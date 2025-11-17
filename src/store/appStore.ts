// src/store/appStore.ts
import { create } from 'zustand'

type ViewMode = 'all' | 'bookmarks'

interface AppState {
  // Глобальный поиск по новостям
  searchQuery: string
  // Режим "показывать только закладки"
  showBookmarksOnly: boolean
  // Режим представления (если понадобится расширять)
  viewMode: ViewMode

  // actions
  setSearchQuery: (value: string) => void
  setShowBookmarksOnly: (value: boolean) => void
  toggleShowBookmarksOnly: () => void
  setViewMode: (mode: ViewMode) => void
}

export const useAppStore = create<AppState>((set) => ({
  searchQuery: '',
  showBookmarksOnly: false,
  viewMode: 'all',

  setSearchQuery: (value) =>
    set({
      searchQuery: value,
    }),

  setShowBookmarksOnly: (value) =>
    set({
      showBookmarksOnly: value,
      viewMode: value ? 'bookmarks' : 'all',
    }),

  toggleShowBookmarksOnly: () =>
    set((state) => {
      const next = !state.showBookmarksOnly
      return {
        showBookmarksOnly: next,
        viewMode: next ? 'bookmarks' : 'all',
      }
    }),

  setViewMode: (mode) =>
    set({
      viewMode: mode,
      showBookmarksOnly: mode === 'bookmarks',
    }),
}))
