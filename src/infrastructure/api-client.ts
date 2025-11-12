import { CACHE_TTL_MS } from '../config';
import { storage } from './storage';
import type { NewsItem } from '../domain/types';

// 1. Определяем тип *реального* ответа от API
type NewsResponse = {
  news: NewsItem[];
  [key: string]: unknown; // Позволяем иметь другие поля (timestamp, etc.)
};

type CacheEntry = { ts: number; etag?: string; data: NewsItem[] };
const KEY = 'news-cache-v1';

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

    // --- ИСПРАВЛЕНИЕ ЗДЕСЬ ---
    // Получаем ВЕСЬ объект, как он есть
    const responseJson = (await res.json()) as NewsResponse;
    // Извлекаем из него массив новостей
    const data = responseJson.news;
    // --- КОНЕЦ ИСПРАВЛЕНИЯ ---

    // Дополнительная защита, чтобы сделать систему "ещё лучше"
    if (!Array.isArray(data)) {
      throw new Error('Invalid API response: "news" field is not an array.');
    }

    storage.set(KEY, { ts: Date.now(), etag, data });
    return data;
  } catch (e) {
    console.error('Failed to fetch news', e);
    if (cached?.data) return cached.data; // оффлайн фолбэк
    throw new Error('Network failed and no cache available');
  }
}

// Принудительно тянем свежак (мимо TTL), аккуратно обновляя кэш
export async function getNewsFresh(): Promise<NewsItem[]> {
  const cached = storage.get<CacheEntry>(KEY);
  try {
    const headers: Record<string, string> = {};
    if (cached?.etag) headers['If-None-Match'] = cached.etag;
    const res = await fetch('/news.json', { headers });
    if (res.status === 304 && cached?.data) return cached.data;
    const etag = res.headers.get('ETag') ?? undefined;

    // --- ИСПРАВЛЕНИЕ ЗДЕСЬ (аналогично) ---
    const responseJson = (await res.json()) as NewsResponse;
    const data = responseJson.news;
    // --- КОНЕЦ ИСПРАВЛЕНИЯ ---

    // Дополнительная защита
    if (!Array.isArray(data)) {
      console.error('Invalid fresh API response: "news" field is not an array.');
      return cached?.data ?? []; // Безопасно отдаем кэш
    }

    storage.set(KEY, { ts: Date.now(), etag, data });
    return data;
  } catch (e) {
    console.error('Failed to fetch fresh news', e);
    return cached?.data ?? [];
  }
}
