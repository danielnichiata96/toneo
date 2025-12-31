import { ComponentProps } from 'react'

type IconProps = ComponentProps<'svg'> & {
  size?: number
}

/**
 * Propaganda-style Audio/TTS icon.
 * Concept: Cutting energy emission like thunder from an invisible mouth.
 */
export function AudioIcon({ size = 24, className, ...props }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 64 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
      {...props}
    >
      <g stroke="currentColor" strokeWidth="3" strokeLinecap="square" strokeLinejoin="miter">
        {/* Speaker body */}
        <path d="M4 20 L16 20 L24 12 L24 52 L16 44 L4 44 Z" fill="currentColor" />
        {/* Speaker grille lines */}
        <path d="M8 24 L12 24 M8 32 L14 32 M8 40 L12 40" stroke="white" strokeWidth="2" />
        {/* Sound waves - angular/sharp */}
        <path d="M32 24 L36 32 L32 40" fill="none" />
        <path d="M42 18 L48 32 L42 46" fill="none" />
        <path d="M52 10 L60 32 L52 54" fill="none" strokeWidth="4" />
        {/* Energy sparks */}
        <path d="M56 18 L58 22 M56 46 L58 42" strokeWidth="2" />
      </g>
    </svg>
  )
}

/**
 * Propaganda-style Dictionary/Book icon.
 * Concept: Heavy book of solid knowledge with hatched text blocks.
 */
export function DictionaryIcon({ size = 24, className, ...props }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 64 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
      {...props}
    >
      <g stroke="currentColor" strokeWidth="3" strokeLinecap="square" strokeLinejoin="miter">
        {/* Book cover - thick border */}
        <path d="M6 10 L58 10 L54 50 L10 54 L6 10 Z" fill="none" strokeWidth="4" />
        {/* Book spine depth */}
        <path d="M10 54 L10 58 L54 54 L54 50" fill="none" />
        {/* Inner page block */}
        <path d="M12 16 L52 16 L50 46 L14 48 Z" fill="currentColor" />
        {/* Text lines - hatching */}
        <path d="M16 22 L48 22 M16 28 L46 28 M16 34 L48 34 M16 40 L40 40" stroke="white" strokeWidth="2" />
        {/* Binding marks */}
        <path d="M6 14 L10 14 M6 24 L10 24 M6 40 L10 40 M6 50 L10 50" strokeWidth="2" />
      </g>
    </svg>
  )
}

/**
 * Propaganda-style HSK Star icon.
 * Concept: Classic sharp-pointed propaganda star with metallic faceting.
 */
export function StarIcon({ size = 24, className, ...props }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 64 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
      {...props}
    >
      <g stroke="currentColor" strokeWidth="3" strokeLinecap="square" strokeLinejoin="miter">
        {/* Five-pointed star - sharp propaganda style */}
        <path
          d="M32 4 L38 24 L60 24 L42 38 L48 58 L32 46 L16 58 L22 38 L4 24 L26 24 Z"
          fill="currentColor"
        />
        {/* Inner faceting lines for metallic/lapidated look */}
        <path d="M32 14 L32 32" stroke="white" strokeWidth="2" />
        <path d="M32 32 L22 44 M32 32 L42 44" stroke="white" strokeWidth="2" />
        <path d="M32 32 L18 26 M32 32 L46 26" stroke="white" strokeWidth="2" />
        {/* Center point */}
        <circle cx="32" cy="32" r="3" fill="white" stroke="none" />
      </g>
    </svg>
  )
}

/**
 * Propaganda-style Megaphone/Practice icon.
 * Concept: Bold megaphone with radiating sound lines - call to action.
 */
export function MegaphoneIcon({ size = 24, className, ...props }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 64 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
      {...props}
    >
      <g stroke="currentColor" strokeWidth="3" strokeLinecap="square" strokeLinejoin="miter">
        {/* Megaphone body - angular/blocky */}
        <path d="M8 24 L8 40 L16 40 L16 24 Z" fill="currentColor" />
        <path d="M16 20 L48 8 L48 56 L16 44 Z" fill="currentColor" />
        {/* Handle */}
        <path d="M10 40 L10 52 L14 52 L14 40" fill="currentColor" />
        {/* Sound emission lines - sharp angular */}
        <path d="M52 20 L58 16" strokeWidth="4" />
        <path d="M52 32 L60 32" strokeWidth="4" />
        <path d="M52 44 L58 48" strokeWidth="4" />
        {/* Inner grille */}
        <path d="M20 26 L20 38 M26 24 L26 40 M32 22 L32 42" stroke="white" strokeWidth="2" />
      </g>
    </svg>
  )
}

