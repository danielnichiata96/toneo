/**
 * Convert pinyin to Chinese characters using Google Input Tools API.
 * This provides IME-like suggestions for romanized input.
 */

const GOOGLE_INPUT_TOOLS_URL = 'https://inputtools.google.com/request'

export interface HanziSuggestion {
  pinyin: string
  suggestions: string[]
}

// All valid Mandarin pinyin syllables (lowercase, no tones)
// Includes 'v' as alternative for 'ü' (common IME input: lv=lü, nv=nü)
const VALID_PINYIN_SYLLABLES = new Set([
  // Standalone vowels
  'a', 'o', 'e', 'ai', 'ei', 'ao', 'ou', 'an', 'en', 'ang', 'eng', 'er',
  // B
  'ba', 'bo', 'bai', 'bei', 'bao', 'ban', 'ben', 'bang', 'beng', 'bi', 'bie', 'biao', 'bian', 'bin', 'bing', 'bu',
  // P
  'pa', 'po', 'pai', 'pei', 'pao', 'pou', 'pan', 'pen', 'pang', 'peng', 'pi', 'pie', 'piao', 'pian', 'pin', 'ping', 'pu',
  // M
  'ma', 'mo', 'me', 'mai', 'mei', 'mao', 'mou', 'man', 'men', 'mang', 'meng', 'mi', 'mie', 'miao', 'miu', 'mian', 'min', 'ming', 'mu',
  // F
  'fa', 'fo', 'fei', 'fou', 'fan', 'fen', 'fang', 'feng', 'fu',
  // D
  'da', 'de', 'dai', 'dei', 'dao', 'dou', 'dan', 'den', 'dang', 'deng', 'dong', 'di', 'die', 'diao', 'diu', 'dian', 'ding', 'du', 'duo', 'dui', 'duan', 'dun',
  // T
  'ta', 'te', 'tai', 'tei', 'tao', 'tou', 'tan', 'tang', 'teng', 'tong', 'ti', 'tie', 'tiao', 'tian', 'ting', 'tu', 'tuo', 'tui', 'tuan', 'tun',
  // N (nv/nve = nü/nüe, also accept nue for IME compatibility)
  'na', 'ne', 'nai', 'nei', 'nao', 'nou', 'nan', 'nen', 'nang', 'neng', 'nong', 'ni', 'nie', 'niao', 'niu', 'nian', 'nin', 'niang', 'ning', 'nu', 'nuo', 'nuan', 'nv', 'nve', 'nue',
  // L (lv/lve = lü/lüe, also accept lue for IME compatibility)
  'la', 'le', 'lai', 'lei', 'lao', 'lou', 'lan', 'lang', 'leng', 'long', 'li', 'lia', 'lie', 'liao', 'liu', 'lian', 'lin', 'liang', 'ling', 'lu', 'luo', 'luan', 'lun', 'lv', 'lve', 'lue',
  // G
  'ga', 'ge', 'gai', 'gei', 'gao', 'gou', 'gan', 'gen', 'gang', 'geng', 'gong', 'gu', 'gua', 'guo', 'guai', 'gui', 'guan', 'gun', 'guang',
  // K
  'ka', 'ke', 'kai', 'kei', 'kao', 'kou', 'kan', 'ken', 'kang', 'keng', 'kong', 'ku', 'kua', 'kuo', 'kuai', 'kui', 'kuan', 'kun', 'kuang',
  // H
  'ha', 'he', 'hai', 'hei', 'hao', 'hou', 'han', 'hen', 'hang', 'heng', 'hong', 'hu', 'hua', 'huo', 'huai', 'hui', 'huan', 'hun', 'huang',
  // J
  'ji', 'jia', 'jie', 'jiao', 'jiu', 'jian', 'jin', 'jiang', 'jing', 'jiong', 'ju', 'jue', 'juan', 'jun',
  // Q
  'qi', 'qia', 'qie', 'qiao', 'qiu', 'qian', 'qin', 'qiang', 'qing', 'qiong', 'qu', 'que', 'quan', 'qun',
  // X
  'xi', 'xia', 'xie', 'xiao', 'xiu', 'xian', 'xin', 'xiang', 'xing', 'xiong', 'xu', 'xue', 'xuan', 'xun',
  // ZH
  'zha', 'zhe', 'zhi', 'zhai', 'zhei', 'zhao', 'zhou', 'zhan', 'zhen', 'zhang', 'zheng', 'zhong', 'zhu', 'zhua', 'zhuo', 'zhuai', 'zhui', 'zhuan', 'zhun', 'zhuang',
  // CH
  'cha', 'che', 'chi', 'chai', 'chao', 'chou', 'chan', 'chen', 'chang', 'cheng', 'chong', 'chu', 'chua', 'chuo', 'chuai', 'chui', 'chuan', 'chun', 'chuang',
  // SH
  'sha', 'she', 'shi', 'shai', 'shei', 'shao', 'shou', 'shan', 'shen', 'shang', 'sheng', 'shu', 'shua', 'shuo', 'shuai', 'shui', 'shuan', 'shun', 'shuang',
  // R
  'ran', 'ren', 'rang', 'reng', 'rong', 'ri', 'ru', 'rua', 'ruo', 'rui', 'ruan', 'run',
  // Z
  'za', 'ze', 'zi', 'zai', 'zei', 'zao', 'zou', 'zan', 'zen', 'zang', 'zeng', 'zong', 'zu', 'zuo', 'zui', 'zuan', 'zun',
  // C
  'ca', 'ce', 'ci', 'cai', 'cao', 'cou', 'can', 'cen', 'cang', 'ceng', 'cong', 'cu', 'cuo', 'cui', 'cuan', 'cun',
  // S
  'sa', 'se', 'si', 'sai', 'sao', 'sou', 'san', 'sen', 'sang', 'seng', 'song', 'su', 'suo', 'sui', 'suan', 'sun',
  // Y
  'ya', 'ye', 'yao', 'you', 'yan', 'yin', 'yang', 'ying', 'yong', 'yi', 'yu', 'yue', 'yuan', 'yun',
  // W
  'wa', 'wo', 'wai', 'wei', 'wan', 'wen', 'wang', 'weng', 'wu',
])

