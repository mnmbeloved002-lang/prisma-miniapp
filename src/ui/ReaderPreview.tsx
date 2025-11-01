// src/ui/ReaderPreview.tsx
import { useEffect } from 'react';
import { useTTSState } from '../utils/useTTSState';

type Props = {
  html: string;
  onOpenSource: () => void;
  onBookmark: () => void;
  onSpeak?: () => void; // необязательно — если не придёт, кнопку спрячем/задизейблим
  onClose: () => void;
};

export function ReaderPreview({ html, onOpenSource, onBookmark, onSpeak, onClose }: Props) {
  const { supported, speaking, stop } = useTTSState();

  // Если окно закрывают — останавливаем речь
  useEffect(() => () => { if (speaking) stop(); }, [speaking, stop]);

  return (
    <>
      {/* затемняющий фон */}
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
        role="button"
        aria-label="Закрыть превью"
        onClick={onClose}
      />

      {/* мобильный дроуэр (внизу), на десктопе — центрированная панель */}
      <div className="
        fixed z-50 left-0 right-0
        md:inset-0 md:flex md:items-center md:justify-center
      ">
        <article
          className="
            bg-[var(--surface)] text-[var(--text)] shadow-cinema ring-1 ring-white/10
            rounded-t-2xl md:rounded-2xl
            w-full md:w-[720px] max-h-[85vh]
            fixed bottom-0 md:relative
            flex flex-col
          "
          style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}
          role="dialog"
          aria-modal="true"
          aria-label="Превью новости"
        >
          {/* хедер с действиями */}
          <header className="sticky top-0 z-10 bg-[var(--surface)]/95 backdrop-blur px-4 py-3 border-b border-white/10 flex items-center gap-2">
            <h2 className="text-sm font-medium opacity-90">Предпросмотр</h2>
            <div className="ml-auto flex items-center gap-2">
              <button
                onClick={onOpenSource}
                className="px-3 py-2 rounded-xl ring-1 ring-white/10 hover:bg-white/10 text-sm"
              >
                Открыть источник
              </button>

              {/* Кнопка озвучки: всегда видимая, но может быть disabled */}
              {onSpeak ? (
                <button
                  onClick={() => (speaking ? stop() : onSpeak())}
                  disabled={!supported}
                  aria-pressed={speaking}
                  className={`px-3 py-2 rounded-xl ring-1 ring-white/10 text-sm
                    ${supported ? 'hover:bg-white/10' : 'opacity-40 cursor-not-allowed'}
                  `}
                  title={supported ? 'Озвучить текст' : 'Озвучка не поддерживается в этом браузере'}
                >
                  {speaking ? '■ Стоп' : '▶ Слушать'}
                </button>
              ) : null}

              <button
                onClick={onBookmark}
                className="px-3 py-2 rounded-xl ring-1 ring-white/10 hover:bg-white/10 text-sm"
              >
                ☆ Закладка
              </button>

              <button
                onClick={onClose}
                className="px-3 py-2 rounded-xl ring-1 ring-white/10 hover:bg-white/10 text-sm"
                aria-label="Закрыть"
              >
                Закрыть
              </button>
            </div>
          </header>

          {/* область чтения */}
          <div className="overflow-y-auto px-4 py-4 md:px-6 md:py-5">
            <div className="prose prose-invert max-w-none" dangerouslySetInnerHTML={{ __html: html }} />
          </div>
        </article>
      </div>
    </>
  );
}
