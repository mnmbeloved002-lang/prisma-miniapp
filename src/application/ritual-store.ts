import { create } from 'zustand';

import type { Ritual } from '../domain/ritual-schema';
import { getRitualCached } from '../infrastructure/ritual-client';

interface RitualState {
  ritualItem: Ritual | null;
  loading: boolean;
  error: string | null;
  fetchRitual: () => Promise<void>;
}

export const useRitualStore = create<RitualState>((set) => ({
  ritualItem: null,
  loading: false,
  error: null,

  fetchRitual: async () => {
    set({ loading: true, error: null });

    try {
      const data = await getRitualCached();
      set({ ritualItem: data, loading: false });
    } catch (err) {
      console.error('Store Error:', err);
      set({
        error: err instanceof Error ? err.message : 'Неизвестная ошибка загрузки',
        loading: false,
      });
    }
  },
}));
