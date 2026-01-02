/**
 * Toneo UI Strings
 * Centralized text for easy i18n in the future.
 */

export const UI = {
  // App
  appName: 'Toneo',
  appTagline: 'Chinese Tone Visualizer',
  appVersion: 'v1.0',

  // Hero
  heroOverline: 'Speak with confidence',
  heroTitle: 'See tones clearly.',
  heroSubtitle: 'Analyze Mandarin tones instantly, spot sandhi changes, and learn with a clean visual map.',
  heroBadges: ['Real-time tone curves', 'Sandhi-aware', 'HSK tags'],

  // Input section
  inputOverline: 'Input',
  inputTitle: 'Paste Chinese text',
  inputSubtitle: 'Enter a phrase, sentence, or paragraph to generate tone curves and HSK tags.',
  inputBadge: 'Instant',

  // Input
  inputPlaceholder: 'Enter Chinese text...',
  inputChars: 'characters',
  analyzeButton: 'Analyze tones',
  analyzingButton: 'Analyzing tones...',

  // Results
  resultsTitle: 'Tone analysis',
  resultsSubtitle: 'Tone overview',
  emptyState: 'Add Chinese text to see the tone analysis',

  // Stats
  statsWords: 'Words',
  statsSyllables: 'Syllables',
  statsSandhi: 'Sandhi',
  statsHsk: 'HSK',

  // Legend
  legendTitle: 'Tone reference',
  legendBadge: 'Quick guide',

  // Examples
  examplesTitle: 'Quick Examples',
  examplesBadge: 'Try one',

  // Sandhi
  sandhiLabel: 'Sandhi',
  sandhiRules: {
    'third_tone_sandhi': '3rd tone rule',
    'bu_sandhi': '不 rule',
    'yi_sandhi': '一 rule',
    'reduplication_sandhi': 'Reduplication',
  } as Record<string, string>,

  // Frequency
  frequencyShort: 'Freq',
  frequencyLabels: {
    unknown: 'Unknown',
    rare: 'Rare',
    uncommon: 'Uncommon',
    common: 'Common',
    veryCommon: 'Very common',
  } as Record<string, string>,

  // Dictionary
  viewInDict: 'View in dictionary',

  // Footer
  footerBuilt: 'Built with Next.js + FastAPI',
  footerData: 'Data: CC-CEDICT · Frequency: wordfreq',

  // Errors
  errorAnalysisFailed: 'Analysis failed',
} as const

export const EXAMPLES = [
  { text: '你好', pinyin: 'nǐ hǎo', meaning: 'Hello' },
  { text: '谢谢', pinyin: 'xiè xie', meaning: 'Thank you' },
  { text: '中国', pinyin: 'zhōng guó', meaning: 'China' },
  { text: '我爱你', pinyin: 'wǒ ài nǐ', meaning: 'I love you' },
  { text: '不是', pinyin: 'bú shì', meaning: 'Is not (sandhi)' },
  { text: '一个', pinyin: 'yí gè', meaning: 'One (sandhi)' },
  { text: '妈妈', pinyin: 'māma', meaning: 'Mom (neutral)' },
  { text: '学习中文', pinyin: 'xué xí zhōng wén', meaning: 'Learn Chinese' },
] as const

export type UIKey = keyof typeof UI
