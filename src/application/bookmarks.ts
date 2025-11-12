// src/application/bookmarks.ts
import type { NewsItem } from '../domain/types'
import { storage } from '../infrastructure/storage'

const KEY = 'bookmarks-v1'

let cache: NewsItem[] | null = null
let loaded = false

function ensureLoaded() {
  if (!loaded) {
    loaded = true
    const data = storage.get<NewsItem[]>(KEY)
    cache = Array.isArray(data) ? data.slice() : []
  }
}

function persist() {
/* c8 ignore next */
  if (cache !== null) {
    storage.set(KEY, cache)
  }
}

export function list(): NewsItem[] {
  ensureLoaded()
  return cache!.slice()
}

export function getList(): NewsItem[] {
  return list()
}

export function has(id: string): boolean {
  ensureLoaded()
  return cache!.some((n) => n.id === id)
}

export function add(item: NewsItem): void {
  ensureLoaded()
  if (has(item.id)) return
  // Добавляем в начало списка (новые закладки сверху)
  cache = [item, ...cache!]
  persist()
}

export function remove(id: string): void {
  ensureLoaded()
  const initialLength = cache!.length
  cache = cache!.filter((n) => n.id !== id)
  if (cache.length !== initialLength) {
    persist()
  }
}

export function toggle(item: NewsItem): void {
  if (has(item.id)) {
    remove(item.id)
  } else {
    add(item)
  }
}

// Синхронизация между вкладками
/* c8 ignore next */
if (typeof window !== 'undefined') {
  window.addEventListener('storage', (e) => {
    if (e.key === KEY) {
      loaded = false // Форсим перечитывание при следующем обращении
      cache = null
      // Опционально: можно диспатчить кастомное событие для уведомления UI
      // window.dispatchEvent(new CustomEvent('bookmarks-changed'))
    }
  })
}

/** Вспомогательно для unit-тестов */
export function __unsafe__resetForTests(seed?: NewsItem[]) {
  loaded = false
  cache = null
  if (seed !== undefined) {
    cache = [...seed]
    loaded = true
    storage.set(KEY, cache) // Синхронизируем с storage для тестов
  } else {
    storage.del(KEY) // Полная очистка
  }
}
