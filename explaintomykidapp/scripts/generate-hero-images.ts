#!/usr/bin/env node
/**
 * CLI: generate hero images for infographics using Gemini 3.1 Flash Image Preview.
 * Uses visual_description from the stored content sections as the prompt base.
 *
 * Usage:
 *   npx tsx scripts/generate-hero-images.ts              # all without an image
 *   npx tsx scripts/generate-hero-images.ts --slug=dlaczego-niebo-jest-niebieskie  # one slug
 *   npx tsx scripts/generate-hero-images.ts --overwrite  # regenerate even existing images
 *   npx tsx scripts/generate-hero-images.ts --dry-run    # show prompts, skip generation
 */

import dotenv from 'dotenv'
dotenv.config({ path: '.env.local' })

import fs from 'fs'
import path from 'path'
import { createClient } from '@supabase/supabase-js'
import { GoogleGenerativeAI } from '@google/generative-ai'

// ── Config ───────────────────────────────────────────────────────────────────

const SUPABASE_URL     = process.env.NEXT_PUBLIC_SUPABASE_URL!
const SERVICE_KEY      = process.env.SUPABASE_SERVICE_ROLE_KEY!
const GEMINI_KEY       = process.env.GEMINI_API_KEY!
const STORAGE_BUCKET   = 'infographic-images'
const IMAGE_MODEL      = 'gemini-3.1-flash-image-preview'

if (!SUPABASE_URL || !SERVICE_KEY || !GEMINI_KEY) {
  console.error('❌ Missing env vars in .env.local')
  process.exit(1)
}

const supabase    = createClient(SUPABASE_URL, SERVICE_KEY)
const gemini      = new GoogleGenerativeAI(GEMINI_KEY)
const imageModel  = gemini.getGenerativeModel({ model: IMAGE_MODEL })

const isDryRun    = process.argv.includes('--dry-run')
const isOverwrite = process.argv.includes('--overwrite')
const slugArg     = process.argv.find(a => a.startsWith('--slug='))?.split('=')[1]
const LOCAL_DIR   = path.join(process.cwd(), 'public', 'infographics')

// ── Storage bucket ────────────────────────────────────────────────────────────

async function ensureBucket() {
  const { data: buckets } = await supabase.storage.listBuckets()
  const exists = buckets?.some(b => b.name === STORAGE_BUCKET)
  if (!exists) {
    const { error } = await supabase.storage.createBucket(STORAGE_BUCKET, { public: true })
    if (error) throw new Error(`Failed to create bucket: ${error.message}`)
    console.log(`  ✓ Created storage bucket '${STORAGE_BUCKET}'`)
  }
}

// ── Build prompt ──────────────────────────────────────────────────────────────

function buildPrompt(title: string, ageGroup: string): string {
  if (ageGroup === '13plus') {
    return `Create a visually engaging infographic for a teenager (13+ years old) about the topic: "${title}". The image should be informative, thoughtful, and age-appropriate for teens — use a more mature visual style with clean layout, icons, and clear data/text. Include text in Polish (double-check for typos or misspelled words). Square format, 1024x1024. It should contain at least 20 words for explanation, with title. Avoid cartoon or childish aesthetics — prefer modern, editorial infographic style.`
  }
  return `Create a visually engaging, portrait-oriented infographic for a child under 13 years old about the topic: "${title}". The image should be colorful, fun, and educational. Include text in Polish (double-check for typos or misspelled words). Square format, 1024x1024. It should contain at least 20 words for explanation, with title.`
}

// ── Generate image ────────────────────────────────────────────────────────────

async function generateImage(prompt: string): Promise<Buffer> {
  const result = await imageModel.generateContent({
    contents: [{ role: 'user', parts: [{ text: prompt }] }],
    // @ts-ignore — responseModalities not yet in type defs for this model
    generationConfig: { responseModalities: ['IMAGE'] },
  })

  const parts = result.response.candidates?.[0]?.content?.parts ?? []
  const imgPart = parts.find((p: { inlineData?: { data: string; mimeType: string } }) => p.inlineData)

  if (!imgPart?.inlineData) {
    throw new Error('No image returned by model')
  }

  return Buffer.from(imgPart.inlineData.data, 'base64')
}

