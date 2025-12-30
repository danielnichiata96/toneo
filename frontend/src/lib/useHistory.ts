'use client'

import { useState, useEffect, useCallback } from 'react'

const HISTORY_KEY = 'toneo_search_history'
const MAX_HISTORY = 20

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
    try {
      const stored = localStorage.getItem(HISTORY_KEY)
      if (stored) {
        setHistory(JSON.parse(stored))
      }
    } catch {
      // Ignore localStorage errors
    }
  }, [])

  // Add item to history
  const addToHistory = useCallback((text: string) => {
    if (!text.trim()) return

    setHistory((prev) => {
      // Remove duplicates
      const filtered = prev.filter((item) => item.text !== text)

      // Add new item at the beginning
      const updated = [
        { text, timestamp: Date.now() },
        ...filtered,
      ].slice(0, MAX_HISTORY)

      // Save to localStorage
      try {
        localStorage.setItem(HISTORY_KEY, JSON.stringify(updated))
      } catch {
        // Ignore localStorage errors
      }

      return updated
    })
  }, [])

  // Clear history
  const clearHistory = useCallback(() => {
    setHistory([])
    try {
      localStorage.removeItem(HISTORY_KEY)
    } catch {
      // Ignore localStorage errors
    }
  }, [])

  // Remove single item
  const removeFromHistory = useCallback((text: string) => {
    setHistory((prev) => {
      const updated = prev.filter((item) => item.text !== text)
      try {
        localStorage.setItem(HISTORY_KEY, JSON.stringify(updated))
      } catch {
        // Ignore localStorage errors
      }
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
