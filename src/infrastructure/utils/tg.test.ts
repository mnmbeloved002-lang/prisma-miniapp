import { afterEach, describe, expect, it, vi } from 'vitest';
import { initTelegramUI } from './tg';

describe('Telegram UI', () => {
  afterEach(() => {
    vi.restoreAllMocks();
    // @ts-expect-error cleanup
    delete window.Telegram;
  });

  it('calls ready() if Telegram API is available', () => {
    const readyMock = vi.fn();
    const expandMock = vi.fn();

    // @ts-expect-error mock
    window.Telegram = {
      WebApp: {
        ready: readyMock,
        expand: expandMock,
      },
    };

    initTelegramUI();

    // Проверяем только то, что реально есть в коде
    expect(readyMock).toHaveBeenCalled();
    expect(expandMock).not.toHaveBeenCalled();
  });

  it('safely handles missing Telegram API', () => {
    // @ts-expect-error cleanup
    delete window.Telegram;
    expect(() => initTelegramUI()).not.toThrow();
  });

  it('safely handles partial API (missing WebApp)', () => {
    // @ts-expect-error mock partial
    window.Telegram = {};
    expect(() => initTelegramUI()).not.toThrow();
  });

  it('swallows errors thrown by Telegram API', () => {
    const errorReady = vi.fn(() => {
      throw new Error('Telegram internal error');
    });

    // @ts-expect-error mock
    window.Telegram = {
      WebApp: {
        ready: errorReady,
      },
    };

    // Ошибка из ready() не должна пробрасываться наружу
    expect(() => initTelegramUI()).not.toThrow();
    expect(errorReady).toHaveBeenCalled();
  });

  it('safely handles missing window (SSR)', () => {
    // Сохраняем оригинальный window
    const originalWindow = global.window;
    // Удаляем window для имитации SSR
    // @ts-expect-error mock SSR
    delete global.window;

    expect(() => initTelegramUI()).not.toThrow();

    // Восстанавливаем window
    global.window = originalWindow;
  });
});