// ── Upload to Supabase Storage ────────────────────────────────────────────────

async function uploadImage(slug: string, imageBuffer: Buffer): Promise<string> {
  const path = `${slug}.png`

  const { error } = await supabase.storage
    .from(STORAGE_BUCKET)
    .upload(path, imageBuffer, {
      contentType: 'image/png',
      upsert: true,
      cacheControl: '31536000',
    })

  if (error) throw new Error(`Storage upload failed: ${error.message}`)

  const { data } = supabase.storage.from(STORAGE_BUCKET).getPublicUrl(path)
  return data.publicUrl
}

// ── Update DB ─────────────────────────────────────────────────────────────────

async function updateHeroUrl(id: string, url: string) {
  const { error } = await supabase
    .from('infographics')
    .update({ hero_image_url: url })
    .eq('id', id)
  if (error) throw new Error(`DB update failed: ${error.message}`)
}

// ── Sleep ─────────────────────────────────────────────────────────────────────

function sleep(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms))
}

// ── Main ──────────────────────────────────────────────────────────────────────

async function main() {
  console.log(`\n🎨 Hero image generation (model: ${IMAGE_MODEL})`)
  if (isDryRun) console.log('   DRY RUN — no images will be generated\n')

  await ensureBucket()

  // Fetch infographics
  let query = supabase
    .from('infographics')
    .select('id, slug, title_pl, category_id, age_group, hero_image_url')
    .eq('status', 'published')

  if (slugArg) {
    query = query.eq('slug', slugArg)
  }

  const { data: all, error } = await query
  if (error) { console.error('❌ DB fetch failed:', error.message); process.exit(1) }
  if (!all?.length) { console.log('✓ No infographics found.\n'); return }

  // Filter in JS to avoid PostgREST NULL-exclusion quirks with NOT ILIKE
  const supabaseHost = SUPABASE_URL.replace('https://', '')
  const infographics = isOverwrite
    ? all
    : all.filter(r => !r.hero_image_url?.includes(`${supabaseHost}/storage`))

  if (!infographics.length) { console.log('✓ All infographics already have Supabase Storage images. Use --overwrite to regenerate.\n'); return }

  console.log(`   Processing ${infographics.length} infographic(s)\n`)

  let success = 0
  let failed  = 0

  for (let i = 0; i < infographics.length; i++) {
    const inf = infographics[i]
    const ageLabel = inf.age_group === '13plus' ? ' [13+]' : ''
    console.log(`[${i + 1}/${infographics.length}] ${inf.title_pl}${ageLabel}`)

    if (isDryRun) {
      console.log(`  prompt: ${inf.age_group === '13plus' ? 'teen/editorial' : 'child/fun'}`)
      console.log('  (dry run, skipping)\n')
      continue
    }

    try {
      process.stdout.write('  Generating image... ')
      const imageBuffer = await generateImage(buildPrompt(inf.title_pl, inf.age_group ?? 'both'))
      console.log(`✓ (${(imageBuffer.length / 1024).toFixed(0)} KB)`)

      // Save locally to public/infographics/
      fs.mkdirSync(LOCAL_DIR, { recursive: true })
      const localPath = path.join(LOCAL_DIR, `${inf.slug}.png`)
      fs.writeFileSync(localPath, imageBuffer)
      console.log(`  Saved locally: public/infographics/${inf.slug}.png`)

      process.stdout.write('  Uploading to Supabase Storage... ')
      const publicUrl = await uploadImage(inf.slug, imageBuffer)
      console.log('✓')

      await updateHeroUrl(inf.id, publicUrl)
      console.log(`  URL: ${publicUrl}\n`)
      success++
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err)
      console.error(`\n  ❌ Failed: ${msg}\n`)
      failed++
    }

    // 5s between requests to respect rate limits
    if (i < infographics.length - 1) await sleep(5000)
  }

  console.log(`📊 Done: ${success} succeeded, ${failed} failed`)
  if (success > 0) {
    console.log('   Images are live in Supabase Storage → infographic-images bucket')
    console.log('   hero_image_url updated in all processed rows\n')
  }
}

main().catch(e => { console.error('❌', e.message); process.exit(1) })
