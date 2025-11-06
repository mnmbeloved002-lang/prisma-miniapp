// src/ui/Header.tsx
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
      className="sticky top-0 z-20 backdrop-blur-lg bg-bg/80 supports-backdrop-blur:bg-bg/60 border-b border-white/10 transition-all duration-200"
    >
      <div className="container mx-auto px-4 py-3 flex items-center gap-3">
        {/* Бренд — видимый, компактный, не ломает тесты */}
        <div className="shrink-0 min-w-[140px] leading-tight">
          <h1 className="text-sm sm:text-base font-semibold tracking-wide">
            Prisma MiniApp
          </h1>
          {/* слоган теперь виден и на мобиле: тонкий и неброский */}
          <p className="text-[11px] text-muted">
            новости без шума
          </p>
        </div>

        {/* min-w-0: чтобы инпут не «пихал» бренд и сам не резался */}
        <div className="flex-1 min-w-0">
          <label className="sr-only" htmlFor="search">
            Поиск
          </label>
          <input
            id="search"
            type="search"
            role="searchbox"
            placeholder="Поиск новостей…"
            className="w-full px-3 py-2 rounded-xl bg-surface border border-white/10 text-fg placeholder-muted outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/30 transition-colors"
            onInput={(e) => onSearch?.((e.target as HTMLInputElement).value)}
          />
        </div>

        <button
          title="Показать закладки"
          aria-pressed={!!showBookmarks}
          data-testid="bookmarks-btn"
          className="px-3 py-2 rounded-xl bg-surface border border-white/10 text-fg hover:bg-surface-hover hover:border-white/20 active:scale-95 transition-all duration-150"
          onClick={onToggleBookmarks}
        >
          {showBookmarks ? '★ Закладки' : '☆ Закладки'}
        </button>
      </div>
    </header>
  )
})
