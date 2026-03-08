import type { Metadata } from 'next'
import Link from 'next/link'
import { Header } from '@/components/layout/Header'
import { BottomTabBar } from '@/components/layout/BottomTabBar'
import { PageWrapper } from '@/components/layout/PageWrapper'
import { AgeSelectorModal } from '@/components/age/AgeSelectorModal'
import { createClient } from '@/lib/supabase/server'
import type { InfographicCard } from '@/types'
import { JourneyMapClient } from './JourneyMapClient'

export const metadata: Metadata = { title: 'Mapa Odkrywcy' }
export const revalidate = 3600

export default async function TematyMapPage() {
    let items: InfographicCard[] = []
    try {
        const supabase = await createClient()
        const { data } = await supabase
            .from('infographics')
            .select('id, slug, title_pl, category_id, age_group, hero_image_url, hero_image_url_en, like_count, view_count, reading_level, emotional_weight, ai_draft, expert_reviewed')
            .eq('status', 'published')
            .order('published_at', { ascending: true }) // chronological/easiest first for journey
            .limit(50)
        items = (data ?? []) as InfographicCard[]
    } catch { }

    return (
        <>
            <Header />
            <PageWrapper>
                <div className="flex items-center justify-between mb-4">
                    <h1 className="font-[family-name:var(--age-font-display)] font-bold text-2xl text-[var(--text-primary)]">
                        Mapa Odkrywcy
                    </h1>
                    <div className="flex bg-stone-100 rounded-lg p-1">
                        <Link href="/tematy" className="px-4 py-1.5 text-sm font-bold text-stone-500 hover:text-[var(--text-primary)] rounded-md transition-colors">
                            Siatka
                        </Link>
                        <button className="px-4 py-1.5 text-sm font-bold bg-white text-[var(--text-primary)] rounded-md shadow-sm">
                            Mapa
                        </button>
                    </div>
                </div>

                <div className="text-[var(--text-secondary)] mb-8">
                    <p>Podążaj szlakiem Rysia, odkrywaj nowe tematy i zdobywaj punkty!</p>
                </div>

                {/* Client component to handle localStorage reading for unlocked nodes */}
                <JourneyMapClient items={items} />

            </PageWrapper>
            <BottomTabBar />
            <AgeSelectorModal />
        </>
    )
}
