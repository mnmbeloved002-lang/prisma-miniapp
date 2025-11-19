// @ts-nocheck
import { useState, useEffect, useRef, lazy, Suspense, memo } from "react";




import { list as bmList, has as bmHas, add as bmAdd, remove as bmRemove } from '../application/bookmarks'
import type { NewsItem, Category } from '../domain/types'
import { getNewsCached } from '../infrastructure/api-client'
import { useAppStore } from '../store/appStore'
import { openLink } from '../utils/nav'
import { useDebouncedValue } from '../utils/useDebouncedValue'

import { EmptyState } from './EmptyState'
import { ErrorBanner } from './ErrorBanner'
import { FilterBar } from './FilterBar'
import { Header } from './Header'
import { NewsCard, NewsCardSkeleton } from './NewsCard'

const ReaderPreview = lazy(() => import('./ReaderPreview'))

export default function AppShell() {
  const [items, setItems] = useState<NewsItem[] | null>(null)
  const [err, setErr] = useState<string | null>(null)
  const [cats, setCats] = useState<Category[]>([])
  const [preview, setPreview] = useState<NewsItem | null>(null)

  // Глобальный стор (Zustand): поиск и "только закладки"
  const searchQuery = useAppStore(state => state.searchQuery)
  const setSearchQuery = useAppStore(state => state.setSearchQuery)

  const showBookmarksOnly = useAppStore(state => state.showBookmarksOnly)
  const toggleShowBookmarksOnly = useAppStore(state => state.toggleShowBookmarksOnly)

  const debouncedQuery = useDebouncedValue(searchQuery, 300)

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

  const current = showBookmarksOnly ? bmList() : filtered

  return (
    <div className="min-h-screen bg-bg text-fg">
      <Header
        onSearch={value => setSearchQuery(value)}
        onToggleBookmarks={() => toggleShowBookmarksOnly()}
        showBookmarks={showBookmarksOnly}
      />

      {err && <ErrorBanner message={err} onRetry={() => location.reload()} />}

      <FilterBar selected={cats} onChange={setCats} total={current.length} />

      <main className="container mx-auto px-4 py-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {items === null
          ? Array.from({ length: 6 }).map((_, i) => <NewsCardSkeleton key={i} />)
          : current.length
            ? current.map((n, i) => (
                <NewsCard
                  key={n.id}
                  item={n}
                  onOpen={setPreview}
                  priority={i === 3}
                />
              ))
            : <EmptyState />}
      </main>

      <Suspense fallback={null}>
        {preview && (
          <ReaderPreview
            html={preview.previewHtml}
            onOpenSource={() => {
              openLink(preview.canonicalUrl)
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
