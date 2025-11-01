import { useEffect } from 'react';
import type { NewsItem } from '../domain/types';
import { bm } from '../application/bookmarks';
import { speak, stop } from '../application/tts';

export function ReaderPreview({
  item,
  onClose,
  onBookmark,
}: {
  item: NewsItem;
  onClose: () => void;
  onBookmark: () => void;
}) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', onKey);
    return () => { document.removeEventListener('keydown', onKey); stop(); };
  }, [onClose]);

  const inBm = bm.has(item.id);

  return (
    <div role="dialog" aria-modal="true" className="fixed inset-0 z-50">
      <div className="absolute inset-0 bg-black/60" onClick={onClose} />
      <div className="absolute inset-0 flex items-center justify-center p-4">
        <article className="w-full max-w-3xl rounded-2xl bg-[var(--surface)] shadow-cinema ring-1 ring-white/10 overflow-hidden">
          <header className="px-5 py-4 border-b border-white/10 flex items-center gap-2">
            <h2 className="text-lg font-semibold leading-tight flex-1">{item.title}</h2>
            <button
              onClick={()=>{
                if (inBm) bm.remove(item.id); else bm.add(item);
                onBookmark();
              }}
              aria-pressed={inBm}
              className="px-3 py-1.5 rounded-lg ring-1 ring-white/10 hover:bg-white/5"
              title={inBm ? 'Удалить из закладок' : 'В закладки'}
            >
              {inBm ? '★' : '☆'}
            </button>
            <button
              onClick={() => speak(item.title + '. ' + item.summary)}
              className="px-3 py-1.5 rounded-lg ring-1 ring-white/10 hover:bg-white/5"
              title="Озвучить"
            >
              🔈
            </button>
            <button onClick={onClose} className="ml-1 px-3 py-1.5 rounded-lg hover:bg-white/5" aria-label="Закрыть">✕</button>
          </header>

          {item.image && (
            <img
              src={item.image}
              alt=""
              className="w-full aspect-[16/9] object-cover"
              loading="lazy"
              decoding="async"
            />
          )}

          <div className="p-5">
            <div className="text-sm text-[var(--muted)] mb-2">
              {item.source} • {new Date(item.publishedAt).toLocaleString()}
            </div>
            <div className="prose prose-invert">
              <div dangerouslySetInnerHTML={{ __html: item.previewHtml }} />
            </div>
          </div>

          <footer className="px-5 pb-5">
            <a
              href={item.canonicalUrl}
              target="_blank" rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white/10 hover:bg-white/15 ring-1 ring-white/10"
            >
              Открыть источник ↗
            </a>
          </footer>
        </article>
      </div>
    </div>
  );
}
