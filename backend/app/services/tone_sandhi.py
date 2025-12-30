"""
Toneo - Tone Sandhi Rules
Implements Mandarin tone change rules.

Rules implemented:
1. Third tone sandhi: 3 + 3 → 2 + 3 (你好 nǐ hǎo → ní hǎo)
2. 不 (bù) sandhi: 4 + 4 → 2 + 4 (不是 bù shì → bú shì)
3. 一 (yī) sandhi:
   - Before 4th tone → 2nd (一个 yī gè → yí gè)
   - Before 1st/2nd/3rd → 4th (一天 yī tiān → yì tiān)
4. Reduplication: AA → A + neutral (妈妈 māmā → māma)
"""
from typing import Optional
from dataclasses import dataclass


@dataclass
class SandhiResult:
    """Result of tone sandhi application."""
    original_tones: list[int]
    modified_tones: list[int]
    has_sandhi: bool
    rule_applied: Optional[str] = None


def apply_third_tone_sandhi(tones: list[int]) -> tuple[list[int], bool, Optional[str]]:
    """
    Apply third tone sandhi rule.
    When two third tones occur consecutively, the first becomes second tone.

    Example: 你好 nǐ hǎo → ní hǎo (3+3 → 2+3)
    """
    if len(tones) < 2:
        return tones, False, None

    modified = tones.copy()
    changed = False

    for i in range(len(tones) - 1):
        if tones[i] == 3 and tones[i + 1] == 3:
            modified[i] = 2
            changed = True

    return modified, changed, "third_tone_sandhi" if changed else None


def apply_bu_sandhi(chars: list[str], tones: list[int]) -> tuple[list[int], bool, Optional[str]]:
    """
    Apply 不 (bù) tone sandhi.
    不 becomes 2nd tone before 4th tone.

    Example: 不是 bù shì → bú shì (4+4 → 2+4)
    """
    if len(chars) < 2 or len(tones) < 2:
        return tones, False, None

    modified = tones.copy()
    changed = False

    for i in range(len(chars) - 1):
        if chars[i] == "不" and tones[i] == 4 and tones[i + 1] == 4:
            modified[i] = 2
            changed = True

    return modified, changed, "bu_sandhi" if changed else None


def apply_yi_sandhi(chars: list[str], tones: list[int]) -> tuple[list[int], bool, Optional[str]]:
    """
    Apply 一 (yī) tone sandhi.
    - Before 4th tone: 一 → 2nd (一个 yī gè → yí gè)
    - Before 1st/2nd/3rd: 一 → 4th (一天 yī tiān → yì tiān)

    Note: When counting or at end of phrase, 一 stays 1st tone.
    """
    if len(chars) < 2 or len(tones) < 2:
        return tones, False, None

    modified = tones.copy()
    changed = False

    for i in range(len(chars) - 1):
        if chars[i] == "一" and tones[i] == 1:
            next_tone = tones[i + 1]
            if next_tone == 4:
                # Before 4th tone, 一 becomes 2nd
                modified[i] = 2
                changed = True
            elif next_tone in (1, 2, 3):
                # Before 1st/2nd/3rd, 一 becomes 4th
                modified[i] = 4
                changed = True

    return modified, changed, "yi_sandhi" if changed else None


def apply_reduplication_sandhi(chars: list[str], tones: list[int]) -> tuple[list[int], bool, Optional[str]]:
    """
    Apply reduplication tone sandhi.
    In AA pattern, second syllable often becomes neutral.

    Example: 妈妈 māmā → māma (1+1 → 1+5)
    """
    if len(chars) != 2 or len(tones) != 2:
        return tones, False, None

    # Check if it's a reduplication (same character)
    if chars[0] != chars[1]:
        return tones, False, None

    # Second syllable becomes neutral
    modified = [tones[0], 5]
    return modified, True, "reduplication_sandhi"


def apply_tone_sandhi(
    chars: list[str],
    tones: list[int],
) -> SandhiResult:
    """
    Apply all relevant tone sandhi rules.

    Args:
        chars: List of Chinese characters
        tones: List of tones (1-5) for each character

    Returns:
        SandhiResult with original and modified tones
    """
    if len(chars) != len(tones):
        raise ValueError("chars and tones must have same length")

    original = tones.copy()
    current = tones.copy()
    rules_applied = []

    # 1. Apply 不 sandhi
    current, changed, rule = apply_bu_sandhi(chars, current)
    if changed and rule:
        rules_applied.append(rule)

    # 2. Apply 一 sandhi
    current, changed, rule = apply_yi_sandhi(chars, current)
    if changed and rule:
        rules_applied.append(rule)

    # 3. Apply third tone sandhi
    current, changed, rule = apply_third_tone_sandhi(current)
    if changed and rule:
        rules_applied.append(rule)

    # 4. Apply reduplication sandhi
    current, changed, rule = apply_reduplication_sandhi(chars, current)
    if changed and rule:
        rules_applied.append(rule)

    has_sandhi = len(rules_applied) > 0
    rule_str = " + ".join(rules_applied) if rules_applied else None

    return SandhiResult(
        original_tones=original,
        modified_tones=current,
        has_sandhi=has_sandhi,
        rule_applied=rule_str,
    )


# Quick test
if __name__ == "__main__":
    # Test cases
    test_cases = [
        (["你", "好"], [3, 3]),        # 你好 - third tone sandhi
        (["不", "是"], [4, 4]),        # 不是 - 不 sandhi
        (["一", "个"], [1, 4]),        # 一个 - 一 before 4th
        (["一", "天"], [1, 1]),        # 一天 - 一 before 1st
        (["妈", "妈"], [1, 1]),        # 妈妈 - reduplication
        (["中", "国"], [1, 2]),        # 中国 - no sandhi
    ]

    for chars, tones in test_cases:
        result = apply_tone_sandhi(chars, tones)
        word = "".join(chars)
        print(f"{word}: {result.original_tones} → {result.modified_tones}")
        if result.has_sandhi:
            print(f"   Rule: {result.rule_applied}")
