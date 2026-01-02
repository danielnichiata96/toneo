import cnchar from 'cnchar'
import 'cnchar-order'
import 'cnchar-radical'

// Type definitions for cnchar extensions
declare module 'cnchar' {
  interface CncharStatic {
    radical(char: string): RadicalResult
    orderToWord: {
      (strokes: string[] | string, mode?: 'array' | 'start' | 'match' | 'contain'): string | string[]
      orders: string[]
    }
  }
}

export interface StrokeDetail {
  shape: string      // e.g., "㇓"
  type: string       // e.g., "平笔"
  foldCount: string  // e.g., "0"
  name: string       // e.g., "撇"
}

export interface RadicalResult {
  radical: string    // The radical character
  struct: string     // Structure type (左右, 上下, etc.)
}

/**
 * Get stroke count for a character
 */
export function getStrokeCount(char: string): number {
  if (!char || char.length !== 1) return 0
  const result = cnchar.stroke(char)
  return typeof result === 'number' ? result : 0
}

/**
 * Get detailed stroke information for each stroke in a character
 */
export function getStrokeDetails(char: string): StrokeDetail[] {
  if (!char || char.length !== 1) return []
  try {
    const result = cnchar.stroke(char, 'order', 'detail') as StrokeDetail[][]
    return result[0] || []
  } catch {
    return []
  }
}

/**
 * Get stroke names for a character
 */
export function getStrokeNames(char: string): string[] {
  if (!char || char.length !== 1) return []
  try {
    const result = cnchar.stroke(char, 'order', 'name') as string[][]
    return result[0] || []
  } catch {
    return []
  }
}

/**
 * Get stroke shapes (visual representation) for a character
 */
export function getStrokeShapes(char: string): string[] {
  if (!char || char.length !== 1) return []
  try {
    const result = cnchar.stroke(char, 'order', 'shape') as string[][]
    return result[0] || []
  } catch {
    return []
  }
}

/**
 * Get radical information for a character
 */
export function getRadical(char: string): RadicalResult | null {
  if (!char || char.length !== 1) return null
  try {
    const result = cnchar.radical(char)
    if (Array.isArray(result) && result.length > 0) {
      const first = result[0] as { radical?: string; struct?: string }
      if (first && typeof first.radical === 'string') {
        return { radical: first.radical, struct: first.struct || '' }
      }
    }
    return null
  } catch {
    return null
  }
}

/**
 * Get pinyin for a character or text
 */
export function getPinyin(text: string): string {
  if (!text) return ''
  try {
    const result = cnchar.spell(text)
    return typeof result === 'string' ? result : String(result)
  } catch {
    return ''
  }
}

/**
 * Character info combining stroke and radical data
 */
export interface CharacterInfo {
  character: string
  strokeCount: number
  strokeNames: string[]
  strokeShapes: string[]
  strokeDetails: StrokeDetail[]
  radical: RadicalResult | null
  pinyin: string
}

/**
 * Get complete character information
 */
export function getCharacterInfo(char: string): CharacterInfo | null {
  if (!char || char.length !== 1) return null

  return {
    character: char,
    strokeCount: getStrokeCount(char),
    strokeNames: getStrokeNames(char),
    strokeShapes: getStrokeShapes(char),
    strokeDetails: getStrokeDetails(char),
    radical: getRadical(char),
    pinyin: getPinyin(char),
  }
}

export { cnchar }
