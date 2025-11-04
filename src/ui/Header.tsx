import { memo } from 'react'

type Props = {
  onSearch?: (v: string) => void
  onToggleBookmarks?: () => void
  showBookmarks?: boolean
}

export const Header = memo(function Header({
  onSearch,
  onToggleBookmarks,
  showBookmarks,
}: Props) {
  return (
    <header
      role="banner"
      data-testid="app-header"
      aria-label="Призма — шапка приложения"
      className="sticky top-0 z-20 backdrop-blur bg-bg/70 border-b border-white/10"
    >
      <div className="container py-3 flex items-center gap-3">
        <h1 className="sr-only">Prisma MiniApp</h1>

        <div className="flex-1">
          <label className="sr-only" htmlFor="search">
            Поиск
          </label>
          <input
            id="search"
            type="search"
            role="searchbox"
            placeholder="Поиск новостей…"
            className="px-3 py-1.5 rounded-xl ring-1 ring-white/10 text-sm transition hover: bg-white/5 text-fg"
            onInput={(e) => onSearch?.((e.target as HTMLInputElement).value)}
          />
        </div>

        <button
          title="Показать закладки"
          aria-pressed={!!showBookmarks}
          data-testid="bookmarks-btn"
          className="px-3 py-2 rounded-xl ring-1 ring-white/10 hover:bg-white/10"
          onClick={onToggleBookmarks}
        >
          ☆ Закладки
        </button>
      </div>
    </header>
  )
})
