import { supported, stop } from '../application/tts';

type Props = {
  html: string;
  onOpenSource: () => void;
  onBookmark: () => void;
  onSpeak: () => void;
  onClose: () => void;
};

export function ReaderPreview({ html, onOpenSource, onBookmark, onSpeak, onClose }: Props) {
  const ttsOk = supported();

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/50"
      role="dialog"
      aria-modal="true"
    >
      {/* Карточка: мобильный — дроуэр снизу; десктоп — модалка по центру */}
      <div className="w-full sm:max-w-xl mx-2 sm:mx-0 max-h-[90vh] bg-[var(--surface)] text-[var(--text)] rounded-t-2xl sm:rounded-2xl shadow-cinema ring-1 ring-white/5 overflow-hidden">
        {/* Контент с прокруткой */}
        <div className="p-4 sm:p-6 overflow-y-auto max-h-[68vh] sm:max-h-[70vh] prose prose-invert">
          {/* html уже прошёл нашу «превью»-селекцию, без полного копирайта */}
          <div dangerouslySetInnerHTML={{ __html: html }} />
        </div>

        {/* Панель действий — крупные кнопки, хороши на мобиле */}
        <div className="p-3 sm:p-4 border-t border-white/10 bg-black/20 flex flex-wrap gap-2 sm:gap-3 justify-between">
          <div className="flex gap-2 sm:gap-3 flex-1">
            <button
              onClick={onOpenSource}
              className="flex-1 sm:flex-none px-3 py-2 rounded-xl ring-1 ring-white/10 hover:bg-white/10"
            >
              Открыть источник
            </button>
            <button
              onClick={onBookmark}
              className="flex-1 sm:flex-none px-3 py-2 rounded-xl ring-1 ring-white/10 hover:bg-white/10"
            >
              В закладки
            </button>
          </div>

          <div className="flex gap-2 sm:gap-3">
            <button
              onClick={onSpeak}
              disabled={!ttsOk}
              title={ttsOk ? 'Озвучить превью' : 'Озвучивание недоступно в этом браузере'}
              className={`px-3 py-2 rounded-xl ring-1 ring-white/10 ${
                ttsOk ? 'hover:bg-white/10' : 'opacity-50 cursor-not-allowed'
              }`}
            >
              Слушать
            </button>
            <button
              onClick={stop}
              className="px-3 py-2 rounded-xl ring-1 ring-white/10 hover:bg-white/10"
            >
              Стоп
            </button>
            <button
              onClick={onClose}
              className="px-3 py-2 rounded-xl bg-white/10 hover:bg-white/15 ring-1 ring-white/10"
            >
              Закрыть
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
