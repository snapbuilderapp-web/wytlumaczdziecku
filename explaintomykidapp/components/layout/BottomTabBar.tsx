'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

const PL_TABS = [
  { hrefBase: '/',        label: 'Główna',  icon: HomeIcon  },
  { hrefBase: '/tematy',  label: 'Tematy',  icon: GridIcon  },
  { hrefBase: '/szukaj',  label: 'Szukaj',  icon: SearchIcon },
  { hrefBase: '/ulubione', label: 'Ulubione', icon: HeartIcon },
]

const EN_TABS = [
  { hrefBase: '/en',         label: 'Home',      icon: HomeIcon  },
  { hrefBase: '/en/topics',  label: 'Topics',    icon: GridIcon  },
  { hrefBase: '/en/search',  label: 'Search',    icon: SearchIcon },
  { hrefBase: '/en/favourites', label: 'Favourites', icon: HeartIcon },
]

export function BottomTabBar() {
  const pathname = usePathname()
  const isEnglish = pathname.startsWith('/en')
  const tabs = isEnglish ? EN_TABS : PL_TABS

  return (
    <nav
      className="fixed bottom-0 inset-x-0 z-40 bg-[var(--bg-base)] border-t border-stone-200"
      style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}
      aria-label={isEnglish ? 'Main navigation' : 'Nawigacja główna'}
    >
      <div className="flex items-stretch justify-around max-w-2xl mx-auto">
        {tabs.map(({ hrefBase, label, icon: Icon }) => {
          const isActive = isEnglish
            ? (hrefBase === '/en' ? pathname === '/en' || pathname === '/en/' : pathname.startsWith(hrefBase))
            : (hrefBase === '/' ? pathname === '/' : pathname.startsWith(hrefBase))
          return (
            <Link
              key={hrefBase}
              href={hrefBase}
              className={[
                'flex flex-col items-center justify-center gap-0.5 flex-1',
                'text-xs font-medium min-h-[var(--touch-min)]',
                'transition-colors duration-150',
                isActive
                  ? 'text-[var(--brand-primary)]'
                  : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]',
              ].join(' ')}
              aria-current={isActive ? 'page' : undefined}
            >
              <Icon active={isActive} />
              <span>{label}</span>
            </Link>
          )
        })}
      </div>
    </nav>
  )
}

function HomeIcon({ active }: { active: boolean }) {
  return (
    <svg className="w-5 h-5" viewBox="0 0 24 24" fill={active ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" d="m2.25 12 8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" />
    </svg>
  )
}

function GridIcon({ active }: { active: boolean }) {
  return (
    <svg className="w-5 h-5" viewBox="0 0 24 24" fill={active ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6A2.25 2.25 0 0 1 6 3.75h2.25A2.25 2.25 0 0 1 10.5 6v2.25a2.25 2.25 0 0 1-2.25 2.25H6a2.25 2.25 0 0 1-2.25-2.25V6ZM3.75 15.75A2.25 2.25 0 0 1 6 13.5h2.25a2.25 2.25 0 0 1 2.25 2.25V18a2.25 2.25 0 0 1-2.25 2.25H6A2.25 2.25 0 0 1 3.75 18v-2.25ZM13.5 6a2.25 2.25 0 0 1 2.25-2.25H18A2.25 2.25 0 0 1 20.25 6v2.25A2.25 2.25 0 0 1 18 10.5h-2.25a2.25 2.25 0 0 1-2.25-2.25V6ZM13.5 15.75a2.25 2.25 0 0 1 2.25-2.25H18a2.25 2.25 0 0 1 2.25 2.25V18A2.25 2.25 0 0 1 18 20.25h-2.25A2.25 2.25 0 0 1 13.5 18v-2.25Z" />
    </svg>
  )
}

function SearchIcon({ active }: { active: boolean }) {
  return (
    <svg className="w-5 h-5" viewBox="0 0 24 24" fill={active ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
    </svg>
  )
}

function HeartIcon({ active }: { active: boolean }) {
  return (
    <svg className="w-5 h-5" viewBox="0 0 24 24" fill={active ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z" />
    </svg>
  )
}
