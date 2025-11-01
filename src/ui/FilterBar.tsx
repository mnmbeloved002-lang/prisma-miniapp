import type { Category } from '../domain/types';

const ALL: Category[] = ['политика','экономика','спорт','технологии','общество','культура'];

export function FilterBar({
  selected,
  onChange,
  total
}: { selected: Category[]; onChange:(c:Category[])=>void; total:number }) {

  const toggle = (c: Category) => {
    if (selected.includes(c)) onChange(selected.filter(x=>x!==c));
    else onChange([...selected, c]);
  };

  return (
    <div className="container mx-auto px-4 pt-3 pb-2 flex items-center gap-2">
      <div className="flex flex-wrap gap-2">
        {ALL.map(c => (
          <button
            key={c}
            onClick={()=>toggle(c)}
            className={`px-3 py-1.5 rounded-full text-sm ring-1 ring-white/10 transition
              ${selected.includes(c) ? 'bg-white/10' : 'bg-white/[0.03] hover:bg-white/[0.06]'}`}
            aria-pressed={selected.includes(c)}
          >
            {c}
          </button>
        ))}
      </div>

      <div className="ml-auto text-sm text-white/60">
        Найдено: <span className="text-white/80">{total}</span>
      </div>
    </div>
  );
}
