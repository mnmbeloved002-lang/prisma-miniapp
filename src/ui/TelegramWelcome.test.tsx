// biome-ignore assist/source/organizeImports: keep React import first for JSX runtime
import React from 'react';
import { render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
void React;
import * as useTelegramModule from '../application/useTelegram';
import { TelegramWelcome } from './TelegramWelcome';

vi.mock('../application/useTelegram', () => ({
  useTelegramUser: vi.fn(),
  useTelegramTheme: vi.fn(),
}));

describe('TelegramWelcome', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('рендерит приветствие с именем пользователя', () => {
    (useTelegramModule.useTelegramUser as ReturnType<typeof vi.fn>).mockReturnValue({
      id: 12345,
      firstName: 'Иван',
      lastName: 'Петров',
    });
    (useTelegramModule.useTelegramTheme as ReturnType<typeof vi.fn>).mockReturnValue(null);

    render(<TelegramWelcome />);
    expect(screen.getByText(/Привет, Иван Петров!/)).toBeInTheDocument();
  });

  it('показывает ID пользователя', () => {
    (useTelegramModule.useTelegramUser as ReturnType<typeof vi.fn>).mockReturnValue({
      id: 12345,
      firstName: 'Иван',
    });
    (useTelegramModule.useTelegramTheme as ReturnType<typeof vi.fn>).mockReturnValue(null);

    render(<TelegramWelcome />);
    expect(screen.getByText('12345')).toBeInTheDocument();
  });

  it('показывает username', () => {
    (useTelegramModule.useTelegramUser as ReturnType<typeof vi.fn>).mockReturnValue({
      id: 12345,
      firstName: 'Иван',
      username: 'ivanpetrov',
    });
    (useTelegramModule.useTelegramTheme as ReturnType<typeof vi.fn>).mockReturnValue(null);

    render(<TelegramWelcome />);
    expect(screen.getByText(/@ivanpetrov/)).toBeInTheDocument();
  });

  it('показывает Premium статус', () => {
    (useTelegramModule.useTelegramUser as ReturnType<typeof vi.fn>).mockReturnValue({
      id: 12345,
      firstName: 'Иван',
      isPremium: true,
    });
    (useTelegramModule.useTelegramTheme as ReturnType<typeof vi.fn>).mockReturnValue(null);

    render(<TelegramWelcome />);
    expect(screen.getByText(/Telegram Premium/)).toBeInTheDocument();
  });

  it('показывает язык', () => {
    (useTelegramModule.useTelegramUser as ReturnType<typeof vi.fn>).mockReturnValue({
      id: 12345,
      firstName: 'Иван',
      languageCode: 'ru',
    });
    (useTelegramModule.useTelegramTheme as ReturnType<typeof vi.fn>).mockReturnValue(null);

    render(<TelegramWelcome />);
    expect(screen.getByText('RU')).toBeInTheDocument();
  });

  it('работает без пользователя (гость)', () => {
    (useTelegramModule.useTelegramUser as ReturnType<typeof vi.fn>).mockReturnValue(null);
    (useTelegramModule.useTelegramTheme as ReturnType<typeof vi.fn>).mockReturnValue(null);

    render(<TelegramWelcome />);
    expect(screen.getByText(/Привет, Гость!/)).toBeInTheDocument();
  });
});
