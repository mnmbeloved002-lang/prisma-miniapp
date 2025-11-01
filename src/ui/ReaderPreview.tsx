// src/ui/ReaderPreview.tsx
import { useEffect, useRef } from 'react';
import { useTTSState } from '../utils/useTTSState';

export function ReaderPreview({
  html,
  onOpenSource,
  onBookmark,
  onClose,
}: {
  html: string;
  onOpenSource: () => void;
  onBookmark: () => void;
  onClose: () => void;
}) {
  const { canTTS, isSpeaking, start, halt } = useTTSState();
  const scrollRef = useRef<HTMLDivElement | null>(null);

  // Мягкое появление и возврат скролла в начало при каждом открытии
  useEffect(() => {
    const el = scrollRef.current;
    if (el) el.scrollTop = 0;
  }, [html]);

  return (
    <div
      className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-end sm:items-center justify-center"
      role="dialog"
      aria-modal="true"
    >
      <div className="w-full sm:w-[720px] max-h-[88vh] bg-[var(--surface)] text-[var(--text)] rounded-2xl shadow-cinema ring-1 ring-white/10 overflow-hidden">
        {/* header */}
        <div className="flex items-center gap-2 p-3 sm:p-4 border-b border-white/5">
          <div className="text-sm text-white/70">Предпросмотр</div>
          <div className="ml-auto flex items-center gap-2">
            <button
              className="px-3 py-2 rounded-lg bg-white/5 ring-1 ring-white/10 hover:bg-white/10"
              onClick={onBookmark}
            >
              ★ В закладки
            </button>
            <button
              className="px-3 py-2 rounded-lg bg-white/5 ring-1 ring-white/10 hover:bg-white/10"
              onClick={onOpenSource}
            >
              Открыть источник
            </button>

            {canTTS && (
              isSpeaking ? (
                <button
                  className="px-3 py-2 rounded-lg bg-white/5 ring-1 ring-white/10 hover:bg-white/10"
                  onClick={halt}
                >
                  ⏹ Остановить
                </button>
              ) : (
                <button
                  className="px-3 py-2 rounded-lg bg-white/5 ring-1 ring-white/10 hover:bg-white/10"
                  onClick={() => start('Превью', html)}
                >
                  🔊 Слушать
                </button>
              )
            )}

            <button
              className="px-3 py-2 rounded-lg bg-white/5 ring-1 ring-white/10 hover:bg-white/10"
              onClick={onClose}
            >
              Закрыть
            </button>
          </div>
        </div>

        {/* content */}
        <div
          ref={scrollRef}
          className="prose prose-invert px-4 sm:px-6 py-4 max-h-[70vh] overflow-auto"
          // безопасная вставка заранее подготовленного previewHtml
          dangerouslySetInnerHTML={{ __html: html }}
        />
      </div>
    </div>
  );
}
