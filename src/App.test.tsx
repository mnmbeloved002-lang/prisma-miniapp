// biome-ignore assist/source/organizeImports: keep React import first for JSX runtime
import React from 'react';
import { render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
void React;
import App from './App';
import * as useTelegramModule from './infrastructure/useTelegram';

// Мокаем Telegram хуки
vi.mock('./infrastructure/useTelegram');

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
    // Default: инициализирован, не в Telegram
    vi.mocked(useTelegramModule.useTelegramInit).mockReturnValue({
      isInitialized: true,
      isInTelegram: false,
    });
  });

  it('рендерит AppShell когда не в Telegram', () => {
    render(<App />);
    expect(screen.getByText('Prisma Ritual AI')).toBeInTheDocument();
  });

  it('показывает загрузку при инициализации', () => {
    vi.mocked(useTelegramModule.useTelegramInit).mockReturnValue({
      isInitialized: false,
      isInTelegram: false,
    });

    render(<App />);
    expect(screen.getByText('Загрузка...')).toBeInTheDocument();
  });
});
