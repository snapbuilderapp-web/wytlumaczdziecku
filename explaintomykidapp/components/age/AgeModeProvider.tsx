'use client'

import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from 'react'
import type { AgeMode } from '@/types'

const STORAGE_KEY = 'wdk_age'

interface AgeModeContextValue {
  ageMode: AgeMode
  setAgeMode: (mode: AgeMode) => void
  isFirstVisit: boolean
  isLoaded: boolean
}

const AgeModeContext = createContext<AgeModeContextValue | null>(null)

export function AgeModeProvider({ children }: { children: ReactNode }) {
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
      // localStorage unavailable — use default
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

  return (
    <AgeModeContext.Provider value={{ ageMode, setAgeMode, isFirstVisit, isLoaded }}>
      {children}
    </AgeModeContext.Provider>
  )
}

export function useAgeModeContext(): AgeModeContextValue {
  const ctx = useContext(AgeModeContext)
  if (!ctx) throw new Error('useAgeModeContext must be used inside AgeModeProvider')
  return ctx
}
