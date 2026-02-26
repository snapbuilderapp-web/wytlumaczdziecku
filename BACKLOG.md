# BACKLOG: Wytłumacz Dziecku / Explain to My Kid
> Format: [Priority] [Phase] | Description | Rating (from brainstorming.md)
> Status: Initial backlog | Created: 2026-02-26

---

## LEGEND
- **Priority:** 🔴 Critical | 🟠 High | 🟡 Medium | 🟢 Nice-to-have
- **Phase:** P0 Foundation | P1 MVP | P2 Engagement | P3 Schools | P4 Scale
- **Effort:** XS (<1 day) | S (1-3 days) | M (1 week) | L (2-3 weeks) | XL (1+ month)

---

## DESIGN SYSTEM (Phase 0 — must precede all UI work)

> Full spec: [UI_UX_DESIGN.md](./UI_UX_DESIGN.md)

| ID | Priority | Effort | Story | Notes |
|----|----------|--------|-------|-------|
| D-001 | 🔴 | L | Set up Tailwind config with full design token system | Colors, fonts, radii, animations, aspect ratios per UI_UX_DESIGN.md §13 |
| D-002 | 🔴 | M | Configure font loading: Baloo 2 + Lexend + Inter (latin-ext for Polish diacritics) | Next.js `next/font/google` with `latin-ext` subset |
| D-003 | 🔴 | M | Implement CSS custom property age-mode system (`:root` vs `.age-13plus`) | No-flash script in `app/layout.tsx` |
| D-004 | 🔴 | S | Override Tailwind focus styles (focus-visible: 3px blue outline, 3px offset) | Tailwind resets these by default — must restore |
| D-005 | 🔴 | S | Add `prefers-reduced-motion` global CSS rule | Non-negotiable accessibility + WCAG |
| D-006 | 🔴 | L | Commission/design "Ryś" mascot — 3 sizes (180px, 80px, 32px icon) | Polish lynx character; see UI_UX_DESIGN.md §5 |
| D-007 | 🟠 | L | Produce 6 Lottie animations for Ryś emotional states | idle, curious, excited, thinking, encouraging, celebrating |
| D-008 | 🟠 | M | Design portrait infographic SVG template (9:16, 5-part structure) | Reusable template for Gemini content pipeline |
| D-009 | 🟠 | M | Design infographic card component (4:5 aspect, category color bar, skeleton) | Used across browse + search grid |
| D-010 | 🟠 | M | Design age selector UI (two large cards, fun/respectful tone, no login) | First-visit modal + persistent header toggle |
| D-011 | 🟠 | S | Create "Bez reklam" trust badge component | Green-tinted, shield icon, tooltip |
| D-012 | 🟠 | M | Design bottom tab bar (4 tabs, 60px/48px height, text+icon, safe-area aware) | See UI_UX_DESIGN.md §7 |
| D-013 | 🟡 | S | Create skeleton loading components (card, infographic, search result) | Tailwind `animate-pulse` based |
| D-014 | 🟡 | S | Design friendly error/empty states (Ryś + message, related topics) | Never "0 results"; see §12 |
| D-015 | 🟡 | M | Define 9 category color tokens + illustrated category icons | See color table in UI_UX_DESIGN.md §3 |
| D-016 | 🟡 | S | Implement Intersection Observer scroll-reveal for infographic sections | `opacity-0 translate-y-4` → `opacity-100 translate-y-0` |
| D-017 | 🟡 | M | Implement AI generation loading states with time-aware messages | 0-3s / 3-6s / 6-10s / 10s+ messaging + Ryś state |
| D-018 | 🟢 | M | Add dyslexia mode toggle (Lexend + increased spacing, localStorage) | Settings page feature |
| D-019 | 🟢 | M | Dark mode opt-in for 13+ tier only | CSS media query + manual override; not default |

---

## INFRASTRUCTURE (Phase 0)

