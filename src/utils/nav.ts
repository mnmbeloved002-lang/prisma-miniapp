// src/utils/nav.ts

type OpenLinkOptions = { try_instant_view?: boolean };

type TGWebApp = {
  openLink?: (url: string, opts?: OpenLinkOptions) => void;
};

declare global {
  interface Window {
    Telegram?: { WebApp?: TGWebApp };
  }
}

/**
 * Открыть ссылку:
 * - в Telegram WebView — через WebApp.openLink (без X-Frame проблем)
 * - в обычном браузере — через window.open
 */
export function openLink(url: string): void {
  const tg = window?.Telegram?.WebApp;

  try {
    if (tg?.openLink) {
      tg.openLink(url, { try_instant_view: true });
      return;
    }
  } catch {
    // noop — упадем в браузерный путь
  }

  try {
    window.open(url, '_blank', 'noopener,noreferrer');
  } catch {
    // Фолбэк на тот же таб, если браузер блокирует popups
    window.location.assign(url);
  }
}
