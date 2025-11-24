import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface BookmarksState {
  ids: string[];
  has: (id: string) => boolean;
  add: (id: string) => void;
  remove: (id: string) => void;
}

export const useBookmarks = create<BookmarksState>()(
  persist(
    (set, get) => ({
      ids: [],
      has: (id) => get().ids.includes(id),
      // 🛡️ L4 Fix: Проверяем наличие перед добавлением
      add: (id) => set((state) => (state.ids.includes(id) ? state : { ids: [...state.ids, id] })),
      remove: (id) => set((state) => ({ ids: state.ids.filter((i) => i !== id) })),
    }),
    { name: 'bookmarks-storage' },
  ),
);
