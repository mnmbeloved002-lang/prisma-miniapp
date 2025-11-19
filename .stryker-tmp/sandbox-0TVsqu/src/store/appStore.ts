// @ts-nocheck
import { create } from 'zustand'

export type AppStoreState = {
  searchQuery: string
  showBookmarksOnly: boolean
  setSearchQuery: (value: string) => void
  toggleShowBookmarksOnly: () => void
  reset: () => void
}

const initialState: Pick<AppStoreState, 'searchQuery' | 'showBookmarksOnly'> = {
  searchQuery: '',
  showBookmarksOnly: false,
}

export const useAppStore = create<AppStoreState>((set) => ({
  ...initialState,

  setSearchQuery: (value: string) => set({ searchQuery: value }),

  toggleShowBookmarksOnly: () =>
    set((state) => ({
      showBookmarksOnly: !state.showBookmarksOnly,
    })),

  reset: () => set(initialState),
}))
