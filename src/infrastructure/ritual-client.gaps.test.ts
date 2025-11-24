import { afterEach, describe, expect, it, vi } from 'vitest';
import { getRitualCached } from './ritual-client';

// Глобальный мок fetch
global.fetch = vi.fn();

describe('Ritual Client Gaps', () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('throws error on network failure', async () => {
    vi.mocked(fetch).mockRejectedValue(new Error('Network Down'));
    await expect(getRitualCached()).rejects.toThrow(/Не удалось загрузить ритуал/i);
  });

  it('throws error on 404/500', async () => {
    vi.mocked(fetch).mockResolvedValue({ ok: false, status: 404 } as Response);
    await expect(getRitualCached()).rejects.toThrow(/Не удалось загрузить ритуал/i);
  });

  it('throws error on invalid JSON (Zod validation)', async () => {
    // Возвращаем валидный JSON, но невалидную схему (нет ID)
    vi.mocked(fetch).mockResolvedValue({
      ok: true,
      json: async () => ({ ritual: { title: 'Bad Ritual' } }),
    } as Response);

    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    await expect(getRitualCached()).rejects.toThrow(/Не удалось загрузить ритуал/i);
    expect(consoleSpy).toHaveBeenCalledWith('Data Fetch Error:', expect.anything());
  });
});
