'use client'

import { useEffect, useRef, useState, useCallback } from 'react'
import HanziWriterLib from 'hanzi-writer'

interface HanziWriterProps {
  character: string
  size?: number
  showOutline?: boolean
  showGrid?: boolean
  gridType?: 'tian' | 'mi'  // 田字格 or 米字格
  strokeColor?: string
  outlineColor?: string
  onComplete?: () => void
}

/**
 * Grid background SVG for character practice.
 * 田字格 (tian zi ge) - field character grid (cross pattern)
 * 米字格 (mi zi ge) - rice character grid (cross + diagonals)
 */
function GridBackground({
  size,
  type = 'tian'
}: {
  size: number
  type: 'tian' | 'mi'
}) {
  // Use darker lines for better visibility
  const lineColor = '#CCCCCC'
  const lineWidth = size < 80 ? 1 : 0.8

  return (
    <svg
      className="absolute inset-0 pointer-events-none z-0"
      width={size}
      height={size}
      viewBox="0 0 100 100"
      preserveAspectRatio="xMidYMid meet"
    >
      {/* Vertical center line */}
      <line
        x1="50"
        y1="2"
        x2="50"
        y2="98"
        stroke={lineColor}
        strokeWidth={lineWidth}
        strokeDasharray="4,3"
      />
      {/* Horizontal center line */}
      <line
        x1="2"
        y1="50"
        x2="98"
        y2="50"
        stroke={lineColor}
        strokeWidth={lineWidth}
        strokeDasharray="4,3"
      />
      {/* Diagonal lines for 米字格 */}
      {type === 'mi' && (
        <>
          <line
            x1="2"
            y1="2"
            x2="98"
            y2="98"
            stroke={lineColor}
            strokeWidth={lineWidth}
            strokeDasharray="4,3"
          />
          <line
            x1="98"
            y1="2"
            x2="2"
            y2="98"
            stroke={lineColor}
            strokeWidth={lineWidth}
            strokeDasharray="4,3"
          />
        </>
      )}
    </svg>
  )
}

/**
 * Hanzi stroke order animation component.
 * Uses hanzi-writer library to show how to write Chinese characters.
 */
export function HanziWriter({
  character,
  size = 120,
  showOutline = true,
  showGrid = true,
  gridType = 'tian',
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

  // Show stroke by stroke
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
      {/* Character container with grid */}
      <div
        className="relative border-2 border-mao-black bg-mao-white"
        style={{ width: size, height: size }}
      >
        {/* Grid background */}
        {showGrid && <GridBackground size={size} type={gridType} />}
        {/* HanziWriter canvas */}
        <div
          ref={containerRef}
          className="relative z-10"
          style={{ width: size, height: size }}
        />
      </div>

      {/* Controls */}
      <div className="flex gap-2 flex-wrap justify-center">
        <button
          onClick={handleAnimate}
          disabled={isPlaying}
          className="px-3 py-1 text-xs font-bold uppercase tracking-wider border border-mao-black bg-mao-cream hover:bg-mao-yellow disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {isPlaying ? 'Playing...' : 'Animate'}
        </button>
        <button
          onClick={handleShowStrokes}
          disabled={isPlaying}
          className="px-3 py-1 text-xs font-bold uppercase tracking-wider border border-mao-black bg-mao-cream hover:bg-mao-yellow disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          Show
        </button>
        <button
          onClick={handleHide}
          disabled={isPlaying}
          className="px-3 py-1 text-xs font-bold uppercase tracking-wider border border-mao-black bg-mao-cream hover:bg-mao-yellow disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
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
  showGrid = true,
}: {
  character: string
  size?: number
  showGrid?: boolean
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
      className="relative cursor-pointer border border-mao-black/20 bg-mao-white hover:border-mao-black transition-colors"
      style={{ width: size, height: size }}
      title="Click to replay animation"
      onClick={handleClick}
    >
      {/* Grid background */}
      {showGrid && <GridBackground size={size} type="tian" />}
      {/* HanziWriter canvas */}
      <div
        ref={containerRef}
        className="relative z-10"
        style={{ width: size, height: size }}
      />
    </div>
  )
}
