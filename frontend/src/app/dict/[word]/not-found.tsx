import Link from 'next/link';

export default function NotFound() {
  return (
    <main className="min-h-screen bg-mao-cream flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-mao-white border-2 border-mao-black p-8 shadow-brutal text-center">
        <h1 className="text-6xl font-display font-bold text-mao-black mb-4">
          404
        </h1>
        <h2 className="text-xl font-bold text-mao-black mb-2">
          Word Not Found
        </h2>
        <p className="text-mao-black/60 mb-6">
          This word isn&apos;t in our dictionary yet. Try searching for another word or check your spelling.
        </p>
        <div className="space-y-3">
          <Link
            href="/"
            className="block w-full bg-mao-red text-mao-white font-bold py-3 border-2 border-mao-black hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-brutal transition-all"
          >
            Go to Analyzer
          </Link>
          <Link
            href="/dict/你好"
            className="block w-full bg-mao-cream text-mao-black font-bold py-3 border-2 border-mao-black hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-brutal-sm transition-all"
          >
            Try &ldquo;你好&rdquo;
          </Link>
        </div>
      </div>
    </main>
  );
}