| ID | Priority | Effort | Story | Notes |
|----|----------|--------|-------|-------|
| I-001 | 🔴 | M | Set up Next.js 15 + Tailwind + Supabase project | App scaffold in explaintomykidapp/ |
| I-002 | 🔴 | M | Design PostgreSQL schema (infographics, categories, age_group, likes, tags) | Include Polish FTS columns |
| I-003 | 🔴 | M | Integrate Gemini API — content generation pipeline | gemini-2.0-flash; dual age-group output |
| I-004 | 🔴 | M | Build content safety middleware (REGEX + Gemini SafetySetting) | Multi-layer: REGEX → Gemini → human queue |
| I-005 | 🔴 | L | Design system: portrait infographic SVG template | aspect-ratio: 9/16; max-width: 450px |
| I-006 | 🔴 | XL | Generate + review first 50 infographics | See top 70 questions list in brainstorming.md |
| I-007 | 🔴 | S | Set up Plausible Analytics (GDPR-compliant) | No cookie consent needed |
| I-008 | 🔴 | S | Configure Vercel deployment pipeline | Preview + production environments |

---

## PHASE 1: MVP

### Core Features

| ID | Priority | Effort | Story | Rating |
|----|----------|--------|-------|--------|
| F-001 | 🔴 | L | Homepage: featured topics + daily question + category grid | — |
| F-002 | 🔴 | M | Browse library: grid of infographic cards, paginated | — |
| F-003 | 🔴 | M | Age group selector: under-13 / 13+ toggle (localStorage) | 9.2 |
| F-004 | 🔴 | M | Individual infographic page (SSG, SEO-optimised) | — |
| F-005 | 🔴 | M | Search: full-text search in Polish (pg_trgm + Polish stemming) | 8.5 |
| F-006 | 🟠 | S | Filter by category (Science, History, Tech, Body, etc.) | 8.5 |
| F-007 | 🟠 | S | Filter by age group | 8.5 |
| F-008 | 🟠 | S | Sort by: Most Popular / Most Recent / Most Liked | 7.8 |
| F-009 | 🟠 | S | Like button (localStorage, no login) + like counter | 7.8 |
| F-010 | 🟠 | S | Daily "Question of the Day" (homepage feature + cron rotation) | 7.9 |
| F-011 | 🟠 | S | Parent "Conversation Starters" collapsible section per infographic | 8.4 |
| F-012 | 🟠 | S | Emotional Weight + Reading Level labels on each card | 7.7 |
| F-013 | 🟠 | M | "Related Topics" sidebar (same category) | — |
| F-014 | 🟠 | M | Category landing pages (SEO) | — |

### Legal / Safety

| ID | Priority | Effort | Story | Notes |
|----|----------|--------|-------|-------|
| L-001 | 🔴 | S | Privacy Policy (PL + EN, plain language) | GDPR requirement |
| L-002 | 🔴 | S | Cookie policy (minimal: Plausible uses no cookies) | — |
| L-003 | 🔴 | S | Age gate: under-13 mode restricts search patterns (REGEX blocklist) | — |
| L-004 | 🔴 | M | "AI Draft — Under Review" watermark on unreviewed content | Trust + EU AI Act |
| L-005 | 🟠 | M | Human review queue (admin panel for approving/rejecting AI drafts) | — |

---

## PHASE 2: ENGAGEMENT

| ID | Priority | Effort | Story | Rating |
|----|----------|--------|-------|--------|
| E-001 | 🟠 | L | "Ask Any Question" AI generation (Gemini → infographic template) | 8.5 |
| E-002 | 🟠 | M | Audio narration: Polish TTS (Google Cloud TTS) play button | 8.5 |
| E-003 | 🟠 | M | Post-infographic "Test Yourself" quiz (3 Gemini-generated MCQ) | 8.8 |
| E-004 | 🟠 | M | Social sharing: portrait card for Instagram Stories / WhatsApp | 6.5 |
| E-005 | 🟠 | L | Expert Review Badge: workflow + badge display + expert CMS | 8.2 |
| E-006 | 🟠 | L | Ukrainian language tier: top 200 topics (Gemini translation + review) | 8.1 |
| E-007 | 🟡 | M | Optional user accounts (Supabase Auth / Clerk) | — |
| E-008 | 🟡 | M | Bookmark / Collections (localStorage → account sync) | 7.5 |
| E-009 | 🟡 | M | Parent dashboard: bookmarks, explored topics, age profile | — |
| E-010 | 🟡 | M | "Explain This News Article for My Child" tool (URL input → Gemini) | 8.7 |
| E-011 | 🟡 | S | App mascot / character design + integration | 7.8 |
| E-012 | 🟡 | S | Dark mode | — |
| E-013 | 🟡 | M | Gamification (badges + streaks) — children under-13 tier only | 6.8 |
| E-014 | 🟡 | M | "I Still Don't Understand" button → re-generate with different analogy | 6.7 |

