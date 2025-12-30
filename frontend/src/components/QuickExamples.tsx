'use client'

import { EXAMPLES } from '@/lib/i18n'

interface QuickExamplesProps {
  onExampleClick: (text: string) => void
}

/**
 * Quick example phrases for testing.
 */
export function QuickExamples({ onExampleClick }: QuickExamplesProps) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
      {EXAMPLES.map((example) => (
        <button
          type="button"
          key={example.text}
          onClick={() => onExampleClick(example.text)}
          className="rounded-none border border-mao-black bg-mao-white p-3 text-left
                     hover:translate-x-[-1px] hover:translate-y-[-1px] hover:shadow-[2px_2px_0px_0px_rgba(27,27,27,1)]
                     transition-all duration-150"
        >
          <div className="text-xl font-bold font-display text-mao-black">
            {example.text}
          </div>
          <div className="text-[10px] font-mono font-bold uppercase tracking-wider text-mao-black/60 mt-1">
            {example.pinyin}
          </div>
          <div className="text-[10px] font-medium leading-tight text-mao-black/40 mt-1">
            {example.meaning}
          </div>
        </button>
      ))}
    </div>
  )
}
