import { createClient } from '@supabase/supabase-js'
import { Header } from '@/components/layout/Header'
import { BottomTabBar } from '@/components/layout/BottomTabBar'
import { PageWrapper } from '@/components/layout/PageWrapper'
import { AgeSelectorModal } from '@/components/age/AgeSelectorModal'
import { CategoryChips } from '@/components/homepage/CategoryChips'
import { AgeFilteredGrid } from '@/components/homepage/AgeFilteredGrid'
import { SearchBar } from '@/components/search/SearchBar'
import type { Category, InfographicCard } from '@/types'

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

async function getHomepageData() {
  try {
    const supabase = getSupabase()

    const [popular, recent] = await Promise.all([
      supabase
        .from('infographics')
        .select('id, slug, slug_en, title_pl, title_en, category_id, age_group, hero_image_url, hero_image_url_en, like_count, view_count, reading_level, emotional_weight, ai_draft, expert_reviewed')
        .eq('status', 'published')
        .not('slug_en', 'is', null)
        .order('like_count', { ascending: false })
        .limit(4),
      supabase
        .from('infographics')
        .select('id, slug, slug_en, title_pl, title_en, category_id, age_group, hero_image_url, hero_image_url_en, like_count, view_count, reading_level, emotional_weight, ai_draft, expert_reviewed')
        .eq('status', 'published')
        .not('slug_en', 'is', null)
        .order('published_at', { ascending: false })
        .limit(4),
    ])

    return {
      popular: (popular.data ?? []) as InfographicCard[],
      recent:  (recent.data  ?? []) as InfographicCard[],
    }
  } catch {
    return { popular: [], recent: [] }
  }
}

export default async function EnglishHomePage() {
  const { popular, recent } = await getHomepageData()

  return (
    <>
      <Header />
      <PageWrapper>
        {/* Search bar */}
        <div className="mb-5 mt-1">
          <SearchBar lang="en" />
        </div>

        {/* Category chips */}
        <div className="mb-5">
          <CategoryChips categories={CATEGORIES} lang="en" />
        </div>

        {/* Popular infographics */}
        {popular.length > 0 && (
          <div className="mb-8">
            <AgeFilteredGrid
              title="Most Popular"
              items={popular}
              viewAllHref="/en/topics"
              lang="en"
            />
          </div>
        )}

        {/* Recent infographics */}
        {recent.length > 0 && (
          <div className="mb-8">
            <AgeFilteredGrid
              title="New Topics"
              items={recent}
              viewAllHref="/en/topics"
              lang="en"
            />
          </div>
        )}

        {/* Empty state */}
        {popular.length === 0 && recent.length === 0 && (
          <div className="text-center py-16">
            <p className="text-6xl mb-4" aria-hidden="true">🔍</p>
            <h1 className="font-bold text-2xl text-[var(--text-primary)] mb-2">
              Explain to My Kid
            </h1>
            <p className="text-[var(--text-secondary)]">
              First infographics coming soon!
            </p>
          </div>
        )}
      </PageWrapper>
      <BottomTabBar />
      <AgeSelectorModal />
    </>
  )
}
