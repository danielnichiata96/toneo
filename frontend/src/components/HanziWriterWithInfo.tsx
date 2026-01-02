'use client'

import { useEffect, useRef, useState, useCallback, useMemo } from 'react'
import HanziWriterLib from 'hanzi-writer'
import { getCharacterInfo } from '@/lib/cnchar'
import { GridBackground } from './GridBackground'
import {
  HANZI_SIZES,
  HANZI_COLORS,
  HANZI_ANIMATION,
  type GridType,
} from '@/lib/constants'

interface HanziWriterWithInfoProps {
  character: string
  size?: number
  showGrid?: boolean
  gridType?: GridType
}

/**
 * Enhanced HanziWriter with stroke information from cnchar.
 * Shows stroke names and character decomposition.
 */
export function HanziWriterWithInfo({
  character,
  size = HANZI_SIZES.large,
  showGrid = true,
  gridType = 'mi',
}: HanziWriterWithInfoProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const writerRef = useRef<HanziWriterLib | null>(null)
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentStroke, setCurrentStroke] = useState(-1)
  const [error, setError] = useState<string | null>(null)

  const charInfo = useMemo(() => getCharacterInfo(character), [character])

  useEffect(() => {
    if (!containerRef.current || !character) return

    containerRef.current.innerHTML = ''
    writerRef.current = null
    setError(null)
    setCurrentStroke(-1)

    try {
      writerRef.current = HanziWriterLib.create(containerRef.current, character, {
        width: size,
        height: size,
        padding: 5,
        showOutline: true,
        strokeColor: HANZI_COLORS.stroke,
        outlineColor: HANZI_COLORS.outline,
        strokeAnimationSpeed: HANZI_ANIMATION.strokeSpeedSlow,
        delayBetweenStrokes: HANZI_ANIMATION.delayBetweenStrokesSlow,
        radicalColor: HANZI_COLORS.radical,
        onLoadCharDataError: () => {
          setError('Character not available')
        },
      })
    } catch {
      setError('Failed to load character')
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
        intervalRef.current = null
      }
      if (containerRef.current) {
        containerRef.current.innerHTML = ''
      }
      writerRef.current = null
    }
  }, [character, size])

  const handleAnimate = useCallback(() => {
    if (!writerRef.current || isPlaying) return

    // Clear any existing interval
    if (intervalRef.current) {
      clearInterval(intervalRef.current)
      intervalRef.current = null
    }

    setIsPlaying(true)
    setCurrentStroke(0)

    let strokeIndex = 0
    const totalStrokes = charInfo?.strokeCount || 0

    writerRef.current.animateCharacter({
      onComplete: () => {
        if (intervalRef.current) {
          clearInterval(intervalRef.current)
          intervalRef.current = null
        }
        setIsPlaying(false)
        setCurrentStroke(-1)
      },
    })

    // Track strokes with interval
    if (totalStrokes > 0) {
      intervalRef.current = setInterval(() => {
        strokeIndex++
        if (strokeIndex < totalStrokes) {
          setCurrentStroke(strokeIndex)
        } else {
          if (intervalRef.current) {
            clearInterval(intervalRef.current)
            intervalRef.current = null
          }
        }
      }, 800)
    }
  }, [isPlaying, charInfo?.strokeCount])

  if (error) {
    return (
      <div
        className="flex items-center justify-center border border-mao-black/20 bg-mao-cream/30"
        style={{ width: size, height: size }}
      >
        <span className="text-xs text-mao-black/40">{error}</span>
      </div>
    )
  }

  const currentStrokeInfo = charInfo?.strokeDetails[currentStroke]

  return (
    <div className="flex flex-col items-center gap-3">
      {/* Character info header */}
      {charInfo && (
        <div className="flex items-center gap-3 text-sm">
          <span className="font-bold text-lg">{charInfo.pinyin}</span>
          <span className="text-mao-black/60">
            {charInfo.strokeCount} strokes
          </span>
          {charInfo.radical && (
            <span className="px-2 py-0.5 bg-mao-red/10 border border-mao-red/30 text-mao-red text-xs">
              {charInfo.radical.radical} ({charInfo.radical.struct})
            </span>
          )}
        </div>
      )}

      {/* Character container */}
      <div
        className="relative border-2 border-mao-black bg-mao-white"
        style={{ width: size, height: size }}
      >
        {showGrid && <GridBackground size={size} type={gridType} />}
        <div
          ref={containerRef}
          className="relative z-10"
          style={{ width: size, height: size }}
        />
      </div>

      {/* Current stroke info */}
      {isPlaying && currentStrokeInfo && (
        <div className="flex items-center gap-2 px-3 py-1.5 bg-mao-yellow/30 border border-mao-black">
          <span className="text-2xl">{currentStrokeInfo.shape}</span>
          <span className="font-bold">{currentStrokeInfo.name}</span>
          <span className="text-xs text-mao-black/60">
            ({currentStroke + 1}/{charInfo?.strokeCount})
          </span>
        </div>
      )}

      {/* Stroke list */}
      {!isPlaying && charInfo && charInfo.strokeNames.length > 0 && (
        <div className="flex flex-wrap gap-1 justify-center max-w-[200px]">
          {charInfo.strokeDetails.map((stroke, i) => (
            <span
              key={i}
              className="px-1.5 py-0.5 text-xs border border-mao-black/20 bg-mao-cream"
              title={stroke.name}
            >
              {stroke.shape}
            </span>
          ))}
        </div>
      )}

      {/* Controls */}
      <button
        onClick={handleAnimate}
        disabled={isPlaying}
        className="px-4 py-1.5 text-sm font-bold uppercase tracking-wider border-2 border-mao-black bg-mao-cream hover:bg-mao-yellow disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
      >
        {isPlaying ? 'Playing...' : 'Animate Strokes'}
      </button>
    </div>
  )
}
