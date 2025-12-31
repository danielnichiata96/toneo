'use client'

import { FormEvent, KeyboardEvent } from 'react'
import { UI } from '@/lib/i18n'

interface TextInputProps {
  value: string
  onChange: (text: string) => void
  onAnalyze: (text: string) => void
  loading?: boolean
}

/**
 * Text input for Chinese text.
 */
export function TextInput({ value, onChange, onAnalyze, loading = false }: TextInputProps) {
  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    if (value.trim() && !loading) {
      onAnalyze(value.trim())
    }
  }

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    // Ctrl+Enter or Cmd+Enter to submit
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
      e.preventDefault()
      if (value.trim() && !loading) {
        onAnalyze(value.trim())
      }
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Input field */}
      <div className="relative">
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={UI.inputPlaceholder}
          className="brutal-input min-h-[120px] text-lg resize-none"
          disabled={loading}
          rows={3}
        />
        <div className="absolute bottom-3 right-3 flex items-center gap-3">
          <kbd className="hidden sm:inline-flex items-center gap-1 text-[10px] font-mono text-mao-black font-bold bg-mao-yellow px-1.5 py-0.5 border border-mao-black shadow-[2px_2px_0px_0px_rgba(27,27,27,1)]">
            <span>⌘</span><span>↵</span>
          </kbd>
          <span className="text-[10px] font-bold uppercase tracking-wider text-mao-black/40">
            {value.length} {UI.inputChars}
          </span>
        </div>
      </div>

      {/* Submit button */}
      <button
        type="submit"
        disabled={loading || !value.trim()}
        className="brutal-button w-full sm:w-auto disabled:opacity-50 disabled:cursor-not-allowed relative overflow-hidden"
      >
        <span aria-hidden="true" className="pointer-events-none opacity-0">
          {UI.analyzingButton}
        </span>
        <span
          className={`absolute inset-0 flex items-center justify-center gap-2 transition-opacity duration-150 ${
            loading ? 'opacity-100' : 'opacity-0'
          }`}
        >
          <LoadingSpinner />
          {UI.analyzingButton}
        </span>
        <span
          className={`absolute inset-0 flex items-center justify-center transition-opacity duration-150 ${
            loading ? 'opacity-0' : 'opacity-100'
          }`}
        >
          {UI.analyzeButton}
        </span>
      </button>
    </form>
  )
}

function LoadingSpinner() {
  return (
    <svg
      className="animate-spin h-4 w-4"
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
    >
      <circle
        className="opacity-25"
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="4"
      />
      <path
        className="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
      />
    </svg>
  )
}
