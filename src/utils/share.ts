// src/utils/share.ts

type WebShareData = {
  title?: string
  text?: string
  url?: string
}

interface NavigatorWithShare extends Navigator {
  share?: (data: WebShareData) => Promise<void>
  clipboard?: {
    writeText: (text: string) => Promise<void>
  }
}

type TgPopupButton =
  | { id?: string; type?: 'ok' | 'close' | 'cancel' | 'destructive' | 'default'; text?: string }

interface TelegramWebApp {
  shareURL?: (url: string) => void
  openTelegramLink?: (url: string) => void
  showPopup?: (params: { title?: string; message: string; buttons?: TgPopupButton[] }) => void
}

declare global {
  interface Window {
    Telegram?: { WebApp?: TelegramWebApp }
  }
}

/** Берём <link rel="canonical"> если он той же origin; иначе — чистим текущий URL. */
function getCanonicalAppUrl(fallbackUrl?: string): string {
  try {
    const link = document.querySelector('link[rel="canonical"]') as HTMLLinkElement | null
    if (link?.href) {
      try {
        const canonical = new URL(link.href)
        const curOrigin = typeof location !== 'undefined' ? location.origin : null
        if (!curOrigin || canonical.origin === curOrigin) {
          return canonical.toString()
        }
      } catch {
        /* ignore bad canonical */
      }
    }
  } catch {
    /* ignore */
  }

  const base = typeof location !== 'undefined' ? location.href : (fallbackUrl ?? '/')
  const origin = typeof location !== 'undefined' ? location.origin : 'http://localhost'
  const u = new URL(base, origin)

  // убираем мусор от Telegram WebApp и вспомогательные query
  u.hash = ''
  ;[
    'tgWebAppData',
    'tgWebAppVersion',
    'tgWebAppPlatform',
    'tgWebAppThemeParams',
    'v',
  ].forEach((k) => u.searchParams.delete(k))

  return u.toString()
}

/**
 * Универсальный шаринг ссылки:
 * 1) Telegram WebApp → shareURL
 * 2) Web Share API → navigator.share
 * 3) Clipboard → navigator.clipboard.writeText
 * 4) Фолбэк → alert
 *
 * @returns true если показывали/скопировали успешно, иначе false
 */
export async function shareLink(url?: string, title?: string): Promise<boolean> {
  const shareUrl = getCanonicalAppUrl(url)
  const tg = window?.Telegram?.WebApp
  const nav = navigator as NavigatorWithShare

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
    if (nav.clipboard?.writeText) {
      await nav.clipboard.writeText(shareUrl)
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
