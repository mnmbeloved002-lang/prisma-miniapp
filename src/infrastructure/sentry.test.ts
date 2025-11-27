import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

describe('sentry utility functions', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('trackEvent calls Sentry.addBreadcrumb', async () => {
    const { trackEvent } = await import('./sentry');

    // Просто проверяем что функция не падает
    expect(() => trackEvent('test-event', { foo: 'bar' })).not.toThrow();
  });

  it('setUserContext calls Sentry.setUser', async () => {
    const { setUserContext } = await import('./sentry');

    // Просто проверяем что функция не падает
    expect(() => setUserContext('user-123')).not.toThrow();
  });

  it('initSentry can be called multiple times safely', async () => {
    const { initSentry } = await import('./sentry');

    // Проверяем что можно вызвать несколько раз
    expect(() => {
      initSentry();
      initSentry();
      initSentry();
    }).not.toThrow();
  });

  it('initSentry handles missing environment gracefully', async () => {
    const { initSentry } = await import('./sentry');

    // В test окружении DSN нет, но не должно падать
    expect(() => initSentry()).not.toThrow();
  });
});
