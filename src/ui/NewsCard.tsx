// src/ui/NewsCard.tsx
import React from 'react'

export type NewsItem = {
  id: string
  title: string
  description?: string
  image?: string
  source?: string
  category?: string[]
  publishedAt?: string | number | Date
}

type Props = {
  item: NewsItem
  isBookmarked?: boolean
  onOpen?: (item: NewsItem) => void
  onBookmark?: (item: NewsItem) => void
}

export default function NewsCard({ item, isBookmarked, onOpen, onBookmark }: Props) {
  const { title, description, image, category, publishedAt } = item

  const handleOpen = () => onOpen?.(item)
  const handleBookmark = () => onBookmark?.(item)

  const dateLabel = publishedAt ? new Date(publishedAt).toLocaleString() : ''

  return (
    <article
      className="group bg-surface rounded-2xl ring-1 ring-white/5 shadow-cinema overflow-hidden hover:ring-white/10 transition-all"
      data-testid="news-card"
    >
      <div className="aspect-[16/9] w-full overflow-hidden">
        {/* alt = title (для a11y и тестов) */}
        <img
          alt={title}
          src={image}
          className="w-full h-full object-cover transition-transform duration-200 group-hover:scale-[1.02]"
          decoding="async"
          loading="lazy"
        />
      </div>

      <div className="p-4 flex flex-col gap-2">
        <div className="flex items-center justify-between gap-2">
          <span className="inline-flex items-center gap-2 px-2.5 py-1 rounded-lg bg-white/5 ring-1 ring-white/10">
            {/* мини-иконка-«логотип» источника/категории (заглушка) */}
            <span aria-hidden="true" className="w-4 h-4 rounded-sm bg-white/10" />
            <span className="text-xs text-muted">
              {category?.[0] ?? 'новости'}
            </span>
          </span>

          {dateLabel && (
            <time className="text-xs text-muted" dateTime={new Date(publishedAt!).toISOString()}>
              {dateLabel}
            </time>
          )}
        </div>

        <h3 className="text-[15px] sm:text-[16px] leading-snug line-clamp-2 text-text">
          {title}
        </h3>

        {description && (
          <p className="text-sm text-muted line-clamp-2">{description}</p>
        )}

        <div className="mt-2 flex gap-2">
          <button
            type="button"
            className="flex-1 px-3 py-2 rounded-xl ring-1 ring-white/10 hover:bg-white/10"
            onClick={handleOpen}
          >
            Открыть
          </button>
          <button
            type="button"
            className="px-3 py-2 rounded-xl ring-1 ring-white/10 hover:bg-white/10"
            title={isBookmarked ? 'Убрать из закладок' : 'В закладки'}
            aria-pressed={!!isBookmarked}
            onClick={handleBookmark}
          >
            {isBookmarked ? '★' : '☆'}
          </button>
        </div>
      </div>
    </article>
  )
}
