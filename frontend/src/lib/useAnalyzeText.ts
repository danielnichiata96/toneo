'use client'

import { useState, useCallback } from 'react'
import { analyzeText } from './api'
import { detectInputType } from './pinyinToHanzi'
import { UI } from './i18n'
import type { AnalyzeResponse } from '@/types/tone'

interface UseAnalyzeTextOptions {
  onSuccess?: (text: string, result: AnalyzeResponse) => void
}

interface UseAnalyzeTextReturn {
  text: string
  setText: (text: string) => void
  result: AnalyzeResponse | null
  loading: boolean
  error: string | null
  analyze: (inputText: string) => Promise<void>
}

/**
 * Hook for analyzing Chinese text with tone information.
 * Encapsulates API calls, loading state, and error handling.
 */
export function useAnalyzeText(options: UseAnalyzeTextOptions = {}): UseAnalyzeTextReturn {
  const { onSuccess } = options

  const [text, setText] = useState('')
  const [result, setResult] = useState<AnalyzeResponse | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const analyze = useCallback(async (inputText: string) => {
    if (!inputText.trim()) return

    // Validate input type before calling API
    const inputType = detectInputType(inputText)

    if (inputType === 'invalid') {
      setError(UI.errorInvalidInput)
      setResult(null)
      return
    }

    // For pinyin input, don't call API - let PinyinSuggestions handle it
    // User will click a suggestion which triggers analyze with hanzi
    if (inputType === 'pinyin') {
      setResult(null)
      setError(null)
      return
    }

    setLoading(true)
    setError(null)

    try {
      const data = await analyzeText(inputText)
      setResult(data)
      onSuccess?.(inputText, data)
    } catch (err) {
      setError(err instanceof Error ? err.message : UI.errorAnalysisFailed)
    } finally {
      setLoading(false)
    }
  }, [onSuccess])

  return {
    text,
    setText,
    result,
    loading,
    error,
    analyze,
  }
}
