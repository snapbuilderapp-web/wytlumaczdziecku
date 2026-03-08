/* eslint-disable react-hooks/set-state-in-effect */
'use client'

import dynamic from 'next/dynamic'
import { useState, useEffect } from 'react'
import { RysStatic } from './RysStatic'

const LottiePlayer = dynamic(
  () => import('@lottiefiles/react-lottie-player').then((m) => m.Player),
  { ssr: false }
)

export type RysState =
  | 'idle'
  | 'curious'
  | 'excited'
  | 'thinking'
  | 'encouraging'
  | 'celebrating'

interface RysProps {
  state?: RysState
  size?: number
  className?: string
}

export function Rys({ state = 'idle', size = 80, className = '' }: RysProps) {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(true)
  const [lottieExists, setLottieExists] = useState(false)

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
    setPrefersReducedMotion(mq.matches)
    const handler = (e: MediaQueryListEvent) => setPrefersReducedMotion(e.matches)
    mq.addEventListener('change', handler)
    return () => mq.removeEventListener('change', handler)
  }, [])

  useEffect(() => {
    // Check if Lottie JSON exists for this state
    fetch(`/animations/rys-${state}.json`, { method: 'HEAD' })
      .then((r) => setLottieExists(r.ok))
      .catch(() => setLottieExists(false))
  }, [state])

  if (prefersReducedMotion || !lottieExists) {
    return <RysStatic size={size} className={className} />
  }

  return (
    <LottiePlayer
      src={`/animations/rys-${state}.json`}
      style={{ width: size, height: size }}
      className={className}
      autoplay
      loop={state === 'idle'}
      keepLastFrame
    />
  )
}
