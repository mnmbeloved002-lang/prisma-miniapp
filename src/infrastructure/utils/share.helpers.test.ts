// src/infrastructure/utils/share.helpers.test.ts
import { afterEach, describe, expect, it } from 'vitest';
import * as shareModule from './share';

type ShareInternals = {
  __hrefOrExample: () => string;
  __hrefOrEmpty: () => string;
};

// Берём внутренние хелперы через строго типизированный каст
const { __hrefOrExample, __hrefOrEmpty } = shareModule as unknown as ShareInternals;

type TestGlobal = typeof globalThis & {
  window?: Window & {
    location?: Location;
  };
};

const testGlobal = globalThis as TestGlobal;
const originalWindow = testGlobal.window;

describe('share internal helpers (SSR-safe)', () => {
  afterEach(() => {
    // Восстанавливаем исходное window после каждого теста
    testGlobal.window = originalWindow;
  });

  it('returns current href when window is available', () => {
    // Эмулируем нормальное браузерное окно с конкретным href
    testGlobal.window = {
      ...(window as Window),
      location: {
        ...window.location,
        href: 'https://app.example.com/current',
      } as Location,
    };

    expect(__hrefOrExample()).toBe('https://app.example.com/current');
    expect(__hrefOrEmpty()).toBe('https://app.example.com/current');
  });

  it('falls back to example URL when window is missing', () => {
    testGlobal.window = undefined;

    expect(__hrefOrExample()).toBe('https://example.com');
  });

  it('returns empty string when window is missing for hrefOrEmpty', () => {
    testGlobal.window = undefined;

    expect(__hrefOrEmpty()).toBe('');
  });
});
