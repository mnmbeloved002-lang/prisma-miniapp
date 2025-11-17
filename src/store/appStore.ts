import { create } from 'zustand';

export type SortOrder = 'newest' | 'oldest';

interface UiState {
  tagFilter: string | null;
  searchQuery: string;
  sortOrder: SortOrder;
  showBookmarksOnly: boolean;
  ttsEnabled: boolean;
}

interface UiActions {
  setTagFilter: (tag: string | null) => void;
  setSearchQuery: (q: string) => void;
  setSortOrder: (order: SortOrder) => void;
  toggleBookmarksOnly: () => void;
  setTtsEnabled: (enabled: boolean) => void;
}

export type AppStore = UiState & UiActions;

export const useAppStore = create<AppStore>((set) => ({
  tagFilter: null,
  searchQuery: '',
  sortOrder: 'newest',
  showBookmarksOnly: false,
  ttsEnabled: true,

  setTagFilter: (tagFilter) => set({ tagFilter }),
  setSearchQuery: (searchQuery) => set({ searchQuery }),
  setSortOrder: (sortOrder) => set({ sortOrder }),
  toggleBookmarksOnly: () =>
    set((state) => ({ showBookmarksOnly: !state.showBookmarksOnly })),
  setTtsEnabled: (ttsEnabled) => set({ ttsEnabled }),
}));