export type InputType = 'chinese' | 'pinyin' | 'mixed' | 'invalid'

/**
 * Detect input type: Chinese characters, pinyin, mixed, or invalid (English/other).
 */
export function detectInputType(text: string): InputType {
  if (!text.trim()) return 'invalid'

  const hasChinese = /[\u4e00-\u9fff]/.test(text)
  const hasLatin = /[a-zA-Z]/.test(text)

  // Pure Chinese or Chinese with numbers/punctuation
  if (hasChinese && !hasLatin) return 'chinese'

  // Mixed: Chinese + Latin (e.g., "你好hello" or annotations)
  if (hasChinese && hasLatin) return 'mixed'

  // No Chinese, check if it's valid pinyin
  if (isRomanized(text)) return 'pinyin'

  // Latin text that isn't valid pinyin = invalid (English, etc.)
  return 'invalid'
}

/**
 * Detect if text looks like pinyin (romanized Chinese).
 * Uses explicit syllable list to avoid false positives with English.
 */
export function isRomanized(text: string): boolean {
  if (!text.trim()) return false

  // If it contains any Chinese characters, it's not romanized input
  if (/[\u4e00-\u9fff]/.test(text)) return false

  // Pre-normalize: compose decomposed chars first, then convert ü→v
  const preNormalized = text
    .toLowerCase()
    .replace(/u:/g, 'v')                // IME-style u: → v
    .normalize('NFC')                   // Compose decomposed chars (u+◌̈ → ü)
    .replace(/[üǖǘǚǜ]/g, 'v')           // Now convert all ü variants → v

  // Only allow pinyin-valid characters (ü already converted to v, but toned u remains)
  const pinyinCharsOnly = /^[a-zA-Zāáǎàēéěèīíǐìōóǒòūúǔùv\s0-5']+$/
  if (!pinyinCharsOnly.test(preNormalized.trim())) return false

  // Normalize: remove tones/diacritics for syllable matching
  const normalized = preNormalized
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')    // Remove diacritics
    .replace(/[0-5]/g, '')              // Remove tone numbers
    .trim()

  // Split into potential syllables
  const parts = normalized.split(/[\s']+/).filter(Boolean)
  if (parts.length === 0) return false

  // Greedy match: try to consume each part as valid pinyin syllables
  let validSyllables = 0
  let matchedChars = 0
  let totalLength = 0

  for (const part of parts) {
    totalLength += part.length
    let remaining = part

    while (remaining.length > 0) {
      let matched = false
      // Try longest match first (6, 5, 4, 3, 2, 1 chars)
      for (let len = Math.min(6, remaining.length); len >= 1; len--) {
        const candidate = remaining.slice(0, len)
        if (VALID_PINYIN_SYLLABLES.has(candidate)) {
          validSyllables++
          matchedChars += len
          remaining = remaining.slice(len)
          matched = true
          break
        }
      }
      if (!matched) {
        remaining = remaining.slice(1)  // Skip invalid char
      }
    }
  }

  // Need at least 1 valid syllable, 2+ chars, and 80%+ coverage
  const coverage = totalLength > 0 ? matchedChars / totalLength : 0
  return validSyllables >= 1 && totalLength >= 2 && coverage >= 0.8
}

/**
 * Convert pinyin text to Chinese character suggestions.
 * Uses Google Input Tools API (unofficial but stable).
 *
 * @param pinyin - Romanized Chinese text (e.g., "nihao", "wo ai ni")
 * @param maxResults - Maximum number of suggestions (default: 5)
 * @returns Array of Chinese character suggestions
 */
export async function pinyinToHanzi(
  pinyin: string,
  maxResults: number = 5
): Promise<string[]> {
  if (!pinyin.trim()) return []

  // Normalize input for Google API:
  // 1. Compose decomposed chars (u+◌̈ → ü)
  // 2. Convert all ü variants → v
  // 3. Remove diacritics, tone numbers, spaces, apostrophes
  // 4. Map lue/nue → lve/nve
  const cleanPinyin = pinyin
    .trim()
    .toLowerCase()
    .replace(/u:/g, 'v')                // IME-style u: → v
    .normalize('NFC')                   // Compose decomposed chars (u+◌̈ → ü)
    .replace(/[üǖǘǚǜ]/g, 'v')           // Now convert all ü variants → v
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')    // Remove diacritics
    .replace(/([ln])ue/g, '$1ve')       // lue→lve, nue→nve (Google expects v)
    .replace(/[0-5]/g, '')              // Remove tone numbers
    .replace(/['\s]+/g, '')             // Remove spaces and apostrophes

  if (!cleanPinyin) return []

  try {
    const url = new URL(GOOGLE_INPUT_TOOLS_URL)
    url.searchParams.set('itc', 'zh-t-i0-pinyin') // Simplified Chinese Pinyin
    url.searchParams.set('text', cleanPinyin)
    url.searchParams.set('num', String(maxResults))

    const response = await fetch(url.toString(), {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
      },
    })

    if (!response.ok) {
      console.warn('Google Input Tools API error:', response.status)
      return []
    }

    const data = await response.json()

    // Response format: ["SUCCESS", [["nihao", ["你好", "尼好", "妮好", ...]]]]
    if (data[0] === 'SUCCESS' && data[1]?.[0]?.[1]) {
      return data[1][0][1] as string[]
    }

    return []
  } catch (error) {
    console.warn('Failed to fetch pinyin suggestions:', error)
    return []
  }
}

/**
 * Convert pinyin with spaces (word-by-word) to suggestions.
 * Handles phrases like "wo ai ni" → "我爱你"
 */
export async function pinyinPhraseToHanzi(
  phrase: string,
  maxResults: number = 5
): Promise<string[]> {
  // First try the whole phrase
  const suggestions = await pinyinToHanzi(phrase, maxResults)

  if (suggestions.length > 0) {
    return suggestions
  }

  // If no results, phrase might be too long or invalid
  return []
}
