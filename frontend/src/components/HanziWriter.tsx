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
  enableQuiz?: boolean
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
  return (
    <svg
      className="absolute inset-0 pointer-events-none"
      width={size}
      height={size}
      viewBox="0 0 100 100"
    >
      {/* Outer border */}
      <rect
        x="1"
        y="1"
        width="98"
        height="98"
        fill="none"
        stroke="#E5E5E5"
        strokeWidth="1"
      />
      {/* Vertical center line */}
      <line
        x1="50"
        y1="5"
        x2="50"
        y2="95"
        stroke="#E5E5E5"
        strokeWidth="0.5"
        strokeDasharray="3,2"
      />
      {/* Horizontal center line */}
      <line
        x1="5"
        y1="50"
        x2="95"
        y2="50"
        stroke="#E5E5E5"
        strokeWidth="0.5"
        strokeDasharray="3,2"
      />
      {/* Diagonal lines for 米字格 */}
      {type === 'mi' && (
        <>
          <line
            x1="5"
            y1="5"
            x2="95"
            y2="95"
            stroke="#E5E5E5"
            strokeWidth="0.5"
            strokeDasharray="3,2"
          />
          <line
            x1="95"
            y1="5"
            x2="5"
            y2="95"
            stroke="#E5E5E5"
            strokeWidth="0.5"
            strokeDasharray="3,2"
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
  enableQuiz = true,
  onComplete,
}: HanziWriterProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const writerRef = useRef<HanziWriterLib | null>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [isQuizzing, setIsQuizzing] = useState(false)
  const [quizResult, setQuizResult] = useState<'idle' | 'correct' | 'mistake'>('idle')
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
    setIsQuizzing(false)
    setQuizResult('idle')
    writerRef.current.showCharacter()
  }, [])

  // Hide character
  const handleHide = useCallback(() => {
    if (!writerRef.current) return
    setIsQuizzing(false)
    setQuizResult('idle')
    writerRef.current.hideCharacter()
  }, [])

  // Start quiz mode
  const handleQuiz = useCallback(() => {
    if (!writerRef.current || isPlaying) return
    setIsQuizzing(true)
    setQuizResult('idle')
    writerRef.current.quiz({
      onMistake: () => {
        setQuizResult('mistake')
      },
      onCorrectStroke: () => {
        setQuizResult('correct')
      },
      onComplete: () => {
        setIsQuizzing(false)
        setQuizResult('idle')
        onComplete?.()
      },
    })
  }, [isPlaying, onComplete])

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

  // Border color based on quiz result
  const borderColor = isQuizzing
    ? quizResult === 'correct'
      ? 'border-green-500'
      : quizResult === 'mistake'
      ? 'border-mao-red'
      : 'border-mao-yellow'
    : 'border-mao-black'

  return (
    <div className="flex flex-col items-center gap-2">
      {/* Character container with grid */}
      <div
        className={`relative ${borderColor} border-2 bg-mao-white transition-colors`}
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

      {/* Quiz mode indicator */}
      {isQuizzing && (
        <p className="text-[10px] font-bold uppercase tracking-wider text-mao-yellow">
          Draw the strokes!
        </p>
      )}

      {/* Controls */}
      <div className="flex gap-2 flex-wrap justify-center">
        <button
          onClick={handleAnimate}
          disabled={isPlaying || isQuizzing}
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
        {enableQuiz && (
          <button
            onClick={handleQuiz}
            disabled={isPlaying || isQuizzing}
            className="px-3 py-1 text-xs font-bold uppercase tracking-wider border border-mao-black bg-mao-red text-mao-white hover:bg-mao-black disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {isQuizzing ? 'Drawing...' : 'Quiz'}
          </button>
        )}
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
