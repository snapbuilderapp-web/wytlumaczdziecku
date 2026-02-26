import Link from 'next/link'
import { Rys } from '@/components/mascot/Rys'
import type { DailyQuestion } from '@/types'

interface DailyQuestionProps {
  question: DailyQuestion | null
}

export function DailyQuestion({ question }: DailyQuestionProps) {
  if (!question) return null

  const { infographics: ig } = question

  return (
    <Link
      href={`/${ig.slug}`}
      className="block p-5 bg-[var(--brand-primary)] text-white rounded-[var(--radius-card)]
                 shadow-md hover:shadow-lg transition-all duration-150 hover:scale-[1.01]
                 focus-visible:ring-4 focus-visible:ring-white/50"
      aria-label={`Pytanie dnia: ${ig.title_pl}`}
    >
      <div className="flex items-start gap-4">
        <Rys state="curious" size={64} className="shrink-0" />
        <div>
          <p className="text-white/80 text-xs font-medium uppercase tracking-wide mb-1">
            Pytanie dnia
          </p>
          <h2 className="font-[family-name:var(--age-font-display)] font-bold text-xl leading-snug">
            {ig.title_pl}
          </h2>
          <p className="mt-2 text-white/80 text-sm">
            Dowiedz się więcej →
          </p>
        </div>
      </div>
    </Link>
  )
}
