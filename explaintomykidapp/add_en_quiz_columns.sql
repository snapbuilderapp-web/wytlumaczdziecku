ALTER TABLE quiz_questions 
ADD COLUMN IF NOT EXISTS question_en text,
ADD COLUMN IF NOT EXISTS explanation_en text,
ADD COLUMN IF NOT EXISTS options_en jsonb;
