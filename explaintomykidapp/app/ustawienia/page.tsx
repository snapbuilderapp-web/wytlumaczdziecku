'use client'

import { Header } from '@/components/layout/Header'
import { BottomTabBar } from '@/components/layout/BottomTabBar'
import { PageWrapper } from '@/components/layout/PageWrapper'
import { useAgeMode } from '@/hooks/useAgeMode'
import { useDyslexiaMode } from '@/hooks/useDyslexiaMode'

export default function UstawieniaPage() {
  const { ageMode, setAgeMode } = useAgeMode()
  const { dyslexiaMode, setDyslexiaMode } = useDyslexiaMode()

  return (
    <>
      <Header />
      <PageWrapper>
        <h1 className="font-[family-name:var(--age-font-display)] font-bold text-2xl text-[var(--text-primary)] mb-6">
          Ustawienia
        </h1>

        {/* Age group */}
        <section className="mb-6 p-5 bg-[var(--bg-card)] rounded-[var(--radius-card)] border border-stone-200">
          <h2 className="font-semibold text-[var(--text-primary)] mb-1">Grupa wiekowa</h2>
          <p className="text-sm text-[var(--text-secondary)] mb-4">
            Dobieramy treści do Twojego wieku
          </p>
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={() => setAgeMode('under13')}
              className={[
                'p-4 rounded-[var(--radius-element)] border-2 text-sm font-medium transition-all',
                ageMode === 'under13'
                  ? 'border-[var(--brand-primary)] bg-orange-50 text-[var(--brand-primary)]'
                  : 'border-stone-200 text-[var(--text-secondary)]',
              ].join(' ')}
              aria-pressed={ageMode === 'under13'}
            >
              🧒 Do 13 lat
            </button>
            <button
              onClick={() => setAgeMode('13plus')}
              className={[
                'p-4 rounded-[var(--radius-element)] border-2 text-sm font-medium transition-all',
                ageMode === '13plus'
                  ? 'border-[var(--brand-primary)] bg-orange-50 text-[var(--brand-primary)]'
                  : 'border-stone-200 text-[var(--text-secondary)]',
              ].join(' ')}
              aria-pressed={ageMode === '13plus'}
            >
              🧑 13+ lat
            </button>
          </div>
        </section>

        {/* Dyslexia mode */}
        <section className="mb-6 p-5 bg-[var(--bg-card)] rounded-[var(--radius-card)] border border-stone-200">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="font-semibold text-[var(--text-primary)]">Tryb dysleksji</h2>
              <p className="text-sm text-[var(--text-secondary)] mt-0.5">
                Zwiększone odstępy i interlinia dla lepszej czytelności
              </p>
            </div>
            <button
              onClick={() => setDyslexiaMode(!dyslexiaMode)}
              role="switch"
              aria-checked={dyslexiaMode}
              className={[
                'relative w-12 h-6 rounded-full transition-colors duration-200 focus-visible:ring-4',
                dyslexiaMode ? 'bg-[var(--brand-primary)]' : 'bg-stone-300',
              ].join(' ')}
            >
              <span
                className={[
                  'absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform duration-200',
                  dyslexiaMode ? 'translate-x-6' : 'translate-x-0.5',
                ].join(' ')}
              />
              <span className="sr-only">{dyslexiaMode ? 'Wyłącz' : 'Włącz'} tryb dysleksji</span>
            </button>
          </div>
        </section>

        {/* Links */}
        <div className="space-y-2 text-sm">
          <a href="/dla-rodzicow" className="block text-[var(--brand-primary)] hover:underline">
            Dla rodziców →
          </a>
          <a href="/polityka-prywatnosci" className="block text-[var(--brand-primary)] hover:underline">
            Polityka prywatności →
          </a>
        </div>
      </PageWrapper>
      <BottomTabBar />
    </>
  )
}
