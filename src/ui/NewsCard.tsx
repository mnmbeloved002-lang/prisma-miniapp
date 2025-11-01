// src/ui/NewsCard.tsx
import { motion } from 'framer-motion'
import type { NewsItem } from '../domain/types'
import { SourceChip } from './SourceChip'
import { has as bmHas, add as bmAdd, remove as bmRemove } from '../application/bookmarks'

type Props = {
  item: NewsItem
  onOpen?: (item: NewsItem) => void
}

export function NewsCard({ item, onOpen }: Props) {
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
      className="group bg-[var(--surface)] rounded-2xl ring-1 ring-white/5 shadow-cinema overflow-hidden hover:ring-white/10 transition-all"
    >
      <div className="aspect-[16/9] w-full overflow-hidden">
        <img
          src={item.image}
          alt={item.title}
          className="w-full h-full object-cover transition-transform duration-200 group-hover:scale-[1.02]"
          loading="lazy"
          decoding="async"
        />
      </div>

      <div className="p-4 flex flex-col gap-2">
        <div className="flex items-center justify-between gap-2">
          <SourceChip brand={item.source} />
          <time className="text-xs text-white/50">{date}</time>
        </div>

        <h3 className="text-[15px] sm:text-[16px] leading-snug line-clamp-2">
          {item.title}
        </h3>

        <p className="text-sm text-white/70 line-clamp-2">{item.summary}</p>

        <div className="mt-2 flex gap-2">
          <button
            onClick={() => onOpen?.(item)}
            className="flex-1 px-3 py-2 rounded-xl ring-1 ring-white/10 hover:bg-white/10"
          >
            Открыть
          </button>

          <button
            onClick={() => {
              if (inBm) bmRemove(item.id)
              else bmAdd(item)
            }}
            aria-pressed={inBm}
            className="px-3 py-2 rounded-xl ring-1 ring-white/10 hover:bg-white/10"
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
    <div className="rounded-2xl ring-1 ring-white/5 bg-[var(--surface)] overflow-hidden">
      <div className="aspect-[16/9] bg-white/5 animate-pulse" />
      <div className="p-4 space-y-2">
        <div className="h-4 w-1/3 bg-white/10 rounded" />
        <div className="h-4 w-5/6 bg-white/10 rounded" />
        <div className="h-4 w-2/3 bg-white/10 rounded" />
        <div className="h-9 w-full bg-white/5 rounded-xl" />
      </div>
    </div>
  )
}
