// src/ui/EmptyState.tsx
export function EmptyState() {
  return (
    <section
      data-testid="empty-state"
      className="col-span-full flex flex-col items-center justify-center rounded-2xl bg-white/5 ring-1 ring-white/10 px-6 py-16 text-center"
      aria-live="polite"
    >
      <div className="text-3xl mb-2">😶‍🌫️</div>
      <h2 className="text-lg font-medium mb-1">Ничего не найдено</h2>
      <p className="text-sm text-white/70">
        Попробуйте изменить запрос или снять часть фильтров.
      </p>
    </section>
  )
}
