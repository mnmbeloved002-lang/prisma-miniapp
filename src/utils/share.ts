type WebShareData = {
  title?: string
  text?: string
  url?: string
}

type MaybeShareNavigator = Navigator & {
  share?: (data: WebShareData) => Promise<void>
}

interface TelegramWebApp {
  shareURL?: (url: string) => void
  openTelegramLink?: (url: string) => void
  showPopup?: (params: { title?: string; message: string; buttons?: any[] }) => void
}

declare global {
  interface Window {
    Telegram?: { WebApp?: TelegramWebApp }
  }
}

// Мусорные параметры для удаления
const JUNK_PARAMS = [
  'tgWebAppData',
  'tgShareScore',
  'utm_source',
  'utm_medium',
  'utm_campaign',
  'utm_term',
  'utm_content',
  'fbclid',
  'gclid',
  'yclid',
  'mc_cid',
  'mc_eid',
  'tgWebAppVersion',
  'tgWebAppPlatform',
  'tgWebAppThemeParams',
  'v',
];

function stripParams(u: URL): URL {
  for (const p of JUNK_PARAMS) u.searchParams.delete(p);
  if ([...u.searchParams.keys()].length === 0) u.search = '';
  u.hash = '';
  return u;
}

export function normalizeShareUrl(raw: string, canonicalUrl?: string): string {
  try {
    const base = canonicalUrl?.trim() ? canonicalUrl : raw;
    const url = new URL(base, typeof window !== 'undefined' ? window.location.href : 'https://example.com');
    return stripParams(url).toString();
  } catch {
    return '';
  }
}

export function buildItemShareUrl(opts: { canonicalUrl?: string; fallbackHref?: string }): string {
  const { canonicalUrl, fallbackHref = (typeof window !== 'undefined' ? window.location.href : '') } = opts;
  return normalizeShareUrl(fallbackHref, canonicalUrl);
}

/**
 * Универсальный шаринг ссылки (сохраняем существующий API)
 */
export async function shareLink(url?: string, title?: string): Promise<boolean> {
  // Используем новую логику нормализации
  const shareUrl = buildItemShareUrl({
    canonicalUrl: getCanonicalFromDocument(),
    fallbackHref: url || window.location.href
  });

  const tg = window?.Telegram?.WebApp
  const nav = navigator as MaybeShareNavigator

  // 1) Telegram WebApp
  try {
    if (tg?.shareURL) {
      tg.shareURL(shareUrl)
      return true
    }
  } catch {
    /* ignore */
  }

  // 2) Web Share API
  try {
    if (nav.share) {
      await nav.share({ url: shareUrl, title })
      return true
    }
  } catch {
    /* ignore */
  }

  // 3) Clipboard API
  try {
    if (navigator.clipboard?.writeText) {
      await navigator.clipboard.writeText(shareUrl)
      tg?.showPopup?.({
        title: 'Скопировано',
        message: 'Ссылка скопирована в буфер обмена.',
        buttons: [{ type: 'ok' }],
      })
      return true
    }
  } catch {
    /* ignore */
  }

  // 4) Фолбэк
  try {
    alert(`Скопируй ссылку:\n${shareUrl}`)
  } catch {
    /* ignore */
  }
  return false
}

// Вспомогательная функция для извлечения canonical из документа
function getCanonicalFromDocument(): string | undefined {
  try {
    const link = document.querySelector('link[rel="canonical"]') as HTMLLinkElement | null
    return link?.href || undefined
  } catch {
    return undefined
  }
}
