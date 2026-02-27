import Link from 'next/link'
import Image from 'next/image'
import { ExpertReviewBadge } from '@/components/trust/ExpertReviewBadge'
import type { InfographicCard as ICard, Lang } from '@/types'

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
  lang?: Lang
}

export function InfographicCard({ infographic, priority = false, lang = 'pl' }: InfographicCardProps) {
  const {
    slug,
    slug_en,
    title_pl,
    title_en,
    category_id,
    age_group,
    hero_image_url,
    like_count,
    view_count,
    ai_draft,
    expert_reviewed,
  } = infographic

  const isEnglish = lang === 'en'
  const displayTitle = isEnglish ? (title_en ?? title_pl) : title_pl
  const href = isEnglish && slug_en ? `/en/${slug_en}` : `/${slug}`

  const accentColor = CATEGORY_COLORS[category_id] ?? 'bg-stone-400'

  // hero_image_url is stored as an absolute OG URL or Supabase storage URL.
  // next/image cannot optimize its own API routes, so only optimize genuine Supabase storage images.
  const imageSrc = hero_image_url
    ?? `/api/og/${slug}?c=${category_id}&t=${encodeURIComponent(title_pl)}`
  const isSupabaseImage = imageSrc.includes('.supabase.co/storage/')
  const shouldOptimize = isSupabaseImage

  return (
    <Link
      href={href}
      className="group relative block aspect-[4/5] bg-[var(--bg-card)] rounded-[var(--radius-card)]
                 shadow-sm overflow-hidden
                 transition-all duration-150 ease-out
                 hover:scale-[1.02] hover:shadow-md
                 focus-visible:ring-4 focus-visible:ring-blue-500/30"
      aria-label={displayTitle}
    >
      {/* Category color bar */}
      <div className={`h-2 ${accentColor}`} aria-hidden="true" />

      {/* 13+ badge */}
      {age_group === '13plus' && (
        <div className="absolute top-3 right-3 z-10 bg-slate-800/80 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full">
          13+
        </div>
      )}

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
          {displayTitle}
        </h3>

        {/* Meta row */}
        <div className="flex items-center gap-2 text-xs text-[var(--text-secondary)]">
          <span className="flex items-center gap-0.5" title={isEnglish ? 'Views' : 'Wyświetlenia'}>
            <span aria-hidden="true">👁</span>
            <span>{formatCount(view_count)}</span>
          </span>
          <span className="flex items-center gap-0.5" title={isEnglish ? 'Likes' : 'Polubienia'}>
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
