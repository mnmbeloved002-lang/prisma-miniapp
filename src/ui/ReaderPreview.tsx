import { useEffect } from 'react';
import { tgOpen } from '../utils/tg';

type Props = {
  html: string;
  onOpenSource?: () => void;
  onBookmark?: () => void;
  onSpeak?: () => void;
  onClose: () => void;
};

export function ReaderPreview({
  html,
  onOpenSource,
  onBookmark,
  onSpeak,
  onClose,
}: Props) {
  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = prev;
    };
  }, []);

  return (
    <div role="dialog" aria-modal="true" className="fixed inset-0 z-40">
      {/* overlay */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* sheet */}
      <div className="absolute inset-x-0 bottom-0 md:inset-y-8 md:mx-auto md:max-w-3xl">
        <div
          className="mx-3 md:mx-0 rounded-2xl shadow-cinema ring-1 ring-white/10 bg-surface text-text overflow-hidden flex flex-col"
          style={{ maxHeight: '85vh' }}
        >
          {/* header */}
          <div className="flex items-center gap-2 px-4 h-12 border-b border-white/10">
            <button
              onClick={onClose}
              className="px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 ring-1 ring-white/10"
              aria-label="Закрыть"
            >
              ✕
            </button>
            <div className="ml-auto flex items-center gap-2">
              <button
                onClick={() => (onSpeak ? onSpeak() : null)}
                className="px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 ring-1 ring-white/10"
              >
                🔊 Слушать
              </button>
              <button
                onClick={() => (onBookmark ? onBookmark() : null)}
                className="px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 ring-1 ring-white/10"
              >
                ⭐ В закладки
              </button>
              <button
                onClick={() => {
                  if (onOpenSource) onOpenSource();
                  else {
                    const m = html.match(/https?:\/\/[^\s"'<>]+/);
                    if (m) tgOpen(m[0]);
                  }
                }}
                className="px-3 py-1.5 rounded-lg bg-primary/20 hover:bg-primary/30 ring-1 ring-white/10"
              >
                🌐 Открыть источник
              </button>
            </div>
          </div>

          {/* scrollable content */}
          <div className="px-4 py-4 overflow-y-auto prose prose-sm prose-invert">
            <div dangerouslySetInnerHTML={{ __html: html }} />
          </div>
        </div>
      </div>
    </div>
  );
}
