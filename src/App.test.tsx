// biome-ignore assist/source/organizeImports: keep React import first for JSX runtime
import React from 'react';
import { render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
void React;
import App from './App';
import * as useTelegramModule from './application/useTelegram';

// Мокаем Telegram хуки
vi.mock('./application/useTelegram', () => ({
  useTelegramInit: vi.fn(),
  useTelegramUser: vi.fn(),
  useTelegramTheme: vi.fn(),
}));

// Мокаем ritual store
vi.mock('./application/ritual-store', () => ({
  useRitualStore: vi.fn(() => ({
    loading: false,
    ritualItem: null,
    error: null,
    fetchRitual: vi.fn(),
  })),
}));

describe('App (Integration)', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('рендерит AppShell когда не в Telegram', () => {
    (useTelegramModule.useTelegramInit as ReturnType<typeof vi.fn>).mockReturnValue({
      isInitialized: true,
      isInTelegram: false,
    });

    render(<App />);
    expect(screen.getByText('Telegram Mini App')).toBeInTheDocument();
  });

  it('показывает загрузку при инициализации', () => {
    (useTelegramModule.useTelegramInit as ReturnType<typeof vi.fn>).mockReturnValue({
      isInitialized: false,
      isInTelegram: false,
    });

    render(<App />);
    expect(screen.getByText('Загрузка...')).toBeInTheDocument();
  });

  it('рендерит TelegramWelcome когда в Telegram', () => {
    (useTelegramModule.useTelegramInit as ReturnType<typeof vi.fn>).mockReturnValue({
      isInitialized: true,
      isInTelegram: true,
    });
    (useTelegramModule.useTelegramUser as ReturnType<typeof vi.fn>).mockReturnValue({
      id: 123,
      firstName: 'Test',
    });
    (useTelegramModule.useTelegramTheme as ReturnType<typeof vi.fn>).mockReturnValue(null);

    render(<App />);
    expect(screen.getByText(/Привет, Test!/)).toBeInTheDocument();
  });
});
