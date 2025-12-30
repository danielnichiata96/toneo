'use client'

import { useEffect, useRef, useState, useCallback } from 'react'
import HanziWriterLib from 'hanzi-writer'

interface HanziWriterProps {
  character: string
  size?: number
  showOutline?: boolean
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
  size = 120,
  showOutline = true,
  strokeColor = '#1B1B1B',
  outlineColor = '#DDD',
  onComplete,
}: HanziWriterProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const writerRef = useRef<HanziWriterLib | null>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Initialize HanziWriter
  useEffect(() => {
    if (!containerRef.current || !character) return

    // Clear previous instance
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
        strokeAnimationSpeed: 1,
        delayBetweenStrokes: 300,
        radicalColor: '#E23D2E',
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

  // Animate strokes
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

  // Show stroke by stroke (quiz mode prep)
  const handleShowStrokes = useCallback(() => {
    if (!writerRef.current) return
    writerRef.current.showCharacter()
  }, [])

  // Hide character
  const handleHide = useCallback(() => {
    if (!writerRef.current) return
    writerRef.current.hideCharacter()
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
      {/* Character container */}
      <div
        ref={containerRef}
        className="border border-mao-black bg-mao-white"
        style={{ width: size, height: size }}
      />

      {/* Controls */}
      <div className="flex gap-2">
        <button
          onClick={handleAnimate}
          disabled={isPlaying}
          className="px-3 py-1 text-xs font-bold uppercase tracking-wider border border-mao-black bg-mao-cream hover:bg-mao-yellow disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {isPlaying ? 'Playing...' : 'Animate'}
        </button>
        <button
          onClick={handleShowStrokes}
          className="px-3 py-1 text-xs font-bold uppercase tracking-wider border border-mao-black bg-mao-cream hover:bg-mao-yellow transition-colors"
        >
          Show
        </button>
        <button
          onClick={handleHide}
          className="px-3 py-1 text-xs font-bold uppercase tracking-wider border border-mao-black bg-mao-cream hover:bg-mao-yellow transition-colors"
        >
          Hide
        </button>
      </div>
    </div>
  )
}

/**
 * Compact version for inline use (no controls).
 */
export function HanziWriterCompact({
  character,
  size = 60,
}: {
  character: string
  size?: number
}) {
  const containerRef = useRef<HTMLDivElement>(null)
  const writerRef = useRef<HanziWriterLib | null>(null)

  useEffect(() => {
    if (!containerRef.current || !character) return

    containerRef.current.innerHTML = ''

    try {
      writerRef.current = HanziWriterLib.create(containerRef.current, character, {
        width: size,
        height: size,
        padding: 3,
        showOutline: true,
        strokeColor: '#1B1B1B',
        outlineColor: '#E5E5E5',
        strokeAnimationSpeed: 1.5,
        delayBetweenStrokes: 200,
      })

      // Auto-animate on load
      setTimeout(() => {
        writerRef.current?.animateCharacter()
      }, 300)
    } catch {
      // Silently fail for compact version
    }

    return () => {
      if (containerRef.current) {
        containerRef.current.innerHTML = ''
      }
    }
  }, [character, size])

  // Click to replay
  const handleClick = () => {
    writerRef.current?.animateCharacter()
  }

  return (
    <div
      ref={containerRef}
      onClick={handleClick}
      className="cursor-pointer border border-mao-black/20 bg-mao-white hover:border-mao-black transition-colors"
      style={{ width: size, height: size }}
      title="Click to replay animation"
    />
  )
}
