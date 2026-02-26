import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { z } from 'zod'

const BodySchema = z.object({
  infographic_id: z.string().uuid(),
})

export async function POST(req: NextRequest) {
  let body: unknown
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 })
  }

  const parsed = BodySchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json({ error: 'Invalid infographic_id' }, { status: 400 })
  }

  const { infographic_id } = parsed.data
  const supabase = await createClient()

  // Atomic increment via RPC
  const { error } = await supabase.rpc('increment_like', {
    target_id: infographic_id,
  })

  if (error) {
    // Fallback: direct update if RPC doesn't exist yet
    await supabase
      .from('infographics')
      .update({ like_count: supabase.rpc('increment_like', { target_id: infographic_id }) })
      .eq('id', infographic_id)
  }

  return NextResponse.json({ ok: true })
}
