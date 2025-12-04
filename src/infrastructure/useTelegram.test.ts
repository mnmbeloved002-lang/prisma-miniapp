import { renderHook } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { useTelegramInit, useTelegramTheme, useTelegramUser } from './useTelegram';

// Мокаем функции telegram.ts
vi.mock('./telegram', () => ({
  initTelegram: vi.fn(() => ({
    initData: { user: { id: 123, firstName: 'Test' } },
  })),
  getTelegramUser: vi.fn(() => ({
    id: 123,
    firstName: 'Test',
    lastName: 'User',
    username: 'testuser',
    languageCode: 'en',
    isPremium: false,
  })),
  getTelegramTheme: vi.fn(() => ({
    colorScheme: 'dark',
    bgColor: '#0f172a',
    textColor: '#e2e8f0',
    hintColor: '#94a3b8',
    linkColor: '#3b82f6',
    buttonColor: '#3b82f6',
    buttonTextColor: '#ffffff',
  })),
}));

describe('useTelegram hooks', () => {
  describe('useTelegramInit', () => {
    it('инициализирует SDK и возвращает статус', () => {
      const { result } = renderHook(() => useTelegramInit());
      expect(result.current.isInitialized).toBe(true);
      expect(result.current.isInTelegram).toBe(true);
    });
  });

  describe('useTelegramUser', () => {
    it('возвращает данные пользователя', () => {
      const { result } = renderHook(() => useTelegramUser());
      expect(result.current).toMatchObject({
        id: 123,
        firstName: 'Test',
      });
    });
  });

  describe('useTelegramTheme', () => {
    it('возвращает тему Telegram', () => {
      const { result } = renderHook(() => useTelegramTheme());
      expect(result.current).toMatchObject({
        colorScheme: 'dark',
        bgColor: '#0f172a',
      });
    });
  });
});
