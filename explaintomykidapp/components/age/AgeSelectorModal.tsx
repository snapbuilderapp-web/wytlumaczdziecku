'use client'

import { useAgeMode } from '@/hooks/useAgeMode'
import { Rys } from '@/components/mascot/Rys'

export function AgeSelectorModal() {
  const { isFirstVisit, setAgeMode, isLoaded } = useAgeMode()

  if (!isLoaded || !isFirstVisit) return null

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-labelledby="age-modal-title"
    >
      <div className="w-full max-w-sm bg-[var(--bg-base)] rounded-[var(--radius-card)] p-6 shadow-2xl">
        {/* Mascot + intro */}
        <div className="flex flex-col items-center text-center gap-4 mb-6">
          <Rys state="curious" size={100} />
          <h1
            id="age-modal-title"
            className="font-[family-name:var(--age-font-display)] font-bold text-2xl text-[var(--text-primary)]"
          >
            Ile masz lat?
          </h1>
          <p className="text-[var(--text-secondary)] text-sm">
            Dobiorę dla Ciebie odpowiednie wyjaśnienia
          </p>
        </div>

        {/* Age selection cards */}
        <div className="grid grid-cols-2 gap-3">
          <button
            onClick={() => setAgeMode('under13')}
            className="flex flex-col items-center gap-3 p-5 rounded-[var(--radius-card)]
                       border-2 border-stone-200 bg-[var(--bg-card)]
                       hover:border-[var(--brand-primary)] hover:scale-[1.02]
                       focus-visible:ring-4 focus-visible:ring-blue-500/30
                       transition-all duration-200 active:scale-[0.98]"
          >
            <span className="text-4xl" aria-hidden="true">🧒</span>
            <span className="font-semibold text-[var(--text-primary)] text-sm leading-tight text-center">
              Mam mniej niż 13 lat
            </span>
          </button>

          <button
            onClick={() => setAgeMode('13plus')}
            className="flex flex-col items-center gap-3 p-5 rounded-[var(--radius-card)]
                       border-2 border-stone-200 bg-[var(--bg-card)]
                       hover:border-[var(--brand-primary)] hover:scale-[1.02]
                       focus-visible:ring-4 focus-visible:ring-blue-500/30
                       transition-all duration-200 active:scale-[0.98]"
          >
            <span className="text-4xl" aria-hidden="true">🧑</span>
            <span className="font-semibold text-[var(--text-primary)] text-sm leading-tight text-center">
              Mam 13 lub więcej lat
            </span>
          </button>
        </div>

        <p className="text-center text-xs text-[var(--text-secondary)] mt-4">
          Możesz zmienić wybór w każdej chwili
        </p>
      </div>
    </div>
  )
}
