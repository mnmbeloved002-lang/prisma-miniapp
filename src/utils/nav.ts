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
    tg.openLink(url, { try_instant_view: true });
    return;
  }

  // Обычный браузер: пытаемся новое окно, иначе — в этом же окне
  if (typeof window !== 'undefined') {
    const win = window.open(url, '_blank', 'noopener,noreferrer');
    if (!win) window.location.assign(url);
  }
}
