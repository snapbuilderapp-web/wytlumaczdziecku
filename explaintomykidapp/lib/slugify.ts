/** Converts a Polish title to a URL-safe slug */
export function slugify(text: string): string {
  return text
    .toLowerCase()
    .normalize('NFD')
    // Remove diacritics (ą→a, ć→c, ę→e, ł→l, ń→n, ó→o, ś→s, ź→z, ż→z)
    .replace(/[\u0300-\u036f]/g, '')
    // Polish ł is not covered by NFD decomposition
    .replace(/ł/g, 'l')
    .replace(/ł/g, 'l')
    // Replace non-alphanumeric with hyphens
    .replace(/[^a-z0-9]+/g, '-')
    // Strip leading/trailing hyphens
    .replace(/^-+|-+$/g, '')
    // Collapse multiple hyphens
    .replace(/-{2,}/g, '-')
    .trim()
}
