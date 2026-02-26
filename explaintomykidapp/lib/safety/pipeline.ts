import { passesRegexCheck } from './regex-blocklist'

export interface SafetyResult {
  safe: boolean
  reason?: string
}

/**
 * Runs the REGEX safety check.
 * Call this:
 * 1. On user-submitted topics (before sending to Gemini)
 * 2. On Gemini-generated content (after generation, before DB insert)
 *
 * Gemini SafetySettings (layer 2) are configured in lib/gemini/safety.ts
 * and applied automatically during generation.
 */
export function checkContent(text: string): SafetyResult {
  if (!passesRegexCheck(text)) {
    return { safe: false, reason: 'regex_blocklist' }
  }
  return { safe: true }
}
