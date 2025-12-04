/**
 * Telegram Mini App SDK Integration
 * Современная интеграция с Telegram WebApp API v3.x
 */

import { init, retrieveLaunchParams } from '@telegram-apps/sdk-react';

export interface TelegramUser {
  id: number;
  firstName: string;
  lastName?: string;
  username?: string;
  languageCode?: string;
  isPremium?: boolean;
}

/**
 * Инициализация Telegram SDK
 * Вызывать один раз при старте приложения
 */
export function initTelegram() {
  if (typeof window === 'undefined') {
    console.warn('[Telegram] Not in browser environment');
    return null;
  }

  try {
    // Получаем параметры запуска
    const launchParams = retrieveLaunchParams();

    // Инициализируем SDK компоненты
    init();

    console.log('[Telegram] SDK initialized successfully');
    return launchParams;
  } catch (error) {
    console.warn('[Telegram] Not running in Telegram environment', error);
    return null;
  }
}

/**
 * Получить данные пользователя Telegram
 */
export function getTelegramUser(): TelegramUser | null {
  try {
    const launchParams = retrieveLaunchParams();
    const user = launchParams?.initData?.user;

    if (!user) {
      return null;
    }

    return {
      id: user.id,
      firstName: user.firstName,
      lastName: user.lastName,
      username: user.username,
      languageCode: user.languageCode,
      isPremium: user.isPremium,
    };
  } catch {
    return null;
  }
}

/**
 * Получить текущую тему Telegram
 */
export function getTelegramTheme() {
  try {
    const launchParams = retrieveLaunchParams();
    const theme = launchParams?.themeParams;

    if (!theme) {
      return null;
    }

    return {
      colorScheme: launchParams.colorScheme || 'dark',
      bgColor: theme.bgColor || theme.backgroundColor,
      textColor: theme.textColor,
      hintColor: theme.hintColor,
      linkColor: theme.linkColor,
      buttonColor: theme.buttonColor,
      buttonTextColor: theme.buttonTextColor,
    };
  } catch {
    return null;
  }
}
