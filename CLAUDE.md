# CLAUDE.md — Wytłumacz Dziecku / Explain to My Kid
> This file is automatically read by Claude Code. It contains the principles, constraints, and architectural decisions that govern this project. Always consult this before writing code.

---

## WHAT THIS PROJECT IS

A **Polish-language, infographic-first, AI-powered platform** that explains any topic to children at their age level — safely. Portrait-only infographics, Gemini-generated content, age-group filtering (under-13 / 13+), GDPR-compliant by design. No login required to browse.

**Stack:** Next.js 15 (App Router) + Tailwind CSS + Supabase (PostgreSQL) + Google Gemini API (`gemini-2.0-flash`) + Plausible Analytics + Lottie (mascot)

**App code lives in:** `explaintomykidapp/`
**Full specs:** `TECH_SPEC.md` | `UI_UX_DESIGN.md` | `BACKLOG.md` | `PROJECT.md`

---

## THE 5 PRODUCT PILLARS

Every feature must serve at least one of these. If it doesn't, don't build it.

1. **Safe** — Multi-layer content filtering (REGEX → Gemini SafetySetting → human review). Browse without login. GDPR-compliant by design.
2. **Visual** — Portrait-only infographics (`aspect-ratio: 9/16`, `max-width: 450px`). Mobile-first, scroll-through story format.
3. **Age-Smart** — Same topic, two versions: under-13 and 13+. CSS custom property system, no flash, no login.
4. **Polish-first** — Native Polish content; not translations. Polish full-text search (`pg_trgm` + `unaccent`). Polish diacritics in fonts (`latin-ext` subset required).
5. **AI-powered** — Gemini generates content at scale; humans review before publish. `status = 'published'` only after approval.

---

## NON-NEGOTIABLE TECHNICAL RULES

### Age mode
- Age preference stored in `localStorage` key `wdk_age` = `'under13'` | `'13plus'`
- No-flash script **must** run before first paint in `app/layout.tsx` (inline `<script>` as first body child)
- CSS age classes: `:root` = under-13 defaults; `.age-13plus` on `<html>` = 13+ overrides
- Never store age in a cookie or server-side session — it is not PII, but we avoid any GDPR complexity

### Security
- `SUPABASE_SERVICE_ROLE_KEY` and `GEMINI_API_KEY` are server-only. **Never** use in Client Components or `NEXT_PUBLIC_` vars
- All public-facing DB reads must go through Supabase RLS (only `status = 'published'` rows are readable by anon)
- All user-facing content goes through the 3-layer safety pipeline: REGEX blocklist → Gemini SafetySetting → human review queue

### Database
- Slugs are Polish, diacritic-stripped, hyphen-separated (e.g., `dlaczego-niebo-jest-niebieskie`)
- `infographics.status` workflow: `draft` → `in_review` → `approved` → `published` | `rejected`
- Never expose `draft`, `in_review`, or `rejected` rows to the public
- Increment `like_count` atomically via `increment_like()` RPC — never a read-modify-write pattern
- Full-text search uses `polish_unaccent` config (custom, see `TECH_SPEC.md §11`)

### Content generation
- Always generate **both** age groups in parallel (`Promise.all`) — never one without the other
- Gemini output is always `responseMimeType: 'application/json'` — always parse + validate with Zod before DB insert
- Generated content goes to `status = 'draft'` — never auto-publish

### Performance
- All infographic pages are ISR (`revalidate: 86400`) — never fully dynamic
- Lottie player always lazy-loaded (`next/dynamic`, `ssr: false`)
- Quiz and AgeSelectorModal always lazy-loaded
- All `<img>` via `next/image` with explicit dimensions to prevent CLS
- Never horizontal scroll — all content ≤ viewport width

---

## NON-NEGOTIABLE DESIGN RULES

### Typography
- Under-13 body text: minimum **18px**, font `Lexend`, line-height **1.8**
- 13+ body text: minimum **16px**, font `Inter`, line-height **1.65**
- **Never** justify text
- **Never** use serif fonts for body text under age 12
- Polish diacritics (ą ć ę ł ń ó ś ź ż) must render correctly — always load `latin-ext` font subset

### Color
- Page background is **never** pure `#FFFFFF` — use `#FFFBF5` (under-13) or `#F8FAFC` (13+)
- Body text is **never** pure `#000000` — use `#1C1917` (under-13) or `#0F172A` (13+)
- All text must meet **WCAG 2.1 AA**: 4.5:1 contrast for body, 3:1 for large text
- Never convey meaning by color alone — always pair with text label or icon

### Touch targets
- Under-13: **60px minimum** touch target
- 13+: **48px minimum** touch target

### Accessibility
- `prefers-reduced-motion`: always respected — the global CSS rule in `globals.css` is non-negotiable
- Focus styles: `3px solid #2563EB`, `outline-offset: 3px` — Tailwind resets these, must be overridden explicitly
- SVG infographics: always include `<title>` + `<desc>` + `aria-labelledby` + `.sr-only` full-text alternative
- Infographic quiz: never show countdown timers; never harsh failure messaging on wrong answers

### Animations
- **Never** auto-play looping animations while the user is reading content
- **Never** trigger Ryś mascot automatically mid-reading (Clippy anti-pattern)
- **Never** use parallax scrolling (vestibular disorder trigger)
- All animations: `motion-safe:` / `motion-reduce:` Tailwind variants, or the global CSS fallback

