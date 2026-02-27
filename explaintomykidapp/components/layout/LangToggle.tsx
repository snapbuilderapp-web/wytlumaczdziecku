'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

// Explicit route mappings — PL uses Polish words, EN uses English words
const PL_TO_EN: Record<string, string> = {
  '/':              '/en',
  '/szukaj':        '/en/search',
  '/tematy':        '/en/topics',
  '/dla-rodzicow':  '/en',
  '/ustawienia':    '/en',
}

const EN_TO_PL: Record<string, string> = {
  '/en':            '/',
  '/en/search':     '/szukaj',
  '/en/topics':     '/tematy',
}

/**
 * Language toggle: PL ↔ EN
 * Detects current language from pathname and links to the other locale.
 * PL routes: /*, /tematy/*, /szukaj, etc.
 * EN routes: /en/*, /en/topics/*, /en/search, etc.
 */
export function LangToggle() {
  const pathname = usePathname()
  const isEnglish = pathname.startsWith('/en')

  function getEnHref(): string {
    if (isEnglish) return pathname
    // Exact match
    if (PL_TO_EN[pathname]) return PL_TO_EN[pathname]
    // Category pages: /tematy/science → /en/topics/science
    const categoryMatch = pathname.match(/^\/tematy\/(.+)$/)
    if (categoryMatch) return `/en/topics/${categoryMatch[1]}`
    // Infographic pages: /[slug] — can't know EN slug, fall back to /en
    return '/en'
  }

  function getPlHref(): string {
    if (!isEnglish) return pathname
    // Exact match
    if (EN_TO_PL[pathname]) return EN_TO_PL[pathname]
    // Category pages: /en/topics/science → /tematy/science
    const categoryMatch = pathname.match(/^\/en\/topics\/(.+)$/)
    if (categoryMatch) return `/tematy/${categoryMatch[1]}`
    // Infographic pages: /en/[slug_en] — can't know PL slug, fall back to /
    return '/'
  }

  const enHref = getEnHref()
  const plHref = getPlHref()

  return (
    <div
      className="flex items-center gap-0.5 text-xs font-medium rounded-full border border-stone-200
                 overflow-hidden"
      aria-label="Zmień język / Change language"
    >
      <Link
        href={plHref}
        className={[
          'px-2 py-1 transition-colors',
          !isEnglish
            ? 'bg-[var(--brand-primary)] text-white'
            : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]',
        ].join(' ')}
        aria-current={!isEnglish ? 'true' : undefined}
        aria-label="Polski"
      >
        PL
      </Link>
      <Link
        href={enHref}
        className={[
          'px-2 py-1 transition-colors',
          isEnglish
            ? 'bg-[var(--brand-primary)] text-white'
            : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]',
        ].join(' ')}
        aria-current={isEnglish ? 'true' : undefined}
        aria-label="English"
      >
        EN
      </Link>
    </div>
  )
}
