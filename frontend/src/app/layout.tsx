import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Toneo - Learn Chinese Tones',
  description: 'The Grammarly of Chinese Pronunciation. Visualize and master Mandarin tones.',
  keywords: ['Chinese', 'Mandarin', 'tones', 'pronunciation', 'learning', 'pinyin'],
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="min-h-screen text-mao-black antialiased">
        {children}
      </body>
    </html>
  )
}
