import Link from 'next/link'
import type { Category, Lang } from '@/types'

interface CategoryChipsProps {
  categories: Category[]
  activeCategory?: string
  lang?: Lang
}

export function CategoryChips({ categories, activeCategory, lang = 'pl' }: CategoryChipsProps) {
  const basePath = lang === 'en' ? '/en/topics' : '/tematy'
  const allLabel = lang === 'en' ? 'All' : 'Wszystkie'
  const navLabel = lang === 'en' ? 'Topic categories' : 'Kategorie tematów'

  return (
    <nav
      className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide -mx-4 px-4"
      aria-label={navLabel}
    >
      <Link
        href={basePath}
        className={[
          'flex items-center gap-1.5 shrink-0 px-3 py-1.5 rounded-full text-sm font-medium',
          'transition-all duration-150 whitespace-nowrap',
          !activeCategory
            ? 'bg-[var(--brand-primary)] text-white'
            : 'bg-[var(--bg-card)] text-[var(--text-secondary)] border border-stone-200 hover:border-stone-300',
        ].join(' ')}
        aria-current={!activeCategory ? 'page' : undefined}
      >
        {allLabel}
      </Link>
      {categories.map((cat) => (
        <Link
          key={cat.id}
          href={`${basePath}/${cat.id}`}
          className={[
            'flex items-center gap-1.5 shrink-0 px-3 py-1.5 rounded-full text-sm font-medium',
            'transition-all duration-150 whitespace-nowrap',
            activeCategory === cat.id
              ? 'bg-[var(--brand-primary)] text-white'
              : 'bg-[var(--bg-card)] text-[var(--text-secondary)] border border-stone-200 hover:border-stone-300',
          ].join(' ')}
          aria-current={activeCategory === cat.id ? 'page' : undefined}
        >
          <span aria-hidden="true">{cat.icon_emoji}</span>
          {lang === 'en' ? cat.name_en : cat.name_pl}
        </Link>
      ))}
    </nav>
  )
}
