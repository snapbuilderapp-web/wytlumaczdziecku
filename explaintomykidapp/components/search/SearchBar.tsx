'use client'

import { useState, useRef, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { useAgeMode } from '@/hooks/useAgeMode'
import { analytics } from '@/lib/analytics/plausible'
import type { AutocompleteResult } from '@/types'

interface SearchBarProps {
  initialValue?: string
  lang?: 'pl' | 'en'
}

export function SearchBar({ initialValue = '', lang = 'pl' }: SearchBarProps) {
  const { ageMode } = useAgeMode()
  const router = useRouter()
  const [query, setQuery] = useState(initialValue)
  const [suggestions, setSuggestions] = useState<AutocompleteResult[]>([])
  const [open, setOpen] = useState(false)
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  const isYounger = ageMode === 'under13'
  const isEnglish = lang === 'en'

  const fetchSuggestions = useCallback(async (q: string) => {
    if (q.length < 2) { setSuggestions([]); return }
    const res = await fetch(`/api/autocomplete?q=${encodeURIComponent(q)}&lang=${lang}`)
    const data = await res.json()
    setSuggestions(data.suggestions ?? [])
  }, [lang])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const q = e.target.value
    setQuery(q)
    setOpen(true)
    if (debounceRef.current) clearTimeout(debounceRef.current)
    debounceRef.current = setTimeout(() => fetchSuggestions(q), 200)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!query.trim()) return
    setOpen(false)
    analytics.search(query)
    const searchPath = isEnglish ? '/en/search' : '/szukaj'
    router.push(`${searchPath}?q=${encodeURIComponent(query.trim())}`)
  }

  const handleSuggestionClick = (s: AutocompleteResult) => {
    setOpen(false)
    const href = isEnglish && s.slug_en ? `/en/${s.slug_en}` : `/${s.slug}`
    router.push(href)
  }

  const placeholder = isEnglish
    ? (isYounger ? 'What do you want to learn today?' : 'Search topics...')
    : (isYounger ? 'Czego chcesz się dziś dowiedzieć?' : 'Wyszukaj temat...')

  const labelText = isEnglish ? 'Search topics' : 'Szukaj tematu'
  const autocompleteLabel = isEnglish ? 'Search suggestions' : 'Podpowiedzi wyszukiwania'

  return (
    <div className="relative w-full">
      <form onSubmit={handleSubmit} role="search">
        <label htmlFor="search-input" className="sr-only">
          {labelText}
        </label>
        <div className="relative">
          <span
            className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--text-secondary)]"
            aria-hidden="true"
          >
            🔍
          </span>
          <input
            ref={inputRef}
            id="search-input"
            type="search"
            value={query}
            onChange={handleChange}
            onFocus={() => query.length >= 2 && setOpen(true)}
            onBlur={() => setTimeout(() => setOpen(false), 150)}
            placeholder={placeholder}
            autoComplete="off"
            className={[
              'w-full pl-10 pr-4 py-3 bg-[var(--bg-card)] text-[var(--text-primary)]',
              'border-2 border-stone-200 transition-colors duration-150',
              'placeholder:text-[var(--text-secondary)]',
              'focus:outline-none focus:border-[var(--brand-primary)]',
              isYounger
                ? 'rounded-full text-base'
                : 'rounded-xl text-sm',
            ].join(' ')}
          />
        </div>
      </form>

      {/* Autocomplete dropdown */}
      {open && suggestions.length > 0 && (
        <ul
          className="absolute top-full left-0 right-0 mt-1 bg-[var(--bg-card)] border border-stone-200
                     rounded-xl shadow-lg z-20 overflow-hidden"
          role="listbox"
          aria-label={autocompleteLabel}
        >
          {suggestions.map((s) => (
            <li key={s.slug} role="option" aria-selected="false">
              <button
                type="button"
                onClick={() => handleSuggestionClick(s)}
                className="w-full text-left px-4 py-3 text-sm text-[var(--text-primary)]
                           hover:bg-stone-50 transition-colors flex items-center gap-2"
              >
                <span className="text-[var(--text-secondary)]" aria-hidden="true">🔍</span>
                {isEnglish ? (s.title_en ?? s.title_pl) : s.title_pl}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
