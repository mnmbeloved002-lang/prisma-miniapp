// src/utils/tg.test.ts
import { vi, describe, it, expect, beforeEach } from 'vitest';
import { initTelegramUI } from './tg';

// Сохраняем и восстанавливаем window.Telegram
const originalTelegram = window.Telegram;
beforeEach(() => {
  // @ts-expect-error: Свойство Telegram только для тестов
  delete window.Telegram;
});
afterEach(() => {
  window.Telegram = originalTelegram;
});

describe('initTelegramUI', () => {
  it('should do nothing if window.Telegram is missing', () => {
    // window.Telegram не определен (по умолчанию в beforeEach)
    expect(() => initTelegramUI()).not.toThrow();
  });

  it('should call tg.ready() if available', () => {
    const readyMock = vi.fn();
    window.Telegram = {
      WebApp: {
        ready: readyMock,
      },
    };

    initTelegramUI();
    expect(readyMock).toHaveBeenCalledTimes(1);
  });

  it('should safely catch errors during initialization (cover catch block)', () => {
    const readyMock = vi.fn(() => {
      throw new Error('TG Bridge Error');
    });
    window.Telegram = {
      WebApp: {
        ready: readyMock,
      },
    };

    // Функция не должна "пробрасывать" ошибку наружу
    expect(() => initTelegramUI()).not.toThrow();
    expect(readyMock).toHaveBeenCalledTimes(1);
  });
});
