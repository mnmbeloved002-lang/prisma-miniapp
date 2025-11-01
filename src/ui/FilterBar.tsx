import type { Category } from '../domain/types';
const ALL: Category[] = ['политика','экономика','спорт','технологии','общество','культура'];

export function FilterBar({ selected, onChange, total }:{
  selected: Category[]; onChange:(c:Category[])=>void; total:number
}){
  function toggle(c: Category){
    onChange(selected.includes(c) ? selected.filter(x=>x!==c) : [...selected, c]);
  }
  return (
    <div className="container mx-auto px-4 py-3 flex items-center gap-2">
      {ALL.map(c => (
        <button key={c} onClick={()=>toggle(c)}
          className={`px-3 py-1.5 rounded-full text-sm ring-1 transition ${selected.includes(c)?'bg-white/10 ring-white/20':'ring-white/10 hover:bg-white/5'}`}>{c}</button>
      ))}
      <div className="ml-auto text-xs text-white/60">Найдено: {total}</div>
    </div>
  );
}
