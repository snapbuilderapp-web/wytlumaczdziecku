/**
 * Plausible Analytics wrapper.
 * Uses the script tag approach (window.plausible) — no npm package needed.
 * GDPR-compliant: no cookies, no consent banner required.
 *
 * Add the script to app/layout.tsx:
 * <Script defer data-domain={process.env.NEXT_PUBLIC_PLAUSIBLE_DOMAIN} src="https://plausible.io/js/script.js" />
 */

declare global {
  interface Window {
    plausible?: (
      event: string,
      options?: { props?: Record<string, string | number | boolean> }
    ) => void
  }
}

export function trackEvent(
  name: string,
  props?: Record<string, string | number | boolean>
) {
  if (typeof window === 'undefined') return
  window.plausible?.(name, props ? { props } : undefined)
}

// Typed event helpers
export const analytics = {
  infographicView:     (slug: string, category: string, ageGroup: string) =>
    trackEvent('infographic_view', { slug, category, age_group: ageGroup }),

  infographicComplete: (slug: string) =>
    trackEvent('infographic_complete', { slug }),

  like:                (slug: string) =>
    trackEvent('like', { slug }),

  search:              (q: string) =>
    trackEvent('search', { q: q.slice(0, 50) }),

  ageSelected:         (mode: string) =>
    trackEvent('age_selected', { mode }),

  quizStarted:         (slug: string) =>
    trackEvent('quiz_started', { slug }),

  quizCompleted:       (slug: string, score: number) =>
    trackEvent('quiz_completed', { slug, score }),

  share:               (slug: string, platform: string) =>
    trackEvent('share', { slug, platform }),
}
