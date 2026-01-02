import sqlite3

import pytest
from fastapi.testclient import TestClient

from app.main import app
from app.routers import dictionary as dictionary_router
from app.routers import tts as tts_router


@pytest.fixture
def client():
    with TestClient(app) as test_client:
        yield test_client


class DummyAnalyzer:
    def __init__(self, db):
        self._db = db

    def _get_db(self):
        return self._db


def make_db(entries):
    db = sqlite3.connect(":memory:")
    db.row_factory = sqlite3.Row
    db.execute(
        """
        CREATE TABLE entries (
            simplified TEXT,
            traditional TEXT,
            pinyin TEXT,
            tones TEXT,
            definitions TEXT,
            hsk_level INTEGER
        )
        """
    )
    if entries:
        db.executemany(
            """
            INSERT INTO entries (simplified, traditional, pinyin, tones, definitions, hsk_level)
            VALUES (?, ?, ?, ?, ?, ?)
            """,
            entries,
        )
        db.commit()
    return db


def test_health_endpoint(client):
    response = client.get("/health")
    assert response.status_code == 200
    payload = response.json()
    assert payload["status"] == "healthy"


def test_analyze_returns_words_and_headers(client):
    response = client.post("/api/analyze", json={"text": "你好"})
    assert response.status_code == 200
    assert response.headers.get("X-Data-Source") == "CC-CEDICT"
    payload = response.json()
    assert payload["text"] == "你好"
    assert isinstance(payload["words"], list)


def test_analyze_rejects_empty_input(client):
    response = client.post("/api/analyze", json={"text": ""})
    assert response.status_code == 422


def test_dictionary_fallback_without_entry(client, monkeypatch):
    db = make_db(entries=[])
    monkeypatch.setattr(dictionary_router, "get_analyzer", lambda: DummyAnalyzer(db))
    try:
        response = client.get("/api/dictionary/你好")
    finally:
        db.close()

    assert response.status_code == 200
    assert response.headers.get("X-Data-Source") == "CC-CEDICT"
    payload = response.json()
    assert payload["simplified"] == "你好"
    assert "(No dictionary entry found)" in payload["definitions"]


def test_dictionary_from_db_entry(client, monkeypatch):
    db = make_db(
        entries=[
            ("中国", "中國", "zhong1 guo2", "1,2", "China;Middle Kingdom", 1),
        ]
    )
    monkeypatch.setattr(dictionary_router, "get_analyzer", lambda: DummyAnalyzer(db))
    try:
        response = client.get("/api/dictionary/中国")
    finally:
        db.close()

    assert response.status_code == 200
    payload = response.json()
    assert payload["simplified"] == "中国"
    assert payload["pinyin_num"] == "zhong1 guo2"
    assert payload["tones"] == [1, 2]
    assert payload["definitions"] == ["China", "Middle Kingdom"]


def test_tts_too_long_returns_400(client):
    response = client.post("/api/tts", json={"text": "a" * 201})
    assert response.status_code == 400


def test_tts_unavailable_returns_503(client, monkeypatch):
    monkeypatch.setattr(tts_router, "is_tts_available", lambda: False)
    response = client.post("/api/tts", json={"text": "你好"})
    assert response.status_code == 503


def test_tts_success_returns_audio(client, monkeypatch):
    async def fake_synthesize_speech(*args, **kwargs):
        return b"audio"

    monkeypatch.setattr(tts_router, "is_tts_available", lambda: True)
    monkeypatch.setattr(tts_router, "synthesize_speech", fake_synthesize_speech)

    response = client.post("/api/tts", json={"text": "你好"})
    assert response.status_code == 200
    assert response.headers.get("content-type") == "audio/mpeg"
    assert response.content == b"audio"
