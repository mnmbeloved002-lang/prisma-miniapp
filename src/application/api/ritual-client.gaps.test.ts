import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

// Глобальный мок fetch
global.fetch = vi.fn();

// Хелпер, чтобы всегда получать свежий инстанс клиента после resetModules
async function importClient() {
  const { getRitualCached } = await import('./ritual-client');
  return { getRitualCached };
}

describe('Ritual Client Gaps', () => {
  beforeEach(() => {
    // Чистим реестр модулей и состояние моков fetch перед каждым тестом
    vi.resetModules();
    vi.mocked(fetch).mockReset();
  });

  afterEach(() => {
    vi.restoreAllMocks();
    vi.resetModules();
  });

  it('throws error on network failure', async () => {
    const { getRitualCached } = await importClient();

    vi.mocked(fetch).mockRejectedValue(new Error('Network Down'));

    await expect(getRitualCached()).rejects.toThrow(/Не удалось загрузить ритуал/i);
  });

  it('throws error on 404/500 without cache', async () => {
    const { getRitualCached } = await importClient();

    const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

    vi.mocked(fetch).mockResolvedValue({
      ok: false,
      status: 404,
      statusText: 'Not Found',
      json: async () => ({}),
    } as Response);

    await expect(getRitualCached()).rejects.toThrow(/Не удалось загрузить ритуал/i);

    expect(consoleErrorSpy).toHaveBeenCalledWith(
      'Data Fetch Error:',
      expect.objectContaining({ message: 'HTTP error! status: 404' }),
    );
  });

  it('returns cached data on repeated call even if network is misconfigured', async () => {
    const { getRitualCached } = await importClient();

    // Валидные данные для заполнения кэша
    const validRitual = {
      ritual: {
        id: '1',
        title: 'Test Ritual',
        motivation: 'Test motivation',
        task: 'Test task',
        affirmation: 'Test affirmation',
      },
    };

    // 1) Успешный ответ -> формируем кэш
    vi.mocked(fetch).mockResolvedValueOnce({
      ok: true,
      json: async () => validRitual,
    } as Response);

    const cachedRitual = await getRitualCached();

    // 2) Дальше "ломаем" сеть, но второй вызов должен пойти в кэш
    // из-за того, что TTL ещё не истёк и до fetch просто не дойдёт.
    vi.mocked(fetch).mockResolvedValue({
      ok: false,
      status: 500,
      statusText: 'Internal Server Error',
      json: async () => ({}),
    } as Response);

    const result = await getRitualCached();

    // Вернули ровно тот же объект, что и из первого вызова
    expect(result).toEqual(cachedRitual);
    // И в сеть при этом сходили только ОДИН раз
    expect(vi.mocked(fetch)).toHaveBeenCalledTimes(1);
  });

  it('throws error on invalid JSON (Zod validation)', async () => {
    const { getRitualCached } = await importClient();

    // Отдаём заведомо невалидный JSON относительно Zod-схемы Ritual
    vi.mocked(fetch).mockResolvedValue({
      ok: true,
      json: async () => ({ ritual: { title: 'Bad Ritual' } }) as unknown, // нет id, motivation, task, affirmation
    } as Response);

    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

    await expect(getRitualCached()).rejects.toThrow(/Не удалось загрузить ритуал/i);

    expect(consoleSpy).toHaveBeenCalledWith('Data Fetch Error:', expect.anything());
  });
});
