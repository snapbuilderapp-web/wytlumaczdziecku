import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import { createClient } from '@supabase/supabase-js'
import { Header } from '@/components/layout/Header'
import { BottomTabBar } from '@/components/layout/BottomTabBar'
import { PageWrapper } from '@/components/layout/PageWrapper'
import { AgeSelectorModal } from '@/components/age/AgeSelectorModal'
import { CategoryChips } from '@/components/homepage/CategoryChips'
import { AgeFilteredGrid } from '@/components/homepage/AgeFilteredGrid'
import type { Category, CategoryId, InfographicCard } from '@/types'

export const revalidate = 3600

const CATEGORIES: Category[] = [
  { id: 'science',    name_pl: 'Nauka',           name_en: 'Science',    color_hex: '#0D9488', icon_emoji: '🔬', description_pl: null, display_order: 1 },
  { id: 'history',    name_pl: 'Historia',        name_en: 'History',    color_hex: '#B45309', icon_emoji: '🏛️', description_pl: null, display_order: 2 },
  { id: 'tech',       name_pl: 'Technologia',     name_en: 'Technology', color_hex: '#2563EB', icon_emoji: '📱', description_pl: null, display_order: 3 },
  { id: 'nature',     name_pl: 'Przyroda',        name_en: 'Nature',     color_hex: '#16A34A', icon_emoji: '🌿', description_pl: null, display_order: 4 },
  { id: 'body',       name_pl: 'Ciało i zdrowie', name_en: 'Body',       color_hex: '#E11D48', icon_emoji: '🫀', description_pl: null, display_order: 5 },
  { id: 'space',      name_pl: 'Kosmos',          name_en: 'Space',      color_hex: '#1E40AF', icon_emoji: '🔭', description_pl: null, display_order: 7 },
  { id: 'society',    name_pl: 'Społeczeństwo',   name_en: 'Society',    color_hex: '#7C3AED', icon_emoji: '🏘️', description_pl: null, display_order: 6 },
  { id: 'emotions',   name_pl: 'Emocje',          name_en: 'Emotions',   color_hex: '#DB2777', icon_emoji: '💭', description_pl: null, display_order: 8 },
  { id: 'philosophy', name_pl: 'Filozofia',       name_en: 'Philosophy', color_hex: '#D97706', icon_emoji: '💡', description_pl: null, display_order: 9 },
]

function getSupabase() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  )
}

export async function generateStaticParams() {
  return CATEGORIES.map(c => ({ category: c.id }))
}

export async function generateMetadata({ params }: { params: Promise<{ category: string }> }): Promise<Metadata> {
  const { category } = await params
  const cat = CATEGORIES.find(c => c.id === category)
  if (!cat) return { title: 'Nie znaleziono' }
  return { title: `${cat.icon_emoji} ${cat.name_pl} — Wytłumacz Dziecku` }
}

export default async function CategoryPage({ params }: { params: Promise<{ category: string }> }) {
  const { category } = await params
  const cat = CATEGORIES.find(c => c.id === category)
  if (!cat) notFound()

  const supabase = getSupabase()
  const { data } = await supabase
    .from('infographics')
    .select('id, slug, title_pl, category_id, hero_image_url, like_count, view_count, reading_level, emotional_weight, ai_draft, expert_reviewed, age_group')
    .eq('status', 'published')
    .eq('category_id', category as CategoryId)
    .order('published_at', { ascending: false })
    .limit(96)

  const items = (data ?? []) as (InfographicCard & { age_group: string })[]

  return (
    <>
      <Header />
      <PageWrapper>
        <h1 className="font-[family-name:var(--age-font-display)] font-bold text-2xl text-[var(--text-primary)] mb-4">
          <span aria-hidden="true">{cat.icon_emoji} </span>{cat.name_pl}
        </h1>
        <div className="mb-5">
          <CategoryChips categories={CATEGORIES} activeCategory={category} />
        </div>
        {items.length > 0 ? (
          <AgeFilteredGrid items={items} columns={3} />
        ) : (
          <div className="text-center py-16 text-[var(--text-secondary)]">
            Brak tematów w tej kategorii.
          </div>
        )}
      </PageWrapper>
      <BottomTabBar />
      <AgeSelectorModal />
    </>
  )
}
