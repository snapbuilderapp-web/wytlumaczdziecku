import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl
  const q        = searchParams.get('q') ?? ''
  const category = searchParams.get('category')
  const lang     = searchParams.get('lang') ?? 'pl'
  const page     = Math.max(1, parseInt(searchParams.get('page') ?? '1', 10))
  const limit    = 12
  const offset   = (page - 1) * limit

  const supabase = await createClient()

  const selectFields = lang === 'en'
    ? 'id, slug, slug_en, title_pl, title_en, category_id, age_group, hero_image_url, like_count, view_count, reading_level, emotional_weight, ai_draft, expert_reviewed'
    : 'id, slug, slug_en, title_pl, title_en, category_id, age_group, hero_image_url, like_count, view_count, reading_level, emotional_weight, ai_draft, expert_reviewed'

  let query = supabase
    .from('infographics')
    .select(selectFields, { count: 'exact' })
    .eq('status', 'published')
    .range(offset, offset + limit - 1)

  if (lang === 'en') {
    // For English: only return infographics with English content
    query = query.not('slug_en', 'is', null)
    if (q.length >= 2) {
      query = query.textSearch('search_vector_en', q, {
        type: 'websearch',
        config: 'english',
      })
    }
  } else {
    if (q.length >= 2) {
      query = query.textSearch('search_vector', q, {
        type: 'websearch',
        config: 'polish_unaccent',
      })
    }
  }

  if (category) query = query.eq('category_id', category)

  const { data, error, count } = await query.order('published_at', { ascending: false })

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ results: data ?? [], page, limit, total: count ?? 0 })
}
