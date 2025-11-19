// @ts-nocheck
import { vi, describe, it, expect, beforeEach, afterEach } from 'vitest';
import { openLink } from './nav';

describe('openLink', () => {
  const originalTelegram = window.Telegram;
  const originalOpen = window.open;
  const originalLocation = window.location;

  beforeEach(() => {
    // Сбрасываем все моки
    vi.clearAllMocks();
    delete (window as any).Telegram;
    delete (window as any).open;
    delete (window as any).location;
  });

  afterEach(() => {
    // Восстанавливаем оригинальные значения
    window.Telegram = originalTelegram;
    window.open = originalOpen;
    window.location = originalLocation as any;
  });

  it('should use Telegram WebApp openLink when available', () => {
    const mockOpenLink = vi.fn();
    window.Telegram = {
      WebApp: {
        openLink: mockOpenLink,
      },
    } as any;

    openLink('https://example.com');

    expect(mockOpenLink).toHaveBeenCalledWith('https://example.com', { try_instant_view: true });
  });

  it('should use window.open when Telegram is not available', () => {
    const mockOpen = vi.fn().mockReturnValue({});
    window.open = mockOpen;

    openLink('https://example.com');

    expect(mockOpen).toHaveBeenCalledWith('https://example.com', '_blank', 'noopener,noreferrer');
  });

  it('should fallback to location.assign when window.open fails', () => {
    const mockOpen = vi.fn().mockReturnValue(null); // window.open returns null (blocked)
    const mockAssign = vi.fn();
    
    window.open = mockOpen;
    window.location = { assign: mockAssign } as any;

    openLink('https://example.com');

    expect(mockOpen).toHaveBeenCalledWith('https://example.com', '_blank', 'noopener,noreferrer');
    expect(mockAssign).toHaveBeenCalledWith('https://example.com');
  });

  it('should handle errors gracefully when Telegram openLink fails', () => {
    const mockOpenLink = vi.fn().mockImplementation(() => {
      throw new Error('Telegram API error');
    });
    
    const mockOpen = vi.fn().mockReturnValue({});
    window.Telegram = {
      WebApp: {
        openLink: mockOpenLink,
      },
    } as any;
    window.open = mockOpen;

    // Не должно выбрасывать ошибку
    expect(() => openLink('https://example.com')).not.toThrow();

    // Должно переключиться на window.open
    expect(mockOpen).toHaveBeenCalledWith('https://example.com', '_blank', 'noopener,noreferrer');
  });

  it('should work in non-browser environment (SSR)', () => {
    // Эмулируем серверное окружение (нет window)
    const originalWindow = global.window;
    delete (global as any).window;

    // Не должно выбрасывать ошибку
    expect(() => openLink('https://example.com')).not.toThrow();

    // Восстанавливаем window
    global.window = originalWindow;
  });
});
