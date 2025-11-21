import '@testing-library/jest-dom'
import { cleanup } from '@testing-library/react'
import { afterEach, vi } from 'vitest'

// Очистка после каждого теста
afterEach(() => {
  cleanup()
  localStorage.clear()
})

// Глобальный мок localStorage для всех тестов
const localStorageMock = (function() {
  let store: Record<string, string> = {}
  return {
    getItem: vi.fn((key: string) => store[key] || null),
    setItem: vi.fn((key: string, value: string) => { store[key] = value.toString() }),
    clear: vi.fn(() => { store = {} }),
    removeItem: vi.fn((key: string) => { delete store[key] }),
    length: 0,
    key: vi.fn((index: number) => null),
  }
})()

vi.stubGlobal('localStorage', localStorageMock)
