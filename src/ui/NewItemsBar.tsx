export function NewItemsBar({ count, onShow }:{ count:number; onShow:()=>void }) {
  if (count <= 0) return null;
  return (
    <div className="sticky top-[calc(var(--safe-top,0px))] z-20 px-4">
      <div className="mx-auto max-w-[1120px]">
        <button
          onClick={onShow}
          className="w-full mt-3 rounded-xl bg-white/10 ring-1 ring-white/15 hover:bg-white/15 px-3 py-2 text-sm"
        >
          Показать {count} новых
        </button>
      </div>
    </div>
  );
}
