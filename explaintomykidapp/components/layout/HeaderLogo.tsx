'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

export function HeaderLogo() {
  const pathname = usePathname()
  const isEnglish = pathname.startsWith('/en')

  if (isEnglish) {
    return (
      <Link
        href="/en"
        className="flex items-center gap-2 font-[family-name:var(--age-font-display)] font-bold text-[var(--brand-primary)] text-lg leading-tight"
        aria-label="Explain to My Kid — home page"
      >
        <span aria-hidden="true">🔍</span>
        <span className="hidden sm:inline">Explain to My Kid</span>
        <span className="sm:hidden">EMK</span>
      </Link>
    )
  }

  return (
    <Link
      href="/"
      className="flex items-center gap-2 font-[family-name:var(--age-font-display)] font-bold text-[var(--brand-primary)] text-lg leading-tight"
      aria-label="Wytłumacz Dziecku — strona główna"
    >
      <span aria-hidden="true">🔍</span>
      <span className="hidden sm:inline">Wytłumacz Dziecku</span>
      <span className="sm:hidden">WD</span>
    </Link>
  )
}
