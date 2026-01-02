import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { lookupWordServer } from '@/lib/api-server';
import { DictionaryContent } from './DictionaryContent';

interface Props {
  params: Promise<{ word: string }>;
}

// Generate metadata for SEO
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { word } = await params;
  const decodedWord = decodeURIComponent(word);
  const entry = await lookupWordServer(decodedWord);

  if (!entry) {
    return {
      title: `${decodedWord} - Word Not Found | Toneo`,
      description: `Search for the meaning and pronunciation of ${decodedWord} in Chinese.`,
    };
  }

  const toneNumbers = entry.tones.join('-');
  const firstDef = entry.definitions[0] || 'Chinese word';
  const hskLabel = entry.hsk_level > 0
    ? `HSK ${entry.hsk_level <= 6 ? entry.hsk_level : '7-9'}`
    : '';

  return {
    title: `${entry.simplified} (${entry.pinyin}) - ${firstDef} | Toneo`,
    description: `${entry.simplified} (${entry.pinyin}): ${entry.definitions.slice(0, 3).join('; ')}. Tones: ${toneNumbers}. ${hskLabel}. Learn Chinese pronunciation with visual tone curves.`,
    keywords: [
      entry.simplified,
      entry.traditional || '',
      entry.pinyin,
      'Chinese dictionary',
      'Mandarin tones',
      'pinyin',
      hskLabel,
      'learn Chinese',
    ].filter(Boolean),
    openGraph: {
      title: `${entry.simplified} (${entry.pinyin}) | Toneo Chinese Dictionary`,
      description: `${firstDef}. Learn the correct tones and pronunciation.`,
      type: 'article',
      url: `https://toneo.vercel.app/dict/${encodeURIComponent(entry.simplified)}`,
    },
    twitter: {
      card: 'summary',
      title: `${entry.simplified} (${entry.pinyin})`,
      description: firstDef,
    },
    alternates: {
      canonical: `https://toneo.vercel.app/dict/${encodeURIComponent(entry.simplified)}`,
    },
  };
}

// JSON-LD structured data
function generateJsonLd(entry: NonNullable<Awaited<ReturnType<typeof lookupWordServer>>>) {
  return {
    '@context': 'https://schema.org',
    '@type': 'DefinedTerm',
    name: entry.simplified,
    alternateName: entry.traditional || undefined,
    description: entry.definitions.join('; '),
    inDefinedTermSet: {
      '@type': 'DefinedTermSet',
      name: 'CC-CEDICT Chinese-English Dictionary',
      url: 'https://cc-cedict.org/',
    },
    termCode: entry.pinyin,
  };
}

export default async function DictionaryPage({ params }: Props) {
  const { word } = await params;
  const decodedWord = decodeURIComponent(word);
  const entry = await lookupWordServer(decodedWord);

  if (!entry) {
    notFound();
  }

  const jsonLd = generateJsonLd(entry);

  return (
    <>
      {/* JSON-LD for SEO */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <main className="min-h-screen bg-mao-cream">
        {/* Header */}
        <header className="bg-mao-white border-b-2 border-mao-black">
          <div className="max-w-3xl mx-auto px-4 py-4 flex items-center justify-between">
            <Link
              href="/"
              className="text-xl font-display font-bold text-mao-black hover:text-mao-red transition-colors"
            >
              Toneo
            </Link>
            <nav className="flex gap-4">
              <Link
                href="/"
                className="text-sm font-medium text-mao-black/60 hover:text-mao-black transition-colors"
              >
                Analyzer
              </Link>
              <Link
                href="/about"
                className="text-sm font-medium text-mao-black/60 hover:text-mao-black transition-colors"
              >
                About
              </Link>
            </nav>
          </div>
        </header>

        {/* Content */}
        <div className="max-w-3xl mx-auto px-4 py-8">
          <DictionaryContent entry={entry} />

          {/* CTA for Journey */}
          <div className="mt-12 bg-mao-red text-mao-white p-6 border-2 border-mao-black shadow-brutal">
            <h2 className="text-xl font-display font-bold mb-2">
              Master this word in 5 minutes a day
            </h2>
            <p className="text-mao-white/80 mb-4">
              Don&apos;t just look up words. Learn to pronounce them perfectly with our tone training system.
            </p>
            <Link
              href="/"
              className="inline-block bg-mao-yellow text-mao-black font-bold px-6 py-3 border-2 border-mao-black hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-brutal transition-all"
            >
              Start Your Journey
            </Link>
          </div>

          {/* Related words */}
          {entry.related.length > 0 && (
            <div className="mt-8">
              <h3 className="text-sm font-bold text-mao-black/50 uppercase tracking-wide mb-3">
                Related Words
              </h3>
              <div className="flex flex-wrap gap-2">
                {entry.related.map((relatedWord) => (
                  <Link
                    key={relatedWord}
                    href={`/dict/${encodeURIComponent(relatedWord)}`}
                    className="px-4 py-2 bg-mao-white border-2 border-mao-black text-mao-black font-medium hover:bg-mao-cream hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-brutal-sm transition-all"
                  >
                    {relatedWord}
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* Footer attribution */}
          <footer className="mt-12 pt-6 border-t border-mao-black/10 text-center">
            <p className="text-xs text-mao-black/40">
              Dictionary data from{' '}
              <a
                href="https://cc-cedict.org/"
                target="_blank"
                rel="noopener noreferrer"
                className="underline hover:text-mao-black/60"
              >
                CC-CEDICT
              </a>
              {' '}(CC BY-SA 4.0) · Frequency data from wordfreq
            </p>
          </footer>
        </div>
      </main>
    </>
  );
}
