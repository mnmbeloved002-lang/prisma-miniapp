// src/infrastructure/utils/share.gaps.test.ts
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { buildItemShareUrl, normalizeShareUrl, shareLink } from './share';

// Навигатор с доп. методами, без any
type NavigatorWithShare = Navigator & {
  share?: (data: { title?: string; text?: string; url?: string }) => Promise<void>;
  clipboard?: {
    writeText: (text: string) => Promise<void>;
  };
};

// Глобал с тем, что нам нужно для тестов
type TestGlobal = typeof globalThis & {
  navigator?: NavigatorWithShare;
  open?: (url?: string, target?: string, features?: string) => Window | null;
  URL?: typeof URL;
};

const testGlobal = globalThis as TestGlobal;

const Saved = {
  navigator: testGlobal.navigator,
  open: testGlobal.open,
  URL: testGlobal.URL,
};

describe('share utils extra coverage', () => {
  beforeEach(() => {
    const baseNavigator: NavigatorWithShare = {
      ...(testGlobal.navigator ?? ({} as NavigatorWithShare)),
      userAgent: 'Vitest UA',
      clipboard: {
        writeText: async () => {},
      },
    };

    testGlobal.navigator = baseNavigator;
    testGlobal.open = () => window;
    testGlobal.URL = URL;
  });

  afterEach(() => {
    testGlobal.navigator = Saved.navigator;
    testGlobal.open = Saved.open;
    testGlobal.URL = Saved.URL;
    vi.restoreAllMocks();
  });

  // biome-ignore lint/security/noSecrets: test name, not a secret
  it('normalizeShareUrl base-branch does not throw', () => {
    expect(() => {
      const url = normalizeShareUrl('/path', 'https://example.com');
      expect(typeof url).toBe('string');
    }).not.toThrow();
  });

  // biome-ignore lint/security/noSecrets: test name, not a secret
  it('buildItemShareUrl minimal object returns string', () => {
    const result = buildItemShareUrl({});
    expect(typeof result).toBe('string');
    expect(result.length).toBeGreaterThan(0);
  });

  it('shareLink works when navigator.share is missing but clipboard exists', async () => {
    const clipboardSpy = vi.fn<[string], Promise<void>>().mockResolvedValue(undefined);

    const nav: NavigatorWithShare = {
      ...(testGlobal.navigator ?? ({} as NavigatorWithShare)),
      clipboard: {
        writeText: clipboardSpy,
      },
    };

    testGlobal.navigator = nav;

    await expect(
      (async () => {
        await shareLink({
          title: 'T',
          text: 'X',
          url: 'https://example.com/item',
        });
      })(),
    ).resolves.toBeUndefined();

    expect(clipboardSpy).toHaveBeenCalled();
  });
});
