import type { Metadata } from 'next'
import Link from 'next/link'
import { Header } from '@/components/layout/Header'
import { BottomTabBar } from '@/components/layout/BottomTabBar'
import { PageWrapper } from '@/components/layout/PageWrapper'
import { AgeSelectorModal } from '@/components/age/AgeSelectorModal'
import { CategoryChips } from '@/components/homepage/CategoryChips'
import { AgeFilteredGrid } from '@/components/homepage/AgeFilteredGrid'
import { createClient } from '@/lib/supabase/server'
import type { Category, InfographicCard } from '@/types'

export const metadata: Metadata = { title: 'Wszystkie tematy' }
export const revalidate = 3600

const CATEGORIES: Category[] = [
  { id: 'science', name_pl: 'Nauka', name_en: 'Science', color_hex: '#0D9488', icon_emoji: '🔬', description_pl: null, display_order: 1 },
  { id: 'history', name_pl: 'Historia', name_en: 'History', color_hex: '#B45309', icon_emoji: '🏛️', description_pl: null, display_order: 2 },
  { id: 'tech', name_pl: 'Technologia', name_en: 'Technology', color_hex: '#2563EB', icon_emoji: '📱', description_pl: null, display_order: 3 },
  { id: 'nature', name_pl: 'Przyroda', name_en: 'Nature', color_hex: '#16A34A', icon_emoji: '🌿', description_pl: null, display_order: 4 },
  { id: 'body', name_pl: 'Ciało i zdrowie', name_en: 'Body', color_hex: '#E11D48', icon_emoji: '🫀', description_pl: null, display_order: 5 },
  { id: 'space', name_pl: 'Kosmos', name_en: 'Space', color_hex: '#1E40AF', icon_emoji: '🔭', description_pl: null, display_order: 7 },
  { id: 'society', name_pl: 'Społeczeństwo', name_en: 'Society', color_hex: '#7C3AED', icon_emoji: '🏘️', description_pl: null, display_order: 6 },
  { id: 'emotions', name_pl: 'Emocje', name_en: 'Emotions', color_hex: '#DB2777', icon_emoji: '💭', description_pl: null, display_order: 8 },
  { id: 'philosophy', name_pl: 'Filozofia', name_en: 'Philosophy', color_hex: '#D97706', icon_emoji: '💡', description_pl: null, display_order: 9 },
]

export default async function TematyPage() {
  let items: InfographicCard[] = []
  try {
    const supabase = await createClient()
    const { data } = await supabase
      .from('infographics')
      .select('id, slug, title_pl, category_id, age_group, hero_image_url, hero_image_url_en, like_count, view_count, reading_level, emotional_weight, ai_draft, expert_reviewed')
      .eq('status', 'published')
      .order('published_at', { ascending: false })
      .limit(200)
    items = (data ?? []) as InfographicCard[]
  } catch { }

  return (
    <>
      <Header />
      <PageWrapper>
        <div className="flex items-center justify-between mb-4">
          <h1 className="font-[family-name:var(--age-font-display)] font-bold text-2xl text-[var(--text-primary)]">
            Wszystkie tematy
          </h1>
          <div className="flex bg-stone-100 rounded-lg p-1">
            <button className="px-4 py-1.5 text-sm font-bold bg-white text-[var(--text-primary)] rounded-md shadow-sm">
              Siatka
            </button>
            <Link href="/tematy/mapa" className="px-4 py-1.5 text-sm font-bold text-stone-500 hover:text-[var(--text-primary)] rounded-md transition-colors">
              Mapa
            </Link>
          </div>
        </div>
        <div className="mb-5">
          <CategoryChips categories={CATEGORIES} />
        </div>
        <AgeFilteredGrid items={items} columns={3} />
      </PageWrapper>
      <BottomTabBar />
      <AgeSelectorModal />
    </>
  )
}
