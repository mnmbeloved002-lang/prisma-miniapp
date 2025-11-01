export function Header({
  onSearch,
  onToggleBookmarks,
  showBookmarks
}: { onSearch: (q: string) => void; onToggleBookmarks: ()=>void; showBookmarks: boolean }) {
  return (
    <header className="sticky top-0 z-10 backdrop-blur bg-black/30 border-b border-white/5">
      <div className="container mx-auto px-4 h-14 flex items-center gap-3">
        <div className="font-semibold tracking-wide">Prisma News</div>
        <input
          placeholder="Поиск"
          className="ml-auto bg-white/5 rounded-xl px-3 py-2 text-sm outline-none ring-1 ring-white/10 focus:ring-white/20"
          onChange={e => onSearch(e.target.value)}
        />
        <button
          aria-pressed={showBookmarks}
          onClick={onToggleBookmarks}
          className={`ml-2 rounded-xl px-3 py-2 ring-1 ring-white/10 ${showBookmarks ? 'bg-white/10' : ''}`}
          aria-label="Закладки"
        >⭐</button>
      </div>
    </header>
  );
}
