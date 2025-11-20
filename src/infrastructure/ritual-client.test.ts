
/* test-only: silence expected network errors */
import { beforeAll, afterAll, vi } from 'vitest';
let __errorSpy: ReturnType<typeof vi.spyOn>;
beforeAll(() => { __errorSpy = vi.spyOn(console, 'error').mockImplementation(() => {}); });
afterAll(() => { __errorSpy?.mockRestore(); });
/* test-only: silence intentional network errors */
import { beforeEach, afterEach, vi } from 'vitest';
const __origConsoleError = console.error;
beforeEach(() => { vi.spyOn(console, 'error').mockImplementation(() => {}); });
afterEach(() => { (console.error as any) = __origConsoleError; });
// src/infrastructur./ritual-client.test.ts
import { vi, describe, it, expect, beforeEach, afterEach } from 'vitest';
import { getRitualCached, getRitualFresh } from './ritual-client';
import { storage } from './storage';
import { CACHE_TTL_MS } from '../config'; // Импортируем реальный TTL

// Мокируем storage
vi.mock('./storage', () => ({
  storage: {
    get: vi.fn(),
    set: vi.fn(),
  },
}));

// Мокируем global fetch
const mockFetch = vi.fn();
// ИСПРАВЛЕНИЕ 1: 'global' заменен на 'globalThis' для совместимости
globalThis.fetch = mockFetch;

const mockedStorage = vi.mocked(storage);

const mockItem = { id: '1', title: 'Cached Ritual' } as any;
const mockCacheEntry = {
  ts: Date.now(),
  etag: 'etag-123',
  data: [mockItem],
};
// Это *массив*, который мы ожидаем ВНУТРИ ответа
const freshRitual = [{ id: '2', title: 'Fresh Ritual' }] as any;

