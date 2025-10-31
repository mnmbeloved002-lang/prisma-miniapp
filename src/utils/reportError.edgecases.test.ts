import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { reportError } from './reportError';

describe('reportError (edgecases to 100%)', () => {
  const origNavigator = globalThis.navigator as any;
  const origLocation = globalThis.location as any;

  beforeEach(() => {
    // Уберём их, чтобы пройти ветки без UA и URL
    
    delete (globalThis as any).navigator;

    delete (globalThis as any).location;
  });

  afterEach(() => {
    // Вернём окружение
 
    globalThis.navigator = origNavigator;
 
    globalThis.location = origLocation;
    vi.restoreAllMocks();
  });

  it('serializes Error when UA/URL are absent', async () => {
    const spy = vi.spyOn(globalThis, 'fetch' as any).mockResolvedValue({} as any);

    const err = new Error('No env branches');
    await expect(reportError(err, {})).resolves.toBeUndefined();

    expect(spy).toHaveBeenCalledTimes(1);
    const [, init] = spy.mock.calls[0]!;
    const body = JSON.parse((init as RequestInit).body as string);

    expect(body.message).toBe('No env branches');
    // userAgent и url должны отсутствовать/быть undefined — это и есть непокрытые ветки
    expect(body.userAgent).toBeUndefined();
    expect(body.url).toBeUndefined();
  });
});
