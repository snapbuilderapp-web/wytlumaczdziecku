export function SkeletonCard() {
  return (
    <div
      className="aspect-[4/5] bg-stone-100 rounded-[var(--radius-card)] overflow-hidden animate-pulse"
      aria-hidden="true"
    >
      {/* Hero image placeholder */}
      <div className="h-[60%] bg-stone-200" />
      {/* Content placeholder */}
      <div className="p-4 space-y-2">
        <div className="h-5 bg-stone-200 rounded-full w-4/5" />
        <div className="h-5 bg-stone-200 rounded-full w-3/5" />
        <div className="flex gap-2 mt-3">
          <div className="h-4 bg-stone-200 rounded-full w-10" />
          <div className="h-4 bg-stone-200 rounded-full w-10" />
        </div>
      </div>
    </div>
  )
}

export function SkeletonCardGrid({ count = 6 }: { count?: number }) {
  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
      {Array.from({ length: count }, (_, i) => (
        <SkeletonCard key={i} />
      ))}
    </div>
  )
}
