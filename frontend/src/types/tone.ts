/**
 * Toneo Type Definitions
 */

export type ToneNumber = 1 | 2 | 3 | 4 | 5;

export type ConfidenceLevel = 'high' | 'medium' | 'low';

export type SourceType =
  | 'dictionary'
  | 'dictionary_pinyin'
  | 'pypinyin'
  | 'unknown';

export interface SyllableInfo {
  char: string;
  pinyin: string;
  pinyin_num: string;
  tone: ToneNumber;
}

export interface WordTone {
  characters: string;
  pinyin: string;
  pinyin_num: string;
  tones: ToneNumber[];
  syllables: SyllableInfo[];
  original_tones: ToneNumber[] | null;
  has_sandhi: boolean;
  sandhi_rule: string | null;
  hsk_level: number;
  frequency: number | null;  // Zipf frequency (0-8 scale, 6+=common)
  source: SourceType;
  confidence: ConfidenceLevel;
  definition: string | null;
}

export interface AnalyzeResponse {
  text: string;
  words: WordTone[];
}

export interface AnalyzeRequest {
  text: string;
}

export type FrequencyTier = 'unknown' | 'rare' | 'uncommon' | 'common' | 'veryCommon';

export interface DictionaryEntry {
  simplified: string;
  traditional: string | null;
  pinyin: string;
  pinyin_num: string;
  tones: number[];
  definitions: string[];
  hsk_level: number;
  frequency: number | null;
  frequency_tier: FrequencyTier;
  examples: string[];
  related: string[];
}

// Tone metadata
export const TONE_INFO: Record<ToneNumber, {
  name: string;
  nameCn: string;
  description: string;
  color: string;
}> = {
  1: {
    name: 'First Tone',
    nameCn: '阴平',
    description: 'High and level',
    color: '#E23D2E',
  },
  2: {
    name: 'Second Tone',
    nameCn: '阳平',
    description: 'Rising',
    color: '#F5C84B',
  },
  3: {
    name: 'Third Tone',
    nameCn: '上声',
    description: 'Falling-rising',
    color: '#1B1B1B',
  },
  4: {
    name: 'Fourth Tone',
    nameCn: '去声',
    description: 'Falling',
    color: '#9E2B25',
  },
  5: {
    name: 'Neutral Tone',
    nameCn: '轻声',
    description: 'Light and short',
    color: '#8C5A3C',
  },
};

// HSK 3.0 level info (levels 1-6, plus 7-9 advanced tier)
export const HSK_INFO: Record<number, {
  label: string;
  color: string;
  words: string;
}> = {
  0: { label: 'N/A', color: '#9CA3AF', words: 'Not in HSK' },
  1: { label: 'HSK 1', color: '#22C55E', words: '~500 words' },
  2: { label: 'HSK 2', color: '#84CC16', words: '~1,272 words' },
  3: { label: 'HSK 3', color: '#EAB308', words: '~2,245 words' },
  4: { label: 'HSK 4', color: '#F97316', words: '~3,245 words' },
  5: { label: 'HSK 5', color: '#EF4444', words: '~4,316 words' },
  6: { label: 'HSK 6', color: '#DC2626', words: '~5,456 words' },
  7: { label: 'HSK 7-9', color: '#7C3AED', words: '~11,092 words' },
  8: { label: 'HSK 7-9', color: '#7C3AED', words: 'Advanced' },
  9: { label: 'HSK 7-9', color: '#7C3AED', words: 'Advanced' },
};
