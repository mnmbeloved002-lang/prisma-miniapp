// src/ui/NewsCard.tsx
import { useState } from 'react'
import { motion } from 'framer-motion'
import type { NewsItem } from '../domain/types'
import { SourceChip } from './SourceChip'
import { has as bmHas, add as bmAdd, remove as bmRemove } from '../application/bookmarks'

type Props = {
  item: NewsItem
  onOpen?: (item: NewsItem) => void
  /** Делает изображение карточки приоритетным для LCP */
  priority?: boolean
}

// Генерируем компактный SVG-заглушку (data URL)
function svgFallback(title: string): string {
  const label = (title || 'Новость').slice(0, 32)
  const svg = encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" width="800" height="450" viewBox="0 0 800 450">
      <defs>
        <linearGradient id="g" x1="0" x2="1" y1="0" y2="1">
          <stop stop-color="#1e293b" offset="0"/>
          <stop stop-color="#0f172a" offset="1"/>
        </linearGradient>
      </defs>
      <rect width="800" height="450" fill="url(#g)"/>
      <g fill="#94a3b8" font-family="system-ui, -apple-system, Segoe UI, Roboto, Arial" text-anchor="middle">
        <text x="400" y="215" font-size="26" opacity="0.9">Изображение недоступно</text>
        <text x="400" y="255" font-size="20" opacity="0.7">${label}</text>
      </g>
    </svg>`
  )
  return `data:image/svg+xml;charset=utf-8,${svg}`
}

export function NewsCard({ item, onOpen, priority }: Props) {
  const inBm = bmHas(item.id)
  const d = new Date(item.publishedAt)
  const date = d.toLocaleDateString(undefined, { day: '2-digit', month: 'short' })

  // Управляем src и помечаем, что перешли на fallback (для предотвращения циклов)
  const [imgSrc, setImgSrc] = useState<string>(item.image)
  const [isFallback, setIsFallback] = useState(false)

  const handleImgError = () => {
    if (!isFallback) {
      setImgSrc(svgFallback(item.title))
      setIsFallback(true) // пометка — нужно для теста и чтобы избежать повторной подмены
    }
  }

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
          src={imgSrc}
          alt={item.title}
          onError={handleImgError}
          data-fallback={isFallback ? '1' : undefined}
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-[1.05]"
          loading={priority ? 'eager' : 'lazy'}
          fetchPriority={priority ? 'high' : 'auto'}
          decoding="async"
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
