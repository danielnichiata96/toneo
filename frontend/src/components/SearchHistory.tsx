'use client'

import { useCallback, KeyboardEvent } from 'react'
import type { HistoryItem } from '@/lib/useHistory'

interface SearchHistoryProps {
  history: HistoryItem[]
  onSelect: (text: string) => void
  onRemove: (text: string) => void
  onClear: () => void
}

/**
 * Display recent search history.
 */
export function SearchHistory({ history, onSelect, onRemove, onClear }: SearchHistoryProps) {
  // Handle Delete key to remove item
  const handleKeyDown = useCallback((e: KeyboardEvent<HTMLLIElement>, text: string) => {
    if (e.key === 'Delete' || e.key === 'Backspace') {
      e.preventDefault()
      onRemove(text)
    }
  }, [onRemove])

  if (history.length === 0) return null

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <p id="history-label" className="text-xs font-semibold uppercase tracking-wide text-mao-black/50">
          Recent
        </p>
        <button
          onClick={onClear}
          className="text-xs text-mao-black/40 hover:text-mao-red transition-colors"
        >
          Clear
        </button>
      </div>
      <ul
        role="list"
        aria-labelledby="history-label"
        className="flex flex-wrap gap-2"
      >
        {history.map((item) => (
          <li
            key={item.text}
            role="listitem"
            className="group flex items-center gap-1 rounded-full border border-mao-black/10 bg-mao-cream/50 pl-3 pr-1 py-1"
            onKeyDown={(e) => handleKeyDown(e, item.text)}
          >
            <button
              onClick={() => onSelect(item.text)}
              className="text-sm text-mao-black/70 hover:text-mao-black transition-colors"
            >
              {item.text}
            </button>
            <button
              onClick={() => onRemove(item.text)}
              className="p-1 text-mao-black/30 hover:text-mao-red transition-colors opacity-100 sm:opacity-0 sm:group-hover:opacity-100 sm:group-focus-within:opacity-100"
              aria-label={`Remove ${item.text} from history`}
            >
              <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </li>
        ))}
      </ul>
    </div>
  )
}
