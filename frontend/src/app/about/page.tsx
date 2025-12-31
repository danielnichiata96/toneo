import type { Metadata } from 'next'
import Link from 'next/link'
import { Logo } from '@/components/Logo'

export const metadata: Metadata = {
  title: 'About - Toneo',
  description: 'About Toneo, the Chinese tone visualizer. Credits, data sources, and licenses.',
}

export default function AboutPage() {
  return (
    <main className="page-shell min-h-screen">
      {/* Header */}
      <header className="border-b border-mao-black bg-mao-white">
        <div className="h-1 bg-mao-red" />
        <div className="max-w-4xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between gap-6">
            <div className="flex flex-col gap-4">
              <Link href="/" className="section-title hover:text-mao-red transition-colors flex items-center gap-2">
                ← Back to Toneo
              </Link>
              <div className="flex items-center gap-4">
                <Logo size="md" showText={false} />
                <h1 className="text-2xl sm:text-5xl font-display font-black tracking-tighter uppercase leading-none text-mao-black">
                  About
                </h1>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Content */}
      <section className="max-w-4xl mx-auto px-4 py-12 space-y-12">
        {/* What is Toneo */}
        <div className="surface-card">
          <h2 className="text-xl font-display font-bold text-mao-black mb-4">
            What is Toneo?
          </h2>
          <p className="text-mao-black/80 leading-relaxed">
            Toneo is a free, open-source Chinese tone visualizer designed to help Mandarin learners
            master pronunciation. Unlike traditional dictionaries that only show tone numbers,
            Toneo provides visual tone curves, automatic tone sandhi detection, and HSK level tags.
          </p>
          <p className="mt-4 text-mao-black/80 leading-relaxed">
            Our mission: <strong>&ldquo;Stop sounding like a robot. Start sounding native.&rdquo;</strong>
          </p>
        </div>

        {/* Data Sources */}
        <div className="surface-card">
          <h2 className="text-xl font-display font-bold text-mao-black mb-4">
            Data Sources & Licenses
          </h2>
          <p className="text-sm text-mao-black/60 mb-6">
            Toneo is built on open data. We are grateful to these projects:
          </p>

          <div className="space-y-6">
            {/* CC-CEDICT */}
            <div className="border-l-4 border-mao-red pl-4">
              <h3 className="font-bold text-mao-black">CC-CEDICT</h3>
              <p className="text-sm text-mao-black/70 mt-1">
                The dictionary data (124,000+ entries) comes from CC-CEDICT, a community-maintained
                Chinese-English dictionary.
              </p>
              <div className="mt-2 flex flex-wrap gap-2">
                <a
                  href="https://www.mdbg.net/chinese/dictionary?page=cedict"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs font-bold text-mao-red hover:underline"
                >
                  MDBG Source →
                </a>
                <a
                  href="https://creativecommons.org/licenses/by-sa/4.0/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="chip hover:bg-mao-yellow/30 transition-colors"
                >
                  CC BY-SA 4.0
                </a>
              </div>
            </div>

            {/* HSK 3.0 */}
            <div className="border-l-4 border-mao-yellow pl-4">
              <h3 className="font-bold text-mao-black">HSK 3.0 Vocabulary</h3>
              <p className="text-sm text-mao-black/70 mt-1">
                HSK level tags are based on the new HSK 3.0 standard (2021), with 11,000+ words
                across levels 1-6 and 7-9.
              </p>
              <div className="mt-2 flex flex-wrap gap-2">
                <a
                  href="https://github.com/ivankra/hsk30"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs font-bold text-mao-red hover:underline"
                >
                  GitHub Source →
                </a>
                <span className="chip">MIT License</span>
              </div>
            </div>

            {/* wordfreq */}
            <div className="border-l-4 border-mao-black pl-4">
              <h3 className="font-bold text-mao-black">Word Frequency</h3>
              <p className="text-sm text-mao-black/70 mt-1">
                Word frequency data is provided by wordfreq, using the Zipf scale (0-8) to indicate
                how common a word is in everyday Chinese.
              </p>
              <div className="mt-2 flex flex-wrap gap-2">
                <a
                  href="https://github.com/rspeer/wordfreq"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs font-bold text-mao-red hover:underline"
                >
                  GitHub Source →
                </a>
                <span className="chip">MIT License</span>
              </div>
            </div>

            {/* NLP Tools */}
            <div className="border-l-4 border-mao-cream pl-4">
              <h3 className="font-bold text-mao-black">NLP Libraries</h3>
              <p className="text-sm text-mao-black/70 mt-1">
                Text segmentation powered by jieba. Pinyin and tone conversion powered by pypinyin.
              </p>
              <div className="mt-2 flex flex-wrap gap-2">
                <a
                  href="https://github.com/fxsjy/jieba"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs font-bold text-mao-red hover:underline"
                >
                  jieba →
                </a>
                <a
                  href="https://github.com/mozillazg/python-pinyin"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs font-bold text-mao-red hover:underline"
                >
                  pypinyin →
                </a>
                <span className="chip">MIT License</span>
              </div>
            </div>
          </div>
        </div>

        {/* Tech Stack */}
        <div className="surface-card">
          <h2 className="text-xl font-display font-bold text-mao-black mb-4">
            Technology
          </h2>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-mao-black/50 mb-2">Frontend</h3>
              <ul className="space-y-1 text-sm text-mao-black/80">
                <li>Next.js 14</li>
                <li>TypeScript</li>
                <li>Tailwind CSS</li>
              </ul>
            </div>
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-mao-black/50 mb-2">Backend</h3>
              <ul className="space-y-1 text-sm text-mao-black/80">
                <li>FastAPI</li>
                <li>Python 3.12</li>
                <li>Azure Speech TTS</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Open Source */}
        <div className="surface-card">
          <h2 className="text-xl font-display font-bold text-mao-black mb-4">
            Open Source
          </h2>
          <p className="text-mao-black/80 leading-relaxed">
            Toneo is open source. You can view the code, report issues, or contribute on GitHub.
          </p>
          <div className="mt-4">
            <a
              href="https://github.com/danielnichiata96/toneo"
              target="_blank"
              rel="noopener noreferrer"
              className="brutal-button inline-flex"
            >
              View on GitHub
            </a>
          </div>
        </div>

        {/* Contact */}
        <div className="surface-card">
          <h2 className="text-xl font-display font-bold text-mao-black mb-4">
            Contact
          </h2>
          <p className="text-mao-black/80 leading-relaxed">
            Found a bug? Have a feature request?{' '}
            <a
              href="https://github.com/danielnichiata96/toneo/issues"
              target="_blank"
              rel="noopener noreferrer"
              className="text-mao-red hover:underline font-medium"
            >
              Open an issue on GitHub
            </a>
            .
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-mao-black bg-mao-white mt-auto">
        <div className="max-w-4xl mx-auto px-4 py-8">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-6">
            <div className="flex items-center gap-6">
              <Logo size="sm" />
              <p className="text-[10px] font-mono text-mao-black/50">
                Dictionary data ©{' '}
                <a
                  href="https://www.mdbg.net/chinese/dictionary?page=cedict"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline hover:text-mao-red"
                >
                  CC-CEDICT
                </a>
              </p>
            </div>
            <Link href="/" className="text-xs font-bold uppercase tracking-widest text-mao-red hover:translate-x-[-2px] transition-transform">
              ← Back to app
            </Link>
          </div>
        </div>
      </footer>
    </main>
  )
}
