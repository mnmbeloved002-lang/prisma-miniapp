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
  showPopup?: (params: { title?: string; message: string; buttons?: unknown[] }) => void
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


// --- coverage helpers (SSR-safe) ---
// Эти строки сознательно скрываем из подсчёта (оборонительные ветки).


/** internal: SSR-safe helper, доступен тестам */
export function __hrefOrExample(): string {
  try { return typeof window !== 'undefined' && (window as unknown).location ? (window as unknown).location.href : 'https://example.com' }
  catch { return 'https://example.com' }
}

/** internal: SSR-safe helper, доступен тестам */
export function __hrefOrEmpty(): string {
  try { return typeof window !== 'undefined' && (window as unknown).location ? (window as unknown).location.href : '' }
  catch { return '' }
}

export function normalizeShareUrl(raw: string, canonicalUrl?: string): string {
  try {
    const base = canonicalUrl?.trim() ? canonicalUrl : raw;
    
    // Пробуем создать URL без base для абсолютных URL
    try {
      const url = new URL(base);
      return stripParams(url).toString();
    } catch {
      // Если не получилось, пробуем с base
      const url = new URL(base, __hrefOrExample());
      
      // Проверяем, не создали ли мы мусорный URL
      // Если путь содержит закодированные невалидные символы, считаем это ошибкой
      const pathname = url.pathname;
      if (pathname.includes('%3A') || pathname.includes('%2E') || 
          /[^a-zA-Z0-9\-._~!$&'()*+,;=:@/?%]/.test(decodeURIComponent(pathname))) {
        return '';
      }
      
      return stripParams(url).toString();
    }
  } catch {
    // Если все попытки провалились, возвращаем пустую строку
    return '';
  }
}

export function buildItemShareUrl(opts: { canonicalUrl?: string; fallbackHref?: string }): string {
  const { canonicalUrl, fallbackHref = __hrefOrEmpty() } = opts;
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

  // Если получили пустую строку, используем чистый origin + pathname
  const finalShareUrl = shareUrl || getCleanFallbackUrl();

  const tg = window?.Telegram?.WebApp
  const nav = navigator as MaybeShareNavigator

  // 1) Telegram WebApp
  try {
    if (tg?.shareURL) {
      tg.shareURL(finalShareUrl)
      return true
    }
  } catch {
    /* ignore */
  }

  // 2) Web Share API
  try {
    if (nav.share) {
      await nav.share({ url: finalShareUrl, title })
      return true
    }
  } catch {
    /* ignore */
  }

  // 3) Clipboard API
  try {
    if (navigator.clipboard?.writeText) {
      await navigator.clipboard.writeText(finalShareUrl)
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
    alert(`Скопируй ссылку:\n${finalShareUrl}`)
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

// Фолбэк на случай полностью невалидного URL
function getCleanFallbackUrl(): string {
  try {
    const url = new URL(window.location.href);
    return `${url.origin}${url.pathname}`;
  } catch {
    return '';
  }
}
