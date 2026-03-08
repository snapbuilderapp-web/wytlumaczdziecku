import type { Metadata } from 'next'
import { Header } from '@/components/layout/Header'
import { BottomTabBar } from '@/components/layout/BottomTabBar'
import { PageWrapper } from '@/components/layout/PageWrapper'

export const metadata: Metadata = {
  title: 'Dla Rodziców',
  description: 'Jak działa Wytłumacz Dziecku — informacje dla rodziców i opiekunów.',
}

export default function DlaRodzicowPage() {
  return (
    <>
      <Header />
      <PageWrapper className="max-w-[680px]">
        <article className="prose prose-stone max-w-none py-6">
          <h1>Dla Rodziców</h1>

          <h2>Jak działa Wytłumacz Dziecku?</h2>
          <p>
            Wytłumacz Dziecku to platforma z infografikami edukacyjnymi tworzonymi z myślą
            o dzieciach i młodzieży w Polsce. Każdy temat jest wytłumaczony w dwóch wersjach:
            dla dzieci do 13 lat i dla młodzieży 13+.
          </p>

          <h2>Bezpieczeństwo i prywatność</h2>
          <ul>
            <li>Platforma nie wymaga rejestracji ani logowania do przeglądania treści.</li>
            <li>Nie zbieramy danych osobowych dzieci.</li>
            <li>Wybór grupy wiekowej jest przechowywany wyłącznie na urządzeniu użytkownika (localStorage).</li>
            <li>Korzystamy z Plausible Analytics — narzędzia GDPR-compliant, które nie używa ciasteczek.</li>
            <li>Platforma nie wyświetla żadnych reklam.</li>
          </ul>

          <h2>Jak tworzymy treści?</h2>
          <p>
            Treści są generowane przez sztuczną inteligencję (Google Gemini), a następnie
            weryfikowane przez człowieka przed publikacją. Wszystkie niesprawdzone treści są
            oznaczone jako &quot;Wersja robocza AI&quot;. Treści zweryfikowane przez eksperta są oznaczone
            osobną odznaką.
          </p>

          <h2>Filtry bezpieczeństwa</h2>
          <p>
            Każda treść przechodzi przez wielowarstwowy system filtrowania:
          </p>
          <ol>
            <li>Filtr REGEX — blokuje zapytania zawierające nieodpowiednie słowa kluczowe</li>
            <li>Ustawienia bezpieczeństwa Gemini — najwyższy poziom restrykcji dla treści dziecięcych</li>
            <li>Weryfikacja przez człowieka — przed publikacją każda treść jest sprawdzana</li>
          </ol>

          <h2>Jak zgłosić problem?</h2>
          <p>
            Jeśli zauważysz treść, która Twoim zdaniem nie powinna znajdować się na platformie,
            napisz do nas. Dane kontaktowe znajdziesz w stopce.
          </p>

          <h2>Zgodność z prawem</h2>
          <ul>
            <li>RODO / GDPR — platforma przetwarza minimalne dane, brak profilowania</li>
            <li>Ustawa o ochronie małoletnich (2024) — wyznaczony Koordynator ds. ochrony dzieci</li>
            <li>WCAG 2.1 AA — dostępność cyfrowa</li>
            <li>EU AI Act — treści AI oznaczone i weryfikowane przed publikacją</li>
          </ul>
        </article>
      </PageWrapper>
      <BottomTabBar />
    </>
  )
}