### Navigation
- **Never** use hamburger menu as primary navigation — invisible to children under 9
- Primary nav: bottom tab bar (4 tabs, text + icon, safe-area-inset-bottom aware)
- Max navigation depth: 3 levels

---

## ANTI-PATTERNS — NEVER DO THESE

| Category | Never |
|----------|-------|
| Layout | Horizontal scroll, walls of text without visual chunking, interstitial screens between infographics |
| Color | Pure white `#FFF` bg, pure black `#000` text, color-only meaning, >5 competing colors on screen |
| Typography | Justified text, body <16px, decorative fonts for readable text, all-caps body text |
| Animation | Auto-playing loops during reading, parallax, blocking modal animations >300ms, ignoring reduced-motion |
| Nav | Hamburger as primary nav, icon-only navigation, nav >3 levels deep |
| Content | Countdown timers on informational content, red X on quiz wrong answers, "0 results" (always suggest alternatives) |
| Technical | `GEMINI_API_KEY` in client bundle, auto-publish AI-generated content, read-modify-write for counters, justify text |
| UX | Push notification prompt on first visit, infinite scroll (ADHD trap), requiring login to browse |
| Design | American gamification (fire streaks, XP bars) — Polish parents classify this as a game, not education |
| Mascot | Generic owl (Duolingo — differentiate), triggering mascot automatically mid-reading |

---

## KEY ARCHITECTURAL DECISIONS (rationale in referenced docs)

| Decision | Choice | Why |
|----------|--------|-----|
| Infographic format | Portrait only, 9:16, max 450px | Mobile-first; scroll-through story; not a flattened poster |
| Age mode | localStorage + CSS custom properties | GDPR-safe; no-flash; not PII; works without login |
| Navigation | Bottom tab bar | NNG: hamburger invisible to <9yr; bottom nav +40% task completion |
| Background color | `#FFFBF5` not `#FFFFFF` | Causes visual stress in ~15% of children |
| Mascot | Ryś (Polish lynx) | Polish cultural anchor; not used by any EdTech competitor globally |
| Font (body) | Lexend | Validated against dyslexia; excellent Polish diacritic support |
| Analytics | Plausible | GDPR-compliant; no cookies; no consent banner needed |
| Content publish | Human review queue | EU AI Act educational AI = high-risk; AI draft always watermarked |
| Like system | localStorage dedup, atomic DB increment | No login required; GDPR-safe; no PII |
| Search | `pg_trgm` + `polish_unaccent` | Polish diacritics; fuzzy matching for children's typos |

---

## INFOGRAPHIC CONTENT STRUCTURE

Every infographic follows the **5-Part Portrait Scroll** (can extend to 7 max):

```
1. HERO      — Title + one-sentence hook + Ryś in "curious" state
2. WHY       — Why does a child care? (1–2 sentences)
3. HOW       — Main explanation: illustrated diagram, 3–5 key points
4. EXAMPLE   — Real-world analogy: "To jakby..." (It's like...)
5. FACTS     — 2–3 surprising facts + Ryś in "excited" state
6. QUIZ CTA  — 3-question quiz prompt + share button
```

Under-13: max 300 words total, max 5 sentences per section
13+: max 450 words total, max 7 sentences per section

---

## LEGAL & COMPLIANCE (non-negotiable before launch)

- **Ustawa o ochronie małoletnich (PL, 2024)** — Child Protection Coordinator must be appointed before go-live
- **GDPR Art. 8** — Poland's age of consent for data processing = 16; under-16 requires parental consent
- **WCAG 2.1 Level AA** — mandatory for Polish public-facing educational platforms; build in from day 1
- **AI Draft watermark** — every AI-generated, unreviewed piece must display "AI Draft — Under Review" badge (EU AI Act)
- **Privacy Policy** — must be in plain Polish + English before launch; link must be prominent (not buried in footer)

---

## DEVELOPMENT COMMANDS (once app is scaffolded)

```bash
# Start dev server
npm run dev

# Generate a single infographic via CLI
npx ts-node scripts/generate-infographic.ts "Dlaczego niebo jest niebieskie"

# Batch generation
npx ts-node scripts/generate-batch.ts

# Seed categories table
npx ts-node scripts/seed-categories.ts

# Regenerate Supabase TypeScript types
supabase gen types typescript --project-id YOUR_ID > lib/supabase/types.ts

# Type check
npm run type-check

# Build
npm run build
```

---

## FIRST IMPLEMENTATION ORDER

1. Scaffold Next.js 15 app (`npx create-next-app@latest explaintomykidapp --typescript --tailwind --app`)
2. Paste Tailwind config from `UI_UX_DESIGN.md §13`
3. Configure fonts in `app/layout.tsx` (Baloo 2 + Lexend + Inter, `latin-ext`)
4. Set up `globals.css` (CSS custom properties + age-mode + prefers-reduced-motion + focus styles)
5. Create Supabase project → run schema SQL from `TECH_SPEC.md §4`
6. Add `.env.local` from `.env.example`
7. Build age selector modal + `useAgeMode` hook
8. Build infographic viewer with `ScrollReveal`
9. Run Gemini generation pipeline → first 20 infographics → human review → publish
10. Build homepage + browse grid

Full task order: `BACKLOG.md` (start with Design System D-001 to D-005, then Infrastructure I-001 to I-008)
