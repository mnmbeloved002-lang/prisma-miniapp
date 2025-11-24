import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { openLink } from './nav';

type TelegramLike = {
  WebApp?: {
    openLink?: (url: string, options?: { try_instant_view?: boolean }) => void;
  };
};

type WindowWithTelegram = Window & {
  Telegram?: TelegramLike;
};

const windowWithTelegram = window as WindowWithTelegram;

const originalTelegram = windowWithTelegram.Telegram;
const originalOpen = window.open;
const originalLocation = window.location;

describe('openLink', () => {
  beforeEach(() => {
    vi.restoreAllMocks();

    delete windowWithTelegram.Telegram;
    window.open = originalOpen;

    Object.defineProperty(window, 'location', {
      value: {
        ...originalLocation,
        assign: vi.fn<(url: string) => void>(),
      },
      writable: true,
    });
  });

  afterEach(() => {
    windowWithTelegram.Telegram = originalTelegram;
    window.open = originalOpen;
    Object.defineProperty(window, 'location', {
      value: originalLocation,
    });
  });

  it('should use Telegram WebApp openLink when available', () => {
    const mockOpenLink = vi.fn<(url: string, options?: { try_instant_view?: boolean }) => void>();

    windowWithTelegram.Telegram = {
      WebApp: {
        openLink: mockOpenLink,
      },
    };

    openLink('https://example.com');

    expect(mockOpenLink).toHaveBeenCalledWith('https://example.com', { try_instant_view: true });
  });

  it('should use window.open when Telegram is not available', () => {
    const mockOpen = vi
      .fn<(url: string, target?: string, features?: string) => Window | null>()
      .mockReturnValue({} as Window);

    windowWithTelegram.Telegram = undefined;
    window.open = mockOpen;

    openLink('https://example.com');

    expect(mockOpen).toHaveBeenCalledWith('https://example.com', '_blank', 'noopener,noreferrer');
  });

  it('should fallback to location.assign when window.open returns null', () => {
    const mockOpen = vi
      .fn<(url: string, target?: string, features?: string) => Window | null>()
      .mockReturnValue(null);

    windowWithTelegram.Telegram = undefined;
    window.open = mockOpen;

    const locationWithSpy = window.location as Location & {
      assign: (url: string) => void;
    };

    openLink('https://example.com');

    expect(mockOpen).toHaveBeenCalledWith('https://example.com', '_blank', 'noopener,noreferrer');
    expect(locationWithSpy.assign).toHaveBeenCalledWith('https://example.com');
  });

  it('should handle errors gracefully when Telegram openLink fails', () => {
    const mockOpenLink = vi
      .fn<(url: string, options?: { try_instant_view?: boolean }) => void>()
      .mockImplementation(() => {
        throw new Error('Telegram API error');
      });

    const mockOpen = vi
      .fn<(url: string, target?: string, features?: string) => Window | null>()
      .mockReturnValue({} as Window);

    windowWithTelegram.Telegram = {
      WebApp: {
        openLink: mockOpenLink,
      },
    };
    window.open = mockOpen;

    expect(() => openLink('https://example.com')).not.toThrow();
    expect(mockOpen).toHaveBeenCalledWith('https://example.com', '_blank', 'noopener,noreferrer');
  });

  it('should work in non-browser environment (SSR)', () => {
    const savedWindow = (globalThis as { window?: Window }).window;
    // biome-ignore lint/suspicious/noExplicitAny: testing SSR fallback without window
    delete (globalThis as any).window;

    expect(() => openLink('https://example.com')).not.toThrow();

    if (savedWindow) {
      (globalThis as { window?: Window }).window = savedWindow;
    }
  });
});
