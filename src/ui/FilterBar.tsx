// src/ui/FilterBar.tsx
import type { Category } from '../domain/types';

type Props = {
  selected: Category[];
  onChange: (cats: Category[]) => void;
  total: number;
};

const ALL: Category[] = ['политика', 'экономика', 'спорт', 'технологии', 'общество', 'культура'];

export function FilterBar({ selected, onChange, total }: Props) {
  const toggle = (c: Category) => {
    if (selected.includes(c)) onChange(selected.filter(x => x !== c));
    else onChange([...selected, c]);
  };

  return (
    <div className="container mx-auto px-4 mt-3 flex items-center gap-2 flex-wrap">
      <div className="flex gap-2 flex-1 flex-wrap">
        {ALL.map(c => {
          const active = selected.includes(c);
          return (
            <button
              key={c}
              onClick={() => toggle(c)}
              aria-pressed={active}
              className={`px-3 py-1.5 rounded-xl ring-1 ring-white/10 text-sm transition
                ${active ? 'bg-white/10' : 'hover:bg-white/5'}
              `}
            >
              {c}
            </button>
          );
        })}
      </div>
      <div className="text-xs text-white/60">Найдено: {total}</div>
    </div>
  );
}
