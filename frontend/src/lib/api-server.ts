/**
 * Server-side API functions for Next.js Server Components
 */
import type { DictionaryEntry } from '@/types/tone';

const BACKEND_URL = process.env.BACKEND_URL || 'http://localhost:8000';

/**
 * Look up a word in the dictionary (server-side).
 */
export async function lookupWordServer(word: string): Promise<DictionaryEntry | null> {
  try {
    const response = await fetch(
      `${BACKEND_URL}/api/dictionary/${encodeURIComponent(word)}`,
      {
        next: { revalidate: 86400 }, // Cache for 24 hours
      }
    );

    if (!response.ok) {
      return null;
    }

    return response.json();
  } catch (error) {
    console.error('Dictionary lookup failed:', error);
    return null;
  }
}
