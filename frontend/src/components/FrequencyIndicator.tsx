'use client'

import { getFrequencyInfo, getFrequencyTier } from '@/lib/colors'
import { UI } from '@/lib/i18n'

interface FrequencyIndicatorProps {
  zipf: number | null
  /** Show text label alongside bars. Use 'short' for abbreviated label, 'full' for tier name */
  showLabel?: false | 'short' | 'full'
  /** Size variant */
  size?: 'sm' | 'md' | 'lg'
  /** Custom container className */
  className?: string
}

const SIZE_CONFIG = {
  sm: { barHeights: [5, 8, 11, 14], barWidth: 'w-1', labelClass: 'text-[10px]' },
  md: { barHeights: [6, 10, 14, 18], barWidth: 'w-1', labelClass: 'text-xs' },
  lg: { barHeights: [8, 12, 16, 20], barWidth: 'w-1.5', labelClass: 'text-sm' },
} as const

/**
 * Visual frequency indicator with bars.
 * Extracted to eliminate duplication across ToneCard, DictionaryDrawer, and DictionaryContent.
 */
export function FrequencyIndicator({
  zipf,
  showLabel = 'short',
  size = 'sm',
  className = ''
}: FrequencyIndicatorProps) {
  const freqInfo = getFrequencyInfo(zipf)

  // Don't render if no frequency data or no bars
  if (zipf === null || freqInfo.bars === 0) return null

  const freqTier = getFrequencyTier(zipf)
  const freqLabel = UI.frequencyLabels[freqTier] || freqTier
  const config = SIZE_CONFIG[size]

  return (
    <span
      className={`flex items-center gap-1.5 rounded-full border border-mao-black/10 bg-mao-cream/50 px-2 py-1 ${className}`}
      title={`${freqLabel} (Zipf: ${zipf})`}
    >
      {showLabel && (
        <span className={`${config.labelClass} font-medium text-mao-black/50 uppercase`}>
          {showLabel === 'short' ? UI.frequencyShort : freqLabel}
        </span>
      )}
      <span className="flex items-end gap-0.5">
        {[1, 2, 3, 4].map((bar) => (
          <span
            key={bar}
            className={`${config.barWidth} rounded-sm`}
            style={{
              height: `${config.barHeights[bar - 1]}px`,
              backgroundColor: bar <= freqInfo.bars ? freqInfo.color : '#D4D4D4',
            }}
          />
        ))}
      </span>
    </span>
  )
}
