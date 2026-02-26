export function BezReklamBadge() {
  return (
    <span
      className="inline-flex items-center gap-1 px-3 py-1 rounded-full
                 bg-green-50 text-green-800 text-xs font-medium border border-green-200"
      title="Wytłumacz Dziecku nie wyświetla żadnych reklam. Nigdy."
    >
      <svg
        className="w-3 h-3"
        viewBox="0 0 24 24"
        fill="currentColor"
        aria-hidden="true"
      >
        <path
          fillRule="evenodd"
          d="M12 1.5a5.25 5.25 0 00-5.25 5.25v3a3 3 0 00-3 3v6.75a3 3 0 003 3h10.5a3 3 0 003-3v-6.75a3 3 0 00-3-3v-3A5.25 5.25 0 0012 1.5zm3.75 8.25v-3a3.75 3.75 0 10-7.5 0v3h7.5z"
          clipRule="evenodd"
        />
      </svg>
      Bez reklam
    </span>
  )
}
