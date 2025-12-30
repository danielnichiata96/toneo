/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // Mao-era propaganda palette
        mao: {
          red: '#E23D2E',       // Modern red
          yellow: '#F5C84B',    // Warm amber
          black: '#1B1B1B',     // Soft black
          white: '#FDFBF7',     // Warm paper
          cream: '#F5EFE6',     // Soft sand
          darkred: '#B33A30',   // Deep red accent
          brown: '#8C5A3C',     // Warm brown
        },
        // Tone colors
        tone: {
          1: '#E23D2E',  // First tone - red (high)
          2: '#F5C84B',  // Second tone - amber (rising)
          3: '#1B1B1B',  // Third tone - black (dipping)
          4: '#9E2B25',  // Fourth tone - deep red (falling)
          5: '#8C5A3C',  // Neutral tone - brown
        },
        // HSK level colors
        hsk: {
          1: '#22C55E',  // Green
          2: '#EAB308',  // Yellow
          3: '#F97316',  // Orange
          4: '#EF4444',  // Red
          5: '#0F766E',  // Teal
          6: '#1B1B1B',  // Black
        },
      },
      fontFamily: {
        sans: ['Lexend', 'Noto Sans SC', 'system-ui', 'sans-serif'],
        serif: ['Noto Serif SC', 'Georgia', 'serif'],
        mono: ['IBM Plex Mono', 'ui-monospace', 'SFMono-Regular', 'monospace'],
        display: ['Syne', 'Lexend', 'Noto Sans SC', 'sans-serif'],
      },
      boxShadow: {
        brutal: '4px 4px 0px 0px #1B1B1B',
        'brutal-sm': '2px 2px 0px 0px #1B1B1B',
        'brutal-lg': '6px 6px 0px 0px #1B1B1B',
        soft: '0 8px 20px -12px rgba(27, 27, 27, 0.3)',
      },
      borderWidth: {
        '1': '1px',
        '3': '3px',
      },
    },
  },
  plugins: [],
}
