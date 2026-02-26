interface PageWrapperProps {
  children: React.ReactNode
  className?: string
  /** When true, removes bottom padding for pages that use the bottom tab bar */
  noBottomPad?: boolean
}

export function PageWrapper({ children, className = '', noBottomPad = false }: PageWrapperProps) {
  return (
    <div
      className={[
        'max-w-2xl mx-auto px-4 pt-4',
        noBottomPad ? 'pb-4' : 'pb-24', // pb-24 clears the bottom tab bar
        className,
      ].join(' ')}
    >
      {children}
    </div>
  )
}
