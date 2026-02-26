import Link from 'next/link'
import { InfographicCard } from '@/components/infographic/InfographicCard'
import { SkeletonCardGrid } from '@/components/ui/SkeletonCard'
import { Rys } from '@/components/mascot/Rys'
import type { InfographicCard as ICard } from '@/types'

interface SearchResultsProps {
  results: ICard[]
  query: string
  loading?: boolean
}

export function SearchResults({ results, query, loading = false }: SearchResultsProps) {
  if (loading) return <SkeletonCardGrid count={6} />

  if (!query) return null

  if (results.length === 0) {
    return (
      <div className="flex flex-col items-center text-center py-12 gap-4">
        <Rys state="curious" size={100} />
        <div>
          <p className="font-bold text-[var(--text-primary)] text-lg">
            Hm, jeszcze tego nie mamy!
          </p>
          <p className="text-[var(--text-secondary)] text-sm mt-1">
            Ale może zainteresuje Cię coś podobnego?
          </p>
        </div>
        <Link
          href="/tematy"
          className="px-5 py-2.5 bg-[var(--brand-primary)] text-white rounded-full text-sm font-medium
                     hover:opacity-90 transition-opacity"
        >
          Przeglądaj wszystkie tematy →
        </Link>
      </div>
    )
  }

  return (
    <div>
      <p className="text-sm text-[var(--text-secondary)] mb-3">
        Znaleziono {results.length} {results.length === 1 ? 'temat' : 'tematów'} dla „{query}"
      </p>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
        {results.map((item, i) => (
          <InfographicCard key={item.id} infographic={item} priority={i < 6} />
        ))}
      </div>
    </div>
  )
}
