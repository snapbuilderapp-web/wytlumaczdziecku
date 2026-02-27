import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function GET(req: NextRequest) {
  const q    = req.nextUrl.searchParams.get('q') ?? ''
  const lang = req.nextUrl.searchParams.get('lang') ?? 'pl'

  if (q.length < 2) {
    return NextResponse.json({ suggestions: [] })
  }

  const supabase = await createClient()

  // Use ilike for fast prefix matching; include English fields for both langs
  const titleField = lang === 'en' ? 'title_en' : 'title_pl'

  let query = supabase
    .from('infographics')
    .select('slug, slug_en, title_pl, title_en, category_id')
    .eq('status', 'published')
    .ilike(titleField, `%${q}%`)
    .order('like_count', { ascending: false })
    .limit(6)

  if (lang === 'en') {
    query = query.not('slug_en', 'is', null)
  }

  const { data, error } = await query

  if (error) {
    return NextResponse.json({ suggestions: [] })
  }

  return NextResponse.json({ suggestions: data ?? [] })
}
