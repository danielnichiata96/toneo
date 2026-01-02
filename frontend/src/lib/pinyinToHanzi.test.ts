import { describe, expect, it } from 'vitest'

import { isRomanized, detectInputType } from './pinyinToHanzi'

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

describe('detectInputType', () => {
  it('detects Chinese characters', () => {
    expect(detectInputType('你好')).toBe('chinese')
    expect(detectInputType('中国')).toBe('chinese')
    expect(detectInputType('你好！')).toBe('chinese') // with punctuation
    expect(detectInputType('一二三')).toBe('chinese')
  })

  it('detects valid pinyin', () => {
    expect(detectInputType('nihao')).toBe('pinyin')
    expect(detectInputType('wo ai ni')).toBe('pinyin')
    expect(detectInputType('nǐhǎo')).toBe('pinyin')
  })

  it('detects mixed Chinese and Latin', () => {
    expect(detectInputType('你好hello')).toBe('mixed')
    expect(detectInputType('ABC中文')).toBe('mixed')
  })

  it('rejects English and invalid input', () => {
    expect(detectInputType('hello')).toBe('invalid')
    expect(detectInputType('hello world')).toBe('invalid')
    expect(detectInputType('I love you')).toBe('invalid')
    expect(detectInputType('the quick brown fox')).toBe('invalid')
    expect(detectInputType('')).toBe('invalid')
    expect(detectInputType('   ')).toBe('invalid')
  })
})
