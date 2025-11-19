// @ts-nocheck
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { reportError } from './reportError';

describe('reportError (branches)', () => {
  const origNavigator = globalThis.navigator as any;
  const origLocation = globalThis.location as any;

  beforeEach(() => {
    // подменим окружение
    //  – в тестах ок
    globalThis.navigator = { userAgent: 'jest-jsdom UA' };
    //  – в тестах ок
    globalThis.location = { href: 'http://localhost/test' };
  });

  afterEach(() => {
    // вернём окружение
    //  – в тестах ок
    globalThis.navigator = origNavigator;
    //  – в тестах ок
    globalThis.location = origLocation;
    vi.restoreAllMocks();
  });

  it('handles non-Error input and non-object meta (coerces to {})', async () => {
    const spy = vi.spyOn(globalThis, 'fetch' as any).mockResolvedValue({} as any);

    await reportError('simple string error', 'not-an-object' as unknown as Record<string, unknown>);

    expect(spy).toHaveBeenCalledTimes(1);
    const [, init] = spy.mock.calls[0]!;
    const body = JSON.parse((init as RequestInit).body as string);

    // ветка: err НЕ Error
    expect(body.message).toBe('simple string error');
    expect(body.stack).toBeUndefined();

    // ветка: meta не объект -> {}
    expect(body.meta).toEqual({});

    // ветки с navigator/location
    expect(body.userAgent).toBe('jest-jsdom UA');
    expect(body.url).toBe('http://localhost/test');
  });

  it('swallows fetch failures (catch branch) and still serializes Error properly', async () => {
    const boom = new Error('Boom again');
    const spy = vi.spyOn(globalThis, 'fetch' as any).mockRejectedValue(new Error('network down'));

    await expect(reportError(boom, { context: 'branch-catch' })).resolves.toBeUndefined();

    expect(spy).toHaveBeenCalledTimes(1);
    const [, init] = spy.mock.calls[0]!;
    const body = JSON.parse((init as RequestInit).body as string);

    // ветка: err instanceof Error
    expect(body.message).toBe('Boom again');
    expect(typeof body.stack === 'string' || body.stack === undefined).toBeTruthy();

    // meta остаётся объектом
    expect(body.meta).toEqual({ context: 'branch-catch' });
  });
});
