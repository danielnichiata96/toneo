'use client'

import { useEffect, useRef } from 'react'
import HanziWriterLib from 'hanzi-writer'
import { GridBackground } from './GridBackground'
import {
  HANZI_SIZES,
  HANZI_COLORS,
  HANZI_ANIMATION,
} from '@/lib/constants'

interface HanziWriterCompactProps {
  character: string
  size?: number
  showGrid?: boolean
}

/**
 * Compact HanziWriter for inline use.
 * Auto-animates on load, click to replay.
 */
export function HanziWriterCompact({
  character,
  size = HANZI_SIZES.compact,
  showGrid = true,
}: HanziWriterCompactProps) {
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
        strokeColor: HANZI_COLORS.stroke,
        outlineColor: HANZI_COLORS.outlineLight,
        strokeAnimationSpeed: HANZI_ANIMATION.strokeSpeedFast,
        delayBetweenStrokes: HANZI_ANIMATION.delayBetweenStrokesFast,
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
      {showGrid && <GridBackground size={size} type="tian" />}
      <div
        ref={containerRef}
        className="relative z-10"
        style={{ width: size, height: size }}
      />
    </div>
  )
}
