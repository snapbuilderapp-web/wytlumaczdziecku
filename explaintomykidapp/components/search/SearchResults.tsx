import Link from 'next/link'
import { InfographicCard } from '@/components/infographic/InfographicCard'
import { SkeletonCardGrid } from '@/components/ui/SkeletonCard'
import { Rys } from '@/components/mascot/Rys'
import type { InfographicCard as ICard, Lang } from '@/types'

interface SearchResultsProps {
  results: ICard[]
  query: string
  loading?: boolean
  lang?: Lang
}

export function SearchResults({ results, query, loading = false, lang = 'pl' }: SearchResultsProps) {
  if (loading) return <SkeletonCardGrid count={6} />

  if (!query) return null

  const isEnglish = lang === 'en'
  const browseHref = isEnglish ? '/en/topics' : '/tematy'

  if (results.length === 0) {
    return (
      <div className="flex flex-col items-center text-center py-12 gap-4">
        <Rys state="curious" size={100} />
        <div>
          <p className="font-bold text-[var(--text-primary)] text-lg">
            {isEnglish ? "Hmm, we don't have that yet!" : 'Hm, jeszcze tego nie mamy!'}
          </p>
          <p className="text-[var(--text-secondary)] text-sm mt-1">
            {isEnglish ? 'Maybe something similar will interest you?' : 'Ale może zainteresuje Cię coś podobnego?'}
          </p>
        </div>
        <Link
          href={browseHref}
          className="px-5 py-2.5 bg-[var(--brand-primary)] text-white rounded-full text-sm font-medium
                     hover:opacity-90 transition-opacity"
        >
          {isEnglish ? 'Browse all topics →' : 'Przeglądaj wszystkie tematy →'}
        </Link>
      </div>
    )
  }

  const resultsSummary = isEnglish
    ? `Found ${results.length} ${results.length === 1 ? 'topic' : 'topics'} for "${query}"`
    : `Znaleziono ${results.length} ${results.length === 1 ? 'temat' : 'tematów'} dla „${query}"`

  return (
    <div>
      <p className="text-sm text-[var(--text-secondary)] mb-3">
        {resultsSummary}
      </p>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
        {results.map((item, i) => (
          <InfographicCard key={item.id} infographic={item} priority={i < 6} lang={lang} />
        ))}
      </div>
    </div>
  )
}
