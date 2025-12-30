"""
Toneo - Dictionary Router
Dictionary lookup endpoints.
"""
from fastapi import APIRouter, HTTPException
from pypinyin import pinyin, Style
from pypinyin.contrib.tone_convert import to_tone
from wordfreq import zipf_frequency

from app.models.schemas import DictionaryEntry
from app.services.tone_analyzer import get_analyzer
from app.services.pinyin_utils import extract_tone_from_pinyin


router = APIRouter()


def get_frequency_tier(zipf: float | None) -> str:
    """Get frequency tier label from Zipf score."""
    if zipf is None or zipf == 0:
        return "unknown"
    if zipf >= 6:
        return "veryCommon"
    if zipf >= 4:
        return "common"
    if zipf >= 2:
        return "uncommon"
    return "rare"


@router.get("/dictionary/{word}", response_model=DictionaryEntry)
async def lookup_word(word: str) -> DictionaryEntry:
    """
    Look up a word in the dictionary.

    Returns full dictionary entry including:
    - Traditional/simplified forms
    - Pinyin with tones
    - All definitions
    - HSK level
    - Word frequency
    """
    analyzer = get_analyzer()
    db = analyzer._get_db()

    if db is None:
        raise HTTPException(status_code=503, detail="Dictionary database not available")

    # Query the database (search both simplified and traditional)
    cursor = db.execute(
        """SELECT simplified, traditional, pinyin, tones, definitions, hsk_level
           FROM entries WHERE simplified = ? OR traditional = ? LIMIT 1""",
        (word, word)
    )
    row = cursor.fetchone()

    if row is None:
        # Fallback: generate pinyin directly from pypinyin (no segmentation)
        py_result = pinyin(word, style=Style.TONE, heteronym=False)
        py_num_result = pinyin(word, style=Style.TONE3, heteronym=False)

        if not py_result:
            raise HTTPException(status_code=404, detail=f"Word '{word}' not found")

        pinyin_marks = [p[0] for p in py_result]
        pinyin_nums = [p[0] for p in py_num_result]
        tones = [extract_tone_from_pinyin(p) for p in pinyin_marks]

        freq = zipf_frequency(word, 'zh')
        return DictionaryEntry(
            simplified=word,
            traditional=None,
            pinyin=" ".join(pinyin_marks),
            pinyin_num=" ".join(pinyin_nums),
            tones=tones,
            definitions=["(No dictionary entry found)"],
            hsk_level=0,
            frequency=round(freq, 2) if freq > 0 else None,
            frequency_tier=get_frequency_tier(freq if freq > 0 else None),
            examples=[],
            related=[],
        )

    # Parse data from database
    pinyin_raw = row["pinyin"]
    tones_str = row["tones"] or ""
    tones = [int(t) for t in tones_str.split(",") if t.strip().isdigit()]

    # Convert numbered pinyin to tone marks
    pinyin_parts = pinyin_raw.split()
    pinyin_marks = []
    for part in pinyin_parts:
        if part and part[-1].isdigit():
            pinyin_marks.append(to_tone(part))
        else:
            pinyin_marks.append(part)
    pinyin_display = " ".join(pinyin_marks)

    # Parse definitions (separated by semicolons in DB)
    definitions_raw = row["definitions"] or ""
    definitions = [d.strip() for d in definitions_raw.split(";") if d.strip()]

    # Use simplified form for frequency lookup (wordfreq works better with simplified)
    simplified = row["simplified"]
    freq = zipf_frequency(simplified, 'zh')
    freq_value = round(freq, 2) if freq > 0 else None

    # Find related words (same first character of simplified form)
    related = []
    if len(simplified) >= 1:
        cursor = db.execute(
            """SELECT DISTINCT simplified FROM entries
               WHERE simplified LIKE ? AND simplified != ?
               ORDER BY hsk_level DESC, LENGTH(simplified)
               LIMIT 5""",
            (simplified[0] + "%", simplified)
        )
        related = [r["simplified"] for r in cursor.fetchall()]

    return DictionaryEntry(
        simplified=row["simplified"],
        traditional=row["traditional"],
        pinyin=pinyin_display,
        pinyin_num=pinyin_raw,
        tones=tones,
        definitions=definitions if definitions else ["(No definition available)"],
        hsk_level=row["hsk_level"] or 0,
        frequency=freq_value,
        frequency_tier=get_frequency_tier(freq_value),
        examples=[],  # Could add example sentences in future
        related=related,
    )
