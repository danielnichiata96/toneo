'use client'

import { useEffect, useState, useCallback, useRef } from 'react'
import { pinyinToHanzi, isRomanized } from '@/lib/pinyinToHanzi'

interface PinyinSuggestionsProps {
  text: string
  onSelect: (hanzi: string) => void
  debounceMs?: number
}

/**
 * Shows Chinese character suggestions when user types romanized pinyin.
 * Uses Google Input Tools API for IME-like conversion.
 */
export function PinyinSuggestions({
  text,
  onSelect,
  debounceMs = 300,
}: PinyinSuggestionsProps) {
  const [suggestions, setSuggestions] = useState<string[]>([])
  const [loading, setLoading] = useState(false)
  const [visible, setVisible] = useState(false)
  const requestIdRef = useRef(0)

  // Fetch suggestions when text changes
  useEffect(() => {
    // Only show for romanized input
    if (!isRomanized(text) || text.length < 2) {
      setSuggestions([])
      setVisible(false)
      return
    }

    setLoading(true)
    setVisible(true)
    setSuggestions([])  // Clear stale suggestions immediately

    // Increment request ID to track latest request
    const currentRequestId = ++requestIdRef.current

    const timer = setTimeout(async () => {
      const results = await pinyinToHanzi(text, 6)

      // Only update if this is still the latest request (guard against race conditions)
      if (currentRequestId === requestIdRef.current) {
        setSuggestions(results)
        setLoading(false)
      }
    }, debounceMs)

    return () => clearTimeout(timer)
  }, [text, debounceMs])

  const handleSelect = useCallback(
    (hanzi: string) => {
      onSelect(hanzi)
      setSuggestions([])
      setVisible(false)
    },
    [onSelect]
  )

  if (!visible) return null

  return (
    <div className="mt-2 p-3 bg-mao-cream border-2 border-mao-black rounded-none shadow-brutal-sm">
      <div className="flex items-center gap-2 mb-2">
        <span className="text-[10px] font-bold uppercase tracking-wider text-mao-black/50">
          Pinyin detected — Did you mean:
        </span>
        {loading && (
          <span className="text-[10px] text-mao-black/40 animate-pulse">
            loading...
          </span>
        )}
      </div>

      {suggestions.length > 0 ? (
        <div className="flex flex-wrap gap-2">
          {suggestions.map((hanzi, index) => (
            <button
              key={`${hanzi}-${index}`}
              onClick={() => handleSelect(hanzi)}
              className="px-3 py-1.5 bg-mao-white border-2 border-mao-black text-lg font-bold
                hover:bg-mao-yellow hover:border-mao-black active:translate-x-[2px] active:translate-y-[2px]
                transition-all duration-100 shadow-[2px_2px_0px_0px_rgba(27,27,27,1)]
                hover:shadow-[1px_1px_0px_0px_rgba(27,27,27,1)]"
            >
              {hanzi}
            </button>
          ))}
        </div>
      ) : !loading ? (
        <p className="text-sm text-mao-black/50">
          No suggestions found. Try typing more pinyin.
        </p>
      ) : null}

      <p className="mt-2 text-[9px] text-mao-black/40">
        Tip: Type Chinese characters directly for best results (e.g., 你好 instead of nihao)
      </p>
    </div>
  )
}
