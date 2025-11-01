import { useEffect } from 'react';
import { stop as ttsStop } from '../application/tts';

export function ReaderPreview({
  html,
  title,
  onOpenSource,
  onBookmark,
  onSpeak,
  onClose,
}: {
  html: string;
  title?: string;
  onOpenSource: () => void;
  onBookmark: () => void;
  onSpeak: () => void;
  onClose: () => void;
}) {
  // Отключаем TTS при закрытии
  useEffect(() => () => ttsStop(), []);

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50"
      style={{ paddingTop: 'env(safe-area-inset-top)', paddingBottom: 'env(safe-area-inset-bottom)' }}
    >
      {/* затемнение фона */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-[2px] opacity-100"
        onClick={onClose}
      />

      {/* Контейнер: мобайл — bottom sheet; десктоп — центр */}
      <div className="
        absolute inset-x-0 bottom-0
        md:inset-0 md:flex md:items-center md:justify-center
      ">
        <div
          className="
            bg-surface text-text ring-1 ring-white/10 shadow-cinema
            rounded-t-2xl md:rounded-2xl
            w-full md:w-[800px]
            max-h-[85dvh] md:max-h-[85vh]
            translate-y-0
          "
        >
          {/* Хэндл для дроуэра на мобиле */}
          <div className="md:hidden flex justify-center pt-2">
            <div className="h-1.5 w-12 rounded-full bg-white/20" />
          </div>

          {/* Заголовок + закрыть (липкая шапка) */}
          <div className="sticky top-0 z-10 px-4 md:px-5 pt-3 pb-3 md:pb-4 bg-surface/90 backdrop-blur border-b border-white/10">
            <div className="flex items-start gap-3">
              <h2 className="text-base md:text-lg font-semibold leading-tight line-clamp-2">
                {title ?? 'Предпросмотр'}
              </h2>
              <button
                onClick={() => { ttsStop(); onClose(); }}
                className="ml-auto px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 ring-1 ring-white/10"
                aria-label="Закрыть"
              >
                ✕
              </button>
            </div>
          </div>

          {/* Контент */}
          <div className="relative overflow-y-auto px-4 md:px-6 py-4 md:py-5 max-h-[calc(85dvh-120px)] md:max-h-[calc(85vh-140px)]">
            <article className="prose prose-invert max-w-none">
              <div dangerouslySetInnerHTML={{ __html: html }} />
            </article>

            <div className="pointer-events-none absolute bottom-0 inset-x-0 h-10 bg-gradient-to-t from-surface to-transparent" />
          </div>

          {/* Липкая панель действий снизу */}
          <div className="sticky bottom-0 z-10 px-4 md:px-5 py-3 bg-surface/90 backdrop-blur border-t border-white/10">
            <div className="flex items-center gap-2">
              <button
                onClick={onOpenSource}
                className="px-3 py-2 md:py-2.5 rounded-xl bg-white/5 hover:bg-white/10 ring-1 ring-white/10 text-sm md:text-base"
                aria-label="Открыть источник"
              >
                🌐 Открыть источник
              </button>
              <button
                onClick={onBookmark}
                className="px-3 py-2 md:py-2.5 rounded-xl bg-white/5 hover:bg-white/10 ring-1 ring-white/10 text-sm md:text-base"
                aria-label="Добавить в закладки"
              >
                ⭐ В закладки
              </button>
              <button
                onClick={() => onSpeak?.()}
                className="ml-auto px-3 py-2 md:py-2.5 rounded-xl bg-primary/20 hover:bg-primary/25 ring-1 ring-white/10 text-sm md:text-base"
                aria-label="Слушать"
              >
                🔊 Слушать
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
