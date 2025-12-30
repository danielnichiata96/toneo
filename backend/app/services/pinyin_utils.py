"""
Toneo - Pinyin Utilities
Helper functions for pinyin tone conversion.
"""

# Tone mark to number mapping
TONE_MARKS = {
    'ā': ('a', 1), 'á': ('a', 2), 'ǎ': ('a', 3), 'à': ('a', 4),
    'ē': ('e', 1), 'é': ('e', 2), 'ě': ('e', 3), 'è': ('e', 4),
    'ī': ('i', 1), 'í': ('i', 2), 'ǐ': ('i', 3), 'ì': ('i', 4),
    'ō': ('o', 1), 'ó': ('o', 2), 'ǒ': ('o', 3), 'ò': ('o', 4),
    'ū': ('u', 1), 'ú': ('u', 2), 'ǔ': ('u', 3), 'ù': ('u', 4),
    'ǖ': ('ü', 1), 'ǘ': ('ü', 2), 'ǚ': ('ü', 3), 'ǜ': ('ü', 4),
}

# Reverse mapping: (base, tone) -> marked vowel
TONE_TO_MARK = {
    ('a', 1): 'ā', ('a', 2): 'á', ('a', 3): 'ǎ', ('a', 4): 'à',
    ('e', 1): 'ē', ('e', 2): 'é', ('e', 3): 'ě', ('e', 4): 'è',
    ('i', 1): 'ī', ('i', 2): 'í', ('i', 3): 'ǐ', ('i', 4): 'ì',
    ('o', 1): 'ō', ('o', 2): 'ó', ('o', 3): 'ǒ', ('o', 4): 'ò',
    ('u', 1): 'ū', ('u', 2): 'ú', ('u', 3): 'ǔ', ('u', 4): 'ù',
    ('ü', 1): 'ǖ', ('ü', 2): 'ǘ', ('ü', 3): 'ǚ', ('ü', 4): 'ǜ',
}


def extract_tone_from_pinyin(pinyin_str: str) -> int:
    """
    Extract tone number from pinyin with tone mark.

    Args:
        pinyin_str: Pinyin with tone mark (e.g., "zhōng")

    Returns:
        Tone number (1-5), defaults to 5 (neutral) if no tone mark
    """
    for char in pinyin_str:
        if char in TONE_MARKS:
            return TONE_MARKS[char][1]

    # Check for tone number at end (e.g., "zhong1")
    if pinyin_str and pinyin_str[-1].isdigit():
        return int(pinyin_str[-1])

    return 5  # Neutral tone


def pinyin_to_numbered(pinyin_str: str) -> str:
    """
    Convert pinyin with tone marks to numbered pinyin.

    Args:
        pinyin_str: "zhōng" → "zhong1"
    """
    result = pinyin_str
    tone = 5

    for char, (base, t) in TONE_MARKS.items():
        if char in result:
            result = result.replace(char, base)
            tone = t

    # Check if already has number
    if result and result[-1].isdigit():
        return result

    return f"{result}{tone}"


def change_pinyin_tone(pinyin_str: str, new_tone: int) -> str:
    """
    Change the tone mark in pinyin to a new tone.

    Args:
        pinyin_str: Pinyin with tone mark (e.g., "nǐ")
        new_tone: New tone number (1-5)

    Returns:
        Pinyin with updated tone mark (e.g., "ní" for tone 2)
    """
    if new_tone == 5:
        # Neutral tone - remove tone mark
        result = pinyin_str
        for char, (base, _) in TONE_MARKS.items():
            result = result.replace(char, base)
        return result

    # Find and replace the tone-marked vowel
    for char in pinyin_str:
        if char in TONE_MARKS:
            base, _ = TONE_MARKS[char]
            new_mark = TONE_TO_MARK.get((base, new_tone), base)
            return pinyin_str.replace(char, new_mark)

    return pinyin_str  # No tone mark found, return as-is
