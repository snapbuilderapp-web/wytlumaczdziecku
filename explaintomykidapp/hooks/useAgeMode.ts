'use client'

import { useState, useEffect, useCallback } from 'react'
import type { AgeMode } from '@/types'

const STORAGE_KEY = 'wdk_age'

interface UseAgeModeReturn {
  ageMode: AgeMode
  setAgeMode: (mode: AgeMode) => void
  isFirstVisit: boolean
  isLoaded: boolean
}

export function useAgeMode(): UseAgeModeReturn {
  const [ageMode, setAgeModeState] = useState<AgeMode>('under13')
  const [isFirstVisit, setIsFirstVisit] = useState(false)
  const [isLoaded, setIsLoaded] = useState(false)

  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY) as AgeMode | null
      if (!stored) {
        setIsFirstVisit(true)
      } else {
        setAgeModeState(stored)
      }
    } catch {
      // localStorage unavailable (private browsing, etc.) — use default
    }
    setIsLoaded(true)
  }, [])

  const setAgeMode = useCallback((mode: AgeMode) => {
    setAgeModeState(mode)
    setIsFirstVisit(false)
    try {
      localStorage.setItem(STORAGE_KEY, mode)
      if (mode === '13plus') {
        document.documentElement.classList.add('age-13plus')
      } else {
        document.documentElement.classList.remove('age-13plus')
      }
    } catch {
      // localStorage unavailable — still update React state
    }
  }, [])

  return { ageMode, setAgeMode, isFirstVisit, isLoaded }
}
