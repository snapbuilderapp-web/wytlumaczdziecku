import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export const revalidate = 3600 // Cache for 1 hour

export async function GET() {
  const today = new Date().toISOString().slice(0, 10) // YYYY-MM-DD

  const supabase = await createClient()

  const { data } = await supabase
    .from('daily_questions')
    .select('id, infographic_id, featured_date, infographics(slug, title_pl, hero_image_url, category_id)')
    .eq('featured_date', today)
    .single()

  return NextResponse.json({ question: data ?? null })
}
