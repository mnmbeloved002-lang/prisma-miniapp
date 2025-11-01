type TelegramOpenLinkOpts = { try_instant_view?: boolean };

type TelegramWebApp = {
  openLink?: (url: string, opts?: TelegramOpenLinkOpts) => void;
};

declare global {
  interface Window {
    Telegram?: { WebApp?: TelegramWebApp };
  }
}

/** Открывает ссылку через Telegram WebApp, если доступен, иначе обычное окно. */
export function tgOpen(url: string) {
  try {
    const tg = window?.Telegram?.WebApp;
    if (tg?.openLink) {
      tg.openLink(url, { try_instant_view: true });
      return;
    }
  } catch {
    // fall through to window.open
  }

  try {
    window.open(url, '_blank', 'noopener,noreferrer');
  } catch {
    // крайний случай — навигация текущим окном
    window.location.href = url;
  }
}
