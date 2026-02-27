'use client'

import { usePathname } from 'next/navigation'
import { useAgeMode } from '@/hooks/useAgeMode'

export function AgeToggle() {
  const { ageMode, setAgeMode, isLoaded } = useAgeMode()
  const pathname = usePathname()
  const isEnglish = pathname.startsWith('/en')

  if (!isLoaded) return null

  return (
    <div
      className="flex items-center gap-1 bg-stone-100 rounded-full p-0.5"
      role="group"
      aria-label={isEnglish ? 'Select age group' : 'Wybierz grupę wiekową'}
    >
      <button
        onClick={() => setAgeMode('under13')}
        className={[
          'px-3 py-1 rounded-full text-xs font-medium transition-all duration-150',
          ageMode === 'under13'
            ? 'bg-white text-[var(--brand-primary)] shadow-sm'
            : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]',
        ].join(' ')}
        aria-pressed={ageMode === 'under13'}
      >
        {isEnglish ? 'under 13' : 'do 13 lat'}
      </button>
      <button
        onClick={() => setAgeMode('13plus')}
        className={[
          'px-3 py-1 rounded-full text-xs font-medium transition-all duration-150',
          ageMode === '13plus'
            ? 'bg-white text-[var(--brand-primary)] shadow-sm'
            : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]',
        ].join(' ')}
        aria-pressed={ageMode === '13plus'}
      >
        13+
      </button>
    </div>
  )
}
