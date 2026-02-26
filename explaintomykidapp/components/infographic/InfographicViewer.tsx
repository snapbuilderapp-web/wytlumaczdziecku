'use client'

import { useRef } from 'react'
import { useAgeMode } from '@/hooks/useAgeMode'
import { useScrollProgress } from '@/hooks/useScrollProgress'
import { ScrollReveal } from './ScrollReveal'
import { ScrollProgress } from './ScrollProgress'
import { InfographicSection } from './InfographicSection'
import { LikeButton } from './LikeButton'
import { ConversationStarters } from './ConversationStarters'
import { AiDraftWatermark } from './AiDraftWatermark'
import { HeroImagePanel } from './HeroImagePanel'
import { Rys } from '@/components/mascot/Rys'
import type { InfographicContent } from '@/types'

interface InfographicViewerProps {
  slug: string
  infographicId: string
  title: string
  heroImageSrc: string
  contentUnder13: InfographicContent | null
  content13plus: InfographicContent | null
  likeCount: number
  aiDraft: boolean
  expertReviewed: boolean
}

export function InfographicViewer({
  slug,
  infographicId,
  title,
  heroImageSrc,
  contentUnder13,
  content13plus,
  likeCount,
  aiDraft,
  expertReviewed,
}: InfographicViewerProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const { ageMode } = useAgeMode()
  const progress = useScrollProgress(containerRef)

  const content = ageMode === '13plus' ? (content13plus ?? contentUnder13) : (contentUnder13 ?? content13plus)

  if (!content) {
    return (
      <div className="infographic-container p-8 text-center">
        <Rys state="thinking" size={80} className="mx-auto mb-4" />
        <p className="text-[var(--text-secondary)]">Brak treści dla tej grupy wiekowej.</p>
      </div>
    )
  }

  return (
    <article
      ref={containerRef}
      className="infographic-container"
      aria-label={content.title}
    >
      {/* Scroll progress bar */}
      <ScrollProgress value={progress} />

      {/* Hero infographic image */}
      <div className="px-4 pt-4">
        <HeroImagePanel
          src={heroImageSrc}
          alt={`Infografika: ${title}`}
          downloadName={slug}
        />
      </div>

      {/* AI draft notice */}
      {aiDraft && !expertReviewed && (
        <div className="pt-3">
          <AiDraftWatermark />
        </div>
      )}

      {/* Sections — each revealed on scroll */}
      {content.sections.map((section, i) => (
        <ScrollReveal key={`${section.type}-${i}`}>
          <InfographicSection
            section={section}
            ageMode={ageMode}
            isFirst={i === 0}
            isLast={i === content.sections.length - 1}
          />
        </ScrollReveal>
      ))}

      {/* Parent conversation starters */}
      <ScrollReveal>
        <ConversationStarters starters={content.conversation_starters} />
      </ScrollReveal>

      {/* Footer: like + share */}
      <ScrollReveal>
        <div className="flex items-center justify-between px-6 py-4 border-t border-stone-100">
          <LikeButton
            slug={slug}
            infographicId={infographicId}
            initialCount={likeCount}
          />
          <Rys
            state={progress >= 90 ? 'celebrating' : 'encouraging'}
            size={ageMode === 'under13' ? 64 : 32}
          />
        </div>
      </ScrollReveal>
    </article>
  )
}
