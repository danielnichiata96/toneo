'use client'

import { useState, useEffect, useCallback } from 'react'
import { MAX_HISTORY } from './constants'
import { safeStorage } from './safeStorage'

const HISTORY_KEY = 'toneo_search_history'

export interface HistoryItem {
  text: string
  timestamp: number
}

/**
 * Hook for managing search history in localStorage.
 */
export function useHistory() {
  const [history, setHistory] = useState<HistoryItem[]>([])

  // Load history from localStorage on mount
  useEffect(() => {
    setHistory(safeStorage.get<HistoryItem[]>(HISTORY_KEY, []))
  }, [])

  // Add item to history
  const addToHistory = useCallback((text: string) => {
    if (!text.trim()) return

    setHistory((prev) => {
      // Remove duplicates and add new item at the beginning
      const filtered = prev.filter((item) => item.text !== text)
      const updated = [
        { text, timestamp: Date.now() },
        ...filtered,
      ].slice(0, MAX_HISTORY)

      safeStorage.set(HISTORY_KEY, updated)
      return updated
    })
  }, [])

  // Clear history
  const clearHistory = useCallback(() => {
    setHistory([])
    safeStorage.remove(HISTORY_KEY)
  }, [])

  // Remove single item
  const removeFromHistory = useCallback((text: string) => {
    setHistory((prev) => {
      const updated = prev.filter((item) => item.text !== text)
      safeStorage.set(HISTORY_KEY, updated)
      return updated
    })
  }, [])

  return {
    history,
    addToHistory,
    clearHistory,
    removeFromHistory,
  }
}
