# UI/UX DESIGN SPEC: Wytłumacz Dziecku / Explain to My Kid
> Research-backed design system | Date: 2026-02-26
> Based on: Nielsen Norman Group, Mayer Multimedia Learning, Piaget, Duolingo/DK/NatGeo analysis, Polish cultural design research

---

## TABLE OF CONTENTS
1. [Visual Style Direction](#1-visual-style-direction)
2. [Age-Tier Design System](#2-age-tier-design-system)
3. [Color Palette](#3-color-palette)
4. [Typography](#4-typography)
5. [Mascot: Ryś](#5-mascot-ryś)
6. [Infographic Layout Principles](#6-infographic-layout-principles)
7. [Navigation & Information Architecture](#7-navigation--information-architecture)
8. [Search UX](#8-search-ux)
9. [Animation & Motion](#9-animation--motion)
10. [Accessibility](#10-accessibility)
11. [Trust Signals](#11-trust-signals)
12. [Error & Empty States](#12-error--empty-states)
13. [Tailwind CSS Implementation](#13-tailwind-css-implementation)
14. [Anti-Patterns to Avoid](#14-anti-patterns-to-avoid)

---

## 1. VISUAL STYLE DIRECTION

### Validated Direction: "Warm Editorial Illustration"

The "light-comic style" intuition is **correct but needs precise definition**.

Research verdict:
- Comic/cartoon style: **9/10** for ages 6–12 (confirmed by Mayer, NNG, Sesame Workshop research)
- Comic/cartoon style: **5/10** for ages 13–16 (triggers age-condescension perception; Buckingham 2003)
- **Recommended:** a single graduated system called **"Warm Editorial Illustration"**

**What this means:**
> Illustrated characters with personality + clean typographic hierarchy + structured layout + infographic elements drawn in the same art style as characters. Expressiveness and saturation are *tuned down* as age increases — not a different product, a calibrated spectrum.

**Reference platforms and their lessons:**
| Platform | What to steal | What to avoid |
|----------|--------------|---------------|
| DK Find Out | Layered hierarchy, whitespace discipline, no unnecessary decoration | Desktop-only, static, no Polish |
| Duolingo | Mascot emotional states as UI signals, consistent illustration system, A/B-validated engagement | American gamification visual language, over-presence of gamification |
| Nat Geo Kids | Photography + illustration hybrid, confident bold typography, energy without chaos | English-only, narrow topic range |
| Polish Dobranocka tradition | Warmth, slight naivety, not corporate-glossy | Outdated production quality |

### The Graduation Spectrum

```
Expressive Cartoon ←————————————————————→ Editorial Illustration
     Ages 6–8              Ages 8–12              Ages 13–16
  Max saturation         Full palette           Slightly muted
  Large characters       Detailed chars        Icon/logo presence
  3 sentences/section    5–7 sections          More text OK
  Spring animations      Spring/ease-out       Ease-out only
  All text 18–20px        16–18px              15–16px
```

---

## 2. AGE-TIER DESIGN SYSTEM

### Tier 1 — "Odkrywcy" / Ages 6–8
- Maximum cartoon expressiveness; large eyes, exaggerated proportions
- Warm primary palette (amber, coral, teal)
- Minimum text per section: 3–5 sentences, 8–10 words per sentence
- Max 4–6 visual elements per scroll section
- Mascot (Ryś) visible at every section anchor — large, expressive
- Text size: 18–20px body, 28–32px headings
- Touch targets: 60px minimum
- Corner radius: 20px cards, 16px elements (rounded = safe, friendly)
- Animation: spring physics (slight overshoot)

### Tier 2 — "Badacze" / Ages 8–12 (Core audience)
- Illustrated-editorial balance; more detail, less exaggeration
- Full color palette, warm-biased
- 5–7 sections per infographic; 100–300 words total
- Mascot at section anchors and start/end; moderately sized
- Text size: 16–18px body, 22–26px headings
- Touch targets: 56px
- Corner radius: 16px cards, 12px elements
- Animation: spring physics with reduced bounce

### Tier 3 — "Myśliciele" / Ages 13–16
- Editorial illustration; proportionate characters, more craft/detail
- Palette slightly desaturated; deep navy replaces pure black for text
- Can handle complex layouts; data-viz acceptable
- Mascot reduced to icon/logo mark — restrained presence
- Text size: 15–16px body, 20–24px headings; serif accent on headlines acceptable
- Touch targets: 48px
- Corner radius: 12px cards, 8px elements
- Animation: cubic-bezier ease-out, no overshoot

### CSS Age Mode Implementation

```css
/* globals.css */
:root {
  /* Default: Tier 2 (8-12) / under-13 catch-all */
  --bg-base:            #FFFBF5;   /* warm cream */
  --bg-card:            #FFFFFF;
  --text-primary:       #1C1917;   /* stone-900 */
  --text-secondary:     #78716C;   /* stone-500 */
  --brand-primary:      #C2410C;   /* orange-700 — WCAG AA on white */
  --brand-light:        #FDBA74;   /* orange-300 */
  --radius-card:        20px;
  --radius-element:     16px;
  --font-display:       'Baloo 2', sans-serif;
  --font-body:          'Lexend', sans-serif;
  --text-body-size:     1.125rem;  /* 18px */
  --text-body-leading:  1.8;
  --touch-min:          3.75rem;   /* 60px */
}

.age-13plus {
  --bg-base:            #F8FAFC;   /* slate-50 */
  --text-primary:       #0F172A;   /* slate-900 */
  --text-secondary:     #64748B;   /* slate-500 */
  --brand-primary:      #1D4ED8;   /* blue-700 */
  --brand-light:        #BFDBFE;   /* blue-200 */
  --radius-card:        12px;
  --radius-element:     8px;
  --font-display:       'Inter', sans-serif;
  --font-body:          'Inter', sans-serif;
  --text-body-size:     1rem;      /* 16px */
  --text-body-leading:  1.65;
  --touch-min:          3rem;      /* 48px */
}
```

Apply age mode in `app/layout.tsx` **before first paint** (prevents flash):
```tsx
<script dangerouslySetInnerHTML={{ __html: `
  try {
    if (localStorage.getItem('wdk_age') === '13plus')
      document.documentElement.classList.add('age-13plus');
  } catch(e) {}
`}} />
```

---

## 3. COLOR PALETTE

### "Warm Science" Palette — Research Rationale
Teal/cerulean = exploration, knowledge (cross-cultural). Amber = discovery, warmth. Coral = emotional warmth. Cream background = quality printed book (Polish parents trust this register).

### Primary Colors
| Role | Name | Hex | Usage |
|------|------|-----|-------|
| Brand anchor | Cerulean | `#1A9BBF` | Primary buttons, links, key highlights |
| Energy/discovery | Amber | `#F59E0B` | Accents, highlights, "wow" moments |
| Emotion/warmth | Coral | `#E8634A` | Emotional topics, alerts, hearts |
| Background | Warm cream | `#FFFBF5` | Page background (never pure white) |
| Text | Warm black | `#1C1917` | Body text (never pure #000) |
| Text secondary | Stone | `#78716C` | Subtitles, captions |

### Category Colors (for infographic topic areas)
| Category | Color | Hex |
|----------|-------|-----|
| Science / Nauka | Teal | `#0D9488` |
| History / Historia | Amber-brown | `#B45309` |
| Technology / Technologia | Blue | `#2563EB` |
| Nature / Przyroda | Green | `#16A34A` |
| Body & Health / Ciało | Pink-coral | `#E11D48` |
| Society / Społeczeństwo | Purple | `#7C3AED` |
| Space / Kosmos | Deep blue | `#1E40AF` |
| Emotions / Emocje | Warm orange | `#EA580C` |
| Philosophy / Filozofia | Indigo | `#4338CA` |

### Tier 3 (13+) Palette Adjustment
All accent colors desaturated ~15–20%. Deep navy `#0D1B2A` replaces warm black for text. Background shifts to `#F8FAFC` (slate-50 — cooler, more editorial).

### Critical Rules
- Never use pure white `#FFFFFF` as page background (causes visual stress in ~15% of children)
- Never use pure black `#000000` as text
- All text must meet WCAG 2.1 AA (4.5:1 for body, 3:1 for large text)
- Never convey meaning by color alone — always pair with text label or icon

---

## 4. TYPOGRAPHY

### Font Pairing (Free, Google Fonts, Full Polish Character Support)

| Role | Font | Weight | Notes |
|------|------|--------|-------|
| Display / Headings (Under-13) | **Baloo 2** | 700, 800 | Rounded, warm, high legibility; excellent Polish diacritics |
| Body (All ages) | **Lexend** | 400, 500 | Designed specifically for reading ease; validated against dyslexia; excellent Polish support |
| Display / Headings (13+) | **Inter** | 600, 700 | Editorial, clean, professional feel |
| Optional serif accent (13+) | **Lora** | 600 | Pull quotes, section headlines for editorial depth |

**Critical requirement:** Verify full Polish diacritic support (ą ć ę ł ń ó ś ź ż) before finalizing. Baloo 2, Lexend, and Inter all pass this check.

### Type Scale

| Level | Under-13 | 13+ | Usage |
|-------|----------|-----|-------|
| H1 / Infographic title | 28–32px / 700 | 24–28px / 700 | One per infographic |
| H2 / Section header | 22–24px / 700 | 20–22px / 600 | Section anchors |
| Lead / Intro sentence | 20px / 500 | 18px / 400 | First sentence of section |
| Body | 18px / 400 | 16px / 400 | Main explanation text |
| Caption | 14px / 400 | 13px / 400 | Labels, footnotes |
| UI labels | 13px / 500 | 12px / 500 | Nav, chips, badges |

### Readability Rules
- Line height: 1.75–1.8 for body (Under-13); 1.6–1.65 (13+)
- Max line length: 60–65 characters (enforced by `max-w-[450px]` container)
- **Never** justify text
- **Never** use serif for body text under age 12
- Paragraph max: 3 sentences for Under-13; 4–5 for 13+
- All-caps: never for body text (destroys word-shape recognition)

### Dyslexia Mode Toggle
Offer optional switch (stored in localStorage) that applies:
```css
.dyslexia-mode {
  font-family: 'Lexend', sans-serif; /* already default */
  letter-spacing: 0.05em;
  word-spacing: 0.1em;
  line-height: 2;
}
```

---

## 5. MASCOT: RYŚ

### Why a Lynx?
- **Polish/CEE cultural anchor** — the Białowieża forest lynx is a recognized Polish natural symbol
- **Not used by any EdTech competitor globally** (Duolingo = owl; differentiates immediately)
- **Visual design potential**: ear tufts + spotted coat + bright eyes = highly expressive at any size
- **Name**: "Ryś" = both the animal name AND a Polish diminutive — gives an immediate character name
- **Symbolism**: sharp vision, sharp perception = perfect for an "explaining" platform
- Research: animal mascots outperform human mascots for cross-cultural child engagement (Joan Ganz Cooney Center)

### Core Emotional States (as Lottie animations)
| State | Trigger | Expression |
|-------|---------|------------|
| Idle / breathing | Default (2s loop) | Slow chest rise, ear twitch |
| Curious | Topic intro, new section | Head tilt, ears forward, wide eyes |
| Excited | Quiz correct, reading complete | Paws up, tail flick, big smile |
| Thinking | Complex concept, AI generating | Paw on chin, eyes narrow, slight head tilt |
| Encouraging | Quiz wrong answer, "try again" | Gentle nod, soft smile, paw wave |
| Celebrating | Full infographic read | Jump, sparkles, big grin |

### Size Appearances by Tier
| Tier | Size | Frequency | Style |
|------|------|-----------|-------|
| 6–8 | Full character (120–180px) | Every section | Maximum expressiveness |
| 8–12 | Character at anchors (80–120px) | Start, end, section breaks | Moderately expressive |
| 13+ | Icon/logo mark (32–48px) | Header only | Refined, minimal |

### Technical Notes
- Design at 3 sizes from day 1: full (180px), medium (80px), icon (32px)
- Icon must be recognizable by **ear tuft silhouette alone** at 32×32px
- Lottie JSON for all 6 emotional states
- SVG static fallback for `prefers-reduced-motion`
- Never trigger mascot automatically to interrupt reading (the Clippy anti-pattern)

---

## 6. INFOGRAPHIC LAYOUT PRINCIPLES

### Core Structure: "5-Part Portrait Scroll"
Every infographic follows this narrative structure (scroll-triggered reveals):

```
┌─────────────────────────────────┐
│  [HERO ZONE]                    │  ← Title + Ryś introducing topic
│  Big bold title                 │    Category color header strip
│  One-sentence hook              │    Ryś in "curious" state
├─────────────────────────────────┤
│  [WHY IT MATTERS]               │  ← Brief: why does a kid care?
│  1–2 sentences + icon           │    Warm amber accent
├─────────────────────────────────┤
│  [HOW IT WORKS]                 │  ← Main explanation (largest zone)
│  Illustrated diagram            │    Numbered steps or flow
│  3–5 key points max             │    Process animation (SVG/Lottie)
├─────────────────────────────────┤
│  [REAL-WORLD EXAMPLE]           │  ← Concrete anchor for abstract concept
│  Illustration + analogy         │    "It's like..." box (amber-tinted)
├─────────────────────────────────┤
│  [KEY FACTS / DID YOU KNOW?]    │  ← 2–3 surprising facts
│  Bold stat or counterintuitive  │    Ryś "excited" state
│  fact cards                     │
├─────────────────────────────────┤
│  [QUIZ PROMPT + SHARE]          │  ← "Test yourself" + share button
│  3-question quiz CTA            │    Ryś "encouraging"
└─────────────────────────────────┘
```

### Layout Rules
1. **Single entry point at top** — never requires backtracking
2. **Max 7 sections** per infographic; sweet spot is 5
3. **Max 4–6 visual elements per section** (Under-13); 6–10 for 13+
4. **Text-to-visual ratio**: 20/80 for Under-8; 35/65 for 8–12; 50/50 for 13+
5. **"Chunk and breathe"**: every dense section followed by a visual breathing space
6. **Illustrated icons only** — filled, colored, in same art style as Ryś. Never Heroicons/Feather in child-facing infographics
7. **Portrait constraint as feature**: design as a scroll-through story, not a flattened poster
8. **All text must have 4.5:1 contrast** against its background — use semi-transparent white overlay when text sits on illustration

### Infographic Container CSS
```html
<article class="w-full max-w-[450px] mx-auto aspect-[9/16]
                bg-white rounded-[20px] shadow-md overflow-y-auto
                flex flex-col scroll-smooth">
```

### Scroll Progress Bar
3px bar at very top of infographic, fills as user scrolls:
```css
.progress-bar {
  position: sticky;
  top: 0;
  height: 3px;
  background: var(--brand-primary);
  transform-origin: left;
  /* width set via JS scroll listener */
}
```

---

## 7. NAVIGATION & INFORMATION ARCHITECTURE

### Primary Navigation: Bottom Tab Bar (Mobile)
Research finding: bottom nav outperforms hamburger menus for under-13 by 40% in task completion (NNG 2023). Hamburger menus are invisible to children under 9.

```
┌──────────────────────────────────────┐
│  [Home]  [Browse]  [Search]  [Saved] │  ← Bottom tab bar
│  Główna  Tematy    Szukaj    Ulubione│
└──────────────────────────────────────┘
```

- 4 tabs maximum (Miller's Law applied to navigation)
- Each tab: 60px height (Under-13 touch target); 48px (13+)
- Active state: brand primary color fill + label
- Icons always paired with text labels — never icon-only
- Fixed bottom, safe-area-inset-bottom aware

### Secondary Navigation (Desktop — supplementary)
Side nav or top nav with same 4 items. Desktop is secondary use case.

### Age Group Selector
- **Where:** First-visit modal + persistent toggle in header
- **No login required** — preference stored in localStorage as `wdk_age`
- **Design (Under-13 selector):**
  - Two large cards (not radio buttons)
  - Card 1: Ryś cartoon large + "Mam mniej niż 13 lat" + fun color
  - Card 2: Ryś icon + "Mam 13 lub więcej lat" + cool color
  - No guilt/consequence language — just "choose your vibe"
- **Persistence**: Remember preference across sessions; allow change at any time via Settings

### Homepage Layout
```
Header: Logo + Ryś icon + Age toggle + "Dla Rodziców"
─────────────────────────────────────────────────────
[Daily Question card — full width, prominent]

[Category chips — horizontal scroll]
🔭 Kosmos  🌿 Przyroda  🔬 Nauka  📱 Tech  🏛️ Historia ...

[Most Popular — 2-column grid, 4 cards]

[Recent additions — 2-column grid, 4 cards]

[Browse all → CTA]
─────────────────────────────────────────────────────
Bottom nav
```

### Category Page
- Category hero with full-width illustration
- Subcategory chips
- Grid of infographic cards (2-col mobile, 3-col tablet)

### Infographic Card (Browse Grid)
```
┌──────────────────────┐
│ [Category color bar] │  ← 8px top border in category color
│                      │
│  [Hero illustration] │  ← 60% of card height
│                      │
│  Topic title         │  ← 2 lines max, bold
│  ──────────────────  │
│  👁 2.4k  ❤ 341  🔖 │  ← View count, likes, save
└──────────────────────┘
```

- Aspect ratio: 4:5 (`aspect-[4/5]`)
- Corner radius: 16px (Under-13), 10px (13+)
- Hover/tap: scale 1.02, shadow lift, 150ms ease-out
- Always reserved height for image (prevents cumulative layout shift)

---

## 8. SEARCH UX

### Search Bar Design
- **Position**: Full-width at top of Search tab + in Homepage hero area
- **Placeholder text**: "Czego chcesz się dziś dowiedzieć?" (Under-13) / "Wyszukaj temat..." (13+)
- **Under-13**: Rounded pill shape (border-radius: 9999px), large (56px height), warm border
- **13+**: Rounded rectangle (border-radius: 12px), standard (48px height), cool border
- **Always visible**: Do not hide behind hamburger or secondary menu

### Autocomplete (Polish FTS)
- Trigger: after 2 characters
- Show: up to 6 suggestions maximum
- Source: existing topic titles + category names
- Under-13: each suggestion has an icon (category color + topic icon)
- 13+: text-only suggestions with category label
- Keyboard accessible (arrow keys + enter)
- Polish fuzzy matching: `pg_trgm` handles typos in Polish diacritics

### "Did You Mean?" (Polish typo correction)
Polish has complex diacritic patterns. Children frequently type without diacritics:
- `dinozaur` → matches `dinozaur` ✓
- `dinozar` → "Czy chodziło Ci o: dinozaur?"
- Implement via `pg_trgm` similarity threshold (0.3)

### No-Results State
Never "0 results". Always:
- Ryś in "curious" state (Under-13) / text-only (13+)
- "Jeszcze tego nie mamy!" + 3–4 related topic suggestions
- CTA to AI generation: "Zapytaj nas!"

### Search for Young Children (ages 6-8)
- Large touch targets on all suggestions (60px)
- Suggestions include illustrated topic thumbnails
- Voice search button (Phase 2 — critical for pre-readers)
- Auto-correct more aggressively (children make more typos)

---

## 9. ANIMATION & MOTION

### Philosophy: Functional > Decorative
Mayer & Moreno (2003): decorative animation reduces comprehension. Every animation must communicate something (state change, process, transition) or it should not exist.

### Animation System

| Type | Duration | Easing (Under-13) | Easing (13+) | Tailwind |
|------|----------|-------------------|--------------|---------|
| Page transition | 200ms | ease-in-out | ease-in-out | `duration-200` |
| Card hover scale | 150ms | ease-out | ease-out | `duration-150 ease-out` |
| Button press | 100ms | ease-in | ease-in | `duration-100` |
| Modal appear | 200ms | ease-out | ease-out | `duration-200 ease-out` |
| Infographic section reveal | 300–350ms | spring (slight overshoot) | ease-out | custom |
| Like button "pop" | 350ms | spring (bounce) | spring (light) | custom keyframe |
| Quiz correct feedback | 400ms | ease-out | ease-out | custom |
| Quiz wrong (shake) | 300ms | ease-in-out | ease-in-out | custom keyframe |
| Lottie mascot idle | 2000ms loop | — | — | Lottie |
| Lottie mascot reaction | 600–800ms | — | — | Lottie |

### Scroll-Triggered Infographic Reveals
Each section enters viewport → fades + slides up gently:
```javascript
// Intersection Observer for reveal
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('opacity-100', 'translate-y-0');
      entry.target.classList.remove('opacity-0', 'translate-y-4');
    }
  });
}, { threshold: 0.15, rootMargin: '0px 0px -40px 0px' });
```
Initial class: `opacity-0 translate-y-4 transition-all duration-300 ease-out`

### Animation Keyframes (Tailwind config)
```javascript
keyframes: {
  fadeUp: {
    '0%':   { opacity: '0', transform: 'translateY(16px)' },
    '100%': { opacity: '1', transform: 'translateY(0)' },
  },
  pop: {
    '0%':   { transform: 'scale(1)' },
    '50%':  { transform: 'scale(1.3)' },  // Under-13
    '100%': { transform: 'scale(1)' },
  },
  popLight: {
    '0%':   { transform: 'scale(1)' },
    '50%':  { transform: 'scale(1.12)' }, // 13+ (less bounce)
    '100%': { transform: 'scale(1)' },
  },
  shake: {
    '0%, 100%': { transform: 'translateX(0)' },
    '20%':      { transform: 'translateX(-4px)' },
    '40%':      { transform: 'translateX(4px)' },
    '60%':      { transform: 'translateX(-4px)' },
    '80%':      { transform: 'translateX(4px)' },
  },
},
```

### Prefers-Reduced-Motion (Non-Negotiable)
```css
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    transition-duration: 0.01ms !important;
  }
}
```
In Tailwind components: use `motion-safe:` / `motion-reduce:` variants.

### Lottie Integration
```tsx
// npm install @lottiefiles/react-lottie-player
import { Player } from '@lottiefiles/react-lottie-player';

<Player
  src="/animations/rys-curious.json"
  style={{ width: 120, height: 120 }}
  autoplay
  loop={false}
  keepLastFrame
/>
```

---

## 10. ACCESSIBILITY

### WCAG 2.1 Level AA — Required Minimum

| Criterion | Requirement | Implementation |
|-----------|-------------|----------------|
| 1.4.3 Contrast | 4.5:1 body text, 3:1 large text | Warm black `#1C1917` on cream `#FFFBF5` = 15.8:1 ✓ |
| 1.4.4 Resize text | 200% zoom without loss | Fluid layout, no fixed px heights |
| 1.1.1 Alt text | All images described | SVG `<title>` + `<desc>`; img `alt` |
| 2.1.1 Keyboard | All functionality via keyboard | Focus-visible on all interactive elements |
| 2.4.3 Focus order | Logical DOM order | Never use CSS to reorder visual vs. DOM order |
| 3.3.1 Error identification | Text description of errors | Never color-only error indicators |
| 2.5.5 Target size | 44×44px minimum | 60px (Under-13), 48px (13+) |

### Focus Styles (Tailwind resets these — override explicitly)
```css
*:focus-visible {
  outline: 3px solid #2563EB;
  outline-offset: 3px;
  border-radius: 4px;
}
```

### SVG Infographic Accessibility
```html
<svg role="img" aria-labelledby="ig-title ig-desc">
  <title id="ig-title">Dlaczego niebo jest niebieskie?</title>
  <desc id="ig-desc">Infografika wyjaśniająca rozpraszanie światła Rayleigha w 5 krokach...</desc>
  <g aria-hidden="true"><!-- decorative elements --></g>
</svg>
<!-- Full text content also in DOM for screen readers -->
<div class="sr-only">
  <!-- Full text version of infographic content -->
</div>
```

### Dyslexia-Friendly Mode
Toggle (Settings page, stored localStorage `wdk_dyslexia`):
```css
.dyslexia-mode body {
  font-family: 'Lexend', sans-serif; /* already default — Lexend is dyslexia-validated */
  letter-spacing: 0.05em;
  word-spacing: 0.1em;
  line-height: 2.1;
}
.dyslexia-mode p { max-width: 55ch; } /* slightly shorter lines */
```

### ADHD-Friendly Design Principles
- No auto-playing animations
- No blinking or flashing elements
- Scroll progress bar (answers "how long is this?")
- No time pressure on content (quizzes: optional, no countdown on infographics)
- No infinite scroll — paginated "load more"
- Clear visual chunking reduces "losing my place" anxiety
- Quiz completion reward (dopamine loop helps ADHD users finish content)

### Color Blindness
- Never use red/green only for error/success — pair with ✓ / ✗ icons + text
- Category labels: text + color, never color chip alone
- Use color-blind-safe palette: cerulean + amber + coral are distinguishable under all 8 major color vision deficiencies

---

## 11. TRUST SIGNALS

### Tier 1 (Visible immediately, no reading required)
- Clean design with zero advertising visual language
- No cookie consent banner (Plausible = no cookies)
- Age filtering selector prominent above the fold
- "Bez reklam" badge visible in header/footer

### "Bez Reklam" Badge Design
```html
<span class="inline-flex items-center gap-1 px-3 py-1 rounded-full
             bg-green-50 text-green-800 text-xs font-medium border border-green-200"
      title="Wytłumacz Dziecku nie wyświetla żadnych reklam. Nigdy.">
  <svg class="w-3 h-3" aria-hidden="true"><!-- shield icon --></svg>
  Bez reklam
</span>
```

### "Dla Rodziców" Section (in main nav, adult-register design)
Must contain:
- How the platform works (plain language)
- Privacy commitment (no tracking, no selling data, no ads)
- How content is reviewed (AI → human review → published)
- Age filtering explanation
- Child Protection Coordinator contact
- GDPR compliance statement
- How to report a concern

Design of this section: **Tier 3 (13+) palette** — adult-register, dense but clean typography, no cartoons. Parents read this seriously.

### Tier 2 (Visible within 30 seconds)
- Expert review badge on reviewed content
- Privacy policy link prominent (not buried in footer)
- Named organization / founder

### Tier 3 (For school/institutional evaluation)
- WCAG compliance statement
- GDPR compliance certificate (obtain)
- Ustawa o ochronie małoletnich compliance indicator
- MEiN listing (pursue)

---

## 12. ERROR & EMPTY STATES

### Philosophy: There Are No Errors, Only Moments
The platform takes responsibility. Never implies the child did something wrong.

### No Search Results
```
[Ryś in "curious" state — medium size]
"Hm, jeszcze tego nie mamy!"
"Ale może zainteresuje Cię coś podobnego?"
[3-4 related topic cards]
─────────
"Zadaj nam to pytanie → wyjaśnimy!"  [→ AI generation]
```

### Failed AI Generation (after 1 silent retry)
```
[Ryś in "thinking" state]
"Ups, coś zajęło za długo!"
"Nasz system działa wolniej niż zwykle.
Spróbuj za chwilę!"
[Button: "Spróbuj ponownie"]
[Or: "Przeglądaj podobne tematy →"]
```
Never show: "AI error", "generation failed", HTTP status codes.

### Loading States (Skeleton)
```html
<!-- Skeleton card during loading -->
<div class="aspect-[4/5] bg-stone-100 rounded-[16px] animate-pulse overflow-hidden">
  <div class="h-[60%] bg-stone-200"></div>
  <div class="p-4 space-y-2">
    <div class="h-5 bg-stone-200 rounded-full w-4/5"></div>
    <div class="h-5 bg-stone-200 rounded-full w-3/5"></div>
    <div class="h-4 bg-stone-200 rounded-full w-2/5 mt-2"></div>
  </div>
</div>
```

### AI Generation Loading (Time-Aware Messaging)
```
0–3s:   "Szukam odpowiedzi..."         [Ryś thinking]
3–6s:   "Układam infografikę..."       [Ryś thinking]
6–10s:  "Prawie gotowe!"               [Ryś excited]
10s+:   "To zajmuje trochę dłużej..."  [Ryś encouraging]
```

### Quiz Feedback
- Correct: green flash + ✓ + "Tak jest!" / "Świetnie!" + Ryś celebrating (Lottie)
- Wrong: gentle horizontal shake (300ms) + soft amber tint + "Prawie! Spróbuj jeszcze raz" — **never red X or harsh failure messaging**; Ryś encouraging

---

## 13. TAILWIND CSS IMPLEMENTATION

### Full Config Extension
```javascript
// tailwind.config.js
module.exports = {
  content: ['./app/**/*.{ts,tsx}', './components/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          teal:   '#1A9BBF',
          amber:  '#F59E0B',
          coral:  '#E8634A',
          cream:  '#FFFBF5',
        },
        category: {
          science:  '#0D9488',
          history:  '#B45309',
          tech:     '#2563EB',
          nature:   '#16A34A',
          body:     '#E11D48',
          society:  '#7C3AED',
          space:    '#1E40AF',
          emotions: '#EA580C',
          philosophy: '#4338CA',
        },
      },
      fontFamily: {
        display: ['Baloo 2', 'sans-serif'],
        body:    ['Lexend', 'sans-serif'],
        editorial: ['Inter', 'sans-serif'],
      },
      aspectRatio: {
        'infographic': '9 / 16',
        'card':        '4 / 5',
      },
      maxWidth: {
        'infographic': '450px',
        'content':     '680px',
      },
      animation: {
        'fade-up':  'fadeUp 300ms ease-out forwards',
        'pop':      'pop 350ms ease-out forwards',
        'pop-light':'popLight 250ms ease-out forwards',
        'shake':    'shake 300ms ease-in-out',
      },
      keyframes: {
        fadeUp:   { '0%': {opacity:'0',transform:'translateY(16px)'}, '100%': {opacity:'1',transform:'translateY(0)'} },
        pop:      { '0%': {transform:'scale(1)'}, '50%': {transform:'scale(1.3)'}, '100%': {transform:'scale(1)'} },
        popLight: { '0%': {transform:'scale(1)'}, '50%': {transform:'scale(1.12)'}, '100%': {transform:'scale(1)'} },
        shake:    { '0%,100%': {transform:'translateX(0)'}, '20%': {transform:'translateX(-4px)'}, '40%': {transform:'translateX(4px)'}, '60%': {transform:'translateX(-4px)'}, '80%': {transform:'translateX(4px)'} },
      },
    },
  },
  plugins: [],
}
```

### Core Component Classes
```html
<!-- Infographic card (browse grid) -->
<article class="aspect-[4/5] bg-white rounded-[16px] shadow-sm overflow-hidden
                transition-all duration-150 ease-out
                hover:scale-[1.02] hover:shadow-md
                cursor-pointer">

<!-- Portrait infographic container -->
<div class="w-full max-w-[450px] mx-auto bg-white rounded-[20px] shadow-md
            overflow-y-auto scroll-smooth">

<!-- Bottom nav -->
<nav class="fixed bottom-0 inset-x-0 bg-white border-t border-stone-200
            flex items-center justify-around h-[60px] z-50"
     style="padding-bottom: env(safe-area-inset-bottom)">

<!-- Age selector card -->
<button class="flex flex-col items-center gap-3 p-6 rounded-[20px] border-2
               transition-all duration-200
               hover:scale-[1.02] focus-visible:ring-4">

<!-- "Bez reklam" badge -->
<span class="inline-flex items-center gap-1 px-3 py-1 rounded-full
             bg-green-50 text-green-800 text-xs font-medium border border-green-200">
```

### Font Loading (Next.js)
```tsx
// app/layout.tsx
import { Baloo_2, Lexend, Inter } from 'next/font/google';

const baloo = Baloo_2({
  subsets: ['latin', 'latin-ext'], // latin-ext covers Polish diacritics
  weight: ['700', '800'],
  variable: '--font-display',
});
const lexend = Lexend({
  subsets: ['latin', 'latin-ext'],
  weight: ['400', '500'],
  variable: '--font-body',
});
const inter = Inter({
  subsets: ['latin', 'latin-ext'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-editorial',
});
```

---

## 14. ANTI-PATTERNS TO AVOID

### Navigation
- ❌ Hamburger menu as primary navigation (invisible to children under 9)
- ❌ Navigation deeper than 3 levels
- ❌ Icon-only navigation without text labels
- ❌ Navigation that changes location between pages

### Typography
- ❌ Justified text alignment
- ❌ Body text below 16px (18px minimum for Under-13)
- ❌ Decorative/script fonts for any readable text
- ❌ More than 2 font families on one screen
- ❌ Negative letter-spacing
- ❌ All-caps for body text
- ❌ Serif body text for users under 12

### Color & Visual
- ❌ Pure white `#FFFFFF` as page background
- ❌ Pure black `#000000` as text
- ❌ Color alone to convey meaning (always pair with icon/text)
- ❌ More than 5 competing colors on one screen
- ❌ Red/green only for error/success (color blindness)
- ❌ Text under 4.5:1 contrast ratio
- ❌ Generic flat/outline icons in child-facing content (Heroicons, Feather, etc.)
- ❌ Illustrations from mixed styles/sources (destroys visual coherence)
- ❌ American-style aggressive gamification (fire streaks, XP bars) — Polish parents classify this as a game, not education

### Animation
- ❌ Auto-playing looping animations while user is trying to read
- ❌ Animations that block interaction (over 300ms modal animations)
- ❌ Multiple simultaneous animations
- ❌ Parallax scrolling (vestibular disorder trigger; confuses scroll position)
- ❌ Ignoring `prefers-reduced-motion`
- ❌ Mascot triggering automatically mid-reading (the Clippy problem)

### Content & Layout
- ❌ Content wider than viewport (horizontal scrolling)
- ❌ Walls of text without visual chunking
- ❌ Countdown timers on informational content
- ❌ Harsh failure messaging on quiz wrong answers
- ❌ Infinite scroll (ADHD trap; lose-your-place problem)
- ❌ Interstitial screens between infographics
- ❌ Push notification prompt on first visit

---

*Research sources: Nielsen Norman Group (children's UX series 2002–2023), Richard Mayer "Multimedia Learning" (2009), Piaget developmental stages, Duolingo UX retrospectives, DK Find Out/Nat Geo Kids analysis, British Dyslexia Association, Polskie Towarzystwo Dysleksji, WCAG 2.1, Apple HIG 2024, Google Material Design 3, Common Sense Media 2023, Ofcom Children's Media 2023/2024*
