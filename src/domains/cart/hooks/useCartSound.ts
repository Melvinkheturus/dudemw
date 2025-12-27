"use client"

import { useEffect, useRef, useCallback } from 'react'

export function useCartSound() {
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const hasPlayedRef = useRef(false)

  useEffect(() => {
    if (typeof window !== 'undefined' && !audioRef.current) {
      const audio = new Audio()
      audio.src = '/sfx/cart-pop.mp3'
      audio.preload = 'auto'
      audio.volume = 0.6
      audio.muted = false
      audio.load()

      // Unlock audio on first user interaction (mobile browser requirement)
      const unlockAudio = () => {
        if (audioRef.current && !hasPlayedRef.current) {
          audioRef.current.play().then(() => {
            audioRef.current?.pause()
            audioRef.current!.currentTime = 0
            hasPlayedRef.current = true
          }).catch(() => {})
          
          document.removeEventListener('touchstart', unlockAudio)
          document.removeEventListener('click', unlockAudio)
        }
      }

      document.addEventListener('touchstart', unlockAudio, { once: true })
      document.addEventListener('click', unlockAudio, { once: true })

      audioRef.current = audio
    }

    return () => {
      if (audioRef.current) {
        audioRef.current.pause()
        audioRef.current.src = ''
        audioRef.current = null
      }
    }
  }, [])

  const playSound = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.currentTime = 0
      const promise = audioRef.current.play()
      
      if (promise !== undefined) {
        promise.catch(error => {
          console.log('Cart sound blocked (normal on first load):', error.message)
        })
      }
      
      hasPlayedRef.current = true
    }
  }, [])

  return playSound
}
