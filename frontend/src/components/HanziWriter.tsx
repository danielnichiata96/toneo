'use client'

import { useEffect, useRef, useState, useCallback } from 'react'
import HanziWriterLib from 'hanzi-writer'
import { GridBackground } from './GridBackground'
import {
  HANZI_SIZES,
  HANZI_COLORS,
  HANZI_ANIMATION,
  type GridType,
} from '@/lib/constants'

interface HanziWriterProps {
  character: string
  size?: number
  showOutline?: boolean
  showGrid?: boolean
  gridType?: GridType
  strokeColor?: string
  outlineColor?: string
  onComplete?: () => void
}

/**
 * Hanzi stroke order animation component.
 * Uses hanzi-writer library to show how to write Chinese characters.
 */
export function HanziWriter({
  character,
  size = HANZI_SIZES.default,
  showOutline = true,
  showGrid = true,
  gridType = 'tian',
  strokeColor = HANZI_COLORS.stroke,
  outlineColor = HANZI_COLORS.outline,
  onComplete,
}: HanziWriterProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const writerRef = useRef<HanziWriterLib | null>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!containerRef.current || !character) return

    containerRef.current.innerHTML = ''
    writerRef.current = null
    setError(null)

    try {
      writerRef.current = HanziWriterLib.create(containerRef.current, character, {
        width: size,
        height: size,
        padding: 5,
        showOutline,
        strokeColor,
        outlineColor,
        strokeAnimationSpeed: HANZI_ANIMATION.strokeSpeed,
        delayBetweenStrokes: HANZI_ANIMATION.delayBetweenStrokes,
        radicalColor: HANZI_COLORS.radical,
        onLoadCharDataError: () => {
          setError('Character not available')
        },
      })
    } catch {
      setError('Failed to load character')
    }

    return () => {
      if (containerRef.current) {
        containerRef.current.innerHTML = ''
      }
      writerRef.current = null
    }
  }, [character, size, showOutline, strokeColor, outlineColor])

  const handleAnimate = useCallback(() => {
    if (!writerRef.current || isPlaying) return

    setIsPlaying(true)
    writerRef.current.animateCharacter({
      onComplete: () => {
        setIsPlaying(false)
        onComplete?.()
      },
    })
  }, [isPlaying, onComplete])

  const handleShowStrokes = useCallback(() => {
    writerRef.current?.showCharacter()
  }, [])

  const handleHide = useCallback(() => {
    writerRef.current?.hideCharacter()
  }, [])

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

  return (
    <div className="flex flex-col items-center gap-2">
      {/* Character container with grid */}
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

      {/* Controls */}
      <div className="flex flex-wrap justify-center gap-2">
        <button onClick={handleAnimate} disabled={isPlaying} className="brutal-button-sm">
          {isPlaying ? 'Playing...' : 'Animate'}
        </button>
        <button onClick={handleShowStrokes} disabled={isPlaying} className="brutal-button-sm">
          Show
        </button>
        <button onClick={handleHide} disabled={isPlaying} className="brutal-button-sm">
          Hide
        </button>
      </div>
    </div>
  )
}
