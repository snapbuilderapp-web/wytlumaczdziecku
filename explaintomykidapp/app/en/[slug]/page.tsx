import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import { createClient } from '@supabase/supabase-js'
import { Header } from '@/components/layout/Header'
import { BottomTabBar } from '@/components/layout/BottomTabBar'
import { PageWrapper } from '@/components/layout/PageWrapper'
import { AgeSelectorModal } from '@/components/age/AgeSelectorModal'
import { InfographicViewer } from '@/components/infographic/InfographicViewer'
import type { Infographic } from '@/types'

function getSupabase() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  )
}

export const revalidate = 3600

interface PageProps {
  params: Promise<{ slug: string }>
}

async function getInfographic(slugEn: string): Promise<Infographic | null> {
  const supabase = getSupabase()
  const { data } = await supabase
    .from('infographics')
    .select('*')
    .eq('slug_en', slugEn)
    .eq('status', 'published')
    .single()
  return data
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params
  const infographic = await getInfographic(slug)

  if (!infographic) return { title: 'Not found' }

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? ''
  const ogImage = infographic.hero_image_url
    ?? `${siteUrl}/api/og/${infographic.slug}?c=${infographic.category_id}&t=${encodeURIComponent(infographic.title_en ?? infographic.title_pl)}`

  return {
    title: infographic.title_en ?? infographic.title_pl,
    description:
      infographic.content_under13_en?.hook ??
      infographic.content_under13?.hook ??
      `Learn all about: ${infographic.title_en ?? infographic.title_pl}`,
    alternates: {
      canonical: `${siteUrl}/en/${infographic.slug_en}`,
      languages: {
        'pl': `${siteUrl}/${infographic.slug}`,
        'en': `${siteUrl}/en/${infographic.slug_en}`,
      },
    },
    openGraph: {
      title: infographic.title_en ?? infographic.title_pl,
      images: [ogImage],
    },
  }
}

export async function generateStaticParams() {
  try {
    const supabase = getSupabase()
    const { data } = await supabase
      .from('infographics')
      .select('slug_en')
      .eq('status', 'published')
      .not('slug_en', 'is', null)
    return (data ?? []).map((i) => ({ slug: i.slug_en as string }))
  } catch {
    return []
  }
}

export default async function EnglishInfographicPage({ params }: PageProps) {
  const { slug } = await params
  const infographic = await getInfographic(slug)

  if (!infographic) notFound()

  const heroImageSrc =
    infographic.hero_image_url_en ??
    infographic.hero_image_url ??
    `/api/og/${infographic.slug}?c=${infographic.category_id}&t=${encodeURIComponent(infographic.title_en ?? infographic.title_pl)}`

  return (
    <>
      <Header />
      <PageWrapper className="flex flex-col items-center py-6">
        <InfographicViewer
          slug={infographic.slug}
          infographicId={infographic.id}
          title={infographic.title_en ?? infographic.title_pl}
          heroImageSrc={heroImageSrc}
          contentUnder13={infographic.content_under13}
          content13plus={infographic.content_13plus}
          contentUnder13En={infographic.content_under13_en}
          content13plusEn={infographic.content_13plus_en}
          lang="en"
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
