'use client'

import { getToneColor } from '@/lib/colors'
import type { ToneNumber } from '@/types/tone'

interface ToneCurveProps {
  tone: ToneNumber
  size?: 'sm' | 'md' | 'lg'
  animated?: boolean
}

/**
 * SVG visualization of a Chinese tone curve.
 *
 * Tone patterns:
 * 1 (阴平): ━━━━━━ High level
 * 2 (阳平): ╱      Rising
 * 3 (上声): ╲_╱    Dipping (falling-rising)
 * 4 (去声): ╲      Falling
 * 5 (轻声): ─      Short neutral
 */
export function ToneCurve({ tone, size = 'md', animated = true }: ToneCurveProps) {
  const color = getToneColor(tone)

  const sizes = {
    sm: { width: 40, height: 24, strokeWidth: 2 },
    md: { width: 60, height: 32, strokeWidth: 3 },
    lg: { width: 80, height: 40, strokeWidth: 4 },
  }

  const { width, height, strokeWidth } = sizes[size]
  const padding = 4

  // Calculate curve paths for each tone
  const getCurvePath = (): string => {
    const w = width - padding * 2
    const h = height - padding * 2
    const startX = padding
    const endX = width - padding

    switch (tone) {
      case 1: {
        // High level: straight line at top
        return `M ${startX} ${padding + 2} L ${endX} ${padding + 2}`
      }
      case 2: {
        // Rising: diagonal up
        return `M ${startX} ${height - padding - 2} L ${endX} ${padding + 2}`
      }
      case 3: {
        // Dipping: down then up (V shape, but curved)
        const midX = width / 2
        const bottomY = height - padding - 2
        const topY = padding + h * 0.3
        return `M ${startX} ${topY} Q ${midX} ${bottomY + 4} ${endX} ${topY - 2}`
      }
      case 4: {
        // Falling: diagonal down
        return `M ${startX} ${padding + 2} L ${endX} ${height - padding - 2}`
      }
      case 5: {
        // Neutral: short middle line
        const neutralY = height / 2
        const shortStart = startX + w * 0.2
        const shortEnd = endX - w * 0.2
        return `M ${shortStart} ${neutralY} L ${shortEnd} ${neutralY}`
      }
      default: {
        return `M ${startX} ${height / 2} L ${endX} ${height / 2}`
      }
    }
  }

  return (
    <svg
      width={width}
      height={height}
      viewBox={`0 0 ${width} ${height}`}
      className={animated ? 'tone-curve' : ''}
      aria-hidden="true"
    >
      {/* Background grid lines (optional visual guide) */}
      <line
        x1={padding}
        y1={padding}
        x2={width - padding}
        y2={padding}
        stroke="#E7E1D6"
        strokeWidth={1}
        strokeDasharray="2,2"
      />
      <line
        x1={padding}
        y1={height / 2}
        x2={width - padding}
        y2={height / 2}
        stroke="#E7E1D6"
        strokeWidth={1}
        strokeDasharray="2,2"
      />
      <line
        x1={padding}
        y1={height - padding}
        x2={width - padding}
        y2={height - padding}
        stroke="#E7E1D6"
        strokeWidth={1}
        strokeDasharray="2,2"
      />

      {/* Tone curve */}
      <path
        d={getCurvePath()}
        fill="none"
        stroke={color}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      {/* Start dot */}
      <circle
        cx={padding + 2}
        cy={
          tone === 1 ? padding + 2 :
          tone === 2 ? height - padding - 2 :
          tone === 3 ? padding + (height - padding * 2) * 0.3 :
          tone === 4 ? padding + 2 :
          height / 2
        }
        r={strokeWidth}
        fill={color}
      />
    </svg>
  )
}

/**
 * Simple tone number badge.
 */
export function ToneNumber({ tone, size = 'md' }: { tone: ToneNumber; size?: 'sm' | 'md' | 'lg' }) {
  const color = getToneColor(tone)

  const sizeClasses = {
    sm: 'w-5 h-5 text-xs',
    md: 'w-6 h-6 text-sm',
    lg: 'w-8 h-8 text-base',
  }

  return (
    <span
      className={`inline-flex items-center justify-center font-black ${sizeClasses[size]}`}
      style={{ color }}
    >
      {tone}
    </span>
  )
}
