'use client'

import { useEffect, useState, useCallback, useRef, KeyboardEvent } from 'react'
import { PlayButton } from './PlayButton'
import { ToneCurve } from './ToneCurve'
import { HanziWriterCompact } from './HanziWriter'
import { BrushIcon, ToneIcon, DictionaryIcon } from './icons'
import { lookupWord } from '@/lib/api'
import { getToneColor, getHskColor, getContrastColor, FREQUENCY_TIERS } from '@/lib/colors'
import { UI } from '@/lib/i18n'
import type { DictionaryEntry, ToneNumber } from '@/types/tone'

interface DictionaryDrawerProps {
  word: string | null
  onClose: () => void
  onWordClick?: (word: string) => void
}

/**
 * Dictionary drawer/modal showing full word details.
 */
export function DictionaryDrawer({ word, onClose, onWordClick }: DictionaryDrawerProps) {
  const [entry, setEntry] = useState<DictionaryEntry | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const currentWordRef = useRef<string | null>(null)
  const drawerRef = useRef<HTMLDivElement>(null)
  const closeButtonRef = useRef<HTMLButtonElement>(null)

  // Fetch dictionary entry when word changes
  useEffect(() => {
    if (!word) {
      setEntry(null)
      currentWordRef.current = null
      return
    }

    // Track current request to prevent race conditions
    currentWordRef.current = word
    setLoading(true)
    setError(null)
    setEntry(null)  // Clear previous entry immediately

    lookupWord(word)
      .then((result) => {
        // Only update if this is still the current word
        if (currentWordRef.current === word) {
          setEntry(result)
        }
      })
      .catch((err) => {
        if (currentWordRef.current === word) {
          setError(err.message)
        }
      })
      .finally(() => {
        if (currentWordRef.current === word) {
          setLoading(false)
        }
      })
  }, [word])

  // Close on escape key
  useEffect(() => {
    const handleEscape = (e: globalThis.KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', handleEscape)
    return () => window.removeEventListener('keydown', handleEscape)
  }, [onClose])

  // Focus trap: focus close button on open
  useEffect(() => {
    if (word && closeButtonRef.current) {
      closeButtonRef.current.focus()
    }
  }, [word])

  // Focus trap: keep focus within drawer
  const handleKeyDown = useCallback((e: KeyboardEvent<HTMLDivElement>) => {
    if (e.key !== 'Tab' || !drawerRef.current) return

    const focusableElements = drawerRef.current.querySelectorAll<HTMLElement>(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    )
    const firstElement = focusableElements[0]
    const lastElement = focusableElements[focusableElements.length - 1]

    if (e.shiftKey && document.activeElement === firstElement) {
      e.preventDefault()
      lastElement?.focus()
    } else if (!e.shiftKey && document.activeElement === lastElement) {
      e.preventDefault()
      firstElement?.focus()
    }
  }, [])

  // Handle related word click
  const handleRelatedClick = useCallback((relatedWord: string) => {
    if (onWordClick) {
      onWordClick(relatedWord)
    }
  }, [onWordClick])

  if (!word) return null

  const freqTier = entry?.frequency_tier || 'unknown'
  const freqInfo = FREQUENCY_TIERS[freqTier as keyof typeof FREQUENCY_TIERS] || FREQUENCY_TIERS.unknown
  const freqLabel = UI.frequencyLabels[freqTier] || freqTier

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-mao-black/60 z-40"
        onClick={onClose}
      />

      {/* Drawer */}
      <div
        ref={drawerRef}
        role="dialog"
        aria-modal="true"
        aria-label={loading ? 'Loading dictionary entry' : error ? 'Dictionary error' : undefined}
        aria-labelledby={entry ? 'dictionary-drawer-title' : undefined}
        onKeyDown={handleKeyDown}
        className="fixed right-0 top-0 h-full w-full max-w-md bg-mao-white border-l border-mao-black shadow-2xl z-50 overflow-y-auto"
      >
        {/* Header */}
        <div className="sticky top-0 bg-mao-white border-b border-mao-black p-4 flex justify-between items-start z-10">
          <div className="flex-1">
            {loading ? (
              <div className="h-12 w-24 bg-mao-cream animate-pulse rounded" />
            ) : entry ? (
              <div className="flex items-center gap-3">
                <span id="dictionary-drawer-title" className="text-4xl font-display font-bold text-mao-black">
                  {entry.simplified}
                </span>
                <PlayButton text={entry.simplified} size="sm" />
              </div>
            ) : null}
          </div>
          <button
            ref={closeButtonRef}
            onClick={onClose}
            className="p-2 text-mao-black/50 hover:text-mao-black hover:bg-mao-cream rounded-lg transition-colors"
            aria-label="Close"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className="p-4 space-y-6">
          {loading && (
            <div className="space-y-4">
              <div className="h-6 w-32 bg-mao-cream animate-pulse rounded" />
              <div className="h-20 bg-mao-cream animate-pulse rounded" />
              <div className="h-16 bg-mao-cream animate-pulse rounded" />
            </div>
          )}

          {error && (
            <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
              {error}
            </div>
          )}

          {entry && !loading && (
            <>
              {/* Pinyin */}
              <div className="bg-mao-cream border border-mao-black p-3 rounded-none shadow-brutal-sm">
                <p className="font-mono text-xl font-bold text-mao-black tracking-wide">
                  {entry.pinyin}
                </p>
                {entry.traditional && entry.traditional !== entry.simplified && (
                  <p className="text-[10px] font-bold uppercase tracking-wider text-mao-black/50 mt-1">
                    繁體: {entry.traditional}
                  </p>
                )}
              </div>

              {/* Badges row */}
              <div className="flex flex-wrap gap-2">
                {/* HSK badge */}
                {entry.hsk_level > 0 && (
                  <span
                    className="rounded-full border border-mao-black/10 px-3 py-1 text-sm font-semibold"
                    style={{
                      backgroundColor: getHskColor(entry.hsk_level),
                      color: getContrastColor(getHskColor(entry.hsk_level)),
                    }}
                  >
                    HSK {entry.hsk_level <= 6 ? entry.hsk_level : '7-9'}
                  </span>
                )}

                {/* Frequency badge */}
                {entry.frequency !== null && (
                  <span
                    className="flex items-center gap-1.5 rounded-full border border-mao-black/10 bg-mao-cream/50 px-3 py-1"
                    title={`Zipf: ${entry.frequency}`}
                  >
                    <span className="text-xs font-medium text-mao-black/60">{freqLabel}</span>
                    <span className="flex items-end gap-0.5">
                      {[1, 2, 3, 4].map((bar) => (
                        <span
                          key={bar}
                          className="w-1 rounded-sm"
                          style={{
                            height: `${bar * 3 + 2}px`,
                            backgroundColor: bar <= freqInfo.bars ? freqInfo.color : '#D4D4D4',
                          }}
                        />
                      ))}
                    </span>
                  </span>
                )}
              </div>

              {/* Tone breakdown */}
              <div className="bg-mao-white border border-mao-black p-4 rounded-none shadow-brutal-sm">
                <h3 className="flex items-center gap-2 text-[10px] font-bold text-mao-black/50 uppercase tracking-widest mb-4">
                  <ToneIcon size={16} />
                  Tone Breakdown
                </h3>
                <div className="flex gap-4">
                  {entry.simplified.split('').map((char, i) => {
                    const tone = entry.tones[i] || 5
                    const toneColor = getToneColor(tone)
                    return (
                      <div key={i} className="flex-1 text-center">
                        <span
                          className="text-3xl font-bold block font-display"
                          style={{ color: toneColor }}
                        >
                          {char}
                        </span>
                        <div className="h-10 w-full bg-mao-white border border-mao-black flex items-center justify-center my-3">
                          <ToneCurve tone={tone as ToneNumber} size="sm" />
                        </div>
                        <span
                          className="text-[10px] font-bold font-mono"
                          style={{ color: toneColor }}
                        >
                          T{tone}
                        </span>
                      </div>
                    )
                  })}
                </div>
              </div>

              {/* Stroke Order */}
              <div className="bg-mao-white border border-mao-black p-4 rounded-none shadow-brutal-sm">
                <h3 className="flex items-center gap-2 text-[10px] font-bold text-mao-black/50 uppercase tracking-widest mb-4">
                  <BrushIcon size={16} />
                  Stroke Order
                </h3>
                <div className="flex gap-3 flex-wrap">
                  {entry.simplified.split('').map((char, i) => (
                    <HanziWriterCompact key={i} character={char} size={70} />
                  ))}
                </div>
                <p className="mt-3 text-[10px] text-mao-black/40">
                  Click to replay animation
                </p>
              </div>

              {/* Definitions */}
              <div>
                <h3 className="flex items-center gap-2 text-xs font-semibold text-mao-black/50 uppercase tracking-wide mb-2">
                  <DictionaryIcon size={14} />
                  Definitions
                </h3>
                <ul className="space-y-2">
                  {entry.definitions.map((def, i) => (
                    <li key={i} className="flex gap-2 text-mao-black/80">
                      <span className="text-mao-black/30 font-mono text-sm">{i + 1}.</span>
                      <span>{def}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Related words */}
              {entry.related.length > 0 && (
                <div>
                  <h3 className="text-xs font-semibold text-mao-black/50 uppercase tracking-wide mb-2">
                    Related Words
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {entry.related.map((relatedWord) => (
                      <button
                        key={relatedWord}
                        onClick={() => handleRelatedClick(relatedWord)}
                        className="px-3 py-1.5 bg-mao-cream/50 border border-mao-black/10 rounded-lg text-sm font-medium text-mao-black/70 hover:bg-mao-cream hover:text-mao-black transition-colors"
                      >
                        {relatedWord}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Footer */}
              <div className="pt-4 border-t border-mao-black/10">
                <p className="text-xs text-mao-black/40">
                  Data: CC-CEDICT · Frequency: wordfreq
                </p>
              </div>
            </>
          )}
        </div>
      </div>
    </>
  )
}
