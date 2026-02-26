import Link from 'next/link'
import Image from 'next/image'
import { ExpertReviewBadge } from '@/components/trust/ExpertReviewBadge'
import type { InfographicCard as ICard } from '@/types'

const CATEGORY_COLORS: Record<string, string> = {
  science: 'bg-category-science',
  history: 'bg-category-history',
  tech: 'bg-category-tech',
  nature: 'bg-category-nature',
  body: 'bg-category-body',
  society: 'bg-category-society',
  space: 'bg-category-space',
  emotions: 'bg-category-emotions',
  philosophy: 'bg-category-philosophy',
}

interface InfographicCardProps {
  infographic: ICard
  priority?: boolean
}

export function InfographicCard({ infographic, priority = false }: InfographicCardProps) {
  const {
    slug,
    title_pl,
    category_id,
    hero_image_url,
    like_count,
    view_count,
    ai_draft,
    expert_reviewed,
  } = infographic

  const accentColor = CATEGORY_COLORS[category_id] ?? 'bg-stone-400'

  // hero_image_url is stored as an absolute OG URL (e.g. https://wytlumaczdziecku.vercel.app/api/og/...) or
  // a Supabase storage URL. next/image cannot optimize its own API routes via localPatterns,
  // so we only let next/image optimize genuine Supabase storage images.
  const imageSrc = hero_image_url
    ?? `/api/og/${slug}?c=${category_id}&t=${encodeURIComponent(title_pl)}`
  const isSupabaseImage = imageSrc.includes('.supabase.co/storage/')
  const shouldOptimize = isSupabaseImage

  return (
    <Link
      href={`/${slug}`}
      className="group block aspect-[4/5] bg-[var(--bg-card)] rounded-[var(--radius-card)]
                 shadow-sm overflow-hidden
                 transition-all duration-150 ease-out
                 hover:scale-[1.02] hover:shadow-md
                 focus-visible:ring-4 focus-visible:ring-blue-500/30"
      aria-label={title_pl}
    >
      {/* Category color bar */}
      <div className={`h-2 ${accentColor}`} aria-hidden="true" />

      {/* Hero image */}
      <div className="relative h-[55%] bg-stone-100">
        <Image
          src={imageSrc}
          alt=""
          fill
          sizes="(max-width: 640px) 50vw, 33vw"
          className="object-cover"
          priority={priority}
          unoptimized={!shouldOptimize}
        />
      </div>

      {/* Content */}
      <div className="p-3 flex flex-col gap-2">
        <h3 className="font-[family-name:var(--age-font-display)] font-bold text-sm leading-snug
                       text-[var(--text-primary)] line-clamp-2 group-hover:text-[var(--brand-primary)]
                       transition-colors">
          {title_pl}
        </h3>

        {/* Meta row */}
        <div className="flex items-center gap-2 text-xs text-[var(--text-secondary)]">
          <span className="flex items-center gap-0.5" title="Wyświetlenia">
            <span aria-hidden="true">👁</span>
            <span>{formatCount(view_count)}</span>
          </span>
          <span className="flex items-center gap-0.5" title="Polubienia">
            <span aria-hidden="true">❤</span>
            <span>{formatCount(like_count)}</span>
          </span>
          {expert_reviewed && (
            <ExpertReviewBadge />
          )}
        </div>
      </div>
    </Link>
  )
}

function formatCount(n: number): string {
  if (n >= 1000) return `${(n / 1000).toFixed(1)}k`
  return String(n)
}
