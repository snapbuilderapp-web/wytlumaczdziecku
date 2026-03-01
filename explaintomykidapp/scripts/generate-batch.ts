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

const TIER_4_KIDS_QUESTIONS = [
  // Science & Nature
  'Dlaczego woda jest mokra',
  'Skąd biorą się tęcze',
  'Dlaczego ogień jest gorący',
  'Jak powstają chmury',
  'Dlaczego morze jest słone',
  'Co to jest błyskawica',
  'Skąd biorą się wulkany',
  'Dlaczego psy szczekają',
  'Jak ryby oddychają pod wodą',
  'Dlaczego Księżyc świeci w nocy',
  'Co to jest magnes',
  'Dlaczego koty mruczą',
  'Jak powstaje śnieg',
  'Dlaczego banany są żółte',
  'Co to jest fotosynteza',
  // Human Body
  'Dlaczego się starzejemy',
  'Dlaczego płaczemy',
  'Co to są bakterie',
  'Dlaczego mamy odciski palców',
  'Jak działa oko',
  'Dlaczego czujemy ból',
  'Co to jest pamięć',
  'Jak działa układ odpornościowy',
  // Space
  'Ile gwiazd jest na niebie',
  'Co to są planety',
  'Dlaczego jest dzień i noc',
  'Co to są meteoryty',
  'Jak daleko jest Księżyc',
  'Co to jest galaktyka',
  'Czy jest życie na innych planetach',
  // History & Society
  'Jak wynaleziono koło',
  'Co to były średniowiecze',
  'Jak zaczęła się II Wojna Światowa',
  'Co to jest pieniądz i skąd pochodzi',
  'Jak powstał alfabet',
  'Co to była starożytna Grecja',
  'Jak odkryto Amerykę',
  'Co to jest rewolucja przemysłowa',
  // Technology
  'Jak działa telefon',
  'Jak działa silnik samochodowy',
  'Co to są roboty',
  'Jak działa telewizja',
  'Co to jest energia odnawialna',
  // Big Questions
  'Dlaczego ludzie się kłócą',
  'Co to jest sprawiedliwość',
  'Dlaczego niektórzy ludzie są biedni',
  'Co to jest wolność',
  'Czy zwierzęta mają uczucia',
  'Co to jest przyjaźń',
  'Dlaczego kłamiemy',
]

// 13+ only topics — more mature content for teenagers
const TIER_5_TEEN = [
  'Dojrzewanie — co się dzieje z ciałem',
  'Depresja i zdrowie psychiczne nastolatków',
  'Lęk i ataki paniki — jak sobie radzić',
  'Presja rówieśnicza i jak jej się oprzeć',
  'Media społecznościowe a samoocena',
  'Cyberprzemoć — jak reagować',
  'Holocaust i ludobójstwo — dlaczego musisz to znać',
  'Fake news i dezinformacja — jak odróżnić prawdę',
  'Uzależnienia — jak zniekształcają mózg',
  'Tożsamość i samoakceptacja — kim jestem',
  'Prawa człowieka — gdzie są łamane',
  'Terroryzm — co to jest i skąd się bierze',
]

// ── Tier 6: New batch (Feb 2026) ─────────────────────────────────────────────

const TIER_6_UNIVERSAL = [
  // Nature & Animals
  'Skąd pochodzi deszcz i cykl wodny',
  'Wieloryby — władcy oceanów',
  'Mrówki — niesamowita społeczność',
  'Pająki — mistrzowie budowania sieci',
  'Tygrysy i lwy — wielkie koty',
  'Słonie — inteligentne olbrzymy',
  'Pingwiny — życie na lodzie',
  'Żółwie — długowieczni mieszkańcy Ziemi',
  'Motyle — magia metamorfozy',
  'Jak śpią zwierzęta',
  // Food & Everyday
  'Czekolada — od ziarna kakaowca do tabliczki',
  'Skąd pochodzi chleb',
  'Skąd bierze się woda kranowa',
  'Skąd pochodzi sól kuchenna',
  'Skąd pochodzi papier',
  // Human Body
  'Jak smakujemy i wąchamy',
  'Dlaczego kichamy i kaszlemy',
  'Serce i krew — życiodajny krwioobieg',
  'Skąd pochodzi tlen który oddychamy',
  'Krew — co kryją nasze żyły',
  // Earth & Environment
  'Recykling — drugie życie odpadów',
  'Lasy deszczowe — zielone płuca Ziemi',
  'Wielka Bariera Koralowa — podwodny świat',
  'Morskie głębiny — nieznany świat',
  'Drzewa — skąd pochodzi drewno i tlen',
  // Space & Physics
  'Mars — czerwona planeta',
  'Kosmiczna stacja ISS — dom w kosmosie',
  'Jak działa rakieta kosmiczna',
  'Energia jądrowa — siła atomu',
  // Technology & Science
  'Jak działa GPS',
  'Jak działa układ trawienny',
  'Jak działa czas i zegarek',
  'Jak działa komputer — od chipa do ekranu',
  'Jak powstaje film i kino',
  // Culture & Language
  'Skąd pochodzi muzyka',
  'Skąd pochodzi język i słowa',
  'Ewolucja — jak powstało życie na Ziemi',
  // Fun
  'Psy a koty — kto jest mądrzejszy',
]

