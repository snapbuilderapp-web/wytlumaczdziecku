#!/usr/bin/env node
/**
 * Translates existing Polish infographics to English.
 * Populates: slug_en, title_en, content_under13_en, content_13plus_en
 *
 * Usage:
 *   npx tsx scripts/generate-english-translations.ts           # all untranslated
 *   npx tsx scripts/generate-english-translations.ts --limit 10
 *   npx tsx scripts/generate-english-translations.ts --slug dlaczego-niebo-jest-niebieskie
 *
 * Requirements: .env.local must have GEMINI_API_KEY + SUPABASE credentials
 */

import dotenv from 'dotenv'
dotenv.config({ path: '.env.local' })
import { createClient } from '@supabase/supabase-js'
import { GoogleGenerativeAI, HarmCategory, HarmBlockThreshold } from '@google/generative-ai'
import { z } from 'zod'

// ── Config ───────────────────────────────────────────────────────────────────

const SUPABASE_URL     = process.env.NEXT_PUBLIC_SUPABASE_URL!
const SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY!
const GEMINI_KEY       = process.env.GEMINI_API_KEY!

if (!SUPABASE_URL || !SERVICE_ROLE_KEY || !GEMINI_KEY) {
  console.error('❌ Missing env vars. Check .env.local')
  process.exit(1)
}

const supabase = createClient(SUPABASE_URL, SERVICE_ROLE_KEY)
const gemini   = new GoogleGenerativeAI(GEMINI_KEY)
const model    = gemini.getGenerativeModel({ model: 'gemini-2.5-flash' })

const safetySettings = [
  { category: HarmCategory.HARM_CATEGORY_HARASSMENT,        threshold: HarmBlockThreshold.BLOCK_LOW_AND_ABOVE },
  { category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,       threshold: HarmBlockThreshold.BLOCK_LOW_AND_ABOVE },
  { category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT, threshold: HarmBlockThreshold.BLOCK_LOW_AND_ABOVE },
  { category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT, threshold: HarmBlockThreshold.BLOCK_LOW_AND_ABOVE },
]

// ── Validation schema ────────────────────────────────────────────────────────

const EnContentSchema = z.object({
  title: z.string().min(1).max(120),
  hook:  z.string().min(1),
  sections: z.array(z.object({
    type:               z.enum(['hero','why','how','example','facts','quiz_cta']),
    heading:            z.string(),
    content:            z.string().default(''),
    visual_description: z.string().optional(),
    key_points:         z.array(z.string()).optional(),
    facts:              z.array(z.string()).optional(),
  })).min(3).max(7),
  key_facts:             z.array(z.string()).optional().default([]),
  conversation_starters: z.array(z.string()).optional().default([]),
  tags:                  z.array(z.string()).optional().default([]),
  emotional_weight:      z.enum(['light','medium','heavy']).optional().default('light'),
  reading_level:         z.enum(['easy','standard','advanced']).optional().default('standard'),
})

type EnContent = z.infer<typeof EnContentSchema>

// ── Helpers ──────────────────────────────────────────────────────────────────

function slugifyEn(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .replace(/-{2,}/g, '-')
}

// ── Prompts ──────────────────────────────────────────────────────────────────

function buildTranslationPrompt(
  ageGroup: 'under13' | '13plus',
  titlePl: string,
  contentPl: Record<string, unknown>,
): string {
  const isYounger = ageGroup === 'under13'
  const plJson = JSON.stringify(contentPl, null, 2)

  return `You are an expert children's educational writer translating Polish infographic content to English for ${isYounger ? 'children aged 8–12' : 'teenagers aged 13–16'}.

ORIGINAL POLISH CONTENT (topic: "${titlePl}"):
${plJson}

TRANSLATION RULES:
- Translate naturally — NOT word-for-word; make it flow in English
- Keep the same structure (same sections, same number of key_points / facts)
- Preserve the educational accuracy
- "To jakby..." analogies → translate as "It's like..."
- Tone: ${isYounger ? 'warm, enthusiastic, like a curious friend' : 'informative, peer-level, no over-simplification'}
- Max ${isYounger ? '300' : '450'} words total
- Max ${isYounger ? '5' : '7'} sentences per section
- "conversation_starters" must be questions parents can ask children in English

Return ONLY valid JSON (no markdown, no \`\`\`):
{
  "title": "string (max 8 words, no question mark)",
  "hook": "string (one sentence — surprising fact or question)",
  "sections": [same structure as input],
  "key_facts": ["string","string","string"],
  "conversation_starters": ["string","string","string"],
  "tags": ["string","string","string","string","string"],
  "emotional_weight": "${contentPl['emotional_weight'] ?? 'light'}",
  "reading_level": "${isYounger ? 'standard' : 'advanced'}"
}`
}

