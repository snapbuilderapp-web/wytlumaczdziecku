/**
 * Gemini prompt templates for infographic and quiz generation.
 * All prompts are in Polish — native content, not translations.
 */

export function buildInfographicPrompt(
  topic: string,
  ageGroup: 'under13' | '13plus'
): string {
  const isYounger = ageGroup === 'under13'

  return `Jesteś polskim ekspertem edukacyjnym piszącym dla dzieci ${
    isYounger ? 'w wieku 8–12 lat' : 'w wieku 13–16 lat'
  }.

Stwórz edukacyjną infografikę o temacie: "${topic}"

REGUŁY OBOWIĄZKOWE:
- Język: wyłącznie polski
- Łącznie maksymalnie ${isYounger ? '300' : '450'} słów
- ${
    isYounger
      ? 'Maksymalnie 5 zdań na sekcję, maksymalnie 10 słów w zdaniu'
      : 'Maksymalnie 7 zdań na sekcję'
  }
- Brak żargonu — wyjaśniaj terminy techniczne przy pierwszym użyciu
- Ton: ${
    isYounger
      ? 'ciepły, zachęcający, pełen entuzjazmu, jak rozmowa z ciekawym przyjacielem'
      : 'rzeczowy, partnerski, szanujący inteligencję czytelnika, bez nadmiernego upraszczania'
  }
- Zawsze użyj realnej analogii w sekcji "example": "To jakby..."
- Nigdy nie wspominaj o przemocy, treściach dla dorosłych, ani treściach nieodpowiednich dla dzieci
- Tematy wrażliwe (śmierć, religia, polityka): traktuj z neutralnością i szacunkiem dla różnych poglądów

Zwróć WYŁĄCZNIE poprawny JSON w tej strukturze (bez markdown, bez \`\`\`):
{
  "title": "string (maks. 8 słów, bez pytajnika)",
  "hook": "string (jedno zdanie otwierające — zaskakujący fakt lub pytanie)",
  "sections": [
    {
      "type": "hero",
      "heading": "string",
      "content": "string",
      "visual_description": "string (opis ilustracji dla grafika, po polsku, 1-2 zdania)"
    },
    {
      "type": "why",
      "heading": "Dlaczego to ważne?",
      "content": "string",
      "visual_description": "string"
    },
    {
      "type": "how",
      "heading": "Jak to działa?",
      "content": "string",
      "key_points": ["string", "string", "string"],
      "visual_description": "string"
    },
    {
      "type": "example",
      "heading": "Przykład z życia",
      "content": "string (MUSI zawierać analogię zaczynającą się od 'To jakby...')",
      "visual_description": "string"
    },
    {
      "type": "facts",
      "heading": "Czy wiesz, że...?",
      "facts": ["string", "string", "string"],
      "visual_description": "string"
    }
  ],
  "key_facts": ["string", "string", "string"],
  "conversation_starters": [
    "string (pytanie otwierające rozmowę, jakie rodzic może zadać dziecku)",
    "string",
    "string"
  ],
  "tags": ["string", "string", "string", "string", "string"],
  "emotional_weight": "light",
  "reading_level": "${isYounger ? 'standard' : 'advanced'}",
  "suggested_category": "science"
}

Dla pola "emotional_weight" użyj: "light" dla tematów naukowych/przyrodniczych, "medium" dla historycznych/społecznych, "heavy" dla emocjonalnych/filozoficznych.
Dla pola "suggested_category" użyj jednej z: science, history, tech, nature, body, society, space, emotions, philosophy.`
}

export function buildQuizPrompt(
  topic: string,
  contentSummary: string,
  ageGroup: 'under13' | '13plus'
): string {
  return `Na podstawie tej polskiej infografiki o temacie "${topic}", stwórz 3 pytania testowe dla dzieci ${
    ageGroup === 'under13' ? 'w wieku 8–12' : 'w wieku 13–16'
  } lat.

Skrót treści infografiki:
${contentSummary}

REGUŁY OBOWIĄZKOWE:
- Język: wyłącznie polski
- 4 odpowiedzi do każdego pytania
- Dokładnie 1 poprawna odpowiedź na pytanie
- Pozostałe 3 odpowiedzi są sensowne, ale błędne — bez absurdalnych pułapek
- Wyjaśnienie pokazywane PO udzieleniu odpowiedzi (nie zdradzaj odpowiedzi w pytaniu)
- Wyjaśnienie jest zawsze zachęcające — nigdy nie krytykuje dziecka
- Pytania sprawdzają rozumienie, nie zapamiętywanie dat ani liczb

Zwróć WYŁĄCZNIE poprawny JSON (bez markdown):
[
  {
    "question": "string",
    "options": [
      {"text": "string", "correct": true},
      {"text": "string", "correct": false},
      {"text": "string", "correct": false},
      {"text": "string", "correct": false}
    ],
    "explanation": "string (2-3 zdania, ciepłe i wyjaśniające)"
  }
]`
}
