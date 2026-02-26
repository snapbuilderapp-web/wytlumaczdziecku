'use client'

import Link from 'next/link'
import { BezReklamBadge } from '@/components/trust/BezReklamBadge'
import { AgeToggle } from '@/components/age/AgeToggle'

export function Header() {
  return (
    <header className="sticky top-0 z-40 bg-[var(--bg-base)] border-b border-stone-200">
      <div className="max-w-2xl mx-auto px-4 h-14 flex items-center justify-between gap-3">
        {/* Logo */}
        <Link
          href="/"
          className="flex items-center gap-2 font-[family-name:var(--age-font-display)] font-bold text-[var(--brand-primary)] text-lg leading-tight"
          aria-label="Wytłumacz Dziecku — strona główna"
        >
          <span aria-hidden="true">🔍</span>
          <span className="hidden sm:inline">Wytłumacz Dziecku</span>
          <span className="sm:hidden">WD</span>
        </Link>

        {/* Right side */}
        <div className="flex items-center gap-2">
          <BezReklamBadge />
          <AgeToggle />
          <Link
            href="/dla-rodzicow"
            className="hidden sm:flex items-center gap-1 text-xs text-[var(--text-secondary)]
                       hover:text-[var(--text-primary)] transition-colors px-2 py-1 rounded"
          >
            Dla rodziców
          </Link>
        </div>
      </div>
    </header>
  )
}
