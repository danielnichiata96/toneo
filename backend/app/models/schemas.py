"""
Toneo API Schemas
Pydantic models for request/response validation.
"""
from pydantic import BaseModel, Field
from typing import Optional
from enum import Enum


class ConfidenceLevel(str, Enum):
    """Confidence level for tone analysis."""
    HIGH = "high"
    MEDIUM = "medium"
    LOW = "low"


class SourceType(str, Enum):
    """Source of tone information."""
    DICTIONARY = "dictionary"        # CC-CEDICT exact match
    DICTIONARY_PINYIN = "dictionary_pinyin"  # Matched by pinyin
    PYPINYIN = "pypinyin"            # Fallback to pypinyin
    UNKNOWN = "unknown"              # Could not determine


class ToneType(int, Enum):
    """Mandarin tone types."""
    FIRST = 1   # 阴平 (high level)
    SECOND = 2  # 阳平 (rising)
    THIRD = 3   # 上声 (dipping)
    FOURTH = 4  # 去声 (falling)
    NEUTRAL = 5 # 轻声 (neutral/light)


# ============== Request Models ==============

class AnalyzeRequest(BaseModel):
    """Request to analyze Chinese text."""
    text: str = Field(..., min_length=1, max_length=1000, description="Chinese text to analyze")


class TTSRequest(BaseModel):
    """Request for text-to-speech."""
    text: str = Field(..., min_length=1, max_length=500)
    voice: str = Field(default="female1", description="Voice ID")
    rate: float = Field(default=1.0, ge=0.5, le=2.0, description="Speech rate")
    pitch: float = Field(default=0.0, ge=-50, le=50, description="Pitch adjustment")
    volume: float = Field(default=0.0, ge=-50, le=50, description="Volume adjustment")


# ============== Response Models ==============

class SyllableInfo(BaseModel):
    """Information about a single syllable."""
    char: str = Field(..., description="Chinese character")
    pinyin: str = Field(..., description="Pinyin with tone mark")
    pinyin_num: str = Field(..., description="Pinyin with tone number")
    tone: int = Field(..., ge=1, le=5, description="Tone number (1-5)")


class WordTone(BaseModel):
    """Tone analysis for a word/phrase."""
    characters: str = Field(..., description="Original characters")
    pinyin: str = Field(..., description="Full pinyin with tone marks")
    pinyin_num: str = Field(..., description="Full pinyin with tone numbers")
    tones: list[int] = Field(..., description="List of tones for each syllable")
    syllables: list[SyllableInfo] = Field(..., description="Per-syllable breakdown")

    # Sandhi information
    original_tones: Optional[list[int]] = Field(None, description="Tones before sandhi")
    has_sandhi: bool = Field(default=False, description="Whether tone sandhi was applied")
    sandhi_rule: Optional[str] = Field(None, description="Which sandhi rule was applied")

    # Metadata
    hsk_level: int = Field(default=0, description="HSK level (0=not in HSK)")
    frequency: Optional[float] = Field(None, description="Zipf frequency (0-8 scale, 6+=common)")
    source: SourceType = Field(..., description="Data source")
    confidence: ConfidenceLevel = Field(..., description="Confidence level")
    definition: Optional[str] = Field(None, description="English definition")


class AnalyzeResponse(BaseModel):
    """Response from text analysis."""
    text: str = Field(..., description="Original input text")
    words: list[WordTone] = Field(..., description="Analysis for each word")


class VoiceInfo(BaseModel):
    """Information about a TTS voice."""
    name: str
    gender: str
    locale: str


class VoicesResponse(BaseModel):
    """Available TTS voices."""
    voices: dict[str, VoiceInfo]


class HealthResponse(BaseModel):
    """Health check response."""
    status: str
    version: str = "1.0.0"
    database: str = "ok"


class DictionaryEntry(BaseModel):
    """Full dictionary entry for a word."""
    simplified: str = Field(..., description="Simplified characters")
    traditional: Optional[str] = Field(None, description="Traditional characters")
    pinyin: str = Field(..., description="Pinyin with tone marks")
    pinyin_num: str = Field(..., description="Pinyin with tone numbers")
    tones: list[int] = Field(..., description="Tone numbers")
    definitions: list[str] = Field(..., description="List of definitions")
    hsk_level: int = Field(default=0, description="HSK level (0=not in HSK)")
    frequency: Optional[float] = Field(None, description="Zipf frequency")
    frequency_tier: str = Field(default="unknown", description="Frequency tier label")
    examples: list[str] = Field(default_factory=list, description="Example sentences")
    related: list[str] = Field(default_factory=list, description="Related words")
