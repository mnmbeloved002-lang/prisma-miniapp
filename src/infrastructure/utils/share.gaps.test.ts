import { describe, expect, it, vi } from 'vitest';
import { normalizeShareUrl, shareLink } from './share';

describe('share utils – coverage gaps', () => {
  it('normalizeShareUrl: outer try/catch returns empty string on unexpected error', () => {
    // canonicalUrl с "злой" реализацией trim -> выбрасываем ошибку ДО внутреннего try/catch
    const evilCanonical: any = {
      trim() {
        throw new Error('boom');
      },
    };

    const result = normalizeShareUrl('https://example.com', evilCanonical);

    expect(result).toBe('');
  });

  it('normalizeShareUrl: returns empty string when pathname contains encoded colon', () => {
    // base = "/weird%3Apath" -> первый new URL(base) падает -> второй успешен, но pathname содержит %3A
    const result = normalizeShareUrl('/weird%3Apath');

    expect(result).toBe('');
  });

  it('normalizeShareUrl: returns empty string when pathname contains encoded dot', () => {
    // проверяем ветку с "%2E"
    const result = normalizeShareUrl('/file%2Ejson');

    expect(result).toBe('');
  });

  it('normalizeShareUrl: returns empty string when decoded pathname has invalid characters', () => {
    // путь с кириллицей -> decodeURIComponent(pathname) содержит неразрешённые символы
    const result = normalizeShareUrl('/%D0%BF%D1%80%D0%B8%D0%B2%D0%B5%D1%82');

    expect(result).toBe('');
  });

  it('getCanonicalFromDocument: errors from querySelector are swallowed (via shareLink)', async () => {
    const querySpy = vi.spyOn(document, 'querySelector').mockImplementation(() => {
      throw new Error('boom');
    });

    // Отключаем все реальные каналы шаринга, чтобы гарантированно попасть в alert-фолбэк
    (window as any).Telegram = undefined;
    (navigator as any).share = undefined;
    (navigator as any).clipboard = undefined;

    const alertSpy = vi.spyOn(window, 'alert').mockImplementation(() => {});

    const result = await shareLink(window.location.href, 'Test canonical fail');

    // shareLink должен тихо отработать через alert, не упав
    expect(result).toBe(false);
    expect(alertSpy).toHaveBeenCalled();

    querySpy.mockRestore();
    alertSpy.mockRestore();
  });

  it('getCleanFallbackUrl: errors from URL constructor are swallowed (via shareLink)', async () => {
    const OriginalURL = URL;

    // Заглушка URL, которая всегда падает при new URL(...)
    class URLStub {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      constructor(..._args: any[]) {
        throw new Error('boom');
      }
    }

    (globalThis as any).URL = URLStub as any;

    // Отключаем все каналы шаринга, опять же идём в alert-фолбэк
    (window as any).Telegram = undefined;
    (navigator as any).share = undefined;
    (navigator as any).clipboard = undefined;

    const alertSpy = vi.spyOn(window, 'alert').mockImplementation(() => {});

    const result = await shareLink('https://example.com/привет', 'Test URL fail');

    expect(result).toBe(false);
    expect(alertSpy).toHaveBeenCalled();

    alertSpy.mockRestore();
    (globalThis as any).URL = OriginalURL;
  });
});
