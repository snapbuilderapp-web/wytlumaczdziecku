#!/usr/bin/env node
/**
 * CLI: generate a single infographic and insert into Supabase as 'draft'
 * Usage: npx tsx scripts/generate-infographic.ts "Dlaczego niebo jest niebieskie"
 *
 * Requirements: .env.local must have GEMINI_API_KEY + SUPABASE credentials
 */

import dotenv from 'dotenv'
dotenv.config({ path: '.env.local' })
import { createClient } from '@supabase/supabase-js'
import { GoogleGenerativeAI } from '@google/generative-ai'
import { HarmCategory, HarmBlockThreshold } from '@google/generative-ai'
import { z } from 'zod'

// ── Config ──────────────────────────────────────────────────────────────────

const SUPABASE_URL      = process.env.NEXT_PUBLIC_SUPABASE_URL!
const SERVICE_ROLE_KEY  = process.env.SUPABASE_SERVICE_ROLE_KEY!
const GEMINI_KEY        = process.env.GEMINI_API_KEY!

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

const ContentSchema = z.object({
  title:                  z.string().min(1).max(120),
  hook:                   z.string().min(1),
  sections:               z.array(z.object({
    type:                 z.enum(['hero','why','how','example','facts','quiz_cta']),
    heading:              z.string(),
    content:              z.string().default(''),
    visual_description:   z.string().optional(),
    key_points:           z.array(z.string()).optional(),
    facts:                z.array(z.string()).optional(),
  })).min(3).max(7),
  key_facts:              z.array(z.string()),
  conversation_starters:  z.array(z.string()),
  tags:                   z.array(z.string()),
  emotional_weight:       z.enum(['light','medium','heavy']),
  reading_level:          z.enum(['easy','standard','advanced']),
  suggested_category:     z.enum(['science','history','tech','nature','body','society','space','emotions','philosophy']).optional(),
})

// ── Prompt ───────────────────────────────────────────────────────────────────

function buildPrompt(topic: string, ageGroup: 'under13' | '13plus'): string {
  const isYounger = ageGroup === 'under13'
  return `Jesteś polskim ekspertem edukacyjnym piszącym dla dzieci ${isYounger ? 'w wieku 8–12 lat' : 'w wieku 13–16 lat'}.

Stwórz edukacyjną infografikę o temacie: "${topic}"

REGUŁY OBOWIĄZKOWE:
- Język: wyłącznie polski
- Łącznie maksymalnie ${isYounger ? '300' : '450'} słów
- ${isYounger ? 'Maksymalnie 5 zdań na sekcję, maksymalnie 10 słów w zdaniu' : 'Maksymalnie 7 zdań na sekcję'}
- Brak żargonu — wyjaśniaj terminy przy pierwszym użyciu
- Ton: ${isYounger ? 'ciepły, entuzjastyczny, jak rozmowa z ciekawym przyjacielem' : 'rzeczowy, partnerski, bez nadmiernego upraszczania'}
- Sekcja "example" MUSI zawierać analogię: "To jakby..."
- Tematy wrażliwe (śmierć, religia): traktuj z neutralnością

Zwróć WYŁĄCZNIE poprawny JSON (bez markdown, bez \`\`\`):
{
  "title": "string (maks. 8 słów, bez pytajnika)",
  "hook": "string (jedno zdanie — zaskakujący fakt lub pytanie)",
  "sections": [
    { "type": "hero",    "heading": "string", "content": "string", "visual_description": "string" },
    { "type": "why",     "heading": "Dlaczego to ważne?", "content": "string", "visual_description": "string" },
    { "type": "how",     "heading": "Jak to działa?", "content": "string", "key_points": ["string","string","string"], "visual_description": "string" },
    { "type": "example", "heading": "Przykład z życia", "content": "string (MUSI zawierać 'To jakby...')", "visual_description": "string" },
    { "type": "facts",   "heading": "Czy wiesz, że...?", "facts": ["string","string","string"], "visual_description": "string" }
  ],
  "key_facts": ["string","string","string"],
  "conversation_starters": ["string","string","string"],
  "tags": ["string","string","string","string","string"],
  "emotional_weight": "light",
  "reading_level": "${isYounger ? 'standard' : 'advanced'}",
  "suggested_category": "science"
}

Dla "emotional_weight": light=nauka/przyroda, medium=historia/społeczeństwo, heavy=emocje/filozofia.
Dla "suggested_category": science|history|tech|nature|body|society|space|emotions|philosophy`
}

// ── Slug ─────────────────────────────────────────────────────────────────────

function slugify(text: string): string {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/ł/g, 'l')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .replace(/-{2,}/g, '-')
}

// ── Generate one age group ────────────────────────────────────────────────────

async function generate(topic: string, ageGroup: 'under13' | '13plus') {
  process.stdout.write(`  Generating ${ageGroup}... `)
  const result = await model.generateContent({
    contents: [{ role: 'user', parts: [{ text: buildPrompt(topic, ageGroup) }] }],
    safetySettings,
    generationConfig: {
      temperature: 0.7,
      topP: 0.9,
      maxOutputTokens: 8192,
      responseMimeType: 'application/json',
    },
  })
  const text = result.response.text()
  const parsed = ContentSchema.parse(JSON.parse(text))
  console.log('✓')
  return parsed
}

// ── Main ─────────────────────────────────────────────────────────────────────

async function main() {
  const topic = process.argv[2]
  if (!topic) {
    console.error('Usage: npx tsx scripts/generate-infographic.ts "Temat infografiki"')
    process.exit(1)
  }

  console.log(`\n📝 Generating: "${topic}"`)

  const [under13, teen] = await Promise.all([
    generate(topic, 'under13'),
    generate(topic, '13plus'),
  ])

  const slug = slugify(under13.title)
  console.log(`  Slug: ${slug}`)

  // Check for slug conflict
  const { data: existing } = await supabase
    .from('infographics')
    .select('id')
    .eq('slug', slug)
    .single()

  if (existing) {
    console.error(`❌ Slug "${slug}" already exists. Edit the title or delete the existing record.`)
    process.exit(1)
  }

  const { data, error } = await supabase
    .from('infographics')
    .insert({
      slug,
      title_pl:         under13.title,
      category_id:      under13.suggested_category ?? 'science',
      age_group:        'both',
      content_under13:  under13,
      content_13plus:   teen,
      status:           'draft',
      tags:             under13.tags,
      emotional_weight: under13.emotional_weight,
      reading_level:    under13.reading_level,
      ai_draft:         true,
      expert_reviewed:  false,
    })
    .select('id, slug')
    .single()

  if (error) {
    console.error('❌ DB insert failed:', error.message)
    process.exit(1)
  }

  console.log(`\n✅ Created as DRAFT`)
  console.log(`   ID:   ${data.id}`)
  console.log(`   Slug: ${data.slug}`)
  console.log(`   Review & publish at: ${SUPABASE_URL.replace('.supabase.co', '')}/project/default/editor\n`)
}

main().catch((e) => { console.error('❌', e.message); process.exit(1) })
