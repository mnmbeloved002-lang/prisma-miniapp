import { useEffect } from 'react'
import { useTTSState } from '../utils/useTTSState'

type Props = {
  html: string
  onOpenSource: () => void
  onBookmark: () => void
  onClose: () => void
}

export function ReaderPreview({ html, onOpenSource, onBookmark, onClose }: Props) {
  const { canTTS, speaking, speak, stop } = useTTSState()

  useEffect(() => {
    // Блокируем скролл фона, пока открыт ридер (модалка)
    const orig = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => { document.body.style.overflow = orig }
  }, [])

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 grid"
      style={{ gridTemplateRows: 'auto 1fr auto' }}
    >
      {/* затемнение фона */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
        aria-hidden
      />

      {/* верхняя панель */}
      <header className="relative z-10 px-4 pt-[var(--safe-top)] pb-2 bg-[var(--surface)]/90 ring-1 ring-white/10">
        <div className="container mx-auto flex items-center gap-2">
          <button
            onClick={onClose}
            className="px-3 py-2 rounded-xl ring-1 ring-white/10 hover:bg-white/10"
            aria-label="Закрыть"
          >
            ← Назад
          </button>

          <div className="ml-auto flex items-center gap-2">
            <button
              onClick={onOpenSource}
              className="px-3 py-2 rounded-xl ring-1 ring-white/10 hover:bg-white/10"
            >
              Открыть источник
            </button>

            <button
              onClick={onBookmark}
              className="px-3 py-2 rounded-xl ring-1 ring-white/10 hover:bg-white/10"
            >
              ☆ В закладки
            </button>

            <button
              onClick={() => (speaking ? stop() : speak())}
              disabled={!canTTS}
              className={`px-3 py-2 rounded-xl ring-1 ring-white/10 ${canTTS ? 'hover:bg-white/10' : 'opacity-50 cursor-not-allowed'}`}
              title={canTTS ? (speaking ? 'Стоп' : 'Слушать') : 'Озвучивание не поддерживается в этом браузере'}
            >
              {speaking ? '⏹ Стоп' : '🔊 Слушать'}
            </button>
          </div>
        </div>
      </header>

      {/* контент */}
      <main className="relative z-10 overflow-y-auto">
        <article className="container mx-auto px-4 py-6">
          <div
            className="prose prose-invert max-w-none leading-7"
            // содержимое уже доверенное (наше previewHtml)
            dangerouslySetInnerHTML={{ __html: html }}
          />
          <div className="h-20" aria-hidden /> {/* запас под нижнюю панель на мобиле */}
        </article>
      </main>

      {/* нижняя панель (мобайл friendly) */}
      <footer className="relative z-10 px-4 pb-[calc(8px+var(--safe-bottom))] pt-3 bg-[var(--surface)]/90 ring-1 ring-white/10">
        <div className="container mx-auto grid grid-cols-3 gap-2">
          <button
            onClick={onOpenSource}
            className="px-3 py-3 rounded-xl ring-1 ring-white/10 hover:bg-white/10"
          >
            Источник
          </button>
          <button
            onClick={onBookmark}
            className="px-3 py-3 rounded-xl ring-1 ring-white/10 hover:bg-white/10"
          >
            ☆ Закладка
          </button>
          <button
            onClick={() => (speaking ? stop() : speak())}
            disabled={!canTTS}
            className={`px-3 py-3 rounded-xl ring-1 ring-white/10 ${canTTS ? 'hover:bg-white/10' : 'opacity-50 cursor-not-allowed'}`}
            title={canTTS ? (speaking ? 'Стоп' : 'Слушать') : 'Озвучивание не поддерживается в этом браузере'}
          >
            {speaking ? 'Стоп' : 'Слушать'}
          </button>
        </div>
      </footer>
    </div>
  )
}
