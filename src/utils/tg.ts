// Небольшие типы вместо any, чтобы не ругался ESLint
interface TelegramWebApp {
  expand?: () => void;
  setHeaderColor?: (color: string) => void;
  setBackgroundColor?: (color: string) => void;
  onEvent?: (event: string, cb: () => void) => void;
}
declare global {
  interface Window {
    Telegram?: { WebApp?: TelegramWebApp };
  }
}

/** true, если приложение открыто в Telegram WebApp */
export function isInTelegram(): boolean {
  return Boolean(window?.Telegram?.WebApp);
}

/** Инициализация UI Telegram WebApp: разворачиваемся, задаём цвета */
export function initTelegramUI(): void {
  const tg = window?.Telegram?.WebApp;
  if (!tg) return;

  try { tg.expand?.(); } catch (e) { console.debug('tg.expand error', e); }

  try {
    tg.setHeaderColor?.('#0b0c0f');
    tg.setBackgroundColor?.('#0b0c0f');
  } catch (e) { console.debug('tg.set*Color error', e); }

  try {
    tg.onEvent?.('themeChanged', () => {
      // Тут можно будет подстраивать токены под tg.themeParams, если понадобится
      console.debug('Telegram themeChanged');
    });
  } catch (e) { console.debug('tg.onEvent error', e); }
}
