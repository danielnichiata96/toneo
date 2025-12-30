'use client'

import { useState, useCallback } from 'react'
import { ToneCard } from './ToneCard'
import { DictionaryDrawer } from './DictionaryDrawer'
import { UI } from '@/lib/i18n'
import type { WordTone } from '@/types/tone'

interface ToneVisualizerProps {
  words: WordTone[]
}

/**
 * Main visualization component showing analyzed words.
 */
export function ToneVisualizer({ words }: ToneVisualizerProps) {
  const [selectedWord, setSelectedWord] = useState<string | null>(null)

  const handleDictionaryClick = useCallback((word: string) => {
    setSelectedWord(word)
  }, [])

  const handleDrawerClose = useCallback(() => {
    setSelectedWord(null)
  }, [])

  return (
    <div className="surface-card">
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="section-title">{UI.resultsTitle}</p>
          <h3 className="text-xl font-display font-semibold text-mao-black">
            {UI.resultsSubtitle}
          </h3>
        </div>
        <span className="chip">{words.length} {UI.statsWords}</span>
      </div>

      {words.length === 0 ? (
        <div className="mt-6 border border-dashed border-mao-black bg-mao-cream/30 px-6 py-12 text-center">
          <p className="text-mao-black/40 text-[10px] font-bold uppercase tracking-widest">
            {UI.emptyState}
          </p>
        </div>
      ) : (
        <>
          {/* Word cards grid */}
          <div className="mt-8 grid grid-cols-1 gap-6">
            {words.map((word, index) => (
              <div
                key={`${word.characters}-${index}`}
                className="stagger-item"
                style={{ animationDelay: `${index * 60}ms` }}
              >
                <ToneCard word={word} onDictionaryClick={handleDictionaryClick} />
              </div>
            ))}
          </div>

          {/* Summary stats */}
          <div className="mt-8 flex flex-wrap gap-3 border-t border-mao-black pt-6">
            <StatBadge label={UI.statsWords} value={words.length} />
            <StatBadge
              label={UI.statsSyllables}
              value={words.reduce((acc, w) => acc + w.syllables.length, 0)}
            />
            <StatBadge
              label={UI.statsSandhi}
              value={words.filter(w => w.has_sandhi).length}
            />
            <StatBadge
              label={UI.statsHsk}
              value={words.filter(w => w.hsk_level > 0).length}
            />
          </div>
        </>
      )}

      {/* Dictionary drawer */}
      <DictionaryDrawer
        word={selectedWord}
        onClose={handleDrawerClose}
        onWordClick={handleDictionaryClick}
      />
    </div>
  )
}

function StatBadge({ label, value }: { label: string; value: number }) {
  return (
    <div className="flex items-center gap-2 rounded-none border border-mao-black bg-mao-cream px-2 py-1 shadow-brutal-sm">
      <span className="text-[10px] font-bold uppercase tracking-wider text-mao-black/50">
        {label}:
      </span>
      <span className="text-xs font-bold text-mao-black">
        {value}
      </span>
    </div>
  )
}
