import type { Metadata } from 'next'
import { Header } from '@/components/layout/Header'
import { BottomTabBar } from '@/components/layout/BottomTabBar'
import { PageWrapper } from '@/components/layout/PageWrapper'
import { AgeSelectorModal } from '@/components/age/AgeSelectorModal'
import { SearchBar } from '@/components/search/SearchBar'
import { SearchResults } from '@/components/search/SearchResults'
import { createClient } from '@/lib/supabase/server'
import type { InfographicCard } from '@/types'

export const metadata: Metadata = { title: 'Szukaj' }

interface PageProps {
  searchParams: Promise<{ q?: string; category?: string }>
}

export default async function SzukajPage({ searchParams }: PageProps) {
  const { q = '', category } = await searchParams
  let results: InfographicCard[] = []

  if (q.length >= 2) {
    try {
      const supabase = await createClient()
      let query = supabase
        .from('infographics')
        .select('id, slug, slug_en, title_pl, title_en, category_id, age_group, hero_image_url, hero_image_url_en, like_count, view_count, reading_level, emotional_weight, ai_draft, expert_reviewed')
        .eq('status', 'published')

      if (q) {
        query = query.textSearch('search_vector', q, {
          type: 'websearch',
          config: 'polish_unaccent',
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
        <h1 className="sr-only">Wyszukiwanie</h1>
        <div className="mb-5 mt-1">
          <SearchBar initialValue={q} />
        </div>
        <SearchResults results={results} query={q} />
      </PageWrapper>
      <BottomTabBar />
      <AgeSelectorModal />
    </>
  )
}
