#!/usr/bin/env node
/**
 * CLI: batch generate multiple infographics from the Tier 1 topic list
 * Usage: npx tsx scripts/generate-batch.ts
 * Usage (dry run): npx tsx scripts/generate-batch.ts --dry-run
 *
 * Runs sequentially with a 3s delay between topics to avoid rate limits.
 */

import dotenv from 'dotenv'
dotenv.config({ path: '.env.local' })
import { execSync } from 'child_process'

const TIER_1_TOPICS = [
  'Dlaczego niebo jest niebieskie',
  'Jak działa mózg',
  'Co to jest DNA',
  'Dlaczego śnimy',
  'Co to jest zmiana klimatu',
  'Co to jest sztuczna inteligencja',
  'Jak działa internet',
  'Jak działają szczepionki',
  'Dlaczego wyginęły dinozaury',
  'Co to jest demokracja',
  'Co powoduje trzęsienia ziemi',
  'Jak działa prąd elektryczny',
  'Co to jest czarna dziura',
  'Jak działa Słońce',
  'Dlaczego liście zmieniają kolor',
  'Jak pszczoły robią miód',
  'Co to jest grawitacja',
  'Jak latają samoloty',
  'Co to jest atom',
  'Jak działa serce',
]

const TIER_2_HISTORY = [
  'Powstanie Warszawskie',
  'Ruch Solidarność w Polsce',
  'Rozbiory Polski',
  'Kopernik i heliocentryzm',
]

const TIER_3_BIG_QUESTIONS = [
  'Dlaczego ludzie umierają',
  'Dlaczego ludzie się smucą',
  'Co to jest miłość',
]

const ALL_TOPICS = [...TIER_1_TOPICS, ...TIER_2_HISTORY, ...TIER_3_BIG_QUESTIONS]

const isDryRun = process.argv.includes('--dry-run')
const startFrom = parseInt(process.argv.find(a => a.startsWith('--from='))?.split('=')[1] ?? '0', 10)

async function sleep(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms))
}

async function main() {
  const topics = ALL_TOPICS.slice(startFrom)
  console.log(`\n🚀 Batch generation: ${topics.length} topics${isDryRun ? ' (DRY RUN)' : ''}`)
  console.log(`   Starting from index ${startFrom}\n`)

  let success = 0
  let failed = 0

  for (let i = 0; i < topics.length; i++) {
    const topic = topics[i]
    const overall = startFrom + i + 1
    console.log(`[${overall}/${ALL_TOPICS.length}] ${topic}`)

    if (isDryRun) {
      console.log('  → (dry run, skipping)\n')
      continue
    }

    try {
      execSync(`npx tsx scripts/generate-infographic.ts "${topic}"`, {
        stdio: 'inherit',
        env: { ...process.env },
      })
      success++
    } catch {
      console.error(`  ❌ Failed: ${topic}`)
      failed++
    }

    // 3s delay between generations to respect rate limits
    if (i < topics.length - 1) await sleep(3000)
  }

  if (!isDryRun) {
    console.log(`\n📊 Done: ${success} succeeded, ${failed} failed`)
    console.log('   Review drafts in Supabase Table Editor → infographics\n')
  }
}

main().catch(console.error)
