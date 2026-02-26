/**
 * REGEX-based content safety layer.
 * First line of defense — runs before Gemini API call.
 * Patterns test against lowercased, raw input.
 *
 * IMPORTANT: These patterns are for topic validation, not for replacing
 * full content moderation. Gemini SafetySettings are the second layer.
 * Human review is the third layer.
 */

const VIOLENCE_PATTERNS: RegExp[] = [
  /\b(zabij|zamorduj|zamordować|morderstwo|okalecz|tortury?)\b/i,
  /\b(terrory|terrorys|bombę|bomby|zamach)\b/i,
]

const SEXUAL_PATTERNS: RegExp[] = [
  /\b(pornografi|treści? erotyczn|nagie dzieci|pedofil)\b/i,
]

const HATE_PATTERNS: RegExp[] = [
  /\b(nienawidz[ęę] (żydów|romów|czarnoskórych|arabów|muzułmanów))\b/i,
  /\b(faszyści?|nazist|hitlerow)\b/i,
]

const DRUG_PATTERNS: RegExp[] = [
  /\b(jak zrobić narkotyk|jak wyhodować marihuanę|jak wziąć heroinę)\b/i,
  /\b(dealerzy? narkotyk|kupić narkotyk)\b/i,
]

export const ALL_BLOCKLIST_PATTERNS: RegExp[] = [
  ...VIOLENCE_PATTERNS,
  ...SEXUAL_PATTERNS,
  ...HATE_PATTERNS,
  ...DRUG_PATTERNS,
]

export function passesRegexCheck(text: string): boolean {
  const normalized = text.toLowerCase()
  return !ALL_BLOCKLIST_PATTERNS.some((p) => p.test(normalized))
}