/**
 * Propaganda-style Microphone/Record icon.
 * Concept: Bold recording microphone with radiating capture lines.
 */
export function MicrophoneIcon({ size = 24, className, ...props }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 64 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
      {...props}
    >
      <g stroke="currentColor" strokeWidth="3" strokeLinecap="square" strokeLinejoin="miter">
        {/* Microphone head - blocky rectangle */}
        <path d="M20 8 L44 8 L44 36 L20 36 Z" fill="currentColor" />
        {/* Grille lines */}
        <path d="M24 14 L40 14 M24 20 L40 20 M24 26 L40 26 M24 32 L40 32" stroke="white" strokeWidth="2" />
        {/* Stand */}
        <path d="M30 36 L30 48 L34 48 L34 36" fill="currentColor" />
        {/* Base - heavy */}
        <path d="M18 48 L46 48 L46 56 L18 56 Z" fill="currentColor" />
        {/* Sound capture arcs - angular */}
        <path d="M12 16 L8 12 M12 28 L6 28 M12 40 L8 44" strokeWidth="2" />
        <path d="M52 16 L56 12 M52 28 L58 28 M52 40 L56 44" strokeWidth="2" />
      </g>
    </svg>
  )
}

/**
 * Propaganda-style Stroke Order/Brush icon.
 * Concept: Calligraphy brush with ink drip - writing energy.
 */
export function BrushIcon({ size = 24, className, ...props }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 64 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
      {...props}
    >
      <g stroke="currentColor" strokeWidth="3" strokeLinecap="square" strokeLinejoin="miter">
        {/* Brush handle */}
        <path d="M28 4 L36 4 L38 28 L26 28 Z" fill="currentColor" />
        {/* Handle bands */}
        <path d="M27 10 L37 10 M27 18 L37 18" stroke="white" strokeWidth="2" />
        {/* Ferrule */}
        <path d="M24 28 L40 28 L40 34 L24 34 Z" fill="currentColor" />
        {/* Brush tip - tapered */}
        <path d="M26 34 L38 34 L32 56 Z" fill="currentColor" />
        {/* Ink drip */}
        <circle cx="32" cy="60" r="3" fill="currentColor" stroke="none" />
        {/* Stroke motion lines */}
        <path d="M18 40 L14 44 M46 40 L50 44" strokeWidth="2" />
      </g>
    </svg>
  )
}

/**
 * Propaganda-style Tone/Wave icon.
 * Concept: Angular tone curve representing the 4 tones.
 */
export function ToneIcon({ size = 24, className, ...props }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 64 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
      {...props}
    >
      <g stroke="currentColor" strokeWidth="4" strokeLinecap="square" strokeLinejoin="miter">
        {/* Tone 1: High flat */}
        <path d="M4 16 L14 16" />
        {/* Tone 2: Rising */}
        <path d="M20 28 L30 12" />
        {/* Tone 3: Dipping */}
        <path d="M36 16 L42 28 L48 20" />
        {/* Tone 4: Falling */}
        <path d="M54 12 L62 28" />
        {/* Base line */}
        <path d="M4 48 L60 48" strokeWidth="2" />
        {/* Tone markers */}
        <text x="7" y="42" fontSize="10" fontWeight="bold" fontFamily="ui-monospace, monospace" fill="currentColor" stroke="none">1</text>
        <text x="22" y="42" fontSize="10" fontWeight="bold" fontFamily="ui-monospace, monospace" fill="currentColor" stroke="none">2</text>
        <text x="38" y="42" fontSize="10" fontWeight="bold" fontFamily="ui-monospace, monospace" fill="currentColor" stroke="none">3</text>
        <text x="54" y="42" fontSize="10" fontWeight="bold" fontFamily="ui-monospace, monospace" fill="currentColor" stroke="none">4</text>
      </g>
    </svg>
  )
}
