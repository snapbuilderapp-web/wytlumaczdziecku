// ============================================================
// UI string dictionary — Polish (primary) + English
// ============================================================

export const strings = {
  pl: {
    siteTitle: 'Wytłumacz Dziecku',
    siteTitleFull: 'Wytłumacz Dziecku — Infografiki edukacyjne dla dzieci',
    siteDesc: 'Ponad 1000 tematów wyjaśnionych dla dzieci w formie infografik. Bezpiecznie, bez reklam, dopasowane do wieku.',
    popular: 'Najpopularniejsze',
    recent: 'Nowe tematy',
    topics: 'Tematy',
    allTopics: 'Wszystkie tematy',
    search: 'Szukaj',
    searchLabel: 'Szukaj tematu',
    searchPlaceholder: 'Czego chcesz się dziś dowiedzieć?',
    searchPlaceholderTeen: 'Wyszukaj temat...',
    home: 'Główna',
    favourites: 'Ulubione',
    settings: 'Ustawienia',
    forParents: 'Dla rodziców',
    viewAll: 'Zobacz wszystkie',
    noContent: 'Pierwsze infografiki są w drodze!',
    noTopicsInCategory: 'Brak tematów w tej kategorii.',
    noSearchResults: 'Hm, jeszcze tego nie mamy!',
    noSearchResultsHint: 'Ale może zainteresuje Cię coś podobnego?',
    browseAllTopics: 'Przeglądaj wszystkie tematy →',
    searchResults: (count: number, q: string) =>
      `Znaleziono ${count} ${count === 1 ? 'temat' : 'tematów'} dla „${q}"`,
    noAgeContent: 'Brak treści dla tej grupy wiekowej.',
    langToggleLabel: 'Zmień język',
    switchToEn: 'EN',
    switchToPl: 'PL',
    autocompleteLabel: 'Podpowiedzi wyszukiwania',
    navLabel: 'Nawigacja główna',
    categoriesLabel: 'Kategorie tematów',
    logoLabel: 'Wytłumacz Dziecku — strona główna',
    adFreeLabel: 'Bez reklam',
  },
  en: {
    siteTitle: 'Explain to My Kid',
    siteTitleFull: 'Explain to My Kid — Educational Infographics for Children',
    siteDesc: '1000+ topics explained for children through infographics. Safe, ad-free, age-appropriate.',
    popular: 'Most Popular',
    recent: 'New Topics',
    topics: 'Topics',
    allTopics: 'All Topics',
    search: 'Search',
    searchLabel: 'Search topics',
    searchPlaceholder: 'What do you want to learn today?',
    searchPlaceholderTeen: 'Search topics...',
    home: 'Home',
    favourites: 'Favourites',
    settings: 'Settings',
    forParents: 'For Parents',
    viewAll: 'View all',
    noContent: 'First infographics coming soon!',
    noTopicsInCategory: 'No topics in this category yet.',
    noSearchResults: "Hmm, we don't have that yet!",
    noSearchResultsHint: 'Maybe something similar will interest you?',
    browseAllTopics: 'Browse all topics →',
    searchResults: (count: number, q: string) =>
      `Found ${count} ${count === 1 ? 'topic' : 'topics'} for "${q}"`,
    noAgeContent: 'No content available for this age group.',
    langToggleLabel: 'Change language',
    switchToEn: 'EN',
    switchToPl: 'PL',
    autocompleteLabel: 'Search suggestions',
    navLabel: 'Main navigation',
    categoriesLabel: 'Topic categories',
    logoLabel: 'Explain to My Kid — home page',
    adFreeLabel: 'Ad-free',
  },
} as const

export type Lang = 'pl' | 'en'
export type Strings = typeof strings.pl

export function t<K extends keyof Strings>(lang: Lang, key: K): Strings[K] {
  return (strings[lang] as Strings)[key]
}
