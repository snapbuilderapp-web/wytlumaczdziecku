#!/usr/bin/env node
/**
 * Usage: node scripts/upload-hero-image.mjs <image-path> <slug>
 * Env:   NEXT_PUBLIC_SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY
 */
import { createClient } from '@supabase/supabase-js'
import { readFileSync, existsSync } from 'fs'
import { extname } from 'path'
import { config } from 'dotenv'

// Load .env.local
config({ path: new URL('../.env.local', import.meta.url).pathname })

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL
const SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!SUPABASE_URL || !SERVICE_KEY) {
    console.error('❌  Missing env vars: NEXT_PUBLIC_SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY')
    process.exit(1)
}

const [imagePath, slug] = process.argv.slice(2)
if (!imagePath || !slug) {
    console.error('Usage: node scripts/upload-hero-image.mjs <image-path> <slug>')
    process.exit(1)
}

if (!existsSync(imagePath)) {
    console.error(`❌  File not found: ${imagePath}`)
    process.exit(1)
}

const supabase = createClient(SUPABASE_URL, SERVICE_KEY)

const ext = extname(imagePath).toLowerCase()
const mime = ext === '.jpg' || ext === '.jpeg' ? 'image/jpeg'
    : ext === '.webp' ? 'image/webp'
        : 'image/png'

const storagePath = `hero/${slug}${ext}`
console.log(`📤  Uploading → storage path: infographics/${storagePath}`)

const fileBuffer = readFileSync(imagePath)

const { data: uploadData, error: uploadError } = await supabase.storage
    .from('infographics')
    .upload(storagePath, fileBuffer, { contentType: mime, upsert: true })

if (uploadError) {
    console.error('❌  Upload failed:', uploadError.message)
    process.exit(1)
}

console.log('✅  Uploaded:', uploadData.path)

const { data: { publicUrl } } = supabase.storage
    .from('infographics')
    .getPublicUrl(storagePath)

console.log('🔗  Public URL:', publicUrl)

const { error: updateError } = await supabase
    .from('infographics')
    .update({ hero_image_url: publicUrl })
    .eq('slug', slug)

if (updateError) {
    console.error('❌  DB update failed:', updateError.message)
    process.exit(1)
}

console.log(`✅  hero_image_url updated in DB for slug: "${slug}"`)
