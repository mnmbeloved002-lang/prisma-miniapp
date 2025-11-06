// src/ui/NewsCard.tsx
import { motion } from 'framer-motion'
import type { SyntheticEvent } from 'react'
import type { NewsItem } from '../domain/types'
import { SourceChip } from './SourceChip'
import { has as bmHas, add as bmAdd, remove as bmRemove } from '../application/bookmarks'

type Props = {
  item: NewsItem
  onOpen?: (item: NewsItem) => void
  /** Делает картинку LCP-дружественной для первой карточки */
  priority?: boolean
}

// Неброский SVG-заполнитель, чтобы не было «битой» иконки
const FALLBACK_SVG =
  'data:image/svg+xml;charset=UTF-8,' +
  encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 450" role="img" aria-label="no image">
      <defs>
        <linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stop-color="#1a1d24"/>
          <stop offset="1" stop-color="#0f1217"/>
        </linearGradient>
      </defs>
      <rect width="800" height="450" fill="url(#g)"/>
      <g fill="#9aa3b2" font-family="system-ui, -apple-system, Segoe UI, Roboto, sans-serif">
        <text x="50%" y="50%" font-size="24" text-anchor="middle" dominant-baseline="middle">no image</text>
      </g>
    </svg>`
  )

function handleImgError(e: SyntheticEvent<HTMLImageElement>) {
  const img = e.currentTarget
  // чтобы не зациклиться, если вдруг и fallback не загрузится
  if (img.dataset.fallback === '1') return
  img.dataset.fallback = '1'
  img.src = FALLBACK_SVG
  img.decoding = 'async'
  img.loading = 'lazy'
}

export function NewsCard({ item, onOpen, priority }: Props) {
  const inBm = bmHas(item.id)
  const d = new Date(item.publishedAt)
  const date = d.toLocaleDateString(undefined, { day: '2-digit', month: 'short' })

  return (
    <motion.article
      layout
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 8 }}
      transition={{ duration: 0.25 }}
      className="group bg-surface rounded-2xl shadow-cinema overflow-hidden hover:shadow-card hover:scale-[1.02] border border-white/5 hover:border-white/10 transition-all duration-300"
    >
      <div className="aspect-[16/9] w-full overflow-hidden">
        <img
          src={item.image}
          alt={item.title}
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-[1.05]"
          loading={priority ? 'eager' : 'lazy'}
          fetchPriority={priority ? 'high' : 'auto'}
          decoding="async"
          onError={handleImgError}
        />
      </div>

      <div className="p-4 flex flex-col gap-3">
        <div className="flex items-center justify-between gap-2">
          <SourceChip brand={item.source} />
          <time className="text-xs text-muted font-medium">{date}</time>
        </div>

        <h3 className="text-[15px] sm:text-[16px] leading-snug text-text line-clamp-2 font-medium group-hover:text-primary/90 transition-colors">
          {item.title}
        </h3>

        <p className="text-sm text-muted line-clamp-2 leading-relaxed">{item.summary}</p>

        <div className="mt-2 flex gap-2">
          <button
            onClick={() => onOpen?.(item)}
            className="flex-1 px-3 py-2 rounded-xl bg-surface border border-white/10 text-text hover:bg-surface-hover hover:border-white/20 active:scale-95 transition-all duration-150 font-medium"
          >
            Открыть
          </button>

          <button
            onClick={() => {
              if (inBm) bmRemove(item.id)
              else bmAdd(item)
            }}
            aria-pressed={inBm}
            className="px-3 py-2 rounded-xl bg-surface border border-white/10 text-text hover:bg-surface-hover hover:border-white/20 active:scale-95 transition-all duration-150"
            title={inBm ? 'Удалить из закладок' : 'В закладки'}
          >
            {inBm ? '★' : '☆'}
          </button>
        </div>
      </div>
    </motion.article>
  )
}

export function NewsCardSkeleton() {
  return (
    <div
      className="rounded-2xl border border-white/5 bg-surface overflow-hidden shadow-cinema"
      data-testid="news-card-skeleton"
    >
      <div className="aspect-[16/9] bg-muted/20 animate-pulse" />
      <div className="p-4 space-y-3">
        <div className="flex justify-between">
          <div className="h-4 w-1/3 bg-muted/30 rounded" />
          <div className="h-4 w-1/4 bg-muted/30 rounded" />
        </div>
        <div className="h-4 w-5/6 bg-muted/30 rounded" />
        <div className="h-4 w-2/3 bg-muted/30 rounded" />
        <div className="h-9 w-full bg-muted/20 rounded-xl" />
      </div>
    </div>
  )
}
