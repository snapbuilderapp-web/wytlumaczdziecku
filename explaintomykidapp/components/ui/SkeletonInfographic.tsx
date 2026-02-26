export function SkeletonInfographic() {
  return (
    <div
      className="w-full max-w-[450px] mx-auto animate-pulse"
      aria-hidden="true"
    >
      {/* Hero */}
      <div className="h-48 bg-stone-200 rounded-t-[var(--radius-card)]" />
      {/* Sections */}
      {[80, 120, 100, 90].map((h, i) => (
        <div key={i} className="px-6 py-5 border-t border-stone-100 space-y-2">
          <div className="h-5 bg-stone-200 rounded-full w-2/5" />
          <div className="space-y-1.5">
            {Array.from({ length: 3 }, (_, j) => (
              <div
                key={j}
                className="h-4 bg-stone-200 rounded-full"
                style={{ width: `${85 - j * 10}%` }}
              />
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}
