// @ts-nocheck
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { normalizeShareUrl, buildItemShareUrl, shareLink } from './share';

// Простые моки
const mockWindowLocation = (href: string) => {
  Object.defineProperty(window, 'location', {
    value: new URL(href),
    writable: true,
  });
};

describe('normalizeShareUrl', () => {
  beforeEach(() => {
    mockWindowLocation('https://app.example.com/current/path');
  });

  it('uses canonical when provided', () => {
    const url = normalizeShareUrl(
      'https://site.tld/a?utm_source=x#hash', 
      'https://example.com/canonical?utm_medium=y#h'
    );
    expect(url).toBe('https://example.com/canonical');
  });

  it('drops tgWebAppData and hash', () => {
    const url = normalizeShareUrl(
      'https://s.tld/p?q=1&utm_source=xxx&tgWebAppData=zzz#frag'
    );
    expect(url).toBe('https://s.tld/p?q=1');
  });

  it('returns empty for garbage input', () => {
    const url = normalizeShareUrl(':::::.not a url:::::');
    expect(url).toBe('');
  });

  it('handles relative paths', () => {
    const url = normalizeShareUrl('/relative/path');
    expect(url).toBe('https://app.example.com/relative/path');
  });

  it('removes all junk parameters', () => {
    const url = normalizeShareUrl(
      'https://example.com/?tgWebAppData=123&utm_source=test&fbclid=456#hash'
    );
    expect(url).toBe('https://example.com/');
  });
});

describe('buildItemShareUrl', () => {
  beforeEach(() => {
    mockWindowLocation('https://app.example.com/current');
  });

  it('uses canonicalUrl when provided', () => {
    const result = buildItemShareUrl({
      canonicalUrl: 'https://news.com/article',
      fallbackHref: 'https://app.com/fallback'
    });
    expect(result).toBe('https://news.com/article');
  });

  it('uses fallbackHref when no canonicalUrl', () => {
    const result = buildItemShareUrl({
      fallbackHref: 'https://app.com/fallback'
    });
    expect(result).toBe('https://app.com/fallback');
  });

  it('uses window location by default', () => {
    const result = buildItemShareUrl({});
    expect(result).toBe('https://app.example.com/current');
  });
});

describe('shareLink', () => {
  let originalNavigator: Navigator;
  let originalLocation: Location;

  beforeEach(() => {
    originalNavigator = window.navigator;
    originalLocation = window.location;
    mockWindowLocation('https://app.example.com/article');
  });

  afterEach(() => {
    Object.defineProperty(window, 'navigator', {
      value: originalNavigator,
      writable: true,
    });
    Object.defineProperty(window, 'location', {
      value: originalLocation,
      writable: true,
    });
    delete (window as any).Telegram;
    vi.restoreAllMocks();
  });

  it('uses Telegram WebApp when available', async () => {
    const mockShareURL = vi.fn();
    (window as any).Telegram = {
      WebApp: {
        shareURL: mockShareURL,
      },
    };

    const result = await shareLink('https://example.com', 'Test Title');

    expect(mockShareURL).toHaveBeenCalledWith('https://example.com/');
    expect(result).toBe(true);
  });

  it('uses Web Share API when Telegram not available', async () => {
    const mockShare = vi.fn().mockResolvedValue(undefined);
    Object.defineProperty(window, 'navigator', {
      value: {
        ...window.navigator,
        share: mockShare,
      },
      writable: true,
    });

    const result = await shareLink('https://example.com', 'Test Title');

    expect(mockShare).toHaveBeenCalledWith({
      url: 'https://example.com/',
      title: 'Test Title'
    });
    expect(result).toBe(true);
  });

  it('uses clipboard when other methods fail', async () => {
    // Telegram не доступен
    delete (window as any).Telegram;

    const mockShare = vi.fn().mockRejectedValue(new Error('Share failed'));
    const mockWriteText = vi.fn().mockResolvedValue(undefined);
    
    Object.defineProperty(window, 'navigator', {
      value: {
        ...window.navigator,
        share: mockShare,
        clipboard: {
          writeText: mockWriteText,
        },
      },
      writable: true,
    });

    const result = await shareLink('https://example.com');

    expect(mockWriteText).toHaveBeenCalledWith('https://example.com/');
    expect(result).toBe(true);
  });

  it('shows alert as final fallback', async () => {
    delete (window as any).Telegram;
    
    Object.defineProperty(window, 'navigator', {
      value: {
        ...window.navigator,
        share: undefined,
        clipboard: undefined,
      },
      writable: true,
    });

    const alertSpy = vi.spyOn(window, 'alert').mockImplementation(() => {});

    const result = await shareLink('https://example.com');

    expect(alertSpy).toHaveBeenCalledWith('Скопируй ссылку:\nhttps://example.com/');
    expect(result).toBe(false);

    alertSpy.mockRestore();
  });
});

// Простые тесты для pathname validation
describe('normalizeShareUrl pathname validation', () => {
  beforeEach(() => {
    mockWindowLocation('https://app.example.com/current');
  });

  it('returns empty for invalid path characters', () => {
    expect(normalizeShareUrl('/invalid<character')).toBe('');
    expect(normalizeShareUrl('/%3A%3A%3A')).toBe('');
    expect(normalizeShareUrl('/%2E%2E%2E')).toBe('');
  });

  it('returns valid URL for allowed characters', () => {
    const url = normalizeShareUrl('/valid-path_with~special+chars@123');
    expect(url).toBe('https://app.example.com/valid-path_with~special+chars@123');
  });
});
