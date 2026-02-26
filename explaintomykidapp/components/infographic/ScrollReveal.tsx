'use client'

import { useEffect, useRef } from 'react'

interface ScrollRevealProps {
  children: React.ReactNode
  className?: string
}

/**
 * Wraps content in an IntersectionObserver-triggered reveal.
 * Fades + slides up when entering viewport.
 * Respects prefers-reduced-motion via CSS (motion-reduce: classes).
 */
export function ScrollReveal({ children, className = '' }: ScrollRevealProps) {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.classList.add('opacity-100', 'translate-y-0')
          el.classList.remove('opacity-0', 'translate-y-4')
          observer.unobserve(el)
        }
      },
      { threshold: 0.15, rootMargin: '0px 0px -40px 0px' }
    )

    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  return (
    <div
      ref={ref}
      className={[
        // Start hidden + offset
        'opacity-0 translate-y-4',
        // Transition
        'transition-all duration-300 ease-out',
        // Respect reduced motion
        'motion-reduce:opacity-100 motion-reduce:translate-y-0 motion-reduce:transition-none',
        className,
      ].join(' ')}
    >
      {children}
    </div>
  )
}
