'use client'

import { useAgeMode } from '@/hooks/useAgeMode'
import { InfographicGrid } from './InfographicGrid'
import type { InfographicCard, Lang } from '@/types'

interface AgeFilteredGridProps {
  items: InfographicCard[]
  title?: string
  viewAllHref?: string
  columns?: 2 | 3
  lang?: Lang
}

export function AgeFilteredGrid({ items, title, viewAllHref, columns = 2, lang = 'pl' }: AgeFilteredGridProps) {
  const { ageMode } = useAgeMode()

  // Under-13 mode: hide content flagged as 13+ only
  const filtered = ageMode === 'under13'
    ? items.filter(item => item.age_group !== '13plus')
    : items

  const defaultTitle = lang === 'en' ? `${filtered.length} topics` : `${filtered.length} tematów`
  const displayTitle = title ?? defaultTitle

  return (
    <InfographicGrid
      title={displayTitle}
      items={filtered}
      viewAllHref={viewAllHref}
      columns={columns}
      lang={lang}
    />
  )
}
