'use client'

import { useState, useRef, useCallback, useEffect } from 'react'
import { synthesizeSpeech } from '@/lib/api'

interface PlayButtonProps {
  text: string
  voice?: string
  rate?: number
  size?: 'sm' | 'md' | 'lg'
  className?: string
}

/**
 * Play button for TTS audio.
 */
export function PlayButton({
  text,
  voice = 'female1',
  rate = 1.0,
  size = 'md',
  className = '',
}: PlayButtonProps) {
  const [status, setStatus] = useState<'idle' | 'loading' | 'playing' | 'error'>('idle')
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const urlRef = useRef<string | null>(null)
  const errorTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  // Helper to set error status with auto-reset, cancellable on unmount
  const setErrorWithReset = useCallback(() => {
    setStatus('error')
    if (errorTimeoutRef.current) {
      clearTimeout(errorTimeoutRef.current)
    }
    errorTimeoutRef.current = setTimeout(() => {
      errorTimeoutRef.current = null
      setStatus('idle')
    }, 2000)
  }, [])

  const sizeClasses = {
    sm: 'w-7 h-7',
    md: 'w-9 h-9',
    lg: 'w-11 h-11',
  }

  const iconSizes = {
    sm: 12,
    md: 16,
    lg: 20,
  }

  const handlePlay = useCallback(async () => {
    // If already playing, stop
    if (status === 'playing' && audioRef.current) {
      audioRef.current.pause()
      audioRef.current.currentTime = 0
      setStatus('idle')
      return
    }

    // If loading, ignore
    if (status === 'loading') return

    setStatus('loading')

    try {
      // Fetch audio
      const blob = await synthesizeSpeech(text, voice, rate)

      // Clean up previous URL
      if (urlRef.current) {
        URL.revokeObjectURL(urlRef.current)
      }

      // Create new audio
      const url = URL.createObjectURL(blob)
      urlRef.current = url

      const audio = new Audio(url)
      audioRef.current = audio

      audio.onended = () => {
        setStatus('idle')
      }

      audio.onerror = () => {
        setErrorWithReset()
      }

      setStatus('playing')
      await audio.play()

    } catch (error) {
      console.error('TTS error:', error)
      setErrorWithReset()
    }
  }, [text, voice, rate, status, setErrorWithReset])

  // Cleanup on unmount: cancel timeout, revoke Object URL, stop audio
  useEffect(() => {
    return () => {
      if (errorTimeoutRef.current) {
        clearTimeout(errorTimeoutRef.current)
        errorTimeoutRef.current = null
      }
      if (audioRef.current) {
        audioRef.current.pause()
        audioRef.current = null
      }
      if (urlRef.current) {
        URL.revokeObjectURL(urlRef.current)
        urlRef.current = null
      }
    }
  }, [])

  return (
    <button
      type="button"
      onClick={handlePlay}
      disabled={status === 'loading'}
      className={`
        ${sizeClasses[size]}
        flex items-center justify-center rounded-none
        border border-mao-black
        bg-mao-white
        hover:bg-mao-yellow/20
        disabled:opacity-50 disabled:cursor-wait
        transition-all duration-150
        active:translate-y-[1px]
        ${className}
      `}
      title={status === 'error' ? 'TTS unavailable' : 'Play pronunciation'}
    >
      {status === 'loading' ? (
        <LoadingIcon size={iconSizes[size]} />
      ) : status === 'playing' ? (
        <StopIcon size={iconSizes[size]} />
      ) : status === 'error' ? (
        <ErrorIcon size={iconSizes[size]} />
      ) : (
        <PlayIcon size={iconSizes[size]} />
      )}
    </button>
  )
}

function PlayIcon({ size }: { size: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="currentColor"
      className="text-mao-black"
    >
      <path d="M8 5v14l11-7z" />
    </svg>
  )
}

function StopIcon({ size }: { size: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="currentColor"
      className="text-mao-red"
    >
      <rect x="6" y="6" width="12" height="12" />
    </svg>
  )
}

function LoadingIcon({ size }: { size: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      className="animate-spin text-mao-black"
    >
      <circle
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="3"
        strokeOpacity="0.25"
      />
      <path
        d="M12 2a10 10 0 0 1 10 10"
        stroke="currentColor"
        strokeWidth="3"
        strokeLinecap="round"
      />
    </svg>
  )
}

function ErrorIcon({ size }: { size: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="currentColor"
      className="text-mao-red"
    >
      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z" />
    </svg>
  )
}
