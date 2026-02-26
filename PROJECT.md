# PROJECT: Wytłumacz Dziecku / Explain to My Kid
> Status: Pre-development | Last updated: 2026-02-26

## Vision
A Polish-first web portal delivering 1000+ kid-friendly explanations of complex topics as portrait-only infographics, with AI-powered generation, age-group content filtering, and robust child safety — filling a verified blue-ocean gap in the Polish EdTech market.

## Target Users
| User | Age | Primary Need |
|------|-----|-------------|
| Parent | 28-45 | Explain hard topics to their child in simple, safe terms |
| Child | 6-16 | Visual, simple answers to "why?" questions in Polish |
| Teacher | 25-55 | Safe, curriculum-aligned visual reference material |

## Core Value Proposition
**One sentence:** "The first Polish-language, infographic-first, AI-powered platform that explains any topic to children at their age level — safely."

## Product Pillars
1. **Safe** — Multi-layer content filtering; browse without login; GDPR-compliant by design
2. **Visual** — Portrait-only infographics; designed for mobile-first, screen-first generation
3. **Age-Smart** — Same topic explained differently for under-13 and 13+
4. **Polish-first** — Native Polish content; not translations; Polish curriculum aligned
5. **AI-powered** — Gemini-generated content at scale; human-reviewed before publishing

## Tech Stack
- **Frontend:** Next.js 15 (App Router) + Tailwind CSS
- **Database:** PostgreSQL (Supabase) with Polish full-text search
- **AI:** Google Gemini API (gemini-2.5-flash)
- **Infographics:** SVG + CSS animations → Lottie (v2)
- **Analytics:** Plausible (GDPR-compliant)
- **Deployment:** Vercel

## Development Phases

### Phase 0: Foundation (Weeks 1-4)
- [ ] Project scaffolding (Next.js + Tailwind + Supabase)
- [ ] Database schema design
- [ ] Gemini API integration + content generation pipeline
- [ ] Content safety middleware (REGEX + Gemini safety)
- [ ] Design system: portrait infographic template
- [ ] First 50 infographics generated + reviewed

### Phase 1: MVP (Weeks 5-12)
- [ ] Homepage + browse library
- [ ] Search + filter (by topic, age group, category)
- [ ] Age group selector (localStorage)
- [ ] Individual infographic page
- [ ] Daily Question of the Day
- [ ] "Most Liked" + social signals
- [ ] Parent "Conversation Starters" section
- [ ] Emotional Weight + Reading Level labels
- [ ] Basic SEO (topic pages as SSG)
- [ ] 200+ infographics live

### Phase 2: Engagement (Weeks 13-24)
- [ ] "Ask Any Question" AI generation
- [ ] Audio narration (Polish TTS)
- [ ] Post-infographic "Test Yourself" quiz
- [ ] Social sharing card (Instagram/WhatsApp)
- [ ] Expert Review Badge system
- [ ] Ukrainian language tier (top 200 topics)
- [ ] User accounts (optional; parent dashboard)
- [ ] Bookmark / Collections
- [ ] 500+ infographics live

### Phase 3: School Market (Weeks 25-40)
- [ ] Polish curriculum alignment tags (Podstawa Programowa)
- [ ] Teacher Classroom Mode (smartboard + QR codes)
- [ ] Offline PDF export
- [ ] School License infrastructure
- [ ] MEiN approval application
- [ ] 1000+ infographics live

### Phase 4: Scale (Month 12+)
- [ ] Animated Lottie infographics
- [ ] Three reading levels per topic
- [ ] EU expansion (CZ, SK)
- [ ] API / content licensing program
- [ ] AR camera feature

## Key Metrics (Success Criteria)
| Metric | 3-month | 6-month | 12-month |
|--------|---------|---------|---------|
| Monthly Active Users | 5,000 | 30,000 | 150,000 |
| Infographics live | 200 | 500 | 1,000+ |
| Average session duration | >3 min | >4 min | >5 min |
| Return visit rate | >20% | >30% | >40% |
| School licenses | 0 | 5 | 50 |
| Grant funding secured | 0 PLN | 200K PLN | 500K PLN |

## Legal / Compliance Checklist
- [ ] Child Protection Coordinator appointed (Ustawa o ochronie małoletnich 2024)
- [ ] Privacy Policy in plain language (Polish + English)
- [ ] GDPR compliance review
- [ ] WCAG 2.1 Level AA accessibility audit
- [ ] Legal review of AI-generated content liability
- [ ] COPPA compliance (if US traffic expected)

## Links
- Brainstorming & Research: [brainstorming.md](./brainstorming.md)
- Feature Backlog: [BACKLOG.md](./BACKLOG.md)
