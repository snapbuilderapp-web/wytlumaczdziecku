import type { Metadata } from 'next'
import { Baloo_2, Lexend, Inter } from 'next/font/google'
import { AgeModeProvider } from '@/components/age/AgeModeProvider'
import './globals.css'

const baloo = Baloo_2({
  subsets: ['latin', 'latin-ext'],
  weight: ['700', '800'],
  variable: '--font-baloo',
  display: 'swap',
})

const lexend = Lexend({
  subsets: ['latin', 'latin-ext'],
  weight: ['400', '500'],
  variable: '--font-lexend',
  display: 'swap',
})

const inter = Inter({
  subsets: ['latin', 'latin-ext'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-inter',
  display: 'swap',
})

export const metadata: Metadata = {
  title: {
    default: 'Wytłumacz Dziecku — Infografiki edukacyjne dla dzieci',
    template: '%s | Wytłumacz Dziecku',
  },
  description:
    'Ponad 1000 tematów wyjaśnionych dla dzieci w formie infografik. Bezpiecznie, bez reklam, dopasowane do wieku.',
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL ?? 'https://wytlumaczdziecku.pl'
  ),
  openGraph: {
    siteName: 'Wytłumacz Dziecku',
    locale: 'pl_PL',
    type: 'website',
  },
  robots: {
    index: true,
    follow: true,
  },
}

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="pl" suppressHydrationWarning>
      <body
        className={`${baloo.variable} ${lexend.variable} ${inter.variable}`}
      >
        {/*
          Age-mode no-flash script: reads localStorage before first paint.
          Must be the first child of <body> to prevent style flash.
          'wdk_age' === '13plus' → adds .age-13plus class to <html>
        */}
        <script
          dangerouslySetInnerHTML={{
            __html: `try{if(localStorage.getItem('wdk_age')==='13plus')document.documentElement.classList.add('age-13plus')}catch(e){}`,
          }}
        />
        <AgeModeProvider>
          {children}
        </AgeModeProvider>
      </body>
    </html>
  )
}
