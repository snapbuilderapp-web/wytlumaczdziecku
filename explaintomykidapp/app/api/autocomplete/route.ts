import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function GET(req: NextRequest) {
  const q = req.nextUrl.searchParams.get('q') ?? ''

  if (q.length < 2) {
    return NextResponse.json({ suggestions: [] })
  }

  const supabase = await createClient()

  // Use pg_trgm similarity via RPC if available, fallback to ilike
  const { data, error } = await supabase
    .from('infographics')
    .select('slug, title_pl, category_id')
    .eq('status', 'published')
    .ilike('title_pl', `%${q}%`)
    .order('like_count', { ascending: false })
    .limit(6)

  if (error) {
    return NextResponse.json({ suggestions: [] })
  }

  return NextResponse.json({ suggestions: data ?? [] })
}
