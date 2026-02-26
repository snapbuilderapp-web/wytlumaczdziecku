import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import { Header } from '@/components/layout/Header'
import { BottomTabBar } from '@/components/layout/BottomTabBar'
import { PageWrapper } from '@/components/layout/PageWrapper'
import { AgeSelectorModal } from '@/components/age/AgeSelectorModal'
import { InfographicViewer } from '@/components/infographic/InfographicViewer'
import { createClient } from '@/lib/supabase/server'
import type { Infographic } from '@/types'

export const revalidate = 86400 // 24h ISR

interface PageProps {
  params: Promise<{ slug: string }>
}

async function getInfographic(slug: string): Promise<Infographic | null> {
  const supabase = await createClient()
  const { data } = await supabase
    .from('infographics')
    .select('*')
    .eq('slug', slug)
    .eq('status', 'published')
    .single()
  return data
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params
  const infographic = await getInfographic(slug)

  if (!infographic) return { title: 'Nie znaleziono' }

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? ''
  const ogImage = infographic.hero_image_url
    ?? `${siteUrl}/api/og/${infographic.slug}?c=${infographic.category_id}&t=${encodeURIComponent(infographic.title_pl)}`

  return {
    title: infographic.title_pl,
    description:
      infographic.content_under13?.hook ??
      `Dowiedz się wszystkiego o: ${infographic.title_pl}`,
    openGraph: {
      title: infographic.title_pl,
      images: [ogImage],
    },
  }
}

export async function generateStaticParams() {
  try {
    const supabase = await createClient()
    const { data } = await supabase
      .from('infographics')
      .select('slug')
      .eq('status', 'published')
    return data?.map((i) => ({ slug: i.slug })) ?? []
  } catch {
    return []
  }
}

export default async function InfographicPage({ params }: PageProps) {
  const { slug } = await params
  const infographic = await getInfographic(slug)

  if (!infographic) notFound()

  return (
    <>
      <Header />
      <PageWrapper className="flex flex-col items-center py-6">
        <InfographicViewer
          slug={infographic.slug}
          infographicId={infographic.id}
          contentUnder13={infographic.content_under13}
          content13plus={infographic.content_13plus}
          likeCount={infographic.like_count}
          aiDraft={infographic.ai_draft}
          expertReviewed={infographic.expert_reviewed}
        />
      </PageWrapper>
      <BottomTabBar />
      <AgeSelectorModal />
    </>
  )
}
