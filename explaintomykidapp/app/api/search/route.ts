import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl
  const q        = searchParams.get('q') ?? ''
  const category = searchParams.get('category')
  const page     = Math.max(1, parseInt(searchParams.get('page') ?? '1', 10))
  const limit    = 12
  const offset   = (page - 1) * limit

  const supabase = await createClient()

  let query = supabase
    .from('infographics')
    .select(
      'id, slug, title_pl, category_id, hero_image_url, like_count, view_count, reading_level, emotional_weight, ai_draft, expert_reviewed',
      { count: 'exact' }
    )
    .eq('status', 'published')
    .range(offset, offset + limit - 1)

  if (q.length >= 2) {
    query = query.textSearch('search_vector', q, {
      type: 'websearch',
      config: 'polish_unaccent',
    })
  }

  if (category) query = query.eq('category_id', category)

  const { data, error, count } = await query.order('published_at', { ascending: false })

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ results: data ?? [], page, limit, total: count ?? 0 })
}