// ── Generate one translation ──────────────────────────────────────────────────

async function translateContent(
  ageGroup: 'under13' | '13plus',
  titlePl: string,
  contentPl: Record<string, unknown>,
): Promise<EnContent> {
  const result = await model.generateContent({
    contents: [{ role: 'user', parts: [{ text: buildTranslationPrompt(ageGroup, titlePl, contentPl) }] }],
    safetySettings,
    generationConfig: {
      temperature: 0.5,
      topP: 0.9,
      maxOutputTokens: 65536,
      responseMimeType: 'application/json',
    },
  })
  const text = result.response.text()
  return EnContentSchema.parse(JSON.parse(text))
}

// ── Fetch infographics to translate ──────────────────────────────────────────

interface Infographic {
  id: string
  slug: string
  title_pl: string
  content_under13: Record<string, unknown> | null
  content_13plus:  Record<string, unknown> | null
}

async function fetchUntranslated(limitArg: number, slugArg?: string): Promise<Infographic[]> {
  let query = supabase
    .from('infographics')
    .select('id, slug, title_pl, content_under13, content_13plus')
    .eq('status', 'published')
    .is('slug_en', null)
    .order('published_at', { ascending: false })

  if (slugArg) {
    query = supabase
      .from('infographics')
      .select('id, slug, title_pl, content_under13, content_13plus')
      .eq('slug', slugArg)
  }

  if (!slugArg) {
    query = query.limit(limitArg)
  }

  const { data, error } = await query
  if (error) throw new Error(`Supabase fetch error: ${error.message}`)
  return (data ?? []) as Infographic[]
}

// ── Main ─────────────────────────────────────────────────────────────────────

async function main() {
  const args       = process.argv.slice(2)
  const limitIdx   = args.indexOf('--limit')
  const limitArg   = limitIdx !== -1 ? parseInt(args[limitIdx + 1] ?? '20', 10) : 20
  const slugIdx    = args.indexOf('--slug')
  const slugArg    = slugIdx !== -1 ? args[slugIdx + 1] : undefined

  console.log('\n🌍 English Translation Script')
  console.log(`   Mode: ${slugArg ? `single (${slugArg})` : `batch (limit: ${limitArg})`}\n`)

  const items = await fetchUntranslated(limitArg, slugArg)

  if (items.length === 0) {
    console.log('✅ Nothing to translate — all published infographics already have slug_en.')
    return
  }

  console.log(`Found ${items.length} infographic(s) to translate.\n`)

  let success = 0
  let failed  = 0

  for (const item of items) {
    console.log(`📝 [${items.indexOf(item) + 1}/${items.length}] "${item.title_pl}"`)

    try {
      if (!item.content_under13) {
        console.log('   ⚠️  No under-13 content — skipping')
        continue
      }

      // Translate both age groups in parallel
      process.stdout.write('   Translating under-13... ')
      const [under13En, teen13En] = await Promise.all([
        translateContent('under13', item.title_pl, item.content_under13),
        item.content_13plus
          ? translateContent('13plus', item.title_pl, item.content_13plus)
          : Promise.resolve(null),
      ])
      console.log('✓  Translating 13+... ' + (teen13En ? '✓' : 'skipped (no PL content)'))

      const slugEn = slugifyEn(under13En.title)
      console.log(`   slug_en: ${slugEn}`)

      // Check for slug_en collision
      const { data: existing } = await supabase
        .from('infographics')
        .select('id')
        .eq('slug_en', slugEn)
        .not('id', 'eq', item.id)
        .maybeSingle()

      if (existing) {
        const slugEnUniq = `${slugEn}-en`
        console.log(`   ⚠️  slug_en collision → using: ${slugEnUniq}`)
      }

      const finalSlugEn = existing ? `${slugEn}-en` : slugEn

      // Update DB
      const { error: updateError } = await supabase
        .from('infographics')
        .update({
          slug_en:             finalSlugEn,
          title_en:            under13En.title,
          content_under13_en:  under13En,
          content_13plus_en:   teen13En ?? under13En,
        })
        .eq('id', item.id)

      if (updateError) {
        console.error(`   ❌ DB update failed: ${updateError.message}`)
        failed++
        continue
      }

      console.log('   ✅ Saved\n')
      success++

      // Small delay to avoid Gemini rate limits
      await new Promise(r => setTimeout(r, 800))

    } catch (err) {
      console.error(`   ❌ Failed: ${err instanceof Error ? err.message : err}\n`)
      failed++
    }
  }

  console.log('─'.repeat(50))
  console.log(`✅ Done: ${success} translated, ${failed} failed`)
  if (failed > 0) {
    console.log('   Re-run the script to retry failed items.')
  }
}

main().catch(err => {
  console.error('Fatal error:', err)
  process.exit(1)
})
