/**
 * Static SVG fallback for Ryś mascot.
 * Used when prefers-reduced-motion is active or Lottie isn't loaded yet.
 * Placeholder until real mascot SVGs are commissioned.
 */

interface RysStaticProps {
  size?: number
  className?: string
}

export function RysStatic({ size = 80, className = '' }: RysStaticProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 80 80"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-label="Ryś — maskotka Wytłumacz Dziecku"
      role="img"
      className={className}
    >
      {/* Placeholder shape — replace with real Ryś SVG after commission */}
      <circle cx="40" cy="40" r="36" fill="#FFFBF5" stroke="#C2410C" strokeWidth="2" />
      {/* Ear tufts */}
      <path d="M22 20 L28 8 L34 20" fill="#C2410C" />
      <path d="M46 20 L52 8 L58 20" fill="#C2410C" />
      {/* Face */}
      <circle cx="40" cy="42" r="18" fill="#F59E0B" />
      {/* Eyes */}
      <circle cx="34" cy="38" r="4" fill="#1C1917" />
      <circle cx="46" cy="38" r="4" fill="#1C1917" />
      <circle cx="35" cy="37" r="1.5" fill="white" />
      <circle cx="47" cy="37" r="1.5" fill="white" />
      {/* Nose */}
      <ellipse cx="40" cy="44" rx="3" ry="2" fill="#E8634A" />
      {/* Smile */}
      <path d="M35 48 Q40 52 45 48" stroke="#1C1917" strokeWidth="1.5" fill="none" strokeLinecap="round" />
      {/* Spots */}
      <circle cx="30" cy="46" r="2" fill="#B45309" opacity="0.4" />
      <circle cx="50" cy="46" r="2" fill="#B45309" opacity="0.4" />
    </svg>
  )
}
