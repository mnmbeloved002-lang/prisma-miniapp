// src/utils/nav.ts
export function openLink(url: string) {
  const tg = (globalThis as any)?.Telegram?.WebApp;
  try {
    if (tg?.openLink) {
      tg.openLink(url, { try_instant_view: true } as any);
      return;
    }
  } catch {}
  try {
    window.open(url, '_blank', 'noopener,noreferrer');
  } catch {}
}
