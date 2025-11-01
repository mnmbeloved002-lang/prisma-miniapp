import { useEffect, useMemo, useRef, useState } from 'react'
import { getNewsCached, getNewsFresh } from '../infrastructure/api-client'
import type { NewsItem, Category } from '../domain/types'
import { Header } from './Header'
import { FilterBar } from './FilterBar'
import { NewsCard, NewsCardSkeleton } from './NewsCard'
import { EmptyState } from './EmptyState'
import { ErrorBanner } from './ErrorBanner'
import { openLink } from '../utils/nav'
import { list as bmList, has as bmHas, add as bmAdd, remove as bmRemove } from '../application/bookmarks'
import { ReaderPreview } from './ReaderPreview'
import { speakFromHtml } from '../application/tts'
import { useDebouncedValue } from '../utils/useDebouncedValue'
import { NewItemsBar } from './NewItemsBar'

export default function AppShell() {
  const [items, setItems] = useState<NewsItem[] | null>(null)
  const [err, setErr] = useState<string | null>(null)
  const [query, setQuery] = useState('')
  const [cats, setCats] = useState<Category[]>([])
  const [showBm, setShowBm] = useState(false)
  const [preview, setPreview] = useState<NewsItem | null>(null)

  const [pending, setPending] = useState<NewsItem[]>([])
  const pollRef = useRef<number | null>(null)

  const debouncedQuery = useDebouncedValue(query, 300)

  useEffect(() => {
    getNewsCached().then(setItems).catch(() => setErr('Не удалось загрузить новости'))
  }, [])

  // опрос свежих новостей раз в 120 сек
  useEffect(() => {
    if (items === null) return
    const stop = () => { if (pollRef.current) { clearInterval(pollRef.current); pollRef.current = null } }
    const start = () => {
      stop()
      pollRef.current = window.setInterval(async () => {
        const fresh = await getNewsFresh()
        const currentIds = new Set((items ?? []).map(i => i.id))
        const unseen = fresh.filter(i => !currentIds.has(i.id))
        if (unseen.length) setPending(unseen)
      }, 120_000)
    }
    start()
    return stop
    // eslint-disable-next-line
  }, [items])

  const filtered = useMemo(() => {
    const base = showBm ? bmList() : (items ?? [])
    return base.filter(n =>
      (cats.length ? cats.some(c => n.category.includes(c)) : true) &&
      (debouncedQuery ? (n.title + ' ' + n.summary).toLowerCase().includes(debouncedQuery.toLowerCase()) : true)
    )
  }, [items, showBm, cats, debouncedQuery])

  const revealPending = async () => {
    if (!pending.length) return
    const fresh = await getNewsFresh()
    setItems(fresh)
    setPending([])
  }

  return (
    <div className="min-h-screen">
      <Header
        onSearch={setQuery}
        onToggleBookmarks={() => setShowBm(v => !v)}
        showBookmarks={showBm}
      />

      <NewItemsBar count={pending.length} onShow={revealPending} />

      {err && <ErrorBanner message={err} onRetry={() => location.reload()} />}

      <FilterBar selected={cats} onChange={setCats} total={filtered.length} />

      <main className="container mx-auto px-4 py-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {items === null
          ? Array.from({ length: 6 }).map((_, i) => <NewsCardSkeleton key={i} />)
          : filtered.length
            ? filtered.map(n => <NewsCard key={n.id} item={n} onOpen={setPreview} />)
            : <EmptyState />}
      </main>

      {preview && (
        <ReaderPreview
          html={preview.previewHtml}
          onOpenSource={() => openLink(preview.canonicalUrl)}
          onBookmark={() => {
            if (bmHas(preview.id)) bmRemove(preview.id)
            else bmAdd(preview)
          }}
          onSpeak={() => speakFromHtml(preview.title, preview.previewHtml)}
          onClose={() => setPreview(null)}
        />
      )}
    </div>
  )
}
