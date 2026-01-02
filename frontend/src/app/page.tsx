'use client'

import { useEffect, useCallback, Suspense } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { Logo } from '@/components/Logo'
import { TextInput } from '@/components/TextInput'
import { ToneVisualizer } from '@/components/ToneVisualizer'
import { QuickExamples } from '@/components/QuickExamples'
import { ToneLegend } from '@/components/ToneLegend'
import { SearchHistory } from '@/components/SearchHistory'
import { useAnalyzeText } from '@/lib/useAnalyzeText'
import { useHistory } from '@/lib/useHistory'
import { UI } from '@/lib/i18n'

export default function Home() {
  return (
    <Suspense fallback={<HomeLoading />}>
      <HomeContent />
    </Suspense>
  )
}

function HomeLoading() {
  return (
    <main className="page-shell min-h-screen">
      <header className="border-b border-mao-black bg-mao-white">
        <div className="h-1 bg-mao-red" />
        <div className="max-w-6xl mx-auto px-4 py-6">
          <Logo size="lg" showTagline />
        </div>
      </header>
      <div className="flex items-center justify-center py-24">
        <div className="animate-pulse text-mao-black/50 font-bold uppercase tracking-wider">
          Loading...
        </div>
      </div>
    </main>
  )
}

function HomeContent() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const { history, addToHistory, clearHistory, removeFromHistory } = useHistory()

  const handleSuccess = useCallback((inputText: string) => {
    addToHistory(inputText)
    // Update URL without navigation
    const url = new URL(window.location.href)
    url.searchParams.set('text', inputText)
    router.replace(url.pathname + url.search, { scroll: false })
  }, [addToHistory, router])

  const { text, setText, result, loading, error, analyze } = useAnalyzeText({
    onSuccess: handleSuccess,
  })

  // Handle URL param on mount
  useEffect(() => {
    const urlText = searchParams.get('text')
    if (urlText) {
      setText(urlText)
      analyze(urlText)
    }
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  // Unified handler for selecting text from examples or history
  const handleTextSelect = useCallback((selectedText: string) => {
    setText(selectedText)
    analyze(selectedText)
  }, [setText, analyze])

  return (
    <main className="page-shell min-h-screen">
      {/* Header */}
      <header className="border-b border-mao-black bg-mao-white">
        <div className="h-1 bg-mao-red" />
        <div className="max-w-6xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between gap-6">
            <div>
              <Logo size="lg" showTagline />
            </div>
            <div className="flex items-center gap-3">
              <Link
                href="/about"
                className="text-xs font-bold uppercase tracking-wider text-mao-black/60 hover:text-mao-red transition-colors"
              >
                About
              </Link>
              <span className="chip">{UI.appVersion}</span>
            </div>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="max-w-6xl mx-auto px-4 pt-12 pb-10">
        <div className="main-grid grid gap-8 lg:grid-cols-[1.2fr_0.8fr] items-end">
          <div className="fade-in-up">
            <p className="section-title">{UI.heroOverline}</p>
            <h2 className="mt-3 text-4xl sm:text-7xl font-display font-extrabold uppercase tracking-tighter text-mao-black leading-[0.9]">
              {UI.heroTitle}
            </h2>
            <p className="mt-6 text-xl text-mao-black/80 max-w-2xl font-medium">
              {UI.heroSubtitle}
            </p>
          </div>
          <div className="flex flex-wrap gap-3 justify-start lg:justify-end fade-in-up" style={{ animationDelay: '120ms' }}>
            {UI.heroBadges.map((badge) => (
              <span key={badge} className="chip">{badge}</span>
            ))}
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="max-w-6xl mx-auto px-4 pb-16">
        <div className="main-grid grid gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.2fr)]">
          <div className="space-y-8">
            <div className="surface-card">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="section-title">{UI.inputOverline}</p>
                  <h3 className="text-xl font-display font-semibold text-mao-black">
                    {UI.inputTitle}
                  </h3>
                </div>
                <span className="chip">{UI.inputBadge}</span>
              </div>
              <p className="mt-2 text-sm text-mao-black/60">
                {UI.inputSubtitle}
              </p>
              <div className="mt-4">
                <TextInput
                  value={text}
                  onChange={setText}
                  onAnalyze={analyze}
                  loading={loading}
                />
              </div>
              {error && (
                <div className="mt-4 rounded-lg border border-mao-red/30 bg-mao-red/10 px-4 py-3 text-sm font-semibold text-mao-red">
                  {error}
                </div>
              )}

              {/* Search history */}
              {history.length > 0 && (
                <div className="mt-4 pt-4 border-t border-mao-black/10">
                  <SearchHistory
                    history={history}
                    onSelect={handleTextSelect}
                    onRemove={removeFromHistory}
                    onClear={clearHistory}
                  />
                </div>
              )}
            </div>

            <div className="surface-card">
              <div className="flex items-center justify-between gap-4">
                <p className="section-title">{UI.examplesTitle}</p>
                <span className="chip">{UI.examplesBadge}</span>
              </div>
              <div className="mt-4">
                <QuickExamples onExampleClick={handleTextSelect} />
              </div>
            </div>
          </div>

          <div className="space-y-8">
            <ToneVisualizer words={result?.words ?? []} />
            <ToneLegend />
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-mao-black bg-mao-white mt-auto">
        <div className="max-w-6xl mx-auto px-4 py-8">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-6">
            <div className="flex items-center gap-6">
              <Logo size="sm" />
              <p className="hidden sm:block text-xs font-bold uppercase tracking-wider text-mao-black/30">
                |
              </p>
              <p className="text-xs font-bold uppercase tracking-wider text-mao-black/70">
                {UI.footerBuilt}
              </p>
              <Link
                href="/about"
                className="text-xs text-mao-black/50 hover:text-mao-red transition-colors"
              >
                About
              </Link>
            </div>
            <p className="text-[10px] text-mao-black/50">
              Dictionary data ©{' '}
              <a
                href="https://www.mdbg.net/chinese/dictionary?page=cedict"
                target="_blank"
                rel="noopener noreferrer"
                className="underline hover:text-mao-red"
              >
                CC-CEDICT
              </a>
              {' '}(
              <a
                href="https://creativecommons.org/licenses/by-sa/4.0/"
                target="_blank"
                rel="noopener noreferrer"
                className="underline hover:text-mao-red"
              >
                CC BY-SA 4.0
              </a>
              )
            </p>
          </div>
        </div>
      </footer>
    </main>
  )
}