describe('api-client', () => {
  beforeEach(() => {
    vi.useFakeTimers(); // Берем контроль над Date.now()
    vi.clearAllMocks();
    mockedStorage.get.mockReturnValue(null); // По умолчанию кэш пуст
  });

  afterEach(() => {
    vi.useRealTimers(); // Возвращаем контроль
  });

  // --- Тесты getRitualCached ---

  it('should fetch data if cache is empty', async () => {
    mockFetch.mockResolvedValue({
      status: 200,
      headers: new Headers({ ETag: 'etag-new' }),
      // ИСПРАВЛЕНО: Возвращаем объект, как в 'ritual.json'
      json: async () => ({ ritual: freshRitual }),
    });

    const data = await getRitualCached();

    expect(data).toEqual(freshRitual);
    expect(mockFetch).toHaveBeenCalledWith('/ritual.json', { headers: {} });
    expect(mockedStorage.set).toHaveBeenCalledWith(
      'ritual-cache-v1',
      expect.objectContaining({ etag: 'etag-new', data: freshRitual }),
    );
  });

  it('should return fresh (non-expired) cache without fetching', async () => {
    mockedStorage.get.mockReturnValue(mockCacheEntry);

    const data = await getRitualCached();

    expect(data).toEqual(mockCacheEntry.data);
    expect(mockFetch).not.toHaveBeenCalled();
  });

  it('should fetch if cache is expired', async () => {
    const expiredTs = Date.now() - CACHE_TTL_MS - 1000; // Просрочен 1 сек назад
    mockedStorage.get.mockReturnValue({ ...mockCacheEntry, ts: expiredTs });

    mockFetch.mockResolvedValue({
      status: 200,
      headers: new Headers({ ETag: 'etag-new' }),
      // ИСПРАВЛЕНО: Возвращаем объект
      json: async () => ({ ritual: freshRitual }),
    });

    await getRitualCached();

    // Проверяем, что ETag был отправлен в заголовке
    expect(mockFetch).toHaveBeenCalledWith('/ritual.json', {
      headers: { 'If-None-Match': 'etag-123' },
    });
    // Проверяем, что кэш обновлен
    expect(mockedStorage.set).toHaveBeenCalledWith(
      'ritual-cache-v1',
      expect.objectContaining({ etag: 'etag-new' }),
    );
  });

  it('should return cache if fetch returns 304 (Not Modified)', async () => {
    const expiredTs = Date.now() - CACHE_TTL_MS - 1000;
    mockedStorage.get.mockReturnValue({ ...mockCacheEntry, ts: expiredTs });

    // Сервер отвечает 304
    mockFetch.mockResolvedValue({
      status: 304,
      headers: new Headers(),
    });

    const data = await getRitualCached();

    // Должны вернуть старые данные из кэша
    expect(data).toEqual(mockCacheEntry.data);
    // Кэш НЕ должен обновляться (т.к. ETag тот же)
    expect(mockedStorage.set).not.toHaveBeenCalled();
  });

  it('should return cache (fallback) if fetch fails', async () => {
    const expiredTs = Date.now() - CACHE_TTL_MS - 1000;
    mockedStorage.get.mockReturnValue({ ...mockCacheEntry, ts: expiredTs });

    // fetch падает с ошибкой
    mockFetch.mockRejectedValue(new Error('Network Failed'));

    const data = await getRitualCached();

  	// Должны вернуть старые (просроченные) данные из кэша как фолбэк
  	expect(data).toEqual(mockCacheEntry.data);
  	expect(mockedStorage.set).not.toHaveBeenCalled();
  });

  it('should throw error if fetch fails AND no cache available', async () => {
  	mockedStorage.get.mockReturnValue(null); // Кэша нет
  	mockFetch.mockRejectedValue(new Error('Network Failed'));

  	// Ожидаем, что функция бросит исключение
  	await expect(getRitualCached()).rejects.toThrow(
  	  'Network failed and no cache available',
  	);
  });

  // --- Тесты getRitualFresh ---

  it('getRitualFresh: should always fetch, even with valid cache', async () => {
  	mockedStorage.get.mockReturnValue(mockCacheEntry); // Валидный кэш
  	mockFetch.mockResolvedValue({
  	  status: 200,
  	  headers: new Headers({ ETag: 'etag-new' }),
  	  // ИСПРАВЛЕНО: Возвращаем объект
  	  json: async () => ({ ritual: freshRitual }),
  	});

  	const data = await getRitualFresh();
  	expect(data).toEqual(freshRitual);
  	// Проверяем, что fetch был вызван с ETag
  	expect(mockFetch).toHaveBeenCalledWith('/ritual.json', {
  	  headers: { 'If-None-Match': 'etag-123' },
  	});
  });

  it('getRitualFresh: should return cache on 304', async () => {
  	mockedStorage.get.mockReturnValue(mockCacheEntry);
  	mockFetch.mockResolvedValue({ status: 304 });

  	const data = await getRitualFresh();
  	expect(data).toEqual(mockCacheEntry.data); // Вернули старые данные
  	expect(mockedStorage.set).not.toHaveBeenCalled();
  });

  it('getRitualFresh: should return cache on fetch fail', async () => {
  	mockedStorage.get.mockReturnValue(mockCacheEntry);
  	mockFetch.mockRejectedValue(new Error('Network Failed'));

  	const data = await getRitualFresh();
  	// Не падает, а возвращает фолбэк
  	expect(data).toEqual(mockCacheEntry.data);
  });

  it('getRitualFresh: should return empty array if fetch fails and no cache', async () => {
  	mockedStorage.get.mockReturnValue(null); // Кэша нет
  	mockFetch.mockRejectedValue(new Error('Network Failed'));

  	const data = await getRitualFresh();
  	// Не падает, возвращает пустой массив
  	expect(data).toEqual([]);
  });

	// --- Тесты на отсутствие ETag (для 100% покрытия) ---

  it('getRitualCached: should handle fetch response without ETag', async () => {
  	mockedStorage.get.mockReturnValue(null); // Кэш пуст

  	// Имитируем ответ БЕЗ ETag
  	mockFetch.mockResolvedValue({
  	  status: 200,
  	  headers: new Headers(), // Пустые заголовки
  	  // ИСПРАВЛЕНО: Возвращаем объект
  	  json: async () => ({ ritual: freshRitual }),
  	});

  	const data = await getRitualCached(); // Вызываем getRitualCached

  	expect(data).toEqual(freshRitual);
  	// Проверяем, что в кэш сохранился 'etag: undefined'
  	expect(mockedStorage.set).toHaveBeenCalledWith(
  	  'ritual-cache-v1',
  	  expect.objectContaining({ etag: undefined, data: freshRitual }),
  	);
  });
  
  it('getRitualFresh: should handle response without ETag (covers line 37)', async () => {
  	mockedStorage.get.mockReturnValue(null); // Кэш пуст

  	// Имитируем ответ БЕЗ ETag
  	mockFetch.mockResolvedValue({
  	  status: 200,
  	  headers: new Headers(), // Пустые заголовки
  	  // ИСПРАВЛЕНО: Возвращаем объект
  	  json: async () => ({ ritual: freshRitual }),
  	});

  	const data = await getRitualFresh(); // Вызываем getRitualFresh

  	expect(data).toEqual(freshRitual);
  	// Проверяем, что в кэш сохранился 'etag: undefined'
  	expect(mockedStorage.set).toHaveBeenCalledWith(
  	  'ritual-cache-v1',
  	  expect.objectContaining({ etag: undefined, data: freshRitual }),
  	// ИСПРАВЛЕНИЕ 2: Случайная буква 'A' удалена
  	);
  });
});
