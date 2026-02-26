'use client'

import { useState, useEffect, useRef, useCallback } from 'react'

export function useScrollProgress(containerRef?: React.RefObject<HTMLElement | null>) {
  const [progress, setProgress] = useState(0)

  const handleScroll = useCallback(() => {
    const el = containerRef?.current ?? document.documentElement
    const scrollTop = el.scrollTop
    const scrollHeight = el.scrollHeight - el.clientHeight
    if (scrollHeight <= 0) {
      setProgress(100)
      return
    }
    setProgress(Math.round((scrollTop / scrollHeight) * 100))
  }, [containerRef])

  useEffect(() => {
    const el = containerRef?.current ?? window
    el.addEventListener('scroll', handleScroll, { passive: true })
    return () => el.removeEventListener('scroll', handleScroll)
  }, [containerRef, handleScroll])

  return progress
}
