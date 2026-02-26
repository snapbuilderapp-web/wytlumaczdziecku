'use client'

import { useState } from 'react'

interface ConversationStartersProps {
  starters: string[]
}

export function ConversationStarters({ starters }: ConversationStartersProps) {
  const [open, setOpen] = useState(false)

  if (!starters.length) return null

  return (
    <section className="px-6 py-4 border-t border-stone-100">
      <button
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        className="flex items-center justify-between w-full text-left
                   text-sm font-medium text-[var(--text-secondary)]
                   hover:text-[var(--text-primary)] transition-colors"
      >
        <span className="flex items-center gap-2">
          <span aria-hidden="true">💬</span>
          Dla rodziców: tematy do rozmowy
        </span>
        <svg
          className={`w-4 h-4 transition-transform duration-200 ${open ? 'rotate-180' : ''}`}
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          aria-hidden="true"
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="m19 9-7 7-7-7" />
        </svg>
      </button>

      {open && (
        <ul className="mt-3 space-y-2" aria-label="Tematy do rozmowy z dzieckiem">
          {starters.map((starter, i) => (
            <li
              key={i}
              className="flex items-start gap-2 text-sm text-[var(--text-secondary)]"
            >
              <span className="mt-0.5 text-[var(--brand-primary)] shrink-0" aria-hidden="true">→</span>
              <span>{starter}</span>
            </li>
          ))}
        </ul>
      )}
    </section>
  )
}