---

## PHASE 3: SCHOOL MARKET

| ID | Priority | Effort | Story | Rating |
|----|----------|--------|-------|--------|
| S-001 | 🟠 | XL | Polish curriculum alignment: tag every infographic with Podstawa Programowa codes | 8.4 |
| S-002 | 🟠 | L | Teacher Classroom Mode: fullscreen smartboard view + QR code per infographic | 8.3 |
| S-003 | 🟠 | M | Shareable "class set": teacher curates 3-5 infographics, shares link | — |
| S-004 | 🟠 | M | PDF export: A4 portrait print-optimised infographic | 7.6 |
| S-005 | 🟠 | L | School License infrastructure: admin dashboard + usage analytics | 8.4 |
| S-006 | 🟡 | M | Lesson plan templates: pre-built 45-min lessons using infographics | — |
| S-007 | 🟡 | S | GDPR compliance certificate for schools | — |
| S-008 | 🟡 | L | MEiN endorsement application package | — |
| S-009 | 🟡 | M | PWA + offline mode: service worker caching for previously viewed content | 7.6 |

---

## PHASE 4: SCALE

| ID | Priority | Effort | Story | Rating |
|----|----------|--------|-------|--------|
| SC-001 | 🟡 | XL | Animated Lottie infographics (design system overhaul) | 9.0 |
| SC-002 | 🟡 | XL | Three reading levels per topic (Easy / Standard / Advanced) | 7.3 |
| SC-003 | 🟡 | XL | EU expansion: Czech Republic localization (cs language) | 7.3 |
| SC-004 | 🟡 | L | Content licensing API (for publishers and 3rd parties) | 7.5 |
| SC-005 | 🟢 | XL | AR Camera "Point and Explain" feature | 7.0 |
| SC-006 | 🟢 | L | Age-progressive content unlocking | 7.4 |

---

## CONTENT BACKLOG

### First 50 Infographics to Generate (Priority Order)
Based on search frequency analysis from brainstorming.md § 11:

**Tier 1 — Generate First (highest search volume):**
1. Why is the sky blue? / Dlaczego niebo jest niebieskie?
2. How does the brain work? / Jak działa mózg?
3. What is DNA? / Co to jest DNA?
4. Why do we dream? / Dlaczego śnimy?
5. What is climate change? / Co to jest zmiana klimatu?
6. What is AI? / Co to jest sztuczna inteligencja?
7. How does the internet work? / Jak działa internet?
8. How do vaccines work? / Jak działają szczepionki?
9. Why did dinosaurs go extinct? / Dlaczego wyginęły dinozaury?
10. What is democracy? / Co to jest demokracja?
11. What causes earthquakes? / Co powoduje trzęsienia ziemi?
12. How does electricity work? / Jak działa prąd elektryczny?
13. What is a black hole? / Co to jest czarna dziura?
14. How does the Sun work? / Jak działa Słońce?
15. Why do leaves change color? / Dlaczego liście zmieniają kolor?
16. How do bees make honey? / Jak pszczoły robią miód?
17. What is gravity? / Co to jest grawitacja?
18. How do planes fly? / Jak latają samoloty?
19. What is the atom? / Co to jest atom?
20. How does the heart work? / Jak działa serce?

**Tier 2 — Polish History Priority:**
21. Warsaw Uprising / Powstanie Warszawskie
22. Solidarity movement / Solidarność
23. Polish Partitions / Rozbiory Polski
24. WWII — why it started / II WW — przyczyny
25. Copernicus / Kopernik

**Tier 3 — Big Questions:**
26. Why do people die? / Dlaczego ludzie umierają?
27. What happens after we die? / Co dzieje się po śmierci?
28. Does God exist? / Czy Bóg istnieje?
29. Why do people get sad? / Dlaczego ludzie się smucą?
30. What is love? / Co to jest miłość?

---

## GRANT APPLICATIONS BACKLOG

| Grant | Deadline | Value (est.) | Status |
|-------|----------|-------------|--------|
| Digital Poland (Polska Cyfrowa) | Rolling | 200K-1M PLN | Research required |
| Horizon Europe (Education call) | Annual | 500K-2M PLN | Research required |
| NASK Youth Internet Safety | Annual | 100-500K PLN | Research required |
| MEiN educational resource listing | Rolling | Distribution value | Research required |
