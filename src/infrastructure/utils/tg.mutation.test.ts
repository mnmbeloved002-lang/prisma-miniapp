import { beforeEach, describe, expect, it, vi } from 'vitest';
import { initTelegramUI } from './tg';

describe('tg.ts (Mutation Coverage - SSR)', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('does not crash when window is undefined (kills SSR mutation)', () => {
    // Mock SSR environment
    const originalWindow = globalThis.window;

    // @ts-expect-error - testing SSR
    delete globalThis.window;

    // Should not throw
    expect(() => {
      initTelegramUI();
    }).not.toThrow();

    // Restore
    globalThis.window = originalWindow;
  });
});
