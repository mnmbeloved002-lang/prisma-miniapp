import React from 'react';

export function Header({
  onSearch,
  onToggleBookmarks,
  showBookmarks,
}: {
  onSearch: (q: string) => void;
  onToggleBookmarks: () => void;
  showBookmarks: boolean;
}) {
  return (
    <header
      role="banner"
      data-testid="app-header"
      className="sticky top-0 z-20 backdrop-blur bg-[var(--bg)]/70 border-b border-white/10"
    >
      <div className="container mx-auto px-4 py-3 flex items-center gap-3">
        <h1 className="sr-only">Prisma MiniApp</h1>

        <div className="flex-1">
          <label className="sr-only" htmlFor="search">
            Поиск
          </label>
          <input
            id="search"
            role="searchbox"
            aria-label="Поиск новостей"
            placeholder="Поиск новостей…"
            type="search"
            className="w-full px-3 py-2 rounded-xl bg-white/5 ring-1 ring-white/10 outline-none"
            onChange={(e) => onSearch(e.currentTarget.value)}
          />
        </div>

        <button
          type="button"
          title="Показать закладки"
          aria-pressed={showBookmarks}
          onClick={onToggleBookmarks}
          className="px-3 py-2 rounded-xl ring-1 ring-white/10 hover:bg-white/10"
        >
          ☆ Закладки
        </button>
      </div>
    </header>
  );
}
