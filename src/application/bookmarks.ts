// src/application/bookmarks.ts
import { storage } from '../infrastructure/storage';
import type { NewsItem } from '../domain/types';

const KEY = 'bookmarks-v1';

/**
 * Внутренняя функция для получения текущего списка из storage.
 */
function getList(): NewsItem[] {
  return storage.get<NewsItem[]>(KEY) ?? [];
}

/**
 * Возвращает полный список закладок.
 */
export function list(): NewsItem[] {
  return getList();
}

/**
 * Проверяет, есть ли ID в закладках.
 */
export function has(id: string): boolean {
  // Мы не кэшируем результат, чтобы React всегда видел свежие данные
  return getList().some(item => item.id === id);
}

/**
 * Добавляет новость в закладки, если ее там еще нет.
 */
export function add(item: NewsItem): void {
  const items = getList();
  if (!items.some(i => i.id === item.id)) {
    storage.set(KEY, [...items, item]);
  }
}

/**
 * Удаляет новость из закладок по ID.
 */
export function remove(id: string): void {
  const items = getList();
  const filtered = items.filter(item => item.id !== id);

  // Перезаписываем, только если что-то изменилось
  if (filtered.length !== items.length) {
    storage.set(KEY, filtered);
  }
}

/**
 * Переключает состояние закладки (добавляет, если нет / удаляет, если есть).
 */
export function toggle(item: NewsItem): void {
  if (has(item.id)) {
    remove(item.id);
  } else {
    add(item);
  }
}
