// Никаких сайд-эффектов на уровне модуля — только функция!
type TgWebApp = {
  ready?: () => void;
  expand?: () => void;
  disableVerticalSwipes?: () => void;
  MainButton?: { setText?: (s: string) => void };
};

declare global {
  interface Window {
    Telegram?: { WebApp?: TgWebApp };
  }
}

/**
 * Безопасная и необязательная инициализация Telegram WebApp.
 * Если API нет — просто выходим. Любые ошибки глушим.
 */
export function initTelegramUI(): void {
  try {
    const tg = window?.Telegram?.WebApp;
    if (!tg) return;

    // Минимальные безопасные вызовы
    tg.ready?.();
    // Всё остальное — осознанно позже, по месту
  } catch {
    // ничего — мост НЕ должен ломать первый рендер UI
  }
}
