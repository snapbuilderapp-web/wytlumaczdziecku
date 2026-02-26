import type { Metadata } from 'next'
import { Header } from '@/components/layout/Header'
import { BottomTabBar } from '@/components/layout/BottomTabBar'
import { PageWrapper } from '@/components/layout/PageWrapper'
import { AgeSelectorModal } from '@/components/age/AgeSelectorModal'
import { CategoryChips } from '@/components/homepage/CategoryChips'
import { InfographicGrid } from '@/components/homepage/InfographicGrid'
import { createClient } from '@/lib/supabase/server'
import type { Category, InfographicCard } from '@/types'

export const metadata: Metadata = { title: 'Wszystkie tematy' }
export const revalidate = 3600

const CATEGORIES: Category[] = [
  { id: 'science',    name_pl: 'Nauka',         name_en: 'Science',    color_hex: '#0D9488', icon_emoji: '🔬', description_pl: null, display_order: 1 },
  { id: 'history',    name_pl: 'Historia',      name_en: 'History',    color_hex: '#B45309', icon_emoji: '🏛️', description_pl: null, display_order: 2 },
  { id: 'tech',       name_pl: 'Technologia',   name_en: 'Technology', color_hex: '#2563EB', icon_emoji: '📱', description_pl: null, display_order: 3 },
  { id: 'nature',     name_pl: 'Przyroda',      name_en: 'Nature',     color_hex: '#16A34A', icon_emoji: '🌿', description_pl: null, display_order: 4 },
  { id: 'body',       name_pl: 'Ciało i zdrowie', name_en: 'Body',     color_hex: '#E11D48', icon_emoji: '🫀', description_pl: null, display_order: 5 },
  { id: 'space',      name_pl: 'Kosmos',        name_en: 'Space',      color_hex: '#1E40AF', icon_emoji: '🔭', description_pl: null, display_order: 7 },
  { id: 'society',    name_pl: 'Społeczeństwo', name_en: 'Society',    color_hex: '#7C3AED', icon_emoji: '🏘️', description_pl: null, display_order: 6 },
]

export default async function TematyPage() {
  let items: InfographicCard[] = []
  try {
    const supabase = await createClient()
    const { data } = await supabase
      .from('infographics')
      .select('id, slug, title_pl, category_id, hero_image_url, like_count, view_count, reading_level, emotional_weight, ai_draft, expert_reviewed')
      .eq('status', 'published')
      .order('published_at', { ascending: false })
      .limit(48)
    items = (data ?? []) as InfographicCard[]
  } catch {}

  return (
    <>
      <Header />
      <PageWrapper>
        <h1 className="font-[family-name:var(--age-font-display)] font-bold text-2xl text-[var(--text-primary)] mb-4">
          Wszystkie tematy
        </h1>
        <div className="mb-5">
          <CategoryChips categories={CATEGORIES} />
        </div>
        <InfographicGrid title={`${items.length} tematów`} items={items} columns={3} />
      </PageWrapper>
      <BottomTabBar />
      <AgeSelectorModal />
    </>
  )
}
