"""
Toneo - Tone Analyzer Service
Core NLP engine for Chinese tone analysis.

Uses:
- jieba for word segmentation
- pypinyin for pinyin/tone extraction
- wordfreq for word frequency
- CC-CEDICT (SQLite) for dictionary lookup
"""
import jieba
from pypinyin import pinyin, Style
from pypinyin.contrib.tone_convert import to_tone
from wordfreq import zipf_frequency
from zhon.hanzi import characters as hanzi_chars, punctuation as hanzi_punct
import sqlite3
import re
from pathlib import Path
from typing import Optional
from dataclasses import dataclass
from functools import lru_cache

# Pre-compiled regex for Chinese character detection (faster than 'in' checks)
_HANZI_RE = re.compile(f'[{hanzi_chars}]')

from app.models.schemas import (
    WordTone, SyllableInfo, AnalyzeResponse,
    ConfidenceLevel, SourceType
)
from app.services.tone_sandhi import apply_tone_sandhi
from app.services.pinyin_utils import (
    extract_tone_from_pinyin,
    pinyin_to_numbered,
    change_pinyin_tone,
)


@dataclass
class DictEntry:
    """Dictionary entry from CC-CEDICT."""
    simplified: str
    traditional: Optional[str]
    pinyin: str
    tones: list[int]
    definition: Optional[str]
    hsk_level: int


class ToneAnalyzer:
    """
    Analyzes Chinese text and extracts tone information.
    """

    def __init__(self, db_path: Optional[str] = None):
        """
        Initialize the analyzer.

        Args:
            db_path: Path to CC-CEDICT SQLite database.
                     If None, uses pypinyin only (no dictionary lookup).
        """
        self.db_path = db_path
        self._db_conn: Optional[sqlite3.Connection] = None

        # Initialize jieba
        jieba.setLogLevel(20)  # Suppress debug logs

    def _get_db(self) -> Optional[sqlite3.Connection]:
        """Get database connection (lazy loading)."""
        if self.db_path is None:
            return None

        if self._db_conn is None:
            db_file = Path(self.db_path)
            if db_file.exists():
                self._db_conn = sqlite3.connect(str(db_file))
                self._db_conn.row_factory = sqlite3.Row
            else:
                print(f"Warning: Database not found at {self.db_path}")
                return None

        return self._db_conn

    def _lookup_dict(self, word: str) -> Optional[DictEntry]:
        """
        Look up word in CC-CEDICT database.

        Args:
            word: Chinese word (simplified)

        Returns:
            DictEntry if found, None otherwise
        """
        db = self._get_db()
        if db is None:
            return None

        cursor = db.execute(
            "SELECT simplified, traditional, pinyin, tones, definitions, hsk_level "
            "FROM entries WHERE simplified = ? LIMIT 1",
            (word,)
        )
        row = cursor.fetchone()

        if row is None:
            return None

        # Parse tones from comma-separated string
        tones_str = row["tones"] or ""
        tones = [int(t) for t in tones_str.split(",") if t.strip().isdigit()]

        return DictEntry(
            simplified=row["simplified"],
            traditional=row["traditional"],
            pinyin=row["pinyin"],
            tones=tones,
            definition=row["definitions"],
            hsk_level=row["hsk_level"] or 0,
        )

    def _get_pinyin_for_char(self, char: str) -> tuple[str, int]:
        """
        Get pinyin and tone for a single character using pypinyin.

        Returns:
            Tuple of (pinyin_with_mark, tone_number)
        """
        # Get pinyin with tone marks
        py = pinyin(char, style=Style.TONE, heteronym=False)
        if py and py[0]:
            pinyin_str = py[0][0]
            tone = extract_tone_from_pinyin(pinyin_str)
            return pinyin_str, tone

        return char, 5  # Fallback

    def _analyze_word_pypinyin(self, word: str) -> WordTone:
        """
        Analyze a word using pypinyin (fallback when not in dictionary).
        """
        chars = list(word)
        syllables = []
        tones = []

        for char in chars:
            # Skip non-Chinese characters
            if not self._is_chinese_char(char):
                syllables.append(SyllableInfo(
                    char=char,
                    pinyin=char,
                    pinyin_num=char,
                    tone=5,
                ))
                tones.append(5)
                continue

            pinyin_mark, tone = self._get_pinyin_for_char(char)
            pinyin_num = pinyin_to_numbered(pinyin_mark)

            syllables.append(SyllableInfo(
                char=char,
                pinyin=pinyin_mark,
                pinyin_num=pinyin_num,
                tone=tone,
            ))
            tones.append(tone)

        # Apply tone sandhi
        sandhi_result = apply_tone_sandhi(chars, tones)

        # Update tones and pinyin marks if sandhi was applied
        if sandhi_result.has_sandhi:
            for i, syl in enumerate(syllables):
                if sandhi_result.modified_tones[i] != tones[i]:
                    new_tone = sandhi_result.modified_tones[i]
                    new_pinyin = change_pinyin_tone(syl.pinyin, new_tone)
                    syllables[i] = SyllableInfo(
                        char=syl.char,
                        pinyin=new_pinyin,
                        pinyin_num=syl.pinyin_num.rstrip('12345') + str(new_tone),
                        tone=new_tone,
                    )

        # Build full pinyin string
        full_pinyin = " ".join(s.pinyin for s in syllables)
        full_pinyin_num = " ".join(s.pinyin_num for s in syllables)

        return WordTone(
            characters=word,
            pinyin=full_pinyin,
            pinyin_num=full_pinyin_num,
            tones=sandhi_result.modified_tones,
            syllables=syllables,
            original_tones=tones if sandhi_result.has_sandhi else None,
            has_sandhi=sandhi_result.has_sandhi,
            sandhi_rule=sandhi_result.rule_applied,
            hsk_level=0,
            frequency=self._get_frequency(word),
            source=SourceType.PYPINYIN,
            confidence=ConfidenceLevel.MEDIUM,
            definition=None,
        )

    def _analyze_word_dict(self, word: str, entry: DictEntry) -> WordTone:
        """
        Analyze a word using dictionary data.
        """
        chars = list(word)

        # Parse pinyin syllables from dictionary
        # CC-CEDICT format: "zhong1 guo2" (space-separated, numbered)
        pinyin_parts = entry.pinyin.split()
        syllables = []
        tones = entry.tones.copy() if entry.tones else []

        for i, char in enumerate(chars):
            if i < len(pinyin_parts):
                py_num = pinyin_parts[i]
                # Extract tone number
                tone = int(py_num[-1]) if py_num and py_num[-1].isdigit() else 5
                # Convert to tone mark
                py_mark = to_tone(py_num) if py_num[-1].isdigit() else py_num

                if i >= len(tones):
                    tones.append(tone)

                syllables.append(SyllableInfo(
                    char=char,
                    pinyin=py_mark,
                    pinyin_num=py_num,
                    tone=tone,
                ))
            else:
                # Fallback to pypinyin for missing syllables
                py_mark, tone = self._get_pinyin_for_char(char)
                syllables.append(SyllableInfo(
                    char=char,
                    pinyin=py_mark,
                    pinyin_num=pinyin_to_numbered(py_mark),
                    tone=tone,
                ))
                tones.append(tone)

        # Apply tone sandhi
        sandhi_result = apply_tone_sandhi(chars, tones)

        # Update tones and pinyin marks if sandhi was applied
        if sandhi_result.has_sandhi:
            for i, syl in enumerate(syllables):
                if sandhi_result.modified_tones[i] != tones[i]:
                    new_tone = sandhi_result.modified_tones[i]
                    new_pinyin = change_pinyin_tone(syl.pinyin, new_tone)
                    syllables[i] = SyllableInfo(
                        char=syl.char,
                        pinyin=new_pinyin,
                        pinyin_num=syl.pinyin_num.rstrip('12345') + str(new_tone),
                        tone=new_tone,
                    )

        # Build full pinyin strings
        full_pinyin = " ".join(s.pinyin for s in syllables)
        full_pinyin_num = " ".join(s.pinyin_num for s in syllables)

        return WordTone(
            characters=word,
            pinyin=full_pinyin,
            pinyin_num=full_pinyin_num,
            tones=sandhi_result.modified_tones,
            syllables=syllables,
            original_tones=tones if sandhi_result.has_sandhi else None,
            has_sandhi=sandhi_result.has_sandhi,
            sandhi_rule=sandhi_result.rule_applied,
            hsk_level=entry.hsk_level,
            frequency=self._get_frequency(word),
            source=SourceType.DICTIONARY,
            confidence=ConfidenceLevel.HIGH,
            definition=entry.definition,
        )

    def _is_chinese_char(self, char: str) -> bool:
        """Check if character is Chinese using zhon library."""
        if len(char) != 1:
            return False
        return bool(_HANZI_RE.match(char))

    def _get_frequency(self, word: str) -> Optional[float]:
        """
        Get Zipf frequency for a word (cached).

        Returns:
            Zipf frequency (0-8 scale, 6+ = very common), or None if not found
        """
        return _cached_zipf_frequency(word)


    def _contains_chinese(self, text: str) -> bool:
        """Check if text contains any Chinese characters."""
        return any(self._is_chinese_char(c) for c in text)


    def analyze_text(self, text: str) -> AnalyzeResponse:
        """
        Analyze Chinese text and extract tone information.

        Args:
            text: Chinese text to analyze

        Returns:
            AnalyzeResponse with word-by-word analysis
        """
        # Segment text using jieba
        words = list(jieba.cut(text))

        analyzed_words = []

        for word in words:
            # Skip empty or whitespace-only
            if not word.strip():
                continue

            # Skip if no Chinese characters
            if not self._contains_chinese(word):
                continue

            # Try dictionary lookup first
            entry = self._lookup_dict(word)

            if entry is not None:
                word_tone = self._analyze_word_dict(word, entry)
            else:
                word_tone = self._analyze_word_pypinyin(word)

            analyzed_words.append(word_tone)

        return AnalyzeResponse(
            text=text,
            words=analyzed_words,
        )


