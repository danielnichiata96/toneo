/**
 * Toneo API Client
 */
import type { AnalyzeResponse, DictionaryEntry } from '@/types/tone';

// Use relative path - Next.js rewrites will proxy to backend
const API_BASE = '/api';

/**
 * Analyze Chinese text for tones.
 */
export async function analyzeText(text: string): Promise<AnalyzeResponse> {
  const response = await fetch(`${API_BASE}/analyze`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ text }),
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ detail: 'Analysis failed' }));
    throw new Error(error.detail || 'Analysis failed');
  }

  return response.json();
}

/**
 * Get available TTS voices.
 */
export async function getVoices() {
  const response = await fetch(`${API_BASE}/tts/voices`);

  if (!response.ok) {
    throw new Error('Failed to fetch voices');
  }

  return response.json();
}

/**
 * Synthesize speech (returns audio blob).
 */
export async function synthesizeSpeech(
  text: string,
  voice: string = 'female1',
  rate: number = 1.0
): Promise<Blob> {
  const response = await fetch(`${API_BASE}/tts`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ text, voice, rate }),
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ detail: 'TTS failed' }));
    throw new Error(error.detail || 'TTS failed');
  }

  return response.blob();
}

/**
 * Look up a word in the dictionary.
 */
export async function lookupWord(word: string): Promise<DictionaryEntry> {
  const response = await fetch(`${API_BASE}/dictionary/${encodeURIComponent(word)}`);

  if (!response.ok) {
    const error = await response.json().catch(() => ({ detail: 'Lookup failed' }));
    throw new Error(error.detail || 'Lookup failed');
  }

  return response.json();
}
