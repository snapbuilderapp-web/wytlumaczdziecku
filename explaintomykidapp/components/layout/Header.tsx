'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { BezReklamBadge } from '@/components/trust/BezReklamBadge'
import { AgeToggle } from '@/components/age/AgeToggle'
import { LangToggle } from '@/components/layout/LangToggle'
import { HeaderLogo } from '@/components/layout/HeaderLogo'
import { RewardsModal } from '@/components/mascot/RewardsModal'
import { useGamification } from '@/hooks/useGamification'
import { useState } from 'react'

export function Header() {
  const pathname = usePathname()
  const { points } = useGamification()
  const [isRewardsOpen, setIsRewardsOpen] = useState(false)

  return (
    <header className="sticky top-0 z-40 bg-[var(--bg-base)] border-b border-stone-200">
      <div className="max-w-2xl mx-auto px-4 h-14 flex items-center justify-between gap-3">
        {/* Logo — locale-aware */}
        <HeaderLogo />

        {/* Right side */}
        <div className="flex items-center gap-2">
          {/* Gamification Points Indicator */}
          <button
            onClick={() => setIsRewardsOpen(true)}
            className="flex items-center gap-1.5 bg-amber-100 hover:bg-amber-200 text-amber-900 px-3 py-1.5 rounded-full font-bold text-sm transition-colors border border-amber-200 shadow-sm"
          >
            <span className="text-base">⭐</span> {points} <span className="hidden sm:inline">PKT</span>
          </button>

          <BezReklamBadge />
          <LangToggle />
          <AgeToggle />
          <Link
            href={pathname.startsWith('/en') ? '/en' : '/dla-rodzicow'}
            className="hidden sm:flex items-center gap-1 text-xs text-[var(--text-secondary)]
                       hover:text-[var(--text-primary)] transition-colors px-2 py-1 rounded"
          >
            {pathname.startsWith('/en') ? 'For parents' : 'Dla rodziców'}
          </Link>
        </div>
      </div>

      {/* Rewards Modal */}
      <RewardsModal
        isOpen={isRewardsOpen}
        onClose={() => setIsRewardsOpen(false)}
      />
    </header>
  )
}
