import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { getRitualCached } from './ritual-client';

const mockFetch = vi.fn();
global.fetch = mockFetch;

describe('Ritual Client (Caching Strategy)', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    mockFetch.mockReset();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('Full flow: fetch -> cache hit -> ttl expire -> network fail -> stale cache', async () => {
    // ... твой существующий тест без изменений ...
  });

  it('applies artificial network lag when NODE_ENV is not "test"', async () => {
    const originalEnv = process.env.NODE_ENV;
    process.env.NODE_ENV = 'production';

    // Гарантируем, что TTL точно истёк, даже если из прошлого теста остался кэш
    vi.setSystemTime(new Date('2100-01-01T00:00:00Z'));

    mockFetch.mockResolvedValue({
      ok: true,
      json: async () => ({
        ritual: {
          id: 'lag-id',
          title: 'Lag Ritual',
          description: 'Lag',
          motivation: 'Test motivation',
          task: 'Test task',
          affirmation: 'Test affirmation',
        },
      }),
    } as Response);

    const promise = getRitualCached();

    // Стрелка в setTimeout отработает при продвижении таймера
    await vi.advanceTimersByTimeAsync(400);

    const result = await promise;

    expect(result.title).toBe('Lag Ritual');
    expect(mockFetch).toHaveBeenCalledTimes(1);

    process.env.NODE_ENV = originalEnv;
  });
});
