/**
 * Shared constants for the application.
 */

// HanziWriter sizes
export const HANZI_SIZES = {
  compact: 60,
  default: 120,
  large: 150,
} as const

// HanziWriter animation settings
export const HANZI_ANIMATION = {
  strokeSpeed: 1,
  strokeSpeedFast: 1.5,
  strokeSpeedSlow: 0.8,
  delayBetweenStrokes: 300,
  delayBetweenStrokesSlow: 500,
  delayBetweenStrokesFast: 200,
} as const

// HanziWriter colors
export const HANZI_COLORS = {
  stroke: '#1B1B1B',
  outline: '#DDD',
  outlineLight: '#E5E5E5',
  radical: '#E23D2E',
  gridLine: '#CCCCCC',
} as const

// Search history
export const MAX_HISTORY = 20

// Debounce timing
export const DEBOUNCE_MS = 300

// Grid types
export type GridType = 'tian' | 'mi'
