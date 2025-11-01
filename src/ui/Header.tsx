import { useState } from 'react';

export function Header({
  onSearch,
  onToggleBookmarks,
  showBookmarks
}: { onSearch: (q: string) => void; onToggleBookmarks: ()=>void; showBookmarks: boolean }) {

  const [q, setQ] = useState('');

  return (
    <header className="sticky top-0 z-10 backdrop-blur bg-black/30 border-b border-white/5">
      <div className="container mx-auto px-4 h-14 flex items-center gap-3">
        <h1 className="font-semibold tracking-wide text-base">Prisma News</h1>

        <div className="ml-auto relative w-64 max-w-[60vw]">
          <input
            value={q}
            onChange={(e)=>{ setQ(e.target.value); onSearch(e.target.value); }}
            placeholder="Поиск"
            className="w-full bg-white/5 rounded-xl pl-9 pr-3 py-2 text-sm outline-none ring-1 ring-white/10 focus:ring-white/20"
            aria-label="Поиск по ленте"
          />
          <span className="absolute left-3 top-1/2 -translate-y-1/2 opacity-60">🔎</span>
        </div>

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
