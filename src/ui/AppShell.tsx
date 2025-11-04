import { useEffect, useState, lazy, Suspense } from 'react'
import { getNewsCached } from '../infrastructure/api-client'
import type { NewsItem, Category } from '../domain/types'
import { Header } from './Header'
import { FilterBar } from './FilterBar'
import { NewsCard, NewsCardSkeleton } from './NewsCard'
import { EmptyState } from './EmptyState'
import { ErrorBanner } from './ErrorBanner'
import { list as bmList, has as bmHas, add as bmAdd, remove as bmRemove } from '../application/bookmarks'
import { useDebouncedValue } from '../utils/useDebouncedValue'

// лениво подгружаем ридер
const ReaderPreview = lazy(() => import('./ReaderPreview'))

export default function AppShell() {
  const [items, setItems] = useState<NewsItem[] | null>(null)
  const [err, setErr] = useState<string | null>(null)
  const [query, setQuery] = useState('')
  const [cats, setCats] = useState<Category[]>([])
  const [showBm, setShowBm] = useState(false)
  const [preview, setPreview] = useState<NewsItem | null>(null)

  const debouncedQuery = useDebouncedValue(query, 300)

  useEffect(() => {
    getNewsCached()
      .then(setItems)
      .catch(() => setErr('Не удалось загрузить новости'))
  }, [])

  const filtered = (items ?? []).filter(n =>
    (cats.length ? cats.some(c => n.category.includes(c)) : true) &&
    (debouncedQuery
      ? (n.title + ' ' + n.summary).toLowerCase().includes(debouncedQuery.toLowerCase())
      : true)
  )

  const current = showBm ? bmList() : filtered

  return (
    <div className="min-h-screen bg-bg text-fg">
      <Header
        onSearch={setQuery}
        onToggleBookmarks={() => setShowBm(v => !v)}
        showBookmarks={showBm}
      />

      {err && <ErrorBanner message={err} onRetry={() => location.reload()} />}

      <FilterBar selected={cats} onChange={setCats} total={current.length} />

      <main className="container mx-auto px-4 py-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {items === null
          ? Array.from({ length: 6 }).map((_, i) => <NewsCardSkeleton key={i} />)
          : current.length
            ? current.map(n => <NewsCard key={n.id} item={n} onOpen={setPreview} />)
            : <EmptyState />}
      </main>

      <Suspense fallback={null}>
        {preview && (
          <ReaderPreview
            html={preview.previewHtml}
            onOpenSource={() => {
              try {
                window.open(preview.canonicalUrl, '_blank', 'noopener,noreferrer')
              } catch {
                window.location.assign(preview.canonicalUrl)
              }
            }}
            onBookmark={() => {
              if (bmHas(preview.id)) bmRemove(preview.id)
              else bmAdd(preview)
            }}
            onClose={() => setPreview(null)}
          />
        )}
      </Suspense>
    </div>
  )
}
