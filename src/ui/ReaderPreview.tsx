// src/ui/ReaderPreview.tsx
import { useEffect } from 'react'

type Props = {
  html: string
  onOpenSource: () => void
  onBookmark: () => void
  onClose: () => void
}

export default function ReaderPreview({ html, onOpenSource, onBookmark, onClose }: Props) {
  // Блокируем прокрутку фона, пока открыт ридер
  useEffect(() => {
    const orig = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => { document.body.style.overflow = orig }
  }, [])

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/60"
      onClick={onClose}
    >
      <article
        className="w-full sm:w-[min(760px,92vw)] max-h-[92vh] overflow-auto rounded-t-2xl sm:rounded-2xl bg-[var(--color-surface)] ring-1 ring-white/10 shadow-cinema"
        onClick={(e) => e.stopPropagation()}
      >
        {/* верхняя панель действий */}
        <div className="sticky top-0 z-10 backdrop-blur bg-[color-mix(in_oklab,var(--color-surface),transparent_25%)] border-b border-white/10 px-3 sm:px-4 py-2 flex items-center gap-2">
          <button
            onClick={onOpenSource}
            className="px-3 py-2 text-sm rounded-xl ring-1 ring-white/10 hover:bg-white/10"
          >
            Открыть источник
          </button>
          <button
            onClick={onBookmark}
            className="px-3 py-2 text-sm rounded-xl ring-1 ring-white/10 hover:bg-white/10"
          >
            В закладки
          </button>
          <div className="ml-auto" />
          <button
            onClick={onClose}
            className="px-3 py-2 text-sm rounded-xl ring-1 ring-white/10 hover:bg-white/10"
            aria-label="Закрыть"
          >
            Закрыть
          </button>
        </div>

        {/* контент превью */}
        <div className="px-4 sm:px-6 py-4">
          <div className="prose prose-invert max-w-none" dangerouslySetInnerHTML={{ __html: html }} />
        </div>
      </article>
    </div>
  )
}
