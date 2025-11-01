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
import { usePersistentState } from '../utils/usePersistentState'
import { NewItemsBar } from './NewItemsBar'

export default function AppShell() {
  const [items, setItems] = useState<NewsItem[] | null>(null)
  const [err, setErr] = useState<string | null>(null)
  const [query, setQuery] = useState('')
  const [cats, setCats] = useState<Category[]>([])
  const [showBm, setShowBm] = useState(false)
  const [preview, setPreview] = useState<NewsItem | null>(null)

  // новые ещё не «показанные» пользователю элементы
  const [pending, setPending] = useState<NewsItem[]>([])
  const pollRef = useRef<number | null>(null)

  const debouncedQuery = useDebouncedValue(query, 300)

  // первичная загрузка
  useEffect(() => {
    getNewsCached().then(setItems).catch(() => setErr('Не удалось загрузить новости'))
  }, [])

  // простой опрос «свежака» раз в 120 сек (можно потом вынести в конфиг)
  useEffect(() => {
    // не опрашиваем, пока ещё первая загрузка не завершилась
    if (items === null) return
    const start = () => {
      stop()
      pollRef.current = window.setInterval(async () => {
        const fresh = await getNewsFresh()
        // сравним по id, отберём те, которых нет в текущих
        const currentIds = new Set((items ?? []).map(i => i.id))
        const unseen = fresh.filter(i => !currentIds.has(i.id))
        if (unseen.length) setPending(unseen)
      }, 120_000)
    }
    const stop = () => { if (pollRef.current) { clearInterval(pollRef.current); pollRef.current = null } }
    start()
    return stop
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [items])

  const filtered = useMemo(() => {
    const base = showBm ? bmList() : (items ?? [])
    return base.filter(n =>
      (cats.length ? cats.some(c => n.category.includes(c)) : true) &&
      (debouncedQuery ? (n.title + ' ' + n.summary).toLowerCase().includes(debouncedQuery.toLowerCase()) : true)
    )
  }, [items, showBm, cats, debouncedQuery])

  // Когда пользователь нажимает «Показать N новых»
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
