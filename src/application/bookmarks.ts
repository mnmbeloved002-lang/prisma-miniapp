import { storage } from '../infrastructure/storage';
import type { NewsItem } from '../domain/types';

const KEY = 'bm-v1';
type BmMap = Record<string, NewsItem>;

function load(): BmMap {
  return storage.get<BmMap>(KEY) ?? {};
}
function save(map: BmMap) {
  storage.set(KEY, map);
}

export function add(item: NewsItem) {
  const m = load();
  m[item.id] = item;
  save(m);
}

export function remove(id: string) {
  const m = load();
  delete m[id];
  save(m);
}

export function has(id: string): boolean {
  const m = load();
  return !!m[id];
}

export function list(): NewsItem[] {
  const m = load();
  return Object.values(m);
}

// совместимость со старым импортом `import { bm } ...`
export const bm = {
  add,
  remove,
  has,
  all: list,
  list,
};
