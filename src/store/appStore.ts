import { create } from 'zustand'

export type AppStoreState = {
  zodiacSign: string | null          // Весы, Овен и т.д.
  mood: string | null                // "мотивированный", "спокойный" и т.д.
  streak: number                     // Счетчик дней подряд
  setZodiacSign: (sign: string) => void
  setMood: (mood: string) => void
  incrementStreak: () => void
  resetStreak: () => void
}

const initialState = {
  zodiacSign: null,
  mood: null,
  streak: 0,
}

export const useAppStore = create<AppStoreState>((set) => ({
  ...initialState,
  setZodiacSign: (sign) => set({ zodiacSign: sign }),
  setMood: (mood) => set({ mood }),
  incrementStreak: () => set((state) => ({ streak: state.streak + 1 })),
  resetStreak: () => set({ streak: 0 }),
}))
