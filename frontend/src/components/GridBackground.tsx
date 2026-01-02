import { HANZI_COLORS, type GridType } from '@/lib/constants'

interface GridBackgroundProps {
  size: number
  type?: GridType
}

/**
 * Grid background SVG for character practice.
 * - 田字格 (tian zi ge) - field character grid (cross pattern)
 * - 米字格 (mi zi ge) - rice character grid (cross + diagonals)
 */
export function GridBackground({ size, type = 'tian' }: GridBackgroundProps) {
  const lineColor = HANZI_COLORS.gridLine
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
