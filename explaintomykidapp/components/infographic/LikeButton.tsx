'use client'

import { useState, useCallback } from 'react'
import { analytics } from '@/lib/analytics/plausible'

interface LikeButtonProps {
  slug: string
  infographicId: string
  initialCount: number
}

export function LikeButton({ slug, infographicId, initialCount }: LikeButtonProps) {
  const storageKey = `wdk_liked_${slug}`

  const [liked, setLiked] = useState(() => {
    try {
      return localStorage.getItem(storageKey) === '1'
    } catch {
      return false
    }
  })
  const [count, setCount] = useState(initialCount)
  const [animating, setAnimating] = useState(false)

  const handleLike = useCallback(async () => {
    if (liked) return
    setLiked(true)
    setCount((c) => c + 1)
    setAnimating(true)
    setTimeout(() => setAnimating(false), 400)

    try {
      localStorage.setItem(storageKey, '1')
    } catch {}

    analytics.like(slug)

    await fetch('/api/like', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ infographic_id: infographicId }),
    }).catch(() => {
      // Silently fail — like is already shown optimistically
    })
  }, [liked, slug, infographicId, storageKey])

  return (
    <button
      onClick={handleLike}
      disabled={liked}
      aria-label={liked ? `Polubiłeś/aś. ${count} polubień` : `Polub. ${count} polubień`}
      aria-pressed={liked}
      className={[
        'flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium',
        'transition-all duration-150',
        'focus-visible:ring-4 focus-visible:ring-red-500/30',
        liked
          ? 'text-red-500 bg-red-50'
          : 'text-[var(--text-secondary)] hover:text-red-400 hover:bg-red-50/60',
        animating ? 'animate-pop' : '',
      ].join(' ')}
    >
      <span aria-hidden="true" className={animating ? 'animate-pop' : ''}>
        {liked ? '❤️' : '🤍'}
      </span>
      <span>{count.toLocaleString('pl-PL')}</span>
    </button>
  )
}
