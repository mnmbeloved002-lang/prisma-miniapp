// biome-ignore assist/source/organizeImports: keep React import first for JSX runtime
import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
void React;
import * as useTelegramModule from '../infrastructure/useTelegram';
import { TelegramWelcome } from './TelegramWelcome';

// Мокаем Telegram хуки
vi.mock('../infrastructure/useTelegram');

describe('TelegramWelcome', () => {
  it('рендерит приветствие с именем пользователя', () => {
    vi.mocked(useTelegramModule.useTelegramUser).mockReturnValue({
      id: 12345,
      firstName: 'Иван',
      lastName: 'Петров',
      username: 'ivanpetrov',
      languageCode: 'ru',
      isPremium: true,
    });
    vi.mocked(useTelegramModule.useTelegramTheme).mockReturnValue({
      bgColor: '#0f172a',
      textColor: '#e2e8f0',
      colorScheme: 'dark',
      hintColor: '#94a3b8',
      linkColor: '#3b82f6',
      buttonColor: '#3b82f6',
      buttonTextColor: '#ffffff',
    });

    render(<TelegramWelcome />);
    expect(screen.getByText(/Привет, Иван Петров!/)).toBeInTheDocument();
  });

  it('показывает ID пользователя', () => {
    vi.mocked(useTelegramModule.useTelegramUser).mockReturnValue({
      id: 12345,
      firstName: 'Иван',
      lastName: 'Петров',
      username: 'ivanpetrov',
      languageCode: 'ru',
      isPremium: true,
    });
    vi.mocked(useTelegramModule.useTelegramTheme).mockReturnValue(null);

    render(<TelegramWelcome />);
    expect(screen.getByText('12345')).toBeInTheDocument();
  });

  it('показывает username', () => {
    vi.mocked(useTelegramModule.useTelegramUser).mockReturnValue({
      id: 12345,
      firstName: 'Иван',
      lastName: 'Петров',
      username: 'ivanpetrov',
      languageCode: 'ru',
      isPremium: false,
    });
    vi.mocked(useTelegramModule.useTelegramTheme).mockReturnValue(null);

    render(<TelegramWelcome />);
    expect(screen.getByText('@ivanpetrov')).toBeInTheDocument();
  });

  it('показывает Premium статус', () => {
    vi.mocked(useTelegramModule.useTelegramUser).mockReturnValue({
      id: 12345,
      firstName: 'Иван',
      isPremium: true,
    });
    vi.mocked(useTelegramModule.useTelegramTheme).mockReturnValue(null);

    render(<TelegramWelcome />);
    expect(screen.getByText(/Telegram Premium/)).toBeInTheDocument();
  });

  it('показывает язык', () => {
    vi.mocked(useTelegramModule.useTelegramUser).mockReturnValue({
      id: 12345,
      firstName: 'Иван',
      languageCode: 'ru',
    });
    vi.mocked(useTelegramModule.useTelegramTheme).mockReturnValue(null);

    render(<TelegramWelcome />);
    expect(screen.getByText('RU')).toBeInTheDocument();
  });

  it('работает без пользователя (гость)', () => {
    vi.mocked(useTelegramModule.useTelegramUser).mockReturnValue(null);
    vi.mocked(useTelegramModule.useTelegramTheme).mockReturnValue(null);

    render(<TelegramWelcome />);
    expect(screen.getByText(/Привет, Гость!/)).toBeInTheDocument();
  });
});
