import { z } from 'zod'
import { generationModel } from './client'
import { strictSafetySettings } from './safety'
import { buildInfographicPrompt, buildQuizPrompt } from './prompts'
import { checkContent } from '@/lib/safety/pipeline'
import type { InfographicContent, QuizQuestion } from '@/types'

// ============================================================
// Zod schemas for runtime validation of Gemini output
// ============================================================

const SectionSchema = z.object({
  type: z.enum(['hero', 'why', 'how', 'example', 'facts', 'quiz_cta']),
  heading: z.string().min(1),
  content: z.string().default(''),
  visual_description: z.string().optional(),
  illustration_url: z.string().optional(),
  key_points: z.array(z.string()).optional(),
  facts: z.array(z.string()).optional(),
})

const InfographicContentSchema = z.object({
  title: z.string().min(1).max(120),
  hook: z.string().min(1),
  sections: z.array(SectionSchema).min(3).max(7),
  key_facts: z.array(z.string()).min(1).max(5),
  conversation_starters: z.array(z.string()).min(1).max(5),
  tags: z.array(z.string()).min(1).max(10),
  emotional_weight: z.enum(['light', 'medium', 'heavy']),
  reading_level: z.enum(['easy', 'standard', 'advanced']),
  suggested_category: z
    .enum(['science', 'history', 'tech', 'nature', 'body', 'society', 'space', 'emotions', 'philosophy'])
    .optional(),
})

const QuizOptionSchema = z.object({
  text: z.string().min(1),
  correct: z.boolean(),
})

const QuizQuestionSchema = z.object({
  question: z.string().min(1),
  options: z.array(QuizOptionSchema).length(4),
  explanation: z.string().min(1),
})

// ============================================================
// Generation functions
// ============================================================

export async function generateInfographic(
  topic: string,
  ageGroup: 'under13' | '13plus'
): Promise<InfographicContent> {
  // Layer 1: REGEX safety check on the topic
  const topicCheck = checkContent(topic)
  if (!topicCheck.safe) {
    throw new Error(`Topic blocked by safety filter: ${topicCheck.reason}`)
  }

  const prompt = buildInfographicPrompt(topic, ageGroup)

  const result = await generationModel.generateContent({
    contents: [{ role: 'user', parts: [{ text: prompt }] }],
    safetySettings: strictSafetySettings,
    generationConfig: {
      temperature: 0.7,
      topP: 0.9,
      maxOutputTokens: 2048,
      responseMimeType: 'application/json',
    },
  })

  const text = result.response.text()

  // Parse and validate
  let parsed: unknown
  try {
    parsed = JSON.parse(text)
  } catch {
    throw new Error(`Gemini returned invalid JSON: ${text.slice(0, 200)}`)
  }

  const validated = InfographicContentSchema.parse(parsed)

  // Layer 3: REGEX check on generated content
  const contentCheck = checkContent(JSON.stringify(validated))
  if (!contentCheck.safe) {
    throw new Error(`Generated content blocked by safety filter: ${contentCheck.reason}`)
  }

  return validated as InfographicContent
}

/** Generates both age groups in parallel — always generate together */
export async function generateBothAgeGroups(topic: string): Promise<{
  under13: InfographicContent
  teen: InfographicContent
}> {
  const [under13, teen] = await Promise.all([
    generateInfographic(topic, 'under13'),
    generateInfographic(topic, '13plus'),
  ])
  return { under13, teen }
}

export async function generateQuiz(
  topic: string,
  content: InfographicContent,
  ageGroup: 'under13' | '13plus'
): Promise<Omit<QuizQuestion, 'id' | 'infographic_id' | 'display_order'>[]> {
  const contentSummary = content.sections
    .map((s) => `${s.heading}: ${s.content}`)
    .join('\n')

  const prompt = buildQuizPrompt(topic, contentSummary, ageGroup)

  const result = await generationModel.generateContent({
    contents: [{ role: 'user', parts: [{ text: prompt }] }],
    safetySettings: strictSafetySettings,
    generationConfig: {
      temperature: 0.5,
      topP: 0.9,
      maxOutputTokens: 1024,
      responseMimeType: 'application/json',
    },
  })

  const text = result.response.text()

  let parsed: unknown
  try {
    parsed = JSON.parse(text)
  } catch {
    throw new Error(`Gemini returned invalid JSON for quiz: ${text.slice(0, 200)}`)
  }

  const validated = z.array(QuizQuestionSchema).min(1).max(5).parse(parsed)

  return validated.map((q, i) => ({
    age_group: ageGroup,
    question_pl: q.question,
    options: q.options,
    explanation_pl: q.explanation,
    display_order: i,
  }))
}
