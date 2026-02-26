import { forwardRef } from 'react'

type Variant = 'primary' | 'secondary' | 'ghost'
type Size    = 'sm' | 'md' | 'lg'

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant
  size?: Size
  loading?: boolean
  children: React.ReactNode
}

const variantClasses: Record<Variant, string> = {
  primary:   'bg-[var(--brand-primary)] text-white hover:opacity-90 active:opacity-80',
  secondary: 'bg-[var(--bg-card)] text-[var(--text-primary)] border border-stone-200 hover:bg-stone-50',
  ghost:     'text-[var(--text-primary)] hover:bg-stone-100',
}

const sizeClasses: Record<Size, string> = {
  sm: 'px-4 py-2 text-sm min-h-[2.5rem]',
  md: 'px-6 py-3 text-base min-h-[var(--touch-min)]',
  lg: 'px-8 py-4 text-lg min-h-[var(--touch-min)]',
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = 'primary', size = 'md', loading, children, className = '', disabled, ...props }, ref) => {
    return (
      <button
        ref={ref}
        disabled={disabled || loading}
        className={[
          'inline-flex items-center justify-center gap-2 rounded-[var(--radius-element)]',
          'font-medium transition-all duration-150',
          'focus-visible:ring-4 focus-visible:ring-blue-500/30',
          'disabled:opacity-50 disabled:cursor-not-allowed',
          variantClasses[variant],
          sizeClasses[size],
          className,
        ].join(' ')}
        {...props}
      >
        {loading && (
          <span
            className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin"
            aria-hidden
          />
        )}
        {children}
      </button>
    )
  }
)
Button.displayName = 'Button'
