/**
 * Toneo API Client
 */
import type { AnalyzeResponse, DictionaryEntry } from '@/types/tone';

// Use relative path - Next.js rewrites will proxy to backend
const API_BASE = '/api';
const REQUEST_TIMEOUT_MS = 15000;
const INVALID_RESPONSE_MESSAGE = 'Invalid response from server';

async function fetchWithTimeout(url: string, options?: RequestInit): Promise<Response> {
  if (typeof url !== 'string' || !url.trim()) {
    throw new Error('Invalid request URL');
  }

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);

  try {
    return await fetch(url, { ...options, signal: controller.signal });
  } catch (err) {
    if (err instanceof Error && err.name === 'AbortError') {
      throw new Error('Request timed out');
    }
    throw new Error('Network error');
  } finally {
    clearTimeout(timeoutId);
  }
}

async function readErrorDetail(response: Response, fallbackError: string): Promise<string> {
  try {
    const raw = await response.text();
    if (!raw) return fallbackError;
    try {
      const parsed = JSON.parse(raw);
      if (parsed && typeof parsed.detail === 'string') {
        return parsed.detail;
      }
    } catch {
      // Ignore non-JSON error bodies
    }
  } catch {
    // Ignore read errors
  }
  return fallbackError;
}

async function readJsonResponse<T>(response: Response): Promise<T> {
  const raw = await response.text();
  if (!raw) {
    throw new Error(INVALID_RESPONSE_MESSAGE);
  }
  try {
    return JSON.parse(raw) as T;
  } catch {
    throw new Error(INVALID_RESPONSE_MESSAGE);
  }
}

/**
 * Unified API call wrapper with consistent error handling.
 */
async function apiCall<T>(
  url: string,
  options?: RequestInit,
  fallbackError = 'Request failed'
): Promise<T> {
  const response = await fetchWithTimeout(url, options);

  if (!response.ok) {
    const detail = await readErrorDetail(response, fallbackError);
    throw new Error(detail);
  }

  return readJsonResponse<T>(response);
}

/**
 * Unified API call wrapper for blob responses (e.g., audio).
 */
async function apiCallBlob(
  url: string,
  options?: RequestInit,
  fallbackError = 'Request failed'
): Promise<Blob> {
  const response = await fetchWithTimeout(url, options);

  if (!response.ok) {
    const detail = await readErrorDetail(response, fallbackError);
    throw new Error(detail);
  }

  return response.blob();
}

/**
 * Analyze Chinese text for tones.
 */
export async function analyzeText(text: string): Promise<AnalyzeResponse> {
  if (typeof text !== 'string') {
    throw new Error('Text must be a string');
  }
  const trimmed = text.trim();
  if (!trimmed) {
    throw new Error('Text is required');
  }
  return apiCall(`${API_BASE}/analyze`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ text: trimmed }),
  }, 'Analysis failed');
}

/**
 * Get available TTS voices.
 */
export async function getVoices() {
  return apiCall(`${API_BASE}/tts/voices`, undefined, 'Failed to fetch voices');
}

/**
 * Synthesize speech (returns audio blob).
 */
export async function synthesizeSpeech(
  text: string,
  voice: string = 'female1',
  rate: number = 1.0
): Promise<Blob> {
  return apiCallBlob(`${API_BASE}/tts`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ text, voice, rate }),
  }, 'TTS failed');
}

/**
 * Look up a word in the dictionary.
 */
export async function lookupWord(word: string): Promise<DictionaryEntry> {
  return apiCall(
    `${API_BASE}/dictionary/${encodeURIComponent(word)}`,
    undefined,
    'Lookup failed'
  );
}
