// Определяем интерфейс, объединяя методы, нужные и здесь, и в share.ts
export interface TgWebAppMinimal {
  ready?: () => void;
  expand?: () => void;
  close?: () => void;
  disableVerticalSwipes?: () => void;
  MainButton?: {
    setText?(label: string): void;
  };
  // Методы, которые используются в share.ts (чтобы не было конфликтов типов)
  shareURL?: (url: string) => void;
  openTelegramLink?: (url: string) => void;
  showPopup?: (params: { title?: string; message: string; buttons?: unknown[] }) => void;
}

// РАСШИРЯЕМ глобальный Window.
// TypeScript автоматически объединит это определение с тем, что в share.ts
declare global {
  interface Window {
    Telegram?: {
      WebApp?: TgWebAppMinimal;
    };
  }
}

/**
 * Безопасная и необязательная инициализация Telegram WebApp.
 * Если API нет — просто выходим. Любые ошибки глушим.
 */
export function initTelegramUI(): void {
  try {
    // SSR-safe проверка: если окна нет, выходим
    if (typeof window === 'undefined') {
      return;
    }

    // Теперь TS знает, что у window есть Telegram, кастовать (as unknown) не нужно!
    const webApp = window.Telegram?.WebApp;

    if (!webApp) {
      return;
    }

    // Минимальные безопасные вызовы
    webApp.ready?.();

    // Остальные методы можно дергать по месту при необходимости:
    // webApp.expand?.();
  } catch {
    // Мост НЕ должен ломать первый рендер UI
  }
}
