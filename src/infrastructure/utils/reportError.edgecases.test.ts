// src/utils/reportError.edgecases.test.ts
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { reportError } from './reportError';

type MutableGlobal = typeof globalThis & {
  navigator?: Navigator;
  location?: Location;
};

describe('reportError (edgecases to 100%)', () => {
  const mutableGlobal = globalThis as MutableGlobal;
  const origNavigator = mutableGlobal.navigator;
  const origLocation = mutableGlobal.location;
  let fetchSpy: vi.SpyInstance;

  const getBodyFromFetchSpy = () => {
    const firstCall = fetchSpy.mock.calls[0];
    if (!firstCall) {
      throw new Error('fetchSpy was not called');
    }

    const [, init] = firstCall;

    if (!init || typeof init.body !== 'string') {
      throw new Error('fetchSpy was called without string body');
    }

    return JSON.parse(init.body) as {
      message: string;
      userAgent?: string;
      url?: string;
      meta?: unknown;
    };
  };

  beforeEach(() => {
    // Уберём их, чтобы пройти ветки без UA и URL
    delete mutableGlobal.navigator;
    delete mutableGlobal.location;

    // Мокируем fetch
    fetchSpy = vi.spyOn(globalThis, 'fetch').mockResolvedValue({} as Response);
  });

  afterEach(() => {
    // Вернём окружение
    if (origNavigator) {
      mutableGlobal.navigator = origNavigator;
    } else {
      delete mutableGlobal.navigator;
    }

    if (origLocation) {
      mutableGlobal.location = origLocation;
    } else {
      delete mutableGlobal.location;
    }

    vi.restoreAllMocks();
  });

  it('serializes Error when UA/URL are absent', async () => {
    const err = new Error('No env branches');
    await expect(reportError(err, {})).resolves.toBeUndefined();

    expect(fetchSpy).toHaveBeenCalledTimes(1);
    const body = getBodyFromFetchSpy();

    expect(body.message).toBe('No env branches');
    expect(body.userAgent).toBeUndefined();
    expect(body.url).toBeUndefined();
    expect(body.meta).toEqual({}); // Ветка 1 (валидный объект)
  });

  /**
   * ЦЕЛЬ: Покрыть строку 2 (Ветка 2: 'meta' - falsy)
   */
  it('should handle invalid (null) meta correctly', async () => {
    const err = new Error('Invalid meta test');
    // Передаем 'null' как некорректный meta
    await reportError(err, null as unknown as never);

    expect(fetchSpy).toHaveBeenCalledTimes(1);
    const body = getBodyFromFetchSpy();

    // Проверяем, что 'safeMeta' стал пустым объектом '{}'
    expect(body.meta).toEqual({});
  });

  /**
   * ЦЕЛЬ: Покрыть строку 2 (Ветка 3: 'meta' - truthy, но не объект)
   */
  it('should handle invalid (string) meta correctly', async () => {
    const err = new Error('Invalid string meta');
    // Передаем 'string' как некорректный meta
    await reportError(err, 'i-am-a-string' as unknown as never);

    expect(fetchSpy).toHaveBeenCalledTimes(1);
    const body = getBodyFromFetchSpy();

    // Проверяем, что 'safeMeta' также стал пустым объектом '{}'
    expect(body.meta).toEqual({});
  });
});
