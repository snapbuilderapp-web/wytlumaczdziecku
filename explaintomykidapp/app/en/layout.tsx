import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: {
    default: 'Explain to My Kid — Educational Infographics for Children',
    template: '%s | Explain to My Kid',
  },
  description:
    '1000+ topics explained for children through infographics. Safe, ad-free, age-appropriate.',
  openGraph: {
    siteName: 'Explain to My Kid',
    locale: 'en_US',
    type: 'website',
  },
}

export default function EnglishLayout({ children }: { children: React.ReactNode }) {
  return children
}
