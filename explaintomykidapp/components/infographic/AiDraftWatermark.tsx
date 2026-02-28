/**
 * "AI Draft — Under Review" watermark.
 * Required by EU AI Act for AI-generated educational content before human review.
 * Display on all infographics where ai_draft = true AND expert_reviewed = false.
 */
export function AiDraftWatermark({ lang = 'pl' }: { lang?: 'pl' | 'en' }) {
  const label = lang === 'en'
    ? 'AI-generated content, pending human review'
    : 'Treść wygenerowana przez AI, oczekuje na weryfikację człowieka'
  const text = lang === 'en'
    ? 'AI Draft — pending expert review'
    : 'Wersja robocza AI — oczekuje na weryfikację eksperta'

  return (
    <div
      className="flex items-center gap-2 px-4 py-2 mx-4 mb-2
                 bg-amber-50 border border-amber-200 rounded-lg text-amber-800 text-xs"
      role="note"
      aria-label={label}
    >
      <svg className="w-3.5 h-3.5 shrink-0" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
        <path
          fillRule="evenodd"
          d="M9.401 3.003c1.155-2 4.043-2 5.197 0l7.355 12.748c1.154 2-.29 4.5-2.599 4.5H4.645c-2.309 0-3.752-2.5-2.598-4.5L9.4 3.003zM12 8.25a.75.75 0 01.75.75v3.75a.75.75 0 01-1.5 0V9a.75.75 0 01.75-.75zm0 8.25a.75.75 0 100-1.5.75.75 0 000 1.5z"
          clipRule="evenodd"
        />
      </svg>
      <span>{text}</span>
    </div>
  )
}
