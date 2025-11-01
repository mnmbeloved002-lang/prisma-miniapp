export function tgOpen(url: string) {
  try {
    // @ts-expect-error Telegram WebApp доступен только в рантайме
    const tg = (window as any)?.Telegram?.WebApp;
    if (tg?.openLink) {
      tg.openLink(url, { try_instant_view: true });
      return;
    }
  } catch {}
  try {
    window.open(url, '_blank', 'noopener,noreferrer');
  } catch {
    window.location.href = url;
  }
}
