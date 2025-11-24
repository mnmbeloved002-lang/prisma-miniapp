import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { reportError } from './reportError';

describe('reportError (branches)', () => {
  const origNavigator = globalThis.navigator as Navigator;
  const origLocation = globalThis.location as Location;

  beforeEach(() => {
    // подменим окружение
    globalThis.navigator = { userAgent: 'jest-jsdom UA' };
    globalThis.location = { href: 'http://localhost/test' };
  });

  afterEach(() => {
    // вернём окружение
    globalThis.navigator = origNavigator;
    globalThis.location = origLocation;
    vi.restoreAllMocks();
  });

  it('handles non-Error input and non-object meta (coerces to {})', async () => {
    const spy = vi.spyOn(globalThis, 'fetch').mockResolvedValue({} as Response);
    await reportError('simple string error', 'not-an-object' as unknown as Record<string, unknown>);
    expect(spy).toHaveBeenCalledTimes(1);
    const call = spy.mock.calls[0];
    expect(call).toBeDefined();
    const [, init] = call as [string, RequestInit];
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
    const spy = vi.spyOn(globalThis, 'fetch').mockRejectedValue(new Error('network down'));
    await expect(reportError(boom, { context: 'branch-catch' })).resolves.toBeUndefined();
    expect(spy).toHaveBeenCalledTimes(1);
    const call = spy.mock.calls[0];
    expect(call).toBeDefined();
    const [, init] = call as [string, RequestInit];
    const body = JSON.parse((init as RequestInit).body as string);
    // ветка: err instanceof Error
    expect(body.message).toBe('Boom again');
    expect(typeof body.stack === 'string' || body.stack === undefined).toBeTruthy();
    // meta остаётся объектом
    expect(body.meta).toEqual({ context: 'branch-catch' });
  });
});