# Cached frequency lookup (module-level for lru_cache to work)
@lru_cache(maxsize=10000)
def _cached_zipf_frequency(word: str) -> Optional[float]:
    """Cached Zipf frequency lookup."""
    freq = zipf_frequency(word, 'zh')
    return round(freq, 2) if freq > 0 else None


# Singleton instance
_analyzer: Optional[ToneAnalyzer] = None


def get_analyzer() -> ToneAnalyzer:
    """Get or create the ToneAnalyzer singleton."""
    global _analyzer
    if _analyzer is None:
        # Try to find database
        db_path = Path(__file__).parent.parent.parent / "data" / "cedict.db"
        _analyzer = ToneAnalyzer(
            db_path=str(db_path) if db_path.exists() else None
        )
    return _analyzer


# Quick test
if __name__ == "__main__":
    analyzer = ToneAnalyzer()

    test_texts = [
        "你好",
        "中国",
        "我爱你",
        "不是",
        "一个人",
        "妈妈",
        "学习中文",
    ]

    for text in test_texts:
        result = analyzer.analyze_text(text)
        print(f"\n{text}:")
        for word in result.words:
            sandhi_info = f" (sandhi: {word.sandhi_rule})" if word.has_sandhi else ""
            print(f"  {word.characters}: {word.pinyin} - tones: {word.tones}{sandhi_info}")
