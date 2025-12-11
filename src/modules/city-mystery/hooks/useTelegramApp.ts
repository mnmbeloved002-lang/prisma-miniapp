import { useEffect } from 'react';

/**
 * Хук для инициализации Telegram Mini App
 */
export function useTelegramApp() {
  useEffect(() => {
    const webApp = window.Telegram?.WebApp;
    if (!webApp) {
      return;
    }

    webApp.ready?.();
    webApp.expand?.();
    webApp.disableVerticalSwipes?.();
  }, []);
}
