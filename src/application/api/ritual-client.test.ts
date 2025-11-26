import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { CACHE_TTL_MS } from '../../config';

// ВАЖНО: Мы удалили статический импорт getRitualCached отсюда!

const mockFetch = vi.fn();
global.fetch = mockFetch;

const START_TIME = new Date('2025-01-01T12:00:00Z');

const VALID_RITUAL_1 = {
  id: 'test-id-1',
  title: 'Valid Ritual Title One',
  description: 'This description is long enough to pass Zod validation constraints if they exist.',
  motivation: 'You represent the infinite potential of the universe in human form.',
  task: 'Take five deep breaths and visualize your success today.',
  affirmation: 'I am capable, strong, and ready for whatever comes my way.',
};

const VALID_RITUAL_2 = {
  ...VALID_RITUAL_1,
  id: 'test-id-2',
  title: 'Valid Ritual Title Two - Updated',
};

describe('Ritual Client (Caching Strategy)', () => {
  // Объявляем переменную для функции, которую будем подгружать заново перед каждым тестом
  let getRitualCached: typeof import('./ritual-client').getRitualCached;

  beforeEach(async () => {
    vi.useFakeTimers();
    vi.setSystemTime(START_TIME);
    mockFetch.mockReset();

    // 1. Сбрасываем кэш модулей Vitest
    vi.resetModules();

    // 2. ДИНАМИЧЕСКИ импортируем модуль.
    // Это гарантирует, что мы получаем абсолютно свежую копию файла,
    // где cachedData === null и lastFetchTime === 0.
    const module = await import('./ritual-client');
    getRitualCached = module.getRitualCached;
  });

  afterEach(() => {
    vi.useRealTimers();
    vi.restoreAllMocks(); // Чистим шпионов консоли
  });

  it('Full flow: fetch -> cache hit -> ttl expire -> network fail -> stale cache', async () => {
    // [UEC ADDITION]: Spy on console to kill log-removal mutants
    const consoleLogSpy = vi.spyOn(console, 'log').mockImplementation(() => {});
    const consoleWarnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});

    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ ritual: VALID_RITUAL_1 }),
    } as Response);

    const data1 = await getRitualCached();
    expect(data1.id).toBe(VALID_RITUAL_1.id);
    expect(mockFetch).toHaveBeenCalledTimes(1);
    expect(consoleLogSpy).toHaveBeenCalledWith(expect.stringContaining('сохранены в кэш'));

    const data2 = await getRitualCached();
    expect(data2.id).toBe(VALID_RITUAL_1.id);
    expect(mockFetch).toHaveBeenCalledTimes(1);
    expect(consoleLogSpy).toHaveBeenCalledWith(expect.stringContaining('из кэша (без запроса'));

    vi.setSystemTime(new Date(START_TIME.getTime() + CACHE_TTL_MS + 1000));

    mockFetch.mockRejectedValueOnce(new Error('Network Fail'));

    const data3 = await getRitualCached();
    expect(data3.id).toBe(VALID_RITUAL_1.id);
    expect(mockFetch).toHaveBeenCalledTimes(2);
    expect(consoleWarnSpy).toHaveBeenCalledWith(
      expect.stringContaining('Ошибка сети, возвращаем устаревшие'),
    );
  });

  it('applies artificial network lag when NODE_ENV is not "test"', async () => {
    const originalEnv = process.env.NODE_ENV;
    process.env.NODE_ENV = 'production';

    vi.setSystemTime(new Date(START_TIME.getTime() + CACHE_TTL_MS + 999999));

    mockFetch.mockResolvedValue({
      ok: true,
      json: async () => ({ ritual: VALID_RITUAL_1 }),
    } as Response);

    const promise = getRitualCached();

    await vi.advanceTimersByTimeAsync(400);

    const result = await promise;
    expect(result.id).toBe(VALID_RITUAL_1.id);
    expect(mockFetch).toHaveBeenCalledTimes(1);

    process.env.NODE_ENV = originalEnv;
  });

  it('refetches from network when cache TTL expires (kills mutation)', async () => {
    // 1. Загружаем данные
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ ritual: VALID_RITUAL_1 }),
    } as Response);

    await getRitualCached();

    // 2. Истекаем TTL
    vi.setSystemTime(new Date(START_TIME.getTime() + CACHE_TTL_MS + 1000));

    // 3. Новые данные
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ ritual: VALID_RITUAL_2 }),
    } as Response);

    // 4. Проверка
    const result = await getRitualCached();

    expect(result.title).toBe(VALID_RITUAL_2.title);
    expect(mockFetch).toHaveBeenCalledTimes(2);
  });

  // [UEC ADDITION]: Boundary Test. Убивает мутанта "<" -> "<=".
  it('Boundary: Refetches exactly at CACHE_TTL limit', async () => {
    // 1. Init cache
    mockFetch.mockResolvedValue({
      ok: true,
      json: async () => ({ ritual: VALID_RITUAL_1 }),
    } as Response);
    await getRitualCached(); // t=0
    mockFetch.mockClear();

    // 2. Advance time exactly by TTL
    // Если код использует `diff < TTL`, то при `diff == TTL` условие False -> Refetch.
    // Если мутант `diff <= TTL`, то при `diff == TTL` условие True -> Cache Hit (FAIL test).
    vi.setSystemTime(new Date(START_TIME.getTime() + CACHE_TTL_MS));

    await getRitualCached();
    expect(mockFetch).toHaveBeenCalledTimes(1);
  });
});
