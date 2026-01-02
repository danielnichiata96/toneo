'use client'

import { ToneCurve } from './ToneCurve'
import { PlayButton } from './PlayButton'
import { FrequencyIndicator } from './FrequencyIndicator'
import { DictionaryIcon } from './icons'
import { getToneColor, getHskColor, getContrastColor } from '@/lib/colors'
import { UI } from '@/lib/i18n'
import type { WordTone, SyllableInfo, ToneNumber } from '@/types/tone'

interface ToneCardProps {
  word: WordTone
  onDictionaryClick?: (word: string) => void
}

/**
 * Card displaying a Chinese word with tone visualization.
 */
export function ToneCard({ word, onDictionaryClick }: ToneCardProps) {
  const showHsk = word.hsk_level > 0

  return (
    <article className="tone-card group" role="article">
      {/* Header: Characters + Play + badges */}
      <div className="flex justify-between items-start mb-2">
        <div className="flex items-center gap-2">
          <span className="text-4xl font-display font-semibold text-mao-black">
            {word.characters}
          </span>
          <PlayButton text={word.characters} size="sm" />
        </div>
        <div className="flex items-center gap-2">
          {/* Frequency indicator */}
          <FrequencyIndicator zipf={word.frequency} size="sm" />
          {/* HSK badge */}
          {showHsk && (
            <span
              className="rounded-full border border-mao-black/10 px-2.5 py-1 text-xs font-semibold uppercase"
              style={{
                backgroundColor: getHskColor(word.hsk_level),
                color: getContrastColor(getHskColor(word.hsk_level)),
              }}
            >
              HSK {word.hsk_level}
            </span>
          )}
        </div>
      </div>

      {/* Pinyin */}
      <p className="font-mono text-sm mb-4 text-mao-black/70 tracking-wide">
        {word.pinyin}
      </p>

      {/* Syllable breakdown with tones */}
      <div className="flex gap-4 mb-4">
        {word.syllables.map((syllable, index) => (
          <SyllableCard
            key={index}
            syllable={syllable}
            originalTone={word.original_tones?.[index]}
          />
        ))}
      </div>

      {/* Tone sandhi indicator */}
      {word.has_sandhi && word.sandhi_rule && (
        <div className="mt-2 pt-3 border-t border-mao-black text-[10px] font-bold uppercase text-mao-black/60 flex flex-wrap gap-1">
          {word.sandhi_rule.split(' + ').map((rule, i) => (
            <span key={i} className="chip">
              {UI.sandhiRules[rule.trim()] || rule.trim()}
            </span>
          ))}
        </div>
      )}

      {/* Definition (if available) */}
      {word.definition && (
        <p className="mt-3 text-sm text-mao-black/80 font-medium line-clamp-2">
          {word.definition}
        </p>
      )}

      {/* Dictionary link */}
      <button
        onClick={() => onDictionaryClick?.(word.characters)}
        className="mt-4 inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-mao-black hover:text-mao-red transition-colors"
      >
        <DictionaryIcon size={14} />
        {UI.viewInDict}
      </button>
    </article>
  )
}

interface SyllableCardProps {
  syllable: SyllableInfo
  originalTone?: number
}

/**
 * Individual syllable visualization.
 */
function SyllableCard({ syllable, originalTone }: SyllableCardProps) {
  const toneColor = getToneColor(syllable.tone)
  const hasSandhiChange = originalTone !== undefined && originalTone !== syllable.tone
  const originalToneColor = hasSandhiChange ? getToneColor(originalTone) : undefined

  return (
    <div className="flex-1 min-w-0">
      {/* Character */}
      <div className="text-center mb-1">
        <span
          className="text-2xl font-bold font-display"
          style={{ color: toneColor }}
        >
          {syllable.char}
        </span>
      </div>

      {/* Sandhi change indicator */}
      {hasSandhiChange && (
        <div className="text-center mb-1">
          <span className="inline-flex items-center gap-0.5 text-[9px] font-mono font-bold">
            <span
              className="line-through opacity-40 text-mao-black"
            >
              T{originalTone}
            </span>
            <span className="text-mao-black/30">→</span>
            <span style={{ color: toneColor }}>T{syllable.tone}</span>
          </span>
        </div>
      )}

      {/* Pinyin with tone */}
      <div className="text-center mb-2">
        <span className="text-[10px] font-mono font-bold uppercase" style={{ color: toneColor }}>
          {syllable.pinyin}
        </span>
      </div>

      {/* Tone curve */}
      <div className="h-10 w-full bg-mao-white border border-mao-black flex items-center justify-center">
        <ToneCurve tone={syllable.tone as ToneNumber} size="sm" />
      </div>

      {/* Tone number (only show if no sandhi change, to avoid duplication) */}
      {!hasSandhiChange && (
        <div className="text-center mt-1">
          <span
            className="text-[10px] font-bold font-mono"
            style={{ color: toneColor }}
          >
            T{syllable.tone}
          </span>
        </div>
      )}
    </div>
  )
}

/**
 * Compact inline syllable for phrase view.
 */
export function InlineSyllable({ syllable }: { syllable: SyllableInfo }) {
  const toneColor = getToneColor(syllable.tone)

  return (
    <span className="inline-flex flex-col items-center mx-1">
      <span
        className="text-3xl font-bold"
        style={{ color: toneColor }}
      >
        {syllable.char}
      </span>
      <span className="text-xs font-mono" style={{ color: toneColor }}>
        {syllable.pinyin}
      </span>
    </span>
  )
}
