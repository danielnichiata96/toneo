import { ComponentProps } from 'react'

type LogoProps = ComponentProps<'div'> & {
    size?: 'sm' | 'md' | 'lg'
    showText?: boolean
    showTagline?: boolean
    className?: string
}

/**
 * Toneo Brand Logo
 * Style: Woodwork Stamp / Neo-Brutalist Propaganda
 */
export function Logo({ size = 'md', showText = true, showTagline = false, className = '', ...props }: LogoProps) {
    const sizeMap = {
        sm: { icon: 32, text: 'text-lg', tagline: 'text-[8px]' },
        md: { icon: 48, text: 'text-2xl', tagline: 'text-[10px]' },
        lg: { icon: 64, text: 'text-4xl', tagline: 'text-xs' },
    }

    const { icon: iconSize, text: textSize, tagline: taglineSize } = sizeMap[size]

    return (
        <div className={`inline-flex items-center gap-3 ${className}`} {...props}>
            {/* Stamp Icon */}
            <svg
                width={iconSize}
                height={iconSize}
                viewBox="0 0 64 64"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="text-mao-red"
            >
                {/* Outer Stamp Frame - slightly irregular/hand-cut look */}
                <path
                    d="M4 6 L60 4 L58 58 L6 60 Z"
                    stroke="currentColor"
                    strokeWidth="4"
                    strokeLinecap="square"
                    strokeLinejoin="miter"
                />

                {/* Main Block Fills */}
                <path
                    d="M10 12 L54 10 L52 52 L12 54 Z"
                    fill="currentColor"
                />

                {/* Stylized 'T' / Tone marks as carved out areas (white) */}
                <g stroke="white" strokeWidth="6" strokeLinecap="square">
                    {/* Horizontal top bar (Tone 1 style) */}
                    <path d="M20 22 L44 22" />
                    {/* Stem of the T / Tone 4 style diagonal cut */}
                    <path d="M32 22 L32 46" />
                    {/* Diagonal slash across (Tone 2/4 fusion) */}
                    <path d="M22 40 L42 28" strokeWidth="4" />
                </g>

                {/* Woodwork hatching/shading */}
                <g stroke="white" strokeWidth="1.5" strokeLinecap="square">
                    <path d="M14 16 L18 16" />
                    <path d="M46 14 L50 14" />
                    <path d="M14 50 L20 50" />
                    <path d="M44 48 L50 48" />
                </g>
            </svg>

            <div className="flex flex-col justify-center">
                {/* Brand Text */}
                {showText && (
                    <span
                        className={`font-display font-black uppercase text-mao-black leading-none ${textSize}`}
                        style={{ letterSpacing: '-0.08em' }}
                    >
                        TONEO
                    </span>
                )}

                {/* Tagline */}
                {showTagline && (
                    <span
                        className={`font-bold uppercase tracking-[0.15em] text-mao-black/40 mt-1.5 ${taglineSize}`}
                    >
                        Chinese Tone Visualizer
                    </span>
                )}
            </div>
        </div>
    )
}
