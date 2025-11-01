import type { NewsItem } from "../domain/types";
import { storage } from "../infrastructure/storage";
const KEY = "bookmarks-v1";

export function list(): NewsItem[] { return storage.get<NewsItem[]>(KEY) ?? []; }
export function has(id: string){ return list().some(x=>x.id===id); }
export function add(item: NewsItem){
  const all = list(); if (!all.find(x=>x.id===item.id)) storage.set(KEY, [...all, item]);
}
export function remove(id: string){ storage.set(KEY, list().filter(x=>x.id!==id)); }
