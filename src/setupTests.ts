// src/setupTests.ts

import '@testing-library/jest-dom/vitest';
import { cleanup } from '@testing-library/react';
import { afterEach, vi } from 'vitest';

// Очистка после каждого теста
afterEach(() => {
  cleanup();
  localStorage.clear();
});

// Глобальный мок localStorage для всех тестов
const localStorageMock = (() => {
  let store: Record<string, string> = {};
  return {
    getItem: vi.fn((key: string) => store[key] || null),
    setItem: vi.fn((key: string, value: string) => {
      store[key] = value.toString();
    }),
    clear: vi.fn(() => {
      store = {};
    }),
    removeItem: vi.fn((key: string) => {
      delete store[key];
    }),
    length: 0,
    key: vi.fn((_index: number) => null),
  };
})();

// biome-ignore lint/security/noSecrets: 'localStorage' — имя Web API, используется для глобального мока в тестах
vi.stubGlobal('localStorage', localStorageMock);
