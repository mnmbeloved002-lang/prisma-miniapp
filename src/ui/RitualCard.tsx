import { useBookmarks } from '../application/bookmarks';
import type { Ritual } from '../domain/ritual-schema';

interface Props {
  item: Ritual;
}

export function RitualCard({ item }: Props) {
  const { has, add, remove } = useBookmarks();
  const isBookmarked = has(item.id);

  const toggle = () => (isBookmarked ? remove(item.id) : add(item.id));

  return (
    <article className="w-full max-w-lg bg-white/10 backdrop-blur-md border border-white/10 rounded-3xl p-8 shadow-2xl relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500"></div>

      <h2 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-white to-purple-200 mb-6 text-center">
        {item.title}
      </h2>

      <div className="bg-black/20 rounded-2xl p-6 mb-8 italic text-lg text-center leading-relaxed text-purple-100">
        "{item.motivation}"
      </div>

      <div className="space-y-6">
        <section className="flex flex-col items-center">
          <h3 className="text-xs uppercase tracking-widest text-white/50 mb-2">Твоя Задача</h3>
          <p className="text-xl font-medium">{item.task}</p>
        </section>

        <section className="flex flex-col items-center">
          <h3 className="text-xs uppercase tracking-widest text-white/50 mb-2">Аффирмация</h3>
          <p className="text-xl font-medium text-pink-200">{item.affirmation}</p>
        </section>
      </div>

      <button
        type="button"
        onClick={toggle}
        className={`mt-10 w-full py-4 rounded-xl font-bold tracking-wide transition-all duration-300 ${
          isBookmarked
            ? 'bg-purple-600 text-white shadow-[0_0_20px_rgba(147,51,234,0.5)]'
            : 'bg-white/5 hover:bg-white/10 text-white/80'
        }`}
      >
        {isBookmarked ? '★ Сохранено' : '☆ Сохранить Ритуал'}
      </button>
    </article>
  );
}
