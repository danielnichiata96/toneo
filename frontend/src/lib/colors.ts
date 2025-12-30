/**
 * Toneo Color System
 * Neobrutalismo Maoísta 红光亮
 */

export const THEME = {
  // Primary colors
  red: '#E23D2E',       // Modern red
  yellow: '#F5C84B',    // Warm amber
  black: '#1B1B1B',     // Soft black
  white: '#FDFBF7',     // Warm paper
  cream: '#F5EFE6',     // Soft sand

  // Accent colors
  darkRed: '#B33A30',   // Deep red
  brown: '#8C5A3C',     // Warm brown
} as const;

export const TONE_COLORS = {
  1: '#E23D2E',  // First tone - Red (high, flat)
  2: '#F5C84B',  // Second tone - Amber (rising)
  3: '#1B1B1B',  // Third tone - Black (dipping)
  4: '#9E2B25',  // Fourth tone - Deep red (falling)
  5: '#8C5A3C',  // Neutral - Brown
} as const;

export const HSK_COLORS = {
  0: '#9CA3AF',  // Not in HSK - Gray
  1: '#22C55E',  // HSK 1 - Green
  2: '#84CC16',  // HSK 2 - Lime
  3: '#EAB308',  // HSK 3 - Yellow
  4: '#F97316',  // HSK 4 - Orange
  5: '#EF4444',  // HSK 5 - Red
  6: '#DC2626',  // HSK 6 - Dark Red
  7: '#7C3AED',  // HSK 7-9 - Purple (Advanced)
  8: '#7C3AED',  // HSK 7-9 - Purple
  9: '#7C3AED',  // HSK 7-9 - Purple
} as const;

/**
 * Get tone color by number.
 */
export function getToneColor(tone: number): string {
  return TONE_COLORS[tone as keyof typeof TONE_COLORS] || TONE_COLORS[5];
}

/**
 * Get HSK level color.
 */
export function getHskColor(level: number): string {
  return HSK_COLORS[level as keyof typeof HSK_COLORS] || HSK_COLORS[0];
}

// Frequency tier definitions (color + bars only, labels come from i18n)
export type FrequencyTier = 'unknown' | 'rare' | 'uncommon' | 'common' | 'veryCommon';

export const FREQUENCY_TIERS: Record<FrequencyTier, { color: string; bars: number }> = {
  unknown: { color: '#9CA3AF', bars: 0 },
  rare: { color: '#EF4444', bars: 1 },
  uncommon: { color: '#EAB308', bars: 2 },
  common: { color: '#84CC16', bars: 3 },
  veryCommon: { color: '#22C55E', bars: 4 },
};

/**
 * Get frequency tier from Zipf scale (0-8).
 * 6+: veryCommon, 4-6: common, 2-4: uncommon, 0-2: rare
 */
export function getFrequencyTier(zipf: number | null): FrequencyTier {
  if (zipf === null || zipf === 0) return 'unknown';
  if (zipf >= 6) return 'veryCommon';
  if (zipf >= 4) return 'common';
  if (zipf >= 2) return 'uncommon';
  return 'rare';
}

/**
 * Get frequency visual info (color + bars).
 */
export function getFrequencyInfo(zipf: number | null): { color: string; bars: number } {
  const tier = getFrequencyTier(zipf);
  return FREQUENCY_TIERS[tier];
}

/**
 * Get MDBG dictionary URL for a word.
 * MDBG is the "Jisho" of Chinese - popular free dictionary using CC-CEDICT.
 */
export function getMdbgUrl(word: string): string {
  return `https://www.mdbg.net/chinese/dictionary?page=worddict&wdrst=0&wdqb=${encodeURIComponent(word)}`;
}

/**
 * Get contrast text color for a background.
 */
export function getContrastColor(bgColor: string): string {
  const hex = bgColor.replace('#', '');
  const normalized = hex.length === 3
    ? hex.split('').map((char) => char + char).join('')
    : hex;

  if (normalized.length !== 6) {
    return THEME.white;
  }

  const r = parseInt(normalized.slice(0, 2), 16) / 255;
  const g = parseInt(normalized.slice(2, 4), 16) / 255;
  const b = parseInt(normalized.slice(4, 6), 16) / 255;

  const luminance = 0.2126 * r + 0.7152 * g + 0.0722 * b;
  return luminance > 0.6 ? THEME.black : THEME.white;
}
