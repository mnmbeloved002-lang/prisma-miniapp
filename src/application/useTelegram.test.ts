import { renderHook } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import * as telegramModule from '../infrastructure/telegram';
import { useTelegramInit, useTelegramTheme, useTelegramUser } from './useTelegram';

// Мокаем telegram.ts
vi.mock('../infrastructure/telegram', () => ({
  initTelegram: vi.fn(),
  getTelegramUser: vi.fn(),
  getTelegramTheme: vi.fn(),
}));

describe('useTelegram hooks', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('useTelegramInit', () => {
    it('инициализирует SDK и возвращает статус', () => {
      (telegramModule.initTelegram as ReturnType<typeof vi.fn>).mockReturnValue({
        isAvailable: true,
        initData: 'test',
      });

      const { result } = renderHook(() => useTelegramInit());
      expect(result.current.isInitialized).toBe(true);
      expect(result.current.isInTelegram).toBe(true);
    });

    it('обрабатывает отсутствие Telegram SDK', () => {
      (telegramModule.initTelegram as ReturnType<typeof vi.fn>).mockReturnValue(null);

      const { result } = renderHook(() => useTelegramInit());
      expect(result.current.isInitialized).toBe(true);
      expect(result.current.isInTelegram).toBe(false);
    });
  });

  describe('useTelegramUser', () => {
    it('возвращает данные пользователя', () => {
      (telegramModule.getTelegramUser as ReturnType<typeof vi.fn>).mockReturnValue({
        id: 123,
        firstName: 'Test',
      });

      const { result } = renderHook(() => useTelegramUser());
      expect(result.current).toMatchObject({
        id: 123,
        firstName: 'Test',
      });
    });

    it('возвращает null если нет пользователя', () => {
      (telegramModule.getTelegramUser as ReturnType<typeof vi.fn>).mockReturnValue(null);

      const { result } = renderHook(() => useTelegramUser());
      expect(result.current).toBeNull();
    });
  });

  describe('useTelegramTheme', () => {
    it('возвращает тему Telegram', () => {
      (telegramModule.getTelegramTheme as ReturnType<typeof vi.fn>).mockReturnValue({
        colorScheme: 'dark',
        bgColor: '#0f172a',
      });

      const { result } = renderHook(() => useTelegramTheme());
      expect(result.current).toMatchObject({
        colorScheme: 'dark',
        bgColor: '#0f172a',
      });
    });

    it('возвращает null если нет темы', () => {
      (telegramModule.getTelegramTheme as ReturnType<typeof vi.fn>).mockReturnValue(null);

      const { result } = renderHook(() => useTelegramTheme());
      expect(result.current).toBeNull();
    });
  });
});
