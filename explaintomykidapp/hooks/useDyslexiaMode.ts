/* eslint-disable react-hooks/set-state-in-effect */
'use client'

import { useState, useEffect, useCallback } from 'react'

const STORAGE_KEY = 'wdk_dyslexia'

interface UseDyslexiaModeReturn {
  dyslexiaMode: boolean
  setDyslexiaMode: (enabled: boolean) => void
}

export function useDyslexiaMode(): UseDyslexiaModeReturn {
  const [dyslexiaMode, setDyslexiaModeState] = useState(false)

  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY)
      const enabled = stored === '1'
      setDyslexiaModeState(enabled)
      if (enabled) {
        document.documentElement.classList.add('dyslexia-mode')
      }
    } catch {
      // localStorage unavailable
    }
  }, [])

  const setDyslexiaMode = useCallback((enabled: boolean) => {
    setDyslexiaModeState(enabled)
    try {
      if (enabled) {
        localStorage.setItem(STORAGE_KEY, '1')
        document.documentElement.classList.add('dyslexia-mode')
      } else {
        localStorage.removeItem(STORAGE_KEY)
        document.documentElement.classList.remove('dyslexia-mode')
      }
    } catch {
      // localStorage unavailable
    }
  }, [])

  return { dyslexiaMode, setDyslexiaMode }
}
