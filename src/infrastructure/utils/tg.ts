// src/infrastructure/utils/tg.ts
// Безопасная инициализация Telegram WebApp без сайд-эффектов на уровне модуля.

type TgWebAppMinimal = {
  ready?(): void;
  expand?(): void;
  disableVerticalSwipes?(): void;
  MainButton?: {
    setText?(label: string): void;
  };
};

interface TelegramWebAppGlobal extends Window {
  Telegram?: {
    WebApp?: TgWebAppMinimal;
  };
}

function getTelegramWindow(): TelegramWebAppGlobal | undefined {
  // SSR-safe: в Node 'window' может быть не определён
  if (typeof window === 'undefined') {
    return undefined;
  }
  return window as unknown as TelegramWebAppGlobal;
}

/**
 * Безопасная и необязательная инициализация Telegram WebApp.
 * Если API нет — просто выходим. Любые ошибки глушим.
 */
export function initTelegramUI(): void {
  try {
    const tgWindow = getTelegramWindow();
    const webApp = tgWindow?.Telegram?.WebApp;

    if (!webApp) {
      return;
    }

    // Минимальные безопасные вызовы
    webApp.ready?.();
    // Остальные методы можно дергать по месту при необходимости:
    // webApp.expand?.();
    // webApp.disableVerticalSwipes?.();
    // webApp.MainButton?.setText?.('...');
  } catch {
    // Мост НЕ должен ломать первый рендер UI
  }
}
