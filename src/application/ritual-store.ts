import { create } from 'zustand'
import { loadTodayRitual } from './ritual-service'
import type { Ritual } from '../domain/ritual-types'

type RitualState = {
  ritual: Ritual | null
  error: string | null
  loading: boolean
  fetchRitual: () => Promise<void>
}

export const useRitualStore = create<RitualState>((set) => ({
  ritual: null,
  error: null,
  loading: true,
  fetchRitual: async () => {
    set({ loading: true, error: null })
    try {
      const data = await loadTodayRitual()
      set({ ritual: data, loading: false })
    } catch (e) {
      set({ error: 'Не удалось загрузить ритуал', loading: false })
    }
  },
}))