const TIER_6_TEEN = [
  'Alkohol i papierosy — co robią z rosnącym ciałem',
  'Pierwsza miłość — emocje, granice i zdrowe związki',
  'Rasizm i dyskryminacja — skąd pochodzi i jak z nim walczyć',
  'Finanse dla nastolatków — jak zarządzać kieszonkowym',
  'Jak wybrać zawód — mapa kariery',
  'Jak działają wybory i polityka — od środka',
  'Uchodźcy i migracja — ludzkie historie za liczbami',
  'FOMO i cyfrowe zmęczenie — gdy smartfon rządzi życiem',
  'Sztuczna inteligencja i prywatność — co wie o tobie algorytm',
  'Jak działają reklamy — psychologia perswazji',
  'Zaburzenia nastroju — gdy smutek trwa za długo',
  'Ekologia i aktywizm — jak młodzi zmieniają świat',
]

// Each topic can have optional --teen flag
type TopicEntry = string | { topic: string; flags: string[] }

const ALL_TOPIC_ENTRIES: TopicEntry[] = [
  ...TIER_1_TOPICS,
  ...TIER_2_HISTORY,
  ...TIER_3_BIG_QUESTIONS,
  ...TIER_4_KIDS_QUESTIONS,
  ...TIER_5_TEEN.map(topic => ({ topic, flags: ['--teen'] })),
]

const TIER_6_ENTRIES: TopicEntry[] = [
  ...TIER_6_UNIVERSAL,
  ...TIER_6_TEEN.map(topic => ({ topic, flags: ['--teen'] })),
]

const isDryRun = process.argv.includes('--dry-run')
const teenOnly = process.argv.includes('--teen-only')
const tier6Only = process.argv.includes('--tier6')
const startFrom = parseInt(process.argv.find(a => a.startsWith('--from='))?.split('=')[1] ?? '0', 10)

async function sleep(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms))
}

async function main() {
  const allEntries = tier6Only
    ? TIER_6_ENTRIES
    : teenOnly
      ? TIER_5_TEEN.map(topic => ({ topic, flags: ['--teen'] }))
      : ALL_TOPIC_ENTRIES

  const entries = allEntries.slice(startFrom)
  console.log(`\n🚀 Batch generation: ${entries.length} topics${isDryRun ? ' (DRY RUN)' : ''}${teenOnly ? ' [13+ only]' : ''}`)
  console.log(`   Starting from index ${startFrom}\n`)

  let success = 0
  let failed = 0

  for (let i = 0; i < entries.length; i++) {
    const entry = entries[i]
    const topic  = typeof entry === 'string' ? entry : entry.topic
    const flags  = typeof entry === 'string' ? [] : entry.flags
    const overall = startFrom + i + 1
    const flagStr = flags.length ? ` ${flags.join(' ')}` : ''
    console.log(`[${overall}/${allEntries.length}] ${topic}${flags.includes('--teen') ? ' [13+]' : ''}`)

    if (isDryRun) {
      console.log('  → (dry run, skipping)\n')
      continue
    }

    try {
      execSync(`npx tsx scripts/generate-infographic.ts "${topic}"${flagStr}`, {
        stdio: 'inherit',
        env: { ...process.env },
      })
      success++
    } catch {
      console.error(`  ❌ Failed: ${topic}`)
      failed++
    }

    // 3s delay between generations to respect rate limits
    if (i < entries.length - 1) await sleep(3000)
  }

  if (!isDryRun) {
    console.log(`\n📊 Done: ${success} succeeded, ${failed} failed`)
    console.log('   Review drafts in Supabase Table Editor → infographics')
    console.log('   To generate just 13+ topics: npx tsx scripts/generate-batch.ts --teen-only\n')
  }
}

main().catch(console.error)
