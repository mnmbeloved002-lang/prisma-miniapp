/**
 * React хуки для работы с Telegram Mini App
 */

import { useEffect, useState } from 'react';
import { getTelegramTheme, getTelegramUser, initTelegram, type TelegramUser } from './telegram';

/**
 * Хук для инициализации Telegram SDK
 * Использовать один раз в корневом компоненте
 */
export function useTelegramInit() {
  const [isInitialized, setIsInitialized] = useState(false);
  const [isInTelegram, setIsInTelegram] = useState(false);

  useEffect(() => {
    const launchParams = initTelegram();
    setIsInTelegram(!!launchParams);
    setIsInitialized(true);
  }, []);

  return { isInitialized, isInTelegram };
}

/**
 * Хук для получения данных пользователя Telegram
 */
export function useTelegramUser() {
  const [user, setUser] = useState<TelegramUser | null>(null);

  useEffect(() => {
    const telegramUser = getTelegramUser();
    setUser(telegramUser);
  }, []);

  return user;
}

/**
 * Хук для работы с темой Telegram
 */
export function useTelegramTheme() {
  const [theme, setTheme] = useState(() => getTelegramTheme());

  useEffect(() => {
    const currentTheme = getTelegramTheme();
    setTheme(currentTheme);
  }, []);

  return theme;
}
