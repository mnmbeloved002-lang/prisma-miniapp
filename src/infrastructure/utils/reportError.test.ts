import { afterEach, describe, expect, it, vi } from 'vitest';
import { reportError } from './reportError';

describe('reportError (basic happy-path)', () => {
  const originalFetch = global.fetch;

  afterEach(() => {
    global.fetch = originalFetch as typeof fetch;
    vi.restoreAllMocks();
  });

  it('sends serialized error to /api/report-error with POST', async () => {
    const mockFetch = vi.fn<Parameters<typeof fetch>, ReturnType<typeof fetch>>().mockResolvedValue(
      new Response(null, {
        status: 200,
      }),
    );

    global.fetch = mockFetch as typeof fetch;

    const error = new Error('Boom');
    await expect(reportError(error, { context: 'unit-test' })).resolves.toBeUndefined();

    expect(mockFetch).toHaveBeenCalledTimes(1);

    const [url, init] = mockFetch.mock.calls[0] ?? [];
    expect(String(url)).toMatch(/\/api\/report-error$/);

    const requestInit = init as RequestInit | undefined;
    expect(requestInit).toBeDefined();
    expect(requestInit?.method).toBe('POST');
    expect(typeof requestInit?.body).toBe('string');

    if (typeof requestInit?.body === 'string') {
      const body = JSON.parse(requestInit.body);
      expect(body.message).toBe('Boom');
      expect(body.meta).toEqual({ context: 'unit-test' });
    }
  });
});
