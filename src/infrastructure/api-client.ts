import { CACHE_TTL_MS } from '../config';
import { storage } from './storage';
import type { NewsItem } from '../domain/types';

type CacheEntry = { ts: number; etag?: string; data: NewsItem[] };
const KEY = 'news-cache-v1';

async function fetchWithCache(headers: Record<string, string> = {}) {
  const res = await fetch('/news.json', { headers });
  const etag = res.headers.get('ETag') ?? undefined;
  const data = await res.json() as NewsItem[];
  storage.set(KEY, { ts: Date.now(), etag, data });
  return { etag, data };
}

export async function getNewsCached(): Promise<NewsItem[]> {
  const cached = storage.get<CacheEntry>(KEY);
  const headers: Record<string, string> = {};
  if (cached?.etag) headers['If-None-Match'] = cached.etag;

  const freshAllowed = !cached || (Date.now() - cached.ts) > CACHE_TTL_MS;
  if (!freshAllowed && cached?.data) return cached.data;

  try {
    const res = await fetch('/news.json', { headers });
    if (res.status === 304 && cached?.data) return cached.data;
    const etag = res.headers.get('ETag') ?? undefined;
    const data = await res.json() as NewsItem[];
    storage.set(KEY, { ts: Date.now(), etag, data });
    return data;
  } catch (e) {
    if (cached?.data) return cached.data; // оффлайн фолбэк
    throw e;
  }
}

// Принудительно игнорируем TTL, аккуратно обновляя кэш
export async function getNewsFresh(): Promise<NewsItem[]> {
  const cached = storage.get<CacheEntry>(KEY);
  try {
    const headers: Record<string, string> = {};
    if (cached?.etag) headers['If-None-Match'] = cached.etag;
    const res = await fetch('/news.json', { headers });
    if (res.status === 304 && cached?.data) return cached.data;
    const etag = res.headers.get('ETag') ?? undefined;
    const data = await res.json() as NewsItem[];
    storage.set(KEY, { ts: Date.now(), etag, data });
    return data;
  } catch {
    return cached?.data ?? [];
  }
}
