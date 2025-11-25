type WebShareData = {
  title?: string;
  text?: string;
  url?: string;
};

type MaybeShareNavigator = Navigator & {
  share?: (data: WebShareData) => Promise<void>;
};

// Мусорные параметры для удаления
const JUNK_PARAMS = [
  // biome-ignore lint/security/noSecrets: query parameter name, not a secret
  'tgWebAppData',
  // biome-ignore lint/security/noSecrets: query parameter name, not a secret
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
  // biome-ignore lint/security/noSecrets: query parameter name, not a secret
  'tgWebAppVersion',
  // biome-ignore lint/security/noSecrets: query parameter name, not a secret
  'tgWebAppPlatform',
  // biome-ignore lint/security/noSecrets: query parameter name, not a secret
  'tgWebAppThemeParams',
  'v',
];

function stripParams(u: URL): URL {
  for (const p of JUNK_PARAMS) {
    u.searchParams.delete(p);
  }
  if ([...u.searchParams.keys()].length === 0) {
    u.search = '';
  }
  u.hash = '';
  return u;
}

// --- coverage helpers (SSR-safe) ---

/** internal: SSR-safe helper, доступен тестам */
export function __hrefOrExample(): string {
  try {
    // biome-ignore lint/suspicious/noExplicitAny: safe access to window in SSR check
    return typeof window !== 'undefined' && (window as any).location
      ? // biome-ignore lint/suspicious/noExplicitAny: safe access
        (window as any).location.href
      : 'https://example.com';
  } catch {
    return 'https://example.com';
  }
}

/** internal: SSR-safe helper, доступен тестам */
export function __hrefOrEmpty(): string {
  try {
    // biome-ignore lint/suspicious/noExplicitAny: safe access to window in SSR check
    return typeof window !== 'undefined' && (window as any).location
      ? // biome-ignore lint/suspicious/noExplicitAny: safe access
        (window as any).location.href
      : '';
  } catch {
    return '';
  }
}

export function normalizeShareUrl(raw: string, canonicalUrl?: string): string {
  try {
    const base = canonicalUrl?.trim() ? canonicalUrl : raw;

    try {
      const url = new URL(base);
      return stripParams(url).toString();
    } catch {
      const url = new URL(base, __hrefOrExample());
      const pathname = url.pathname;
      if (
        pathname.includes('%3A') ||
        pathname.includes('%2E') ||
        /[^a-zA-Z0-9\-._~!$&'()*+,;=:@/?%]/.test(decodeURIComponent(pathname))
      ) {
        return '';
      }
      return stripParams(url).toString();
    }
  } catch {
    return '';
  }
}

export function buildItemShareUrl(opts: { canonicalUrl?: string; fallbackHref?: string }): string {
  const { canonicalUrl, fallbackHref = __hrefOrEmpty() } = opts;
  return normalizeShareUrl(fallbackHref, canonicalUrl);
}

/**
 * Универсальный шаринг ссылки
 */
export async function shareLink(url?: string, title?: string): Promise<boolean> {
  const shareUrl = buildItemShareUrl({
    canonicalUrl: getCanonicalFromDocument(),
    fallbackHref: url || window.location.href,
  });

  const finalShareUrl = shareUrl || getCleanFallbackUrl();

  const tg = window.Telegram?.WebApp;
  const nav = navigator as MaybeShareNavigator;

  // 1) Telegram WebApp
  try {
    if (tg?.shareURL) {
      tg.shareURL(finalShareUrl);
      return true;
    }
  } catch {
    /* ignore */
  }

  // 2) Web Share API
  try {
    if (nav.share) {
      await nav.share({ url: finalShareUrl, title });
      return true;
    }
  } catch {
    /* ignore */
  }

  // 3) Clipboard API
  try {
    if (navigator.clipboard?.writeText) {
      await navigator.clipboard.writeText(finalShareUrl);
      tg?.showPopup?.({
        title: 'Скопировано',
        message: 'Ссылка скопирована в буфер обмена.',
        buttons: [{ type: 'ok' }],
      });
      return true;
    }
  } catch {
    /* ignore */
  }

  // 4) Фолбэк
  try {
    // Здесь удален лишний комментарий про noConsoleLog, так как alert != console.log

    alert(`Скопируй ссылку:\n${finalShareUrl}`);
  } catch {
    /* ignore */
  }
  return false;
}

function getCanonicalFromDocument(): string | undefined {
  try {
    // biome-ignore lint/security/noSecrets: CSS selector
    const link = document.querySelector('link[rel="canonical"]') as HTMLLinkElement | null;
    return link?.href || undefined;
  } catch {
    return undefined;
  }
}

function getCleanFallbackUrl(): string {
  try {
    const url = new URL(window.location.href);
    return `${url.origin}${url.pathname}`;
  } catch {
    return '';
  }
}
