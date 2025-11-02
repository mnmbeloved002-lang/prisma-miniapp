// src/utils/share.ts
export async function shareLink(url: string, title?: string) {
  // 1) Нативный share API (например, Telegram WebView или мобильный браузер)
  try {
    if (typeof navigator !== 'undefined' && typeof (navigator as any).share === 'function') {
      await (navigator as any).share({ title, url });
      return true;
    }
  } catch {
    /* ignore */
  }

  // 2) Фолбэк — просто копируем ссылку в буфер обмена
  try {
    if (typeof navigator !== 'undefined' && navigator.clipboard?.writeText) {
      await navigator.clipboard.writeText(url);
      return true;
    }
  } catch {
    /* ignore */
  }

  // 3) Если ничего не сработало — открываем в новой вкладке
  try {
    window.open(url, '_blank', 'noopener,noreferrer');
  } catch {
    /* ignore */
  }

  return false;
}
