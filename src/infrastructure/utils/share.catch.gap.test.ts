// src/infrastructure/utils/share.catch.gap.test.ts
import { afterEach, expect, it, vi } from 'vitest';
import * as shareModule from './share';

// Явно типизируем внутренние хелперы,
type ShareInternals = {
  __hrefOrExample: () => string;
  __hrefOrEmpty: () => string;
};

// Достаём внутренние хелперы без any
const { __hrefOrExample, __hrefOrEmpty } = shareModule as unknown as ShareInternals;

// Расширяем глобальный объект типами окна
type TestGlobal = typeof globalThis & {
  window?: Window & typeof globalThis;
};

const testGlobal = globalThis as TestGlobal;
const originalWindow = testGlobal.window;

afterEach(() => {
  // Восстанавливаем исходное окно и чистим stub’ы
  testGlobal.window = originalWindow;
  vi.unstubAllGlobals();
});

// Если доступ к window/location бросает ошибку — используем URL по умолчанию
it('returns example URL when window access fails', () => {
  vi.stubGlobal(
    'window',
    new Proxy(
      {},
      {
        get() {
          throw new Error('boom');
        },
      },
    ),
  );

  expect(__hrefOrExample()).toBe('https://example.com');
});

// Для случая с пустой строкой
it('returns empty string when window access fails', () => {
  vi.stubGlobal(
    'window',
    new Proxy(
      {},
      {
        get() {
          throw new Error('boom');
        },
      },
    ),
  );

  expect(__hrefOrEmpty()).toBe('');
});
