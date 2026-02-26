// ============================================================
// Shared TypeScript types — mirrors the database schema
// ============================================================

export type AgeMode = 'under13' | '13plus'

export type AgeGroup = 'under13' | '13plus' | 'both'

export type InfographicStatus =
  | 'draft'
  | 'in_review'
  | 'approved'
  | 'published'
  | 'rejected'

export type EmotionalWeight = 'light' | 'medium' | 'heavy'

export type ReadingLevel = 'easy' | 'standard' | 'advanced'

export type CategoryId =
  | 'science'
  | 'history'
  | 'tech'
  | 'nature'
  | 'body'
  | 'society'
  | 'space'
  | 'emotions'
  | 'philosophy'

// ============================================================
// Infographic content structures (stored as JSONB)
// ============================================================

export type SectionType = 'hero' | 'why' | 'how' | 'example' | 'facts' | 'quiz_cta'

export interface InfographicSection {
  type: SectionType
  heading: string
  content: string
  visual_description?: string
  illustration_url?: string
  key_points?: string[]
  facts?: string[]
}

export interface InfographicContent {
  title: string
  hook: string
  sections: InfographicSection[]
  key_facts: string[]
  conversation_starters: string[]
  tags: string[]
  emotional_weight: EmotionalWeight
  reading_level: ReadingLevel
  suggested_category?: CategoryId
}

// ============================================================
// Database row types (from Supabase)
// ============================================================

export interface Category {
  id: CategoryId
  name_pl: string
  name_en: string
  color_hex: string
  icon_emoji: string
  description_pl: string | null
  display_order: number
}

export interface Infographic {
  id: string
  slug: string
  title_pl: string
  title_en: string | null
  category_id: CategoryId
  age_group: AgeGroup
  content_under13: InfographicContent | null
  content_13plus: InfographicContent | null
  hero_image_url: string | null
  status: InfographicStatus
  view_count: number
  like_count: number
  emotional_weight: EmotionalWeight
  reading_level: ReadingLevel
  tags: string[]
  ai_draft: boolean
  expert_reviewed: boolean
  expert_reviewer_name: string | null
  created_at: string
  updated_at: string
  published_at: string | null
  // joined
  categories?: Category
}

// Lighter version for grid/card display
export interface InfographicCard {
  id: string
  slug: string
  title_pl: string
  category_id: CategoryId
  hero_image_url: string | null
  like_count: number
  view_count: number
  reading_level: ReadingLevel
  emotional_weight: EmotionalWeight
  ai_draft: boolean
  expert_reviewed: boolean
}

export interface QuizOption {
  text: string
  correct: boolean
}

export interface QuizQuestion {
  id: string
  infographic_id: string
  age_group: AgeGroup
  question_pl: string
  options: QuizOption[]
  explanation_pl: string
  display_order: number
}

export interface DailyQuestion {
  id: string
  infographic_id: string
  featured_date: string
  infographics: Pick<Infographic, 'slug' | 'title_pl' | 'hero_image_url' | 'category_id'>
}

// ============================================================
// Search / API response types
// ============================================================

export interface SearchParams {
  q?: string
  age?: AgeMode
  category?: CategoryId
  sort?: 'recent' | 'popular' | 'liked'
  page?: number
}

export interface SearchResult {
  results: InfographicCard[]
  page: number
  limit: number
  total?: number
}

export interface AutocompleteResult {
  slug: string
  title_pl: string
  category_id: CategoryId
}

// ============================================================
// Generation types
// ============================================================

export interface GenerateRequest {
  topic: string
}

export interface GenerateResult {
  infographic_id: string
  slug: string
}
