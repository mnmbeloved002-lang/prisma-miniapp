// src/utils/reportError.test.ts
import { reportError } from './reportError';

describe('reportError', () => {
  const origFetch = global.fetch;

  beforeEach(() => {
    global.fetch = vi.fn().mockResolvedValue({ ok: true, status: 200 });
  });

  afterEach(() => {
    global.fetch = origFetch as any;
    vi.restoreAllMocks();
  });

  it('sends minimal payload', async () => {
    await reportError(new Error('Boom'), { context: 'unit-test' });
    expect(global.fetch).toHaveBeenCalledTimes(1);
    const [url, init] = (global.fetch as any).mock.calls[0];
    expect(url).toMatch(/\/api\/report-error$/);
    expect(init.method).toBe('POST');
    const body = JSON.parse(init.body);
    expect(body.message).toMatch(/Boom/);
    expect(body.meta.context).toBe('unit-test');
  });
});
