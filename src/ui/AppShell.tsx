import { useEffect, useState } from 'react';
import { getNewsCached } from '../infrastructure/api-client';
import type { NewsItem, Category } from '../domain/types';
import { Header } from './Header';
import { FilterBar } from './FilterBar';
import { NewsCard, NewsCardSkeleton } from './NewsCard';
import { EmptyState } from './EmptyState';
import { ErrorBanner } from './ErrorBanner';

export default function AppShell() {
  const [items, setItems] = useState<NewsItem[] | null>(null);
  const [err, setErr] = useState<string | null>(null);
  const [query, setQuery] = useState('');
  const [cats, setCats] = useState<Category[]>([]);

  useEffect(() => {
    getNewsCached().then(setItems).catch(() => setErr('Не удалось загрузить новости'));
  }, []);

  const filtered = (items ?? []).filter(n =>
    (cats.length ? cats.some(c => n.category.includes(c)) : true) &&
    (query ? (n.title + ' ' + n.summary).toLowerCase().includes(query.toLowerCase()) : true)
  );

  return (
    <div className="min-h-screen">
      <Header onSearch={setQuery} />
      {err && <ErrorBanner message={err} onRetry={() => location.reload()} />}
      <FilterBar selected={cats} onChange={setCats} total={filtered.length} />
      <main className="container mx-auto px-4 py-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {items === null
          ? Array.from({ length: 6 }).map((_, i) => <NewsCardSkeleton key={i} />)
          : filtered.length
            ? filtered.map(n => <NewsCard key={n.id} item={n} />)
            : <EmptyState />}
      </main>
    </div>
  );
}
