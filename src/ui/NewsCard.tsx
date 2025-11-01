import type { NewsItem } from '../domain/types';
import { has as bmHas, add as bmAdd, remove as bmRemove } from '../application/bookmarks';

export function NewsCard({
  item,
  onOpen,
}: {
  item: NewsItem;
  onOpen?: (n: NewsItem) => void;
}) {
  const inBm = bmHas(item.id);

  return (
    <article className="rounded-2xl overflow-hidden ring-1 ring-white/10 bg-surface text-text shadow-cinema">
      <div className="aspect-[16/9] overflow-hidden">
        <img
          src={item.image}
          alt={item.title}
          className="w-full h-full object-cover transition-transform duration-150 will-change-transform hover:scale-[1.01]"
          loading="lazy"
        />
      </div>

      <div className="p-4 flex flex-col gap-2">
        <div className="flex items-center gap-2 text-xs text-white/60">
          <span className="px-2 py-0.5 rounded-full bg-white/5 ring-1 ring-white/10">
            {item.source}
          </span>
          <time dateTime={item.publishedAt}>
            {new Date(item.publishedAt).toLocaleDateString()}
          </time>
        </div>

        <h3 className="text-base font-semibold leading-tight line-clamp-2">
          {item.title}
        </h3>

        <p className="text-sm text-white/70 line-clamp-2">{item.summary}</p>

        <div className="mt-2 flex items-center gap-2">
          <button
            onClick={() => {
              // ВАЖНО: показываем модалку, а не переходим по ссылке
              onOpen?.(item);
            }}
            className="px-3 py-1.5 text-sm rounded-lg bg-white/5 hover:bg-white/10 ring-1 ring-white/10"
          >
            Открыть
          </button>

          <button
            onClick={() => {
              if (inBm) {
                bmRemove(item.id);
              } else {
                bmAdd(item);
              }
            }}
            aria-pressed={inBm}
            className="px-3 py-1.5 text-sm rounded-lg ring-1 ring-white/10"
          >
            {inBm ? '★ В закладках' : '☆ В закладки'}
          </button>
        </div>
      </div>
    </article>
  );
}

export function NewsCardSkeleton() {
  return (
    <div className="rounded-2xl ring-1 ring-white/10 bg-surface text-text shadow-cinema overflow-hidden">
      <div className="aspect-[16/9] bg-white/5 animate-pulse" />
      <div className="p-4 space-y-2">
        <div className="h-3 w-20 bg-white/10 rounded" />
        <div className="h-4 w-11/12 bg-white/10 rounded" />
        <div className="h-4 w-9/12 bg-white/10 rounded" />
        <div className="h-8 w-28 bg-white/10 rounded mt-3" />
      </div>
    </div>
  );
}
