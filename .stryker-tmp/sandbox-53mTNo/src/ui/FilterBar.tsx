// @ts-nocheck
import { useState, useEffect, useRef, lazy, Suspense, memo } from "react";

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
    <div className="container mx-auto px-4 mt-3 flex items-center gap-2">
      {/* ряд чипсов — одна строка + горизонтальный скролл на узких экранах */}
      <div
        className={[
          'flex gap-2 flex-1 min-w-0 overflow-x-auto whitespace-nowrap',
          // приглушаем полосы прокрутки (не критично, просто nicer)
          '[-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden',
          '-mx-1 px-1',
        ].join(' ')}
      >
        {ALL.map(c => {
          const active = selected.includes(c);
          return (
            <button
              key={c}
              onClick={() => toggle(c)}
              aria-pressed={active}
              className={[
                'inline-flex shrink-0 items-center h-9 px-3 rounded-xl ring-1 ring-white/10 text-sm transition',
                active ? 'bg-white/10' : 'hover:bg-white/5',
              ].join(' ')}
            >
              {c}
            </button>
          );
        })}
      </div>

      {/* счётчик — не сжимается */}
      <div className="text-xs text-white/60 shrink-0 ml-2">Найдено: {total}</div>
    </div>
  );
}
