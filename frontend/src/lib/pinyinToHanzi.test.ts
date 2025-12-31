import { describe, expect, it } from 'vitest'

import { isRomanized } from './pinyinToHanzi'

describe('isRomanized', () => {
  it('accepts valid pinyin variants', () => {
    const decomposedUmlaut = `nu\u0308`
    const cases = [
      'nihao',
      'ni3hao3',
      "xi'an",
      'nǐhǎo',
      'lv',
      'lve',
      'nv',
      'lüe',
      'nǚ',
      'lù',
      'hú',
      'lu:',
      'nu:e',
      decomposedUmlaut,
    ]

    for (const value of cases) {
      expect(isRomanized(value), value).toBe(true)
    }
  })

  it('rejects non-pinyin input', () => {
    const cases = [
      'hello',
      'world',
      'the quick brown fox',
      '你好',
      'ni好',
      '123',
      '',
    ]

    for (const value of cases) {
      expect(isRomanized(value), value).toBe(false)
    }
  })
})
