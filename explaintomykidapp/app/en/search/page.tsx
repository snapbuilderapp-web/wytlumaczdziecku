import type { Metadata } from 'next'
import { createClient } from '@supabase/supabase-js'
import { Header } from '@/components/layout/Header'
import { BottomTabBar } from '@/components/layout/BottomTabBar'
import { PageWrapper } from '@/components/layout/PageWrapper'
import { AgeSelectorModal } from '@/components/age/AgeSelectorModal'
import { SearchBar } from '@/components/search/SearchBar'
import { SearchResults } from '@/components/search/SearchResults'
import type { InfographicCard } from '@/types'

export const metadata: Metadata = { title: 'Search' }

interface PageProps {
  searchParams: Promise<{ q?: string; category?: string }>
}

function getSupabase() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  )
}

export default async function EnglishSearchPage({ searchParams }: PageProps) {
  const { q = '', category } = await searchParams
  let results: InfographicCard[] = []

  if (q.length >= 2) {
    try {
      const supabase = getSupabase()
      let query = supabase
        .from('infographics')
        .select('id, slug, slug_en, title_pl, title_en, category_id, age_group, hero_image_url, like_count, view_count, reading_level, emotional_weight, ai_draft, expert_reviewed')
        .eq('status', 'published')
        .not('slug_en', 'is', null)

      if (q) {
        query = query.textSearch('search_vector_en', q, {
          type: 'websearch',
          config: 'english',
        })
      }
      if (category) query = query.eq('category_id', category)

      const { data } = await query.order('like_count', { ascending: false }).limit(24)
      results = (data ?? []) as InfographicCard[]
    } catch {}
  }

  return (
    <>
      <Header />
      <PageWrapper>
        <h1 className="sr-only">Search</h1>
        <div className="mb-5 mt-1">
          <SearchBar initialValue={q} lang="en" />
        </div>
        <SearchResults results={results} query={q} lang="en" />
      </PageWrapper>
      <BottomTabBar />
      <AgeSelectorModal />
    </>
  )
}
