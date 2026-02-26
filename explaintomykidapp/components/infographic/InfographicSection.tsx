import { Rys } from '@/components/mascot/Rys'
import type { InfographicSection as Section, AgeMode } from '@/types'

interface InfographicSectionProps {
  section: Section
  ageMode: AgeMode
  isFirst?: boolean
  isLast?: boolean
}

const SECTION_ACCENTS: Record<string, string> = {
  hero:    'bg-[var(--brand-primary)]',
  why:     'bg-amber-400',
  how:     'bg-brand-teal',
  example: 'bg-amber-200',
  facts:   'bg-[var(--brand-coral)]',
  quiz_cta:'bg-[var(--brand-primary)]',
}

export function InfographicSection({ section, ageMode, isFirst, isLast }: InfographicSectionProps) {
  const isHero = section.type === 'hero'
  const isFacts = section.type === 'facts'
  const isExample = section.type === 'example'

  return (
    <section
      className={[
        'px-6 py-5',
        !isFirst ? 'border-t border-stone-100' : '',
      ].join(' ')}
      aria-labelledby={`section-${section.type}`}
    >
      {/* Section heading with color accent */}
      {!isHero && (
        <h2
          id={`section-${section.type}`}
          className={[
            'font-[family-name:var(--age-font-display)] font-bold mb-3',
            ageMode === 'under13' ? 'text-xl' : 'text-lg',
            'text-[var(--text-primary)]',
          ].join(' ')}
        >
          {section.heading}
        </h2>
      )}

      {/* Hero section */}
      {isHero && (
        <div className="text-center pb-2">
          <Rys
            state="curious"
            size={ageMode === 'under13' ? 100 : 48}
            className="mx-auto mb-4"
          />
          <h1
            id={`section-${section.type}`}
            className={[
              'font-[family-name:var(--age-font-display)] font-bold leading-tight mb-2',
              ageMode === 'under13' ? 'text-2xl' : 'text-xl',
              'text-[var(--text-primary)]',
            ].join(' ')}
          >
            {section.heading || section.content}
          </h1>
        </div>
      )}

      {/* Body content */}
      {!isHero && section.content && (
        <p className="text-[var(--text-primary)] leading-relaxed">
          {section.content}
        </p>
      )}

      {/* Key points (for 'how' section) */}
      {section.key_points && section.key_points.length > 0 && (
        <ul className="mt-3 space-y-2">
          {section.key_points.map((point, i) => (
            <li key={i} className="flex items-start gap-2">
              <span
                className={`w-5 h-5 shrink-0 rounded-full text-white text-xs flex items-center justify-center mt-0.5 font-bold ${SECTION_ACCENTS['how']}`}
                aria-hidden="true"
              >
                {i + 1}
              </span>
              <span className="text-[var(--text-primary)]">{point}</span>
            </li>
          ))}
        </ul>
      )}

      {/* Facts (for 'facts' section) */}
      {isFacts && section.facts && section.facts.length > 0 && (
        <div className="mt-3 space-y-2">
          {section.facts.map((fact, i) => (
            <div
              key={i}
              className="flex items-start gap-3 p-3 bg-amber-50 rounded-xl"
            >
              <span className="text-lg shrink-0" aria-hidden="true">⭐</span>
              <p className="text-sm text-[var(--text-primary)]">{fact}</p>
            </div>
          ))}
          <div className="flex justify-center mt-4">
            <Rys state="excited" size={ageMode === 'under13' ? 80 : 40} />
          </div>
        </div>
      )}

      {/* Example analogy box */}
      {isExample && (
        <div className="mt-3 p-4 bg-amber-50 border-l-4 border-amber-400 rounded-r-xl">
          <p className="text-sm font-medium text-amber-900">
            {section.content}
          </p>
        </div>
      )}
    </section>
  )
}
