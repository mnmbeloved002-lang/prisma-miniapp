import { useEffect, useRef } from 'react'
import { openLink } from '../utils/nav'
import { shareLink } from '../utils/share'

type Props = {
  html: string
  onOpenSource: () => void
  onBookmark?: () => void
  onClose: () => void
}

/**
 * Модальное окно чтения:
 * - role="dialog", aria-modal
 * - фокус на «Закрыть» при открытии
 * - Esc — закрыть, Enter на «Открыть источник»
 */
export function ReaderPreview({ html, onOpenSource, onBookmark, onClose }: Props) {
  const closeBtnRef = useRef<HTMLButtonElement | null>(null)
  const openBtnRef = useRef<HTMLButtonElement | null>(null)

  useEffect(() => {
    // Запрет скролла подложки
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    // Фокус на кнопку «Закрыть»
    closeBtnRef.current?.focus()
    return () => {
      document.body.style.overflow = prev
    }
  }, [])

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault()
        onClose()
      }
      if (e.key === 'Enter' && (document.activeElement === openBtnRef.current)) {
        e.preventDefault()
        onOpenSource()
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onClose, onOpenSource])

  return (
    <div
      className="fixed inset-0 z-50 grid place-items-end sm:place-items-center bg-black/60"
      role="dialog"
      aria-modal="true"
    >
      <div className="w-full sm:w-[min(720px,95vw)] h-[92vh] sm:h-[80vh] bg-[var(--surface)] rounded-t-3xl sm:rounded-2xl ring-1 ring-white/10 shadow-cinema overflow-hidden flex flex-col">
        {/* action bar */}
        <div className="flex items-center gap-2 p-3 border-b border-white/10 bg-black/20">
          <button
            ref={closeBtnRef}
            onClick={onClose}
            className="px-3 py-2 rounded-xl ring-1 ring-white/10 hover:bg-white/10"
            aria-label="Закрыть"
          >
            Закрыть
          </button>

          <div className="ml-auto flex items-center gap-2">
            <button
              ref={openBtnRef}
              onClick={onOpenSource}
              className="px-3 py-2 rounded-xl ring-1 ring-white/10 hover:bg-white/10"
              aria-label="Открыть источник"
              title="Открыть источник"
            >
              Открыть
            </button>

            <button
              onClick={async () => {
                // попытаемся расшарить текущий URL источника, если он в onOpenSource = openLink(url)
                // для консистентности — прокинем из AppShell прямо canonicalUrl
                // но так как сюда приходит только handler, используем небольшой трюк:
                // попросим AppShell открыть ссылку в новом табе и параллельно вызовем shareLink
                // (AppShell уже прокидывает onOpenSource как openLink(url))
                try {
                  const btn = openBtnRef.current
                  const urlAttr = btn?.getAttribute('data-url')
                  if (urlAttr) {
                    await shareLink(urlAttr)
                  } else {
                    // если data-url не прокинут — просто предупредим пользователя
                    alert('Не удалось определить ссылку источника — откроем страницу, её можно скопировать')
                    onOpenSource()
                  }
                } catch {
                  onOpenSource()
                }
              }}
              className="px-3 py-2 rounded-xl ring-1 ring-white/10 hover:bg-white/10"
              aria-label="Поделиться"
              title="Поделиться"
            >
              Поделиться
            </button>

            {onBookmark && (
              <button
                onClick={onBookmark}
                className="px-3 py-2 rounded-xl ring-1 ring-white/10 hover:bg-white/10"
                aria-label="В закладки"
                title="В закладки"
              >
                ☆
              </button>
            )}
          </div>
        </div>

        {/* content */}
        <div className="flex-1 overflow-auto p-4 sm:p-6">
          <article
            className="prose prose-invert max-w-none"
            // без dangerouslySetInnerHTML тут не обойтись: мы рендерим подготовленный HTML превью
            dangerouslySetInnerHTML={{ __html: html }}
          />
        </div>
      </div>
    </div>
  )
}
