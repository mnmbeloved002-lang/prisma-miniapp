// @ts-nocheck
// src/utils/nav.ts

// Мини-типизация Telegram WebApp, чтобы не использовать `any`
type TelegramWebApp = {
  openLink?: (url: string, opts?: { try_instant_view?: boolean }) => void;
};
type TelegramGlobal = {
  Telegram?: { WebApp?: TelegramWebApp };
};

export function openLink(url: string) {
  const tg = (globalThis as TelegramGlobal).Telegram?.WebApp;

  // Внутри Telegram: откроем нативно (Instant View, если доступен)
  if (tg?.openLink) {
    try {
      tg.openLink(url, { try_instant_view: true });
      return;
    } catch {
      // Если Telegram WebApp выбросил ошибку, продолжаем к обычным методам
      // Не логируем ошибку, чтобы не засорять консоль пользователя
    }
  }

  // Обычный браузер: пытаемся новое окно, иначе — в этом же окне
  if (typeof window !== 'undefined') {
    try {
      const win = window.open(url, '_blank', 'noopener,noreferrer');
      if (!win && window.location) {
        window.location.assign(url);
      }
    } catch {
      // Игнорируем ошибки открытия ссылок
    }
  }
}
