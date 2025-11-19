// @ts-nocheck
// src/utils/reportError.edgecases.test.ts
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'; // <-- vi ДОЛЖЕН БЫТЬ ЗДЕСЬ
import { reportError } from './reportError';

describe('reportError (edgecases to 100%)', () => {
  const origNavigator = globalThis.navigator as any;
  const origLocation = globalThis.location as any;
  let fetchSpy: vi.SpyInstance; // <-- ОШИБКА БЫЛА ЗДЕСЬ, т.к. 'vi' не был импортирован

  beforeEach(() => {
    // Уберём их, чтобы пройти ветки без UA и URL
    delete (globalThis as any).navigator;
    delete (globalThis as any).location;
    // Мокируем fetch
    fetchSpy = vi.spyOn(globalThis, 'fetch' as any).mockResolvedValue({} as any);
  });

  afterEach(() => {
    // Вернём окружение
    globalThis.navigator = origNavigator;
  	globalThis.location = origLocation;
  	vi.restoreAllMocks();
  });

  it('serializes Error when UA/URL are absent', async () => {
  	const err = new Error('No env branches');
  	await expect(reportError(err, {})).resolves.toBeUndefined();

  	expect(fetchSpy).toHaveBeenCalledTimes(1);
  	const [, init] = fetchSpy.mock.calls[0]!;
  	const body = JSON.parse((init as RequestInit).body as string);

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
  	await reportError(err, null as any); // Передаем 'null'

  	expect(fetchSpy).toHaveBeenCalledTimes(1);
  	const [, init] = fetchSpy.mock.calls[0]!;
  	const body = JSON.parse((init as RequestInit).body as string);

  	// Проверяем, что 'safeMeta' стал пустым объектом '{}'
  	expect(body.meta).toEqual({});
  });

  /**
   * ЦЕЛЬ: Покрыть строку 2 (Ветка 3: 'meta' - truthy, но не объект)
   */
  it('should handle invalid (string) meta correctly', async () => {
  	const err = new Error('Invalid string meta');
  	await reportError(err, 'i-am-a-string' as any); // Передаем 'string'

  	expect(fetchSpy).toHaveBeenCalledTimes(1);
  	const [, init] = fetchSpy.mock.calls[0]!;
  	const body = JSON.parse((init as RequestInit).body as string);

  	// Проверяем, что 'safeMeta' также стал пустым объектом '{}'
  	expect(body.meta).toEqual({});
  });
});
