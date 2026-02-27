import Link from 'next/link'
import { InfographicCard } from '@/components/infographic/InfographicCard'
import { SkeletonCardGrid } from '@/components/ui/SkeletonCard'
import type { InfographicCard as ICard, Lang } from '@/types'

interface InfographicGridProps {
  title: string
  items: ICard[]
  viewAllHref?: string
  viewAllLabel?: string
  loading?: boolean
  columns?: 2 | 3
  lang?: Lang
}

export function InfographicGrid({
  title,
  items,
  viewAllHref,
  viewAllLabel,
  loading = false,
  columns = 2,
  lang = 'pl',
}: InfographicGridProps) {
  const noItemsLabel = lang === 'en' ? 'No topics to display.' : 'Brak tematów do wyświetlenia.'
  const defaultViewAll = lang === 'en' ? 'View all →' : 'Zobacz wszystkie →'

  return (
    <section>
      <div className="flex items-center justify-between mb-3">
        <h2 className="font-[family-name:var(--age-font-display)] font-bold text-lg text-[var(--text-primary)]">
          {title}
        </h2>
        {viewAllHref && (
          <Link
            href={viewAllHref}
            className="text-sm text-[var(--brand-primary)] hover:underline"
          >
            {viewAllLabel ?? defaultViewAll}
          </Link>
        )}
      </div>

      {loading ? (
        <SkeletonCardGrid count={columns === 3 ? 6 : 4} />
      ) : items.length === 0 ? (
        <p className="text-[var(--text-secondary)] text-sm py-4 text-center">
          {noItemsLabel}
        </p>
      ) : (
        <div
          className={[
            'grid gap-3',
            columns === 3 ? 'grid-cols-2 sm:grid-cols-3' : 'grid-cols-2',
          ].join(' ')}
        >
          {items.map((item, i) => (
            <InfographicCard key={item.id} infographic={item} priority={i < 4} lang={lang} />
          ))}
        </div>
      )}
    </section>
  )
}
