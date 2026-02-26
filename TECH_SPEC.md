# TECH SPEC: Wytłumacz Dziecku / Explain to My Kid
> Status: Ready for implementation | Created: 2026-02-26
> References: PROJECT.md, BACKLOG.md, UI_UX_DESIGN.md

---

## TABLE OF CONTENTS
1. [Stack & Dependencies](#1-stack--dependencies)
2. [Repository Structure](#2-repository-structure)
3. [Environment Variables](#3-environment-variables)
4. [Database Schema](#4-database-schema)
5. [Next.js Configuration](#5-nextjs-configuration)
6. [Age-Mode System](#6-age-mode-system)
7. [API Routes](#7-api-routes)
8. [Component Architecture](#8-component-architecture)
9. [Content Generation Pipeline](#9-content-generation-pipeline)
10. [Content Safety Middleware](#10-content-safety-middleware)
11. [Search Implementation](#11-search-implementation)
12. [Analytics](#12-analytics)
13. [Deployment Configuration](#13-deployment-configuration)
14. [Performance Targets](#14-performance-targets)
15. [Security Headers](#15-security-headers)
16. [Implementation Order](#16-implementation-order)

---

## 1. STACK & DEPENDENCIES

### Runtime
- **Node.js:** 22 LTS (required by Next.js 15)
- **Package manager:** npm (or pnpm — pick one, stay consistent)

### Core Dependencies
```json
{
  "dependencies": {
    "next": "^15.2.0",
    "react": "^19.0.0",
    "react-dom": "^19.0.0",
    "@supabase/supabase-js": "^2.49.0",
    "@supabase/ssr": "^0.5.0",
    "@google/generative-ai": "^0.21.0",
    "@lottiefiles/react-lottie-player": "^3.5.4",
    "zod": "^3.24.0",
    "plausible-tracker": "^0.3.9"
  },
  "devDependencies": {
    "typescript": "^5.7.0",
    "tailwindcss": "^3.4.0",
    "autoprefixer": "^10.4.0",
    "postcss": "^8.5.0",
    "@types/react": "^19.0.0",
    "@types/react-dom": "^19.0.0",
    "@types/node": "^22.0.0",
    "supabase": "^2.20.0"
  }
}
```

### Phase 2+ Dependencies (do not install yet)
```
@google-cloud/text-to-speech   # Polish TTS narration
@react-pdf/renderer            # PDF export (Phase 3)
```

---

## 2. REPOSITORY STRUCTURE

```
explaintomykidapp/
├── app/
│   ├── layout.tsx                  # Root layout — fonts, age-mode script, metadata
│   ├── globals.css                 # CSS custom properties, prefers-reduced-motion
│   ├── page.tsx                    # Homepage
│   ├── (browse)/
│   │   └── tematy/
│   │       ├── page.tsx            # Browse all topics / category grid
│   │       └── [category]/
│   │           └── page.tsx        # Category landing page (SSG)
│   ├── (content)/
│   │   └── [slug]/
│   │       ├── page.tsx            # Individual infographic page (SSG)
│   │       └── loading.tsx         # Skeleton while streaming
│   ├── szukaj/
│   │   └── page.tsx                # Search results page
│   ├── dla-rodzicow/
│   │   └── page.tsx                # Parent info (adult register design)
│   ├── ustawienia/
│   │   └── page.tsx                # Settings: age toggle, dyslexia mode
│   ├── polityka-prywatnosci/
│   │   └── page.tsx                # Privacy policy (PL + EN tabs)
│   ├── api/
│   │   ├── search/route.ts         # GET ?q=&age=&category=&page=
│   │   ├── autocomplete/route.ts   # GET ?q=
│   │   ├── like/route.ts           # POST { infographic_id }
│   │   ├── daily-question/route.ts # GET — returns today's featured question
│   │   ├── quiz/route.ts           # GET ?infographic_id=&age=
│   │   ├── generate/route.ts       # POST { topic } — Phase 2
│   │   └── cron/
│   │       └── daily-question/route.ts  # POST — Vercel cron, rotates daily question
│   └── (admin)/
│       └── admin/
│           ├── layout.tsx          # Auth-protected admin shell
│           ├── page.tsx            # Review queue dashboard
│           └── [id]/
│               └── page.tsx        # Single infographic review
├── components/
│   ├── ui/                         # Headless primitive components
│   │   ├── Button.tsx
│   │   ├── Badge.tsx
│   │   ├── Chip.tsx
│   │   ├── Modal.tsx
│   │   ├── SkeletonCard.tsx
│   │   ├── SkeletonInfographic.tsx
│   │   └── ProgressBar.tsx
│   ├── layout/
│   │   ├── Header.tsx              # Logo, Ryś icon, age toggle, "Dla Rodziców"
│   │   ├── BottomTabBar.tsx        # Fixed 4-tab nav
│   │   └── PageWrapper.tsx         # Safe-area padding, max-width
│   ├── age/
│   │   ├── AgeSelectorModal.tsx    # First-visit full-screen modal
│   │   └── AgeToggle.tsx           # Header toggle (compact)
│   ├── infographic/
│   │   ├── InfographicCard.tsx     # Browse grid card (4:5 aspect)
│   │   ├── InfographicViewer.tsx   # Full portrait viewer (9:16)
│   │   ├── InfographicSection.tsx  # Single scroll section with reveal
│   │   ├── ScrollProgress.tsx      # 3px sticky progress bar
│   │   ├── ScrollReveal.tsx        # IntersectionObserver wrapper
│   │   ├── LikeButton.tsx          # Like + counter with pop animation
│   │   ├── ConversationStarters.tsx # Collapsible parent section
│   │   └── AiDraftWatermark.tsx    # "AI Draft — Under Review" banner
│   ├── mascot/
│   │   ├── Rys.tsx                 # Lottie player with state prop
│   │   └── RysStatic.tsx           # SVG fallback for prefers-reduced-motion
│   ├── search/
│   │   ├── SearchBar.tsx           # Input + Autocomplete dropdown
│   │   ├── SearchResults.tsx       # Results grid + no-results state
│   │   └── FilterChips.tsx         # Category + age filter row
│   ├── quiz/
│   │   ├── QuizCard.tsx            # Quiz prompt + progress CTA
│   │   └── QuizQuestion.tsx        # Single MCQ with feedback
│   ├── trust/
│   │   ├── BezReklamBadge.tsx
│   │   └── ExpertReviewBadge.tsx
│   └── homepage/
│       ├── DailyQuestion.tsx       # Full-width daily question card
│       ├── CategoryChips.tsx       # Horizontal scroll chip row
│       └── InfographicGrid.tsx     # 2-col grid with heading
├── lib/
│   ├── supabase/
│   │   ├── client.ts               # createBrowserClient()
│   │   ├── server.ts               # createServerClient() for RSC / Route Handlers
│   │   └── types.ts                # `supabase gen types typescript` output
│   ├── gemini/
│   │   ├── client.ts               # GoogleGenerativeAI init
│   │   ├── generate.ts             # generateInfographic(), generateQuiz()
│   │   ├── prompts.ts              # Prompt template strings
│   │   └── safety.ts               # HarmCategory + HarmBlockThreshold config
│   ├── safety/
│   │   ├── regex-blocklist.ts      # Pattern arrays by category
│   │   └── pipeline.ts             # checkContent() — REGEX then Gemini
│   ├── search/
│   │   └── fts.ts                  # searchInfographics(), autocomplete()
│   ├── analytics/
│   │   └── plausible.ts            # trackEvent() wrapper
│   └── slugify.ts                  # Polish-aware slug generation
├── hooks/
│   ├── useAgeMode.ts               # Read/set localStorage wdk_age
│   ├── useDyslexiaMode.ts          # Read/set localStorage wdk_dyslexia
│   └── useScrollProgress.ts        # Scroll % for ProgressBar
├── types/
│   └── index.ts                    # Shared TS interfaces
├── scripts/
│   ├── generate-infographic.ts     # CLI: `npx ts-node scripts/generate-infographic.ts "topic"`
│   ├── generate-batch.ts           # CLI: bulk generation from topic list
│   └── seed-categories.ts          # CLI: seed categories table
├── public/
│   ├── animations/                 # Lottie JSON (added after mascot commission)
│   │   ├── rys-idle.json
│   │   ├── rys-curious.json
│   │   ├── rys-excited.json
│   │   ├── rys-thinking.json
│   │   ├── rys-encouraging.json
│   │   └── rys-celebrating.json
│   └── mascot/
│       ├── rys-180.svg             # Full character
│       ├── rys-80.svg              # Section anchor size
│       └── rys-32.svg              # Icon/logo mark
├── tailwind.config.js
├── next.config.ts
├── tsconfig.json
├── .env.local                      # gitignored
├── .env.example                    # committed
└── package.json
```

---

## 3. ENVIRONMENT VARIABLES

### `.env.example` — commit this file
```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key   # server-only, never expose

# Google Gemini
GEMINI_API_KEY=your-gemini-api-key                # server-only, never expose

# Analytics
NEXT_PUBLIC_PLAUSIBLE_DOMAIN=wytlumaczdziecku.pl

# Admin panel protection (simple shared secret for MVP)
ADMIN_SECRET=change-this-to-random-64-char-string

# App
NEXT_PUBLIC_SITE_URL=https://wytlumaczdziecku.pl
NODE_ENV=development
```

### Security Rules
- `SUPABASE_SERVICE_ROLE_KEY` and `GEMINI_API_KEY` must **never** appear in client bundles
- Any variable without `NEXT_PUBLIC_` prefix is server-only — Next.js enforces this
- Add `.env.local` to `.gitignore` before first commit

---

## 4. DATABASE SCHEMA

### Setup: Enable Extensions First
```sql
-- Run in Supabase SQL editor before creating tables
CREATE EXTENSION IF NOT EXISTS pg_trgm;
CREATE EXTENSION IF NOT EXISTS unaccent;

-- Custom Polish FTS config (diacritic-insensitive)
CREATE TEXT SEARCH CONFIGURATION polish_unaccent (COPY = pg_catalog.simple);
ALTER TEXT SEARCH CONFIGURATION polish_unaccent
  ALTER MAPPING FOR hword, hword_part, word WITH unaccent, simple;
```

---

### Table: `categories`
```sql
CREATE TABLE categories (
  id            TEXT PRIMARY KEY,               -- 'science', 'history', 'tech', etc.
  name_pl       TEXT NOT NULL,
  name_en       TEXT NOT NULL,
  color_hex     TEXT NOT NULL,                  -- e.g. '#0D9488'
  icon_emoji    TEXT NOT NULL,                  -- e.g. '🔬'
  description_pl TEXT,
  display_order INTEGER NOT NULL DEFAULT 0
);

-- Seed data (run via scripts/seed-categories.ts)
INSERT INTO categories VALUES
  ('science',     'Nauka',         'Science',    '#0D9488', '🔬', NULL, 1),
  ('history',     'Historia',      'History',    '#B45309', '🏛️', NULL, 2),
  ('tech',        'Technologia',   'Technology', '#2563EB', '📱', NULL, 3),
  ('nature',      'Przyroda',      'Nature',     '#16A34A', '🌿', NULL, 4),
  ('body',        'Ciało i zdrowie','Body',      '#E11D48', '🫀', NULL, 5),
  ('society',     'Społeczeństwo', 'Society',    '#7C3AED', '🏘️', NULL, 6),
  ('space',       'Kosmos',        'Space',      '#1E40AF', '🔭', NULL, 7),
  ('emotions',    'Emocje',        'Emotions',   '#EA580C', '💛', NULL, 8),
  ('philosophy',  'Filozofia',     'Philosophy', '#4338CA', '🤔', NULL, 9);
```

---

### Table: `infographics`
```sql
CREATE TYPE infographic_status AS ENUM (
  'draft',        -- AI generated, not yet reviewed
  'in_review',    -- In human review queue
  'approved',     -- Approved, pending final publish
  'published',    -- Live on site
  'rejected'      -- Rejected, will not publish
);

CREATE TYPE age_group AS ENUM ('under13', '13plus', 'both');
CREATE TYPE emotional_weight AS ENUM ('light', 'medium', 'heavy');
CREATE TYPE reading_level AS ENUM ('easy', 'standard', 'advanced');

CREATE TABLE infographics (
  id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug                TEXT UNIQUE NOT NULL,       -- 'dlaczego-niebo-jest-niebieskie'
  title_pl            TEXT NOT NULL,
  title_en            TEXT,                        -- optional, admin use
  category_id         TEXT NOT NULL REFERENCES categories(id),
  age_group           age_group NOT NULL DEFAULT 'both',
  content_under13     JSONB,                       -- InfographicContent (see type below)
  content_13plus      JSONB,                       -- InfographicContent
  hero_image_url      TEXT,                        -- Supabase Storage URL for hero SVG
  status              infographic_status NOT NULL DEFAULT 'draft',
  review_notes        TEXT,                        -- Internal reviewer comment
  view_count          INTEGER NOT NULL DEFAULT 0,
  like_count          INTEGER NOT NULL DEFAULT 0,
  emotional_weight    emotional_weight NOT NULL DEFAULT 'light',
  reading_level       reading_level NOT NULL DEFAULT 'standard',
  tags                TEXT[] NOT NULL DEFAULT '{}',
  ai_draft            BOOLEAN NOT NULL DEFAULT TRUE,
  expert_reviewed     BOOLEAN NOT NULL DEFAULT FALSE,
  expert_reviewer_name TEXT,
  search_vector       TSVECTOR GENERATED ALWAYS AS (
                        to_tsvector('polish_unaccent',
                          coalesce(title_pl, '') || ' ' ||
                          coalesce(array_to_string(tags, ' '), '')
                        )
                      ) STORED,
  created_at          TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at          TIMESTAMPTZ NOT NULL DEFAULT now(),
  published_at        TIMESTAMPTZ
);

-- Indexes
CREATE INDEX infographics_search_idx     ON infographics USING GIN(search_vector);
CREATE INDEX infographics_title_trgm_idx ON infographics USING GIN(title_pl gin_trgm_ops);
CREATE INDEX infographics_category_idx   ON infographics(category_id);
CREATE INDEX infographics_status_idx     ON infographics(status);
CREATE INDEX infographics_published_idx  ON infographics(published_at DESC) WHERE status = 'published';

-- Auto-update updated_at
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN NEW.updated_at = now(); RETURN NEW; END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER infographics_updated_at
  BEFORE UPDATE ON infographics
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();
```

### JSONB: `InfographicContent` structure
```typescript
// types/index.ts
export interface InfographicSection {
  type: 'hero' | 'why' | 'how' | 'example' | 'facts' | 'quiz_cta';
  heading: string;
  content: string;
  visual_description?: string;  // Brief for SVG artist / future generation
  illustration_url?: string;    // Supabase Storage URL
  key_points?: string[];        // Bulleted list for 'how' sections
  facts?: string[];             // For 'facts' section
}

export interface InfographicContent {
  title: string;
  hook: string;                         // Opening sentence/question
  sections: InfographicSection[];       // 5–7 sections
  key_facts: string[];                  // 2–3 standout facts
  conversation_starters: string[];      // 3 prompts for parents
  tags: string[];
  emotional_weight: 'light' | 'medium' | 'heavy';
  reading_level: 'easy' | 'standard' | 'advanced';
}
```

---

### Table: `quiz_questions`
```sql
CREATE TABLE quiz_questions (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  infographic_id  UUID NOT NULL REFERENCES infographics(id) ON DELETE CASCADE,
  age_group       age_group NOT NULL,
  question_pl     TEXT NOT NULL,
  options         JSONB NOT NULL,    -- [{text: string, correct: boolean}]
  explanation_pl  TEXT NOT NULL,     -- Shown after any answer
  display_order   INTEGER NOT NULL DEFAULT 0,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX quiz_infographic_idx ON quiz_questions(infographic_id, age_group);
```

---

### Table: `daily_questions`
```sql
CREATE TABLE daily_questions (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  infographic_id  UUID NOT NULL REFERENCES infographics(id),
  featured_date   DATE UNIQUE NOT NULL,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX daily_questions_date_idx ON daily_questions(featured_date DESC);
```

---

### Table: `likes`
```sql
-- No user tracking. Increment-only. Client deduplicates via localStorage.
-- Server-side: just increment infographics.like_count
-- This table exists only for future analytics (optional, can skip in MVP)
CREATE TABLE likes (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  infographic_id  UUID NOT NULL REFERENCES infographics(id) ON DELETE CASCADE,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX likes_infographic_idx ON likes(infographic_id);
```

---

### Table: `generation_queue`
```sql
CREATE TYPE queue_status AS ENUM ('pending', 'generating', 'generated', 'failed');

CREATE TABLE generation_queue (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  topic_pl        TEXT NOT NULL,
  topic_en        TEXT,
  status          queue_status NOT NULL DEFAULT 'pending',
  attempts        INTEGER NOT NULL DEFAULT 0,
  error_message   TEXT,
  infographic_id  UUID REFERENCES infographics(id),  -- populated after success
  created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);
```

---

### Row Level Security Policies
```sql
-- Enable RLS on all tables
ALTER TABLE infographics    ENABLE ROW LEVEL SECURITY;
ALTER TABLE quiz_questions  ENABLE ROW LEVEL SECURITY;
ALTER TABLE daily_questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE likes           ENABLE ROW LEVEL SECURITY;
ALTER TABLE categories      ENABLE ROW LEVEL SECURITY;

-- Public: read published content only
CREATE POLICY "public_read_published" ON infographics
  FOR SELECT USING (status = 'published');

CREATE POLICY "public_read_categories" ON categories
  FOR SELECT USING (true);

CREATE POLICY "public_read_quiz" ON quiz_questions
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM infographics i WHERE i.id = infographic_id AND i.status = 'published')
  );

CREATE POLICY "public_read_daily" ON daily_questions
  FOR SELECT USING (true);

-- Public: insert likes (no auth required)
CREATE POLICY "public_insert_likes" ON likes
  FOR INSERT WITH CHECK (true);

-- Service role bypasses RLS automatically (used in admin + generation scripts)
```

---

## 5. NEXT.JS CONFIGURATION

### `next.config.ts`
```typescript
import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '*.supabase.co',    // Supabase Storage
        pathname: '/storage/v1/object/public/**',
      },
    ],
  },
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          { key: 'X-Content-Type-Options',  value: 'nosniff' },
          { key: 'X-Frame-Options',          value: 'DENY' },
          { key: 'X-XSS-Protection',         value: '1; mode=block' },
          { key: 'Referrer-Policy',          value: 'strict-origin-when-cross-origin' },
          { key: 'Permissions-Policy',       value: 'camera=(), microphone=(), geolocation=()' },
        ],
      },
    ];
  },
};

export default nextConfig;
```

### `tsconfig.json` — path aliases
```json
{
  "compilerOptions": {
    "target": "ES2022",
    "lib": ["dom", "dom.iterable", "esnext"],
    "allowJs": true,
    "skipLibCheck": true,
    "strict": true,
    "moduleResolution": "bundler",
    "paths": {
      "@/*": ["./*"],
      "@/components/*": ["./components/*"],
      "@/lib/*": ["./lib/*"],
      "@/hooks/*": ["./hooks/*"],
      "@/types/*": ["./types/*"]
    }
  }
}
```

---

## 6. AGE-MODE SYSTEM

### How it works
1. On first visit: `AgeSelectorModal` shown full-screen
2. User picks age tier → stored in `localStorage` as key `wdk_age` = `'under13'` or `'13plus'`
3. On every page load: inline script reads localStorage and adds `.age-13plus` class to `<html>` **before first paint** (no flash)
4. CSS custom properties cascade from `:root` (under-13 defaults) or `.age-13plus` override
5. React components read age mode via `useAgeMode()` hook for conditional rendering

### `app/layout.tsx` — age-mode no-flash script
```tsx
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pl" suppressHydrationWarning>
      <head />
      <body className={`${baloo.variable} ${lexend.variable} ${inter.variable}`}>
        {/* MUST be first child — runs before any rendering */}
        <script
          dangerouslySetInnerHTML={{
            __html: `try{if(localStorage.getItem('wdk_age')==='13plus')document.documentElement.classList.add('age-13plus')}catch(e){}`,
          }}
        />
        {children}
      </body>
    </html>
  );
}
```

### `hooks/useAgeMode.ts`
```typescript
'use client';
import { useState, useEffect } from 'react';

export type AgeMode = 'under13' | '13plus';

export function useAgeMode() {
  const [ageMode, setAgeModeState] = useState<AgeMode>('under13');
  const [isFirstVisit, setIsFirstVisit] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem('wdk_age') as AgeMode | null;
    if (!stored) {
      setIsFirstVisit(true);
    } else {
      setAgeModeState(stored);
    }
  }, []);

  const setAgeMode = (mode: AgeMode) => {
    localStorage.setItem('wdk_age', mode);
    setAgeModeState(mode);
    if (mode === '13plus') {
      document.documentElement.classList.add('age-13plus');
    } else {
      document.documentElement.classList.remove('age-13plus');
    }
  };

  return { ageMode, setAgeMode, isFirstVisit };
}
```

### `app/globals.css` — CSS custom properties
```css
/* Age-mode tokens */
:root {
  --bg-base:            #FFFBF5;
  --bg-card:            #FFFFFF;
  --text-primary:       #1C1917;
  --text-secondary:     #78716C;
  --brand-primary:      #C2410C;
  --brand-light:        #FDBA74;
  --radius-card:        20px;
  --radius-element:     16px;
  --font-display:       'Baloo 2', sans-serif;
  --font-body:          'Lexend', sans-serif;
  --text-body-size:     1.125rem;
  --text-body-leading:  1.8;
  --touch-min:          3.75rem;
}

.age-13plus {
  --bg-base:            #F8FAFC;
  --text-primary:       #0F172A;
  --text-secondary:     #64748B;
  --brand-primary:      #1D4ED8;
  --brand-light:        #BFDBFE;
  --radius-card:        12px;
  --radius-element:     8px;
  --font-display:       'Inter', sans-serif;
  --font-body:          'Inter', sans-serif;
  --text-body-size:     1rem;
  --text-body-leading:  1.65;
  --touch-min:          3rem;
}

/* Non-negotiable: prefers-reduced-motion */
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    transition-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    scroll-behavior: auto !important;
  }
}

/* Focus styles (Tailwind resets these) */
*:focus-visible {
  outline: 3px solid #2563EB;
  outline-offset: 3px;
  border-radius: 4px;
}

/* Dyslexia mode */
.dyslexia-mode body {
  letter-spacing: 0.05em;
  word-spacing: 0.1em;
  line-height: 2.1;
}
.dyslexia-mode p { max-width: 55ch; }

body {
  background-color: var(--bg-base);
  color: var(--text-primary);
  font-family: var(--font-body);
  font-size: var(--text-body-size);
  line-height: var(--text-body-leading);
}
```

---

## 7. API ROUTES

All routes are in `app/api/`. All are Edge Runtime compatible where possible.

### `GET /api/search`
Query params: `q` (string), `age` ('under13'|'13plus'), `category` (string), `page` (integer, default 1)

```typescript
// app/api/search/route.ts
import { createServerClient } from '@/lib/supabase/server';
import { NextRequest, NextResponse } from 'next/server';

export const runtime = 'edge';

export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl;
  const q        = searchParams.get('q') ?? '';
  const age      = searchParams.get('age') ?? 'under13';
  const category = searchParams.get('category');
  const page     = parseInt(searchParams.get('page') ?? '1', 10);
  const limit    = 12;
  const offset   = (page - 1) * limit;

  const supabase = createServerClient();

  let query = supabase
    .from('infographics')
    .select('id, slug, title_pl, category_id, hero_image_url, like_count, view_count, reading_level, emotional_weight')
    .eq('status', 'published')
    .range(offset, offset + limit - 1);

  if (q.length >= 2) {
    query = query.textSearch('search_vector', q, {
      type: 'websearch',
      config: 'polish_unaccent',
    });
  }
  if (category) query = query.eq('category_id', category);
  if (age !== 'both') {
    query = query.or(`age_group.eq.${age},age_group.eq.both`);
  }

  const { data, error } = await query.order('published_at', { ascending: false });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ results: data, page, limit });
}
```

---

### `GET /api/autocomplete`
Query params: `q` (min 2 chars)

```typescript
// app/api/autocomplete/route.ts
export const runtime = 'edge';

export async function GET(req: NextRequest) {
  const q = req.nextUrl.searchParams.get('q') ?? '';
  if (q.length < 2) return NextResponse.json({ suggestions: [] });

  const supabase = createServerClient();
  const { data } = await supabase
    .from('infographics')
    .select('slug, title_pl, category_id')
    .eq('status', 'published')
    .ilike('title_pl', `%${q}%`)   // Fallback; upgrade to pg_trgm similarity via RPC
    .limit(6);

  return NextResponse.json({ suggestions: data ?? [] });
}
```

> **Upgrade path:** Create a Postgres RPC function `autocomplete_topics(query text)` using `pg_trgm` similarity for fuzzy matching — call via `supabase.rpc('autocomplete_topics', { query: q })`.

---

### `POST /api/like`
Body: `{ infographic_id: string }`

```typescript
// app/api/like/route.ts
export async function POST(req: NextRequest) {
  const { infographic_id } = await req.json();
  if (!infographic_id) return NextResponse.json({ error: 'Missing id' }, { status: 400 });

  const supabase = createServerClient();

  // Increment like_count atomically
  const { error } = await supabase.rpc('increment_like', { target_id: infographic_id });
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json({ ok: true });
}
```

```sql
-- SQL: atomic increment function (bypasses RLS, uses SECURITY DEFINER)
CREATE OR REPLACE FUNCTION increment_like(target_id UUID)
RETURNS void
LANGUAGE sql
SECURITY DEFINER
AS $$
  UPDATE infographics SET like_count = like_count + 1 WHERE id = target_id;
  INSERT INTO likes (infographic_id) VALUES (target_id);
$$;
```

---

### `GET /api/daily-question`
```typescript
export async function GET() {
  const today = new Date().toISOString().slice(0, 10); // 'YYYY-MM-DD'
  const supabase = createServerClient();

  const { data } = await supabase
    .from('daily_questions')
    .select('infographic_id, infographics(slug, title_pl, hero_image_url, category_id)')
    .eq('featured_date', today)
    .single();

  if (!data) return NextResponse.json({ question: null });
  return NextResponse.json({ question: data });
}
```

---

### `POST /api/cron/daily-question` — Vercel Cron (protected)
```typescript
export async function POST(req: NextRequest) {
  // Vercel passes CRON_SECRET as Authorization header
  if (req.headers.get('authorization') !== `Bearer ${process.env.CRON_SECRET}`) {
    return new Response('Unauthorized', { status: 401 });
  }
  // Pick a published infographic not featured in the last 30 days
  // Insert into daily_questions with featured_date = tomorrow
  // ...
}
```

---

## 8. COMPONENT ARCHITECTURE

### Key component: `InfographicViewer`
```tsx
// components/infographic/InfographicViewer.tsx
'use client';

interface Props {
  content: InfographicContent;
  ageMode: AgeMode;
  slug: string;
}

export function InfographicViewer({ content, ageMode, slug }: Props) {
  const [scrollProgress, setScrollProgress] = useScrollProgress();

  return (
    <article
      className="w-full max-w-[450px] mx-auto bg-[var(--bg-card)]
                 rounded-[var(--radius-card)] shadow-md overflow-y-auto
                 flex flex-col scroll-smooth relative"
      aria-label={content.title}
    >
      <ScrollProgress value={scrollProgress} />
      {content.sections.map((section, i) => (
        <ScrollReveal key={i}>
          <InfographicSection section={section} ageMode={ageMode} index={i} />
        </ScrollReveal>
      ))}
      <LikeButton slug={slug} />
    </article>
  );
}
```

### Key component: `ScrollReveal`
```tsx
// components/infographic/ScrollReveal.tsx
'use client';
import { useEffect, useRef } from 'react';

export function ScrollReveal({ children }: { children: React.ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.classList.add('opacity-100', 'translate-y-0');
          el.classList.remove('opacity-0', 'translate-y-4');
          observer.unobserve(el);
        }
      },
      { threshold: 0.15, rootMargin: '0px 0px -40px 0px' }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className="opacity-0 translate-y-4 transition-all duration-300 ease-out
                 motion-reduce:opacity-100 motion-reduce:translate-y-0"
    >
      {children}
    </div>
  );
}
```

### Key component: `Rys` (mascot)
```tsx
// components/mascot/Rys.tsx
'use client';
import dynamic from 'next/dynamic';
import { RysStatic } from './RysStatic';
import { useReducedMotion } from 'framer-motion'; // or manual mediaQuery check

const LottiePlayer = dynamic(
  () => import('@lottiefiles/react-lottie-player').then(m => m.Player),
  { ssr: false }
);

export type RysState = 'idle' | 'curious' | 'excited' | 'thinking' | 'encouraging' | 'celebrating';

interface Props {
  state?: RysState;
  size?: 180 | 80 | 32;
}

export function Rys({ state = 'idle', size = 80 }: Props) {
  const prefersReducedMotion = useReducedMotion();

  if (prefersReducedMotion) {
    return <RysStatic size={size} />;
  }

  return (
    <LottiePlayer
      src={`/animations/rys-${state}.json`}
      style={{ width: size, height: size }}
      autoplay
      loop={state === 'idle'}
      keepLastFrame
    />
  );
}
```

### Key component: `LikeButton`
```tsx
'use client';
import { useState } from 'react';

export function LikeButton({ slug, initialCount }: { slug: string; initialCount: number }) {
  const storageKey = `wdk_liked_${slug}`;
  const [liked, setLiked] = useState(() => {
    try { return localStorage.getItem(storageKey) === '1'; } catch { return false; }
  });
  const [count, setCount] = useState(initialCount);
  const [animating, setAnimating] = useState(false);

  async function handleLike() {
    if (liked) return;
    setLiked(true);
    setCount(c => c + 1);
    setAnimating(true);
    setTimeout(() => setAnimating(false), 350);
    try { localStorage.setItem(storageKey, '1'); } catch {}
    await fetch('/api/like', {
      method: 'POST',
      body: JSON.stringify({ infographic_id: slug }), // use actual UUID in production
    });
  }

  return (
    <button
      onClick={handleLike}
      aria-label={liked ? 'Polubiłeś/aś' : 'Polub'}
      aria-pressed={liked}
      className={`flex items-center gap-2 px-4 py-2 rounded-full transition-all
                  ${liked ? 'text-red-500' : 'text-stone-400'}
                  ${animating ? 'animate-pop' : ''}`}
    >
      <span aria-hidden>{liked ? '❤️' : '🤍'}</span>
      <span>{count}</span>
    </button>
  );
}
```

---

## 9. CONTENT GENERATION PIPELINE

### `lib/gemini/client.ts`
```typescript
import { GoogleGenerativeAI } from '@google/generative-ai';

if (!process.env.GEMINI_API_KEY) {
  throw new Error('GEMINI_API_KEY is required');
}

export const gemini = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
export const model  = gemini.getGenerativeModel({ model: 'gemini-2.0-flash' });
```

### `lib/gemini/safety.ts`
```typescript
import {
  HarmCategory,
  HarmBlockThreshold,
  type SafetySetting,
} from '@google/generative-ai';

export const strictSafetySettings: SafetySetting[] = [
  { category: HarmCategory.HARM_CATEGORY_HARASSMENT,        threshold: HarmBlockThreshold.BLOCK_LOW_AND_ABOVE },
  { category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,       threshold: HarmBlockThreshold.BLOCK_LOW_AND_ABOVE },
  { category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT, threshold: HarmBlockThreshold.BLOCK_LOW_AND_ABOVE },
  { category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT, threshold: HarmBlockThreshold.BLOCK_LOW_AND_ABOVE },
];
```

### `lib/gemini/prompts.ts`
```typescript
export function buildInfographicPrompt(topic: string, ageGroup: 'under13' | '13plus'): string {
  const isYounger = ageGroup === 'under13';

  return `Jesteś polskim ekspertem edukacyjnym piszącym dla dzieci ${isYounger ? 'w wieku 8–12 lat' : 'w wieku 13–16 lat'}.

Stwórz edukacyjną infografikę o temacie: "${topic}"

REGUŁY OBOWIĄZKOWE:
- Język: wyłącznie polski
- Łącznie maksymalnie ${isYounger ? '300' : '450'} słów
- ${isYounger ? 'Maksymalnie 5 zdań na sekcję, maksymalnie 10 słów w zdaniu' : 'Maksymalnie 7 zdań na sekcję'}
- Brak żargonu — wyjaśniaj terminy techniczne przy pierwszym użyciu
- Ton: ${isYounger ? 'ciepły, zachęcający, pełen entuzjazmu' : 'rzeczowy, partnerski, bez nadmiernego upraszczania'}
- Zawsze użyj realnej analogii: "To jakby..."
- Nigdy nie wspominaj o przemocy, śmierci (chyba że temat tego wymaga), treściach dla dorosłych

Zwróć WYŁĄCZNIE poprawny JSON w tej strukturze:
{
  "title": "string (maks. 8 słów, bez pytajnika na końcu tytułu)",
  "hook": "string (jedno zdanie otwierające — pytanie lub zaskakujący fakt)",
  "sections": [
    {
      "type": "hero",
      "heading": "string",
      "content": "string",
      "visual_description": "string (opis ilustracji dla grafika, po polsku)"
    },
    {
      "type": "why",
      "heading": "Dlaczego to ważne?",
      "content": "string",
      "visual_description": "string"
    },
    {
      "type": "how",
      "heading": "Jak to działa?",
      "content": "string",
      "key_points": ["string", "string", "string"],
      "visual_description": "string"
    },
    {
      "type": "example",
      "heading": "Przykład z życia",
      "content": "string (zawiera analogię 'To jakby...')",
      "visual_description": "string"
    },
    {
      "type": "facts",
      "heading": "Czy wiesz, że...?",
      "facts": ["string", "string", "string"],
      "visual_description": "string"
    }
  ],
  "key_facts": ["string", "string", "string"],
  "conversation_starters": [
    "string (pytanie otwierające rozmowę dla rodzica)",
    "string",
    "string"
  ],
  "tags": ["string", "string", "string", "string", "string"],
  "emotional_weight": "light" | "medium" | "heavy",
  "reading_level": "easy" | "standard" | "advanced",
  "suggested_category": "science" | "history" | "tech" | "nature" | "body" | "society" | "space" | "emotions" | "philosophy"
}`;
}

export function buildQuizPrompt(topic: string, content: string, ageGroup: 'under13' | '13plus'): string {
  return `Na podstawie tej polskiej infografiki o temacie "${topic}", stwórz 3 pytania testowe dla dzieci ${ageGroup === 'under13' ? 'w wieku 8–12' : 'w wieku 13–16'} lat.

Treść infografiki:
${content}

REGUŁY:
- Język: wyłącznie polski
- 4 odpowiedzi do każdego pytania (A, B, C, D)
- Dokładnie 1 poprawna odpowiedź na pytanie
- Inne odpowiedzi są sensowne, ale niejednoznacznie błędne — bez pułapek
- Wyjaśnienie pokazywane PO odpowiedzi, nie zdradzaj odpowiedzi w pytaniu
- Nigdy nie krytykuj — wyjaśnienie jest zachęcające dla obydwu wyników

Zwróć WYŁĄCZNIE JSON:
[
  {
    "question": "string",
    "options": [
      {"text": "string", "correct": true},
      {"text": "string", "correct": false},
      {"text": "string", "correct": false},
      {"text": "string", "correct": false}
    ],
    "explanation": "string"
  }
]`;
}
```

### `lib/gemini/generate.ts`
```typescript
import { model } from './client';
import { strictSafetySettings } from './safety';
import { buildInfographicPrompt, buildQuizPrompt } from './prompts';
import { checkContent } from '@/lib/safety/pipeline';
import type { InfographicContent } from '@/types';

export async function generateInfographic(
  topic: string,
  ageGroup: 'under13' | '13plus'
): Promise<InfographicContent> {
  const prompt = buildInfographicPrompt(topic, ageGroup);

  const result = await model.generateContent({
    contents: [{ role: 'user', parts: [{ text: prompt }] }],
    safetySettings: strictSafetySettings,
    generationConfig: {
      temperature: 0.7,
      topP: 0.9,
      maxOutputTokens: 2048,
      responseMimeType: 'application/json',
    },
  });

  const text = result.response.text();
  const content: InfographicContent = JSON.parse(text);

  // Run additional REGEX safety check on generated text
  const fullText = JSON.stringify(content);
  const safetyResult = await checkContent(fullText);
  if (!safetyResult.safe) {
    throw new Error(`Safety check failed: ${safetyResult.reason}`);
  }

  return content;
}

export async function generateBothAgeGroups(topic: string) {
  const [under13, teen] = await Promise.all([
    generateInfographic(topic, 'under13'),
    generateInfographic(topic, '13plus'),
  ]);
  return { under13, teen };
}
```

### `scripts/generate-infographic.ts` — CLI tool
```typescript
#!/usr/bin/env npx ts-node
import { generateBothAgeGroups } from '../lib/gemini/generate';
import { createClient } from '@supabase/supabase-js';
import { slugify } from '../lib/slugify';

const topic = process.argv[2];
if (!topic) { console.error('Usage: npx ts-node scripts/generate-infographic.ts "topic"'); process.exit(1); }

async function main() {
  console.log(`Generating infographic for: "${topic}"`);
  const { under13, teen } = await generateBothAgeGroups(topic);

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  const { data, error } = await supabase.from('infographics').insert({
    slug: slugify(under13.title),
    title_pl: under13.title,
    category_id: under13.suggested_category,
    content_under13: under13,
    content_13plus: teen,
    status: 'draft',
    tags: under13.tags,
    emotional_weight: under13.emotional_weight,
    reading_level: under13.reading_level,
    ai_draft: true,
  }).select('id, slug').single();

  if (error) { console.error('DB error:', error); process.exit(1); }
  console.log(`✓ Created: ${data.slug} (${data.id})`);
  console.log('→ Review at /admin/' + data.id);
}

main().catch(console.error);
```

---

## 10. CONTENT SAFETY MIDDLEWARE

### Three-layer pipeline
```
User-submitted topic
       ↓
1. REGEX Blocklist  →  BLOCKED → reject immediately (< 1ms)
       ↓ PASSED
2. Gemini SafetySettings  →  BLOCKED by Gemini → reject, log
       ↓ PASSED
3. Generated content REGEX re-check  →  BLOCKED → reject, flag for review
       ↓ PASSED
Human review queue (status = 'draft')
       ↓ APPROVED
Published
```

### `lib/safety/regex-blocklist.ts`
```typescript
// Patterns are tested against lowercased, diacritic-stripped input
export const BLOCKLIST_PATTERNS: RegExp[] = [
  // Violence
  /\b(zabij|zamorduj|samobójstwo|okalecz|tortury?|gwałt)\b/i,
  // Sexual content
  /\b(seks|pornografi|nagi[a-z]*|erotyk)\b/i,
  // Hate speech targets
  /\b(nienawidz[ęę]|faszyści?|nazist)\b/i,
  // Drug-related (for under-13 generation requests)
  /\b(narkotyk|heroina|kokaina|marihuana)\b/i,
];

export function passesRegexCheck(text: string): boolean {
  const normalized = text.toLowerCase();
  return !BLOCKLIST_PATTERNS.some(p => p.test(normalized));
}
```

### `lib/safety/pipeline.ts`
```typescript
import { passesRegexCheck } from './regex-blocklist';

interface SafetyResult {
  safe: boolean;
  reason?: string;
}

export async function checkContent(text: string): Promise<SafetyResult> {
  if (!passesRegexCheck(text)) {
    return { safe: false, reason: 'regex_blocklist' };
  }
  return { safe: true };
}

export function checkTopic(topic: string): SafetyResult {
  if (!passesRegexCheck(topic)) {
    return { safe: false, reason: 'topic_blocklist' };
  }
  return { safe: true };
}
```

---

## 11. SEARCH IMPLEMENTATION

### PostgreSQL RPC: fuzzy autocomplete
```sql
CREATE OR REPLACE FUNCTION autocomplete_topics(query text, result_limit int DEFAULT 6)
RETURNS TABLE(slug text, title_pl text, category_id text)
LANGUAGE sql
STABLE
AS $$
  SELECT slug, title_pl, category_id
  FROM infographics
  WHERE status = 'published'
    AND (
      title_pl ILIKE '%' || query || '%'
      OR similarity(title_pl, query) > 0.2
    )
  ORDER BY
    CASE WHEN title_pl ILIKE query || '%' THEN 0 ELSE 1 END,
    similarity(title_pl, query) DESC,
    like_count DESC
  LIMIT result_limit;
$$;
```

### `lib/search/fts.ts`
```typescript
import { createServerClient } from '@/lib/supabase/server';

export async function searchInfographics(params: {
  q: string;
  age?: 'under13' | '13plus';
  category?: string;
  page?: number;
  limit?: number;
}) {
  const { q, age, category, page = 1, limit = 12 } = params;
  const supabase = createServerClient();

  let query = supabase
    .from('infographics')
    .select('id, slug, title_pl, category_id, hero_image_url, like_count, view_count, reading_level, emotional_weight, ai_draft')
    .eq('status', 'published')
    .range((page - 1) * limit, page * limit - 1);

  if (q.length >= 2) {
    // Full-text search with Polish config
    query = query.textSearch('search_vector', q, {
      type: 'websearch',
      config: 'polish_unaccent',
    });
  }

  if (category) query = query.eq('category_id', category);
  if (age && age !== 'both') {
    query = query.or(`age_group.eq.${age},age_group.eq.both`);
  }

  const { data, error, count } = await query.order('published_at', { ascending: false });
  return { data, error, count };
}
```

---

## 12. ANALYTICS

### Plausible setup (no cookies, no GDPR consent required)

Add to `app/layout.tsx`:
```tsx
<Script
  defer
  data-domain={process.env.NEXT_PUBLIC_PLAUSIBLE_DOMAIN}
  src="https://plausible.io/js/script.js"
/>
```

### `lib/analytics/plausible.ts`
```typescript
declare global {
  interface Window {
    plausible?: (event: string, options?: { props?: Record<string, string | number> }) => void;
  }
}

export function trackEvent(name: string, props?: Record<string, string | number>) {
  if (typeof window !== 'undefined' && window.plausible) {
    window.plausible(name, { props });
  }
}
```

### Events to track
| Event | When | Props |
|-------|------|-------|
| `infographic_view` | Infographic page load | `slug`, `category`, `age_group` |
| `infographic_complete` | Scroll reaches 90% | `slug` |
| `like` | Like button clicked | `slug` |
| `search` | Search submitted | `q` (anonymised if sensitive) |
| `age_selected` | Age mode chosen | `mode` |
| `quiz_started` | Quiz CTA clicked | `slug` |
| `quiz_completed` | All 3 questions answered | `slug`, `score` |
| `share` | Share button clicked | `slug`, `platform` |

---

## 13. DEPLOYMENT CONFIGURATION

### `vercel.json`
```json
{
  "crons": [
    {
      "path": "/api/cron/daily-question",
      "schedule": "0 5 * * *"
    }
  ],
  "functions": {
    "app/api/generate/route.ts": {
      "maxDuration": 30
    }
  }
}
```

### Environment variables in Vercel dashboard
Set these in Vercel → Project Settings → Environment Variables:
- `NEXT_PUBLIC_SUPABASE_URL` — all environments
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` — all environments
- `SUPABASE_SERVICE_ROLE_KEY` — production + preview (NOT exposed to client)
- `GEMINI_API_KEY` — production + preview (NOT exposed to client)
- `NEXT_PUBLIC_PLAUSIBLE_DOMAIN` — production only
- `NEXT_PUBLIC_SITE_URL` — production only
- `ADMIN_SECRET` — production + preview
- `CRON_SECRET` — production (for cron route protection)

### Supabase setup checklist
- [ ] Create project at supabase.com
- [ ] Run extension setup SQL
- [ ] Run all CREATE TABLE statements
- [ ] Run seed-categories script
- [ ] Enable Row Level Security on all tables
- [ ] Apply all RLS policies
- [ ] Enable Supabase Storage: create bucket `infographic-assets` (public)
- [ ] Set CORS for your domain in Supabase project settings
- [ ] Run `supabase gen types typescript --project-id YOUR_ID > lib/supabase/types.ts`

---

## 14. PERFORMANCE TARGETS

### Core Web Vitals targets
| Metric | Target | Strategy |
|--------|--------|---------|
| LCP | < 2.5s | SSG, hero image preload, Supabase CDN |
| INP | < 200ms | Edge runtime for API routes |
| CLS | < 0.1 | Reserved dimensions on all images/cards |
| TTFB | < 800ms | Vercel Edge Network + Supabase close region |

### Rendering strategy by page
| Page | Strategy | Revalidation |
|------|----------|-------------|
| Homepage | ISR | `revalidate: 3600` (1h) |
| `/[slug]` infographic | ISR | `revalidate: 86400` (24h) |
| `/tematy/[category]` | ISR | `revalidate: 3600` |
| `/szukaj` | CSR | n/a (dynamic) |
| `/dla-rodzicow` | Static | n/a |
| `/api/*` | Edge | n/a |

### Code splitting rules
```tsx
// Always lazy-load heavy components
const QuizCard       = dynamic(() => import('@/components/quiz/QuizCard'), { ssr: false });
const AgeSelectorModal = dynamic(() => import('@/components/age/AgeSelectorModal'), { ssr: false });
// Lottie player is always dynamically imported (see Rys component)
```

### Image rules
- All images via `next/image` with explicit `width` and `height`
- Hero SVGs: inline `<svg>` for above-fold content (no extra request)
- Card thumbnails: AVIF/WebP via Supabase Image Transformation (`?width=400&format=avif`)

---

## 15. SECURITY HEADERS

Applied globally via `next.config.ts` (see §5). Additional policies:

### Content Security Policy (add after initial launch)
```typescript
// Tighten after identifying all third-party domains
"Content-Security-Policy": [
  "default-src 'self'",
  "script-src 'self' 'unsafe-inline' plausible.io",  // unsafe-inline for no-flash script
  "style-src 'self' 'unsafe-inline' fonts.googleapis.com",
  "font-src 'self' fonts.gstatic.com",
  "img-src 'self' data: *.supabase.co",
  "connect-src 'self' *.supabase.co plausible.io",
  "frame-ancestors 'none'",
].join('; '),
```

### Admin route protection
```typescript
// app/(admin)/admin/layout.tsx
import { headers } from 'next/headers';
import { redirect } from 'next/navigation';

export default async function AdminLayout({ children }) {
  // Simple secret-based auth for MVP — replace with Supabase Auth in Phase 2
  const headersList = await headers();
  const adminCookie = headersList.get('cookie') ?? '';
  if (!adminCookie.includes(`admin_auth=${process.env.ADMIN_SECRET}`)) {
    redirect('/');
  }
  return <>{children}</>;
}
```

---

## 16. IMPLEMENTATION ORDER

Follow this order to avoid blockers. Each task maps to BACKLOG.md IDs.

### Sprint 0 — Foundation (prerequisite for everything)
1. `I-001` Scaffold Next.js 15 app in `explaintomykidapp/`
2. `D-001` Tailwind config: paste full config from UI_UX_DESIGN.md §13
3. `D-002` Font loading in `app/layout.tsx` (Baloo 2 + Lexend + Inter, latin-ext)
4. `D-003` `globals.css` with CSS custom properties + age-mode classes
5. `D-004` Focus style override in globals.css
6. `D-005` `prefers-reduced-motion` rule in globals.css
7. `I-002` Supabase: create project, run schema SQL, enable RLS
8. `I-007` Plausible: configure domain, add script to layout

### Sprint 1 — Core Loop
9. `I-003` Gemini client + prompts + generate.ts
10. `I-004` Safety pipeline (regex-blocklist + Gemini SafetySetting)
11. `I-006` Run generation script: produce first 20 infographics (Tier 1 list)
12. `F-003` Age selector modal + useAgeMode hook
13. `F-001` Homepage (static, hardcoded data to start)
14. `F-004` Infographic viewer page with ScrollReveal
15. `F-002` Browse page with InfographicGrid

### Sprint 2 — Search & Discovery
16. `F-005` Search API route + SearchBar + SearchResults
17. `F-006` Category filter chips
18. `F-007` Age filter in search
19. `F-008` Sort options (popular / recent / liked)
20. `F-010` Daily question (API + cron + homepage card)

### Sprint 3 — Engagement Mechanics
21. `F-009` Like button with localStorage dedup
22. `F-011` Conversation starters collapsible section
23. `F-012` Emotional weight + reading level badges on cards
24. `F-013` Related topics sidebar
25. `L-001/002` Privacy policy + cookie policy pages
26. `L-003` Age gate REGEX blocklist on search input
27. `L-004` AI Draft watermark component

### Sprint 4 — Admin & Polish
28. `L-005` Admin review queue (list + approve/reject)
29. `I-008` Vercel deployment pipeline (preview + production)
30. `I-006` Generate + review remaining infographics to 50+

---

*See also: UI_UX_DESIGN.md (design system spec) | BACKLOG.md (full task list) | PROJECT.md (vision + phases)*
