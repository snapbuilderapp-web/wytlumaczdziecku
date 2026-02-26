'use client'

interface ScrollProgressProps {
  /** 0–100 */
  value: number
}

export function ScrollProgress({ value }: ScrollProgressProps) {
  return (
    <div
      className="sticky top-0 left-0 right-0 z-10 h-[3px] bg-stone-100"
      role="progressbar"
      aria-valuenow={value}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-label="Postęp czytania"
    >
      <div
        className="h-full bg-[var(--brand-primary)] transition-all duration-100"
        style={{ width: `${value}%` }}
      />
    </div>
  )
}
