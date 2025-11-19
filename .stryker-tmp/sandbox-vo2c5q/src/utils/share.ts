// @ts-nocheck
function stryNS_9fa48() {
  var g = typeof globalThis === 'object' && globalThis && globalThis.Math === Math && globalThis || new Function("return this")();
  var ns = g.__stryker__ || (g.__stryker__ = {});
  if (ns.activeMutant === undefined && g.process && g.process.env && g.process.env.__STRYKER_ACTIVE_MUTANT__) {
    ns.activeMutant = g.process.env.__STRYKER_ACTIVE_MUTANT__;
  }
  function retrieveNS() {
    return ns;
  }
  stryNS_9fa48 = retrieveNS;
  return retrieveNS();
}
stryNS_9fa48();
function stryCov_9fa48() {
  var ns = stryNS_9fa48();
  var cov = ns.mutantCoverage || (ns.mutantCoverage = {
    static: {},
    perTest: {}
  });
  function cover() {
    var c = cov.static;
    if (ns.currentTestId) {
      c = cov.perTest[ns.currentTestId] = cov.perTest[ns.currentTestId] || {};
    }
    var a = arguments;
    for (var i = 0; i < a.length; i++) {
      c[a[i]] = (c[a[i]] || 0) + 1;
    }
  }
  stryCov_9fa48 = cover;
  cover.apply(null, arguments);
}
function stryMutAct_9fa48(id) {
  var ns = stryNS_9fa48();
  function isActive(id) {
    if (ns.activeMutant === id) {
      if (ns.hitCount !== void 0 && ++ns.hitCount > ns.hitLimit) {
        throw new Error('Stryker: Hit count limit reached (' + ns.hitCount + ')');
      }
      return true;
    }
    return false;
  }
  stryMutAct_9fa48 = isActive;
  return isActive(id);
}
type WebShareData = {
  title?: string;
  text?: string;
  url?: string;
};
type MaybeShareNavigator = Navigator & {
  share?: (data: WebShareData) => Promise<void>;
};
interface TelegramWebApp {
  shareURL?: (url: string) => void;
  openTelegramLink?: (url: string) => void;
  showPopup?: (params: {
    title?: string;
    message: string;
    buttons?: any[];
  }) => void;
}
declare global {
  interface Window {
    Telegram?: {
      WebApp?: TelegramWebApp;
    };
  }
}

// Мусорные параметры для удаления
const JUNK_PARAMS = stryMutAct_9fa48("180") ? [] : (stryCov_9fa48("180"), [stryMutAct_9fa48("181") ? "" : (stryCov_9fa48("181"), 'tgWebAppData'), stryMutAct_9fa48("182") ? "" : (stryCov_9fa48("182"), 'tgShareScore'), stryMutAct_9fa48("183") ? "" : (stryCov_9fa48("183"), 'utm_source'), stryMutAct_9fa48("184") ? "" : (stryCov_9fa48("184"), 'utm_medium'), stryMutAct_9fa48("185") ? "" : (stryCov_9fa48("185"), 'utm_campaign'), stryMutAct_9fa48("186") ? "" : (stryCov_9fa48("186"), 'utm_term'), stryMutAct_9fa48("187") ? "" : (stryCov_9fa48("187"), 'utm_content'), stryMutAct_9fa48("188") ? "" : (stryCov_9fa48("188"), 'fbclid'), stryMutAct_9fa48("189") ? "" : (stryCov_9fa48("189"), 'gclid'), stryMutAct_9fa48("190") ? "" : (stryCov_9fa48("190"), 'yclid'), stryMutAct_9fa48("191") ? "" : (stryCov_9fa48("191"), 'mc_cid'), stryMutAct_9fa48("192") ? "" : (stryCov_9fa48("192"), 'mc_eid'), stryMutAct_9fa48("193") ? "" : (stryCov_9fa48("193"), 'tgWebAppVersion'), stryMutAct_9fa48("194") ? "" : (stryCov_9fa48("194"), 'tgWebAppPlatform'), stryMutAct_9fa48("195") ? "" : (stryCov_9fa48("195"), 'tgWebAppThemeParams'), stryMutAct_9fa48("196") ? "" : (stryCov_9fa48("196"), 'v')]);
function stripParams(u: URL): URL {
  if (stryMutAct_9fa48("197")) {
    {}
  } else {
    stryCov_9fa48("197");
    for (const p of JUNK_PARAMS) u.searchParams.delete(p);
    if (stryMutAct_9fa48("200") ? [...u.searchParams.keys()].length !== 0 : stryMutAct_9fa48("199") ? false : stryMutAct_9fa48("198") ? true : (stryCov_9fa48("198", "199", "200"), (stryMutAct_9fa48("201") ? [] : (stryCov_9fa48("201"), [...u.searchParams.keys()])).length === 0)) u.search = stryMutAct_9fa48("202") ? "Stryker was here!" : (stryCov_9fa48("202"), '');
    u.hash = stryMutAct_9fa48("203") ? "Stryker was here!" : (stryCov_9fa48("203"), '');
    return u;
  }
}

// --- coverage helpers (SSR-safe) ---
// Эти строки сознательно скрываем из подсчёта (оборонительные ветки).

/** internal: SSR-safe helper, доступен тестам */
export function __hrefOrExample(): string {
  if (stryMutAct_9fa48("204")) {
    {}
  } else {
    stryCov_9fa48("204");
    try {
      if (stryMutAct_9fa48("205")) {
        {}
      } else {
        stryCov_9fa48("205");
        return (stryMutAct_9fa48("208") ? typeof window !== 'undefined' || (window as any).location : stryMutAct_9fa48("207") ? false : stryMutAct_9fa48("206") ? true : (stryCov_9fa48("206", "207", "208"), (stryMutAct_9fa48("210") ? typeof window === 'undefined' : stryMutAct_9fa48("209") ? true : (stryCov_9fa48("209", "210"), typeof window !== (stryMutAct_9fa48("211") ? "" : (stryCov_9fa48("211"), 'undefined')))) && (window as any).location)) ? (window as any).location.href : stryMutAct_9fa48("212") ? "" : (stryCov_9fa48("212"), 'https://example.com');
      }
    } catch {
      if (stryMutAct_9fa48("213")) {
        {}
      } else {
        stryCov_9fa48("213");
        return stryMutAct_9fa48("214") ? "" : (stryCov_9fa48("214"), 'https://example.com');
      }
    }
  }
}

/** internal: SSR-safe helper, доступен тестам */
export function __hrefOrEmpty(): string {
  if (stryMutAct_9fa48("215")) {
    {}
  } else {
    stryCov_9fa48("215");
    try {
      if (stryMutAct_9fa48("216")) {
        {}
      } else {
        stryCov_9fa48("216");
        return (stryMutAct_9fa48("219") ? typeof window !== 'undefined' || (window as any).location : stryMutAct_9fa48("218") ? false : stryMutAct_9fa48("217") ? true : (stryCov_9fa48("217", "218", "219"), (stryMutAct_9fa48("221") ? typeof window === 'undefined' : stryMutAct_9fa48("220") ? true : (stryCov_9fa48("220", "221"), typeof window !== (stryMutAct_9fa48("222") ? "" : (stryCov_9fa48("222"), 'undefined')))) && (window as any).location)) ? (window as any).location.href : stryMutAct_9fa48("223") ? "Stryker was here!" : (stryCov_9fa48("223"), '');
      }
    } catch {
      if (stryMutAct_9fa48("224")) {
        {}
      } else {
        stryCov_9fa48("224");
        return stryMutAct_9fa48("225") ? "Stryker was here!" : (stryCov_9fa48("225"), '');
      }
    }
  }
}
export function normalizeShareUrl(raw: string, canonicalUrl?: string): string {
  if (stryMutAct_9fa48("226")) {
    {}
  } else {
    stryCov_9fa48("226");
    try {
      if (stryMutAct_9fa48("227")) {
        {}
      } else {
        stryCov_9fa48("227");
        const base = (stryMutAct_9fa48("229") ? canonicalUrl.trim() : stryMutAct_9fa48("228") ? canonicalUrl : (stryCov_9fa48("228", "229"), canonicalUrl?.trim())) ? canonicalUrl : raw;

        // Пробуем создать URL без base для абсолютных URL
        try {
          if (stryMutAct_9fa48("230")) {
            {}
          } else {
            stryCov_9fa48("230");
            const url = new URL(base);
            return stripParams(url).toString();
          }
        } catch {
          if (stryMutAct_9fa48("231")) {
            {}
          } else {
            stryCov_9fa48("231");
            // Если не получилось, пробуем с base
            const url = new URL(base, __hrefOrExample());

            // Проверяем, не создали ли мы мусорный URL
            // Если путь содержит закодированные невалидные символы, считаем это ошибкой
            const pathname = url.pathname;
            if (stryMutAct_9fa48("234") ? (pathname.includes('%3A') || pathname.includes('%2E')) && /[^a-zA-Z0-9\-._~!$&'()*+,;=:@/?%]/.test(decodeURIComponent(pathname)) : stryMutAct_9fa48("233") ? false : stryMutAct_9fa48("232") ? true : (stryCov_9fa48("232", "233", "234"), (stryMutAct_9fa48("236") ? pathname.includes('%3A') && pathname.includes('%2E') : stryMutAct_9fa48("235") ? false : (stryCov_9fa48("235", "236"), pathname.includes(stryMutAct_9fa48("237") ? "" : (stryCov_9fa48("237"), '%3A')) || pathname.includes(stryMutAct_9fa48("238") ? "" : (stryCov_9fa48("238"), '%2E')))) || (stryMutAct_9fa48("239") ? /[a-zA-Z0-9\-._~!$&'()*+,;=:@/?%]/ : (stryCov_9fa48("239"), /[^a-zA-Z0-9\-._~!$&'()*+,;=:@/?%]/)).test(decodeURIComponent(pathname)))) {
              if (stryMutAct_9fa48("240")) {
                {}
              } else {
                stryCov_9fa48("240");
                return stryMutAct_9fa48("241") ? "Stryker was here!" : (stryCov_9fa48("241"), '');
              }
            }
            return stripParams(url).toString();
          }
        }
      }
    } catch {
      if (stryMutAct_9fa48("242")) {
        {}
      } else {
        stryCov_9fa48("242");
        // Если все попытки провалились, возвращаем пустую строку
        return stryMutAct_9fa48("243") ? "Stryker was here!" : (stryCov_9fa48("243"), '');
      }
    }
  }
}
export function buildItemShareUrl(opts: {
  canonicalUrl?: string;
  fallbackHref?: string;
}): string {
  if (stryMutAct_9fa48("244")) {
    {}
  } else {
    stryCov_9fa48("244");
    const {
      canonicalUrl,
      fallbackHref = __hrefOrEmpty()
    } = opts;
    return normalizeShareUrl(fallbackHref, canonicalUrl);
  }
}

/**
 * Универсальный шаринг ссылки (сохраняем существующий API)
 */
export async function shareLink(url?: string, title?: string): Promise<boolean> {
  if (stryMutAct_9fa48("245")) {
    {}
  } else {
    stryCov_9fa48("245");
    // Используем новую логику нормализации
    const shareUrl = buildItemShareUrl(stryMutAct_9fa48("246") ? {} : (stryCov_9fa48("246"), {
      canonicalUrl: getCanonicalFromDocument(),
      fallbackHref: stryMutAct_9fa48("249") ? url && window.location.href : stryMutAct_9fa48("248") ? false : stryMutAct_9fa48("247") ? true : (stryCov_9fa48("247", "248", "249"), url || window.location.href)
    }));

    // Если получили пустую строку, используем чистый origin + pathname
    const finalShareUrl = stryMutAct_9fa48("252") ? shareUrl && getCleanFallbackUrl() : stryMutAct_9fa48("251") ? false : stryMutAct_9fa48("250") ? true : (stryCov_9fa48("250", "251", "252"), shareUrl || getCleanFallbackUrl());
    const tg = stryMutAct_9fa48("254") ? window.Telegram?.WebApp : stryMutAct_9fa48("253") ? window?.Telegram.WebApp : (stryCov_9fa48("253", "254"), window?.Telegram?.WebApp);
    const nav = navigator as MaybeShareNavigator;

    // 1) Telegram WebApp
    try {
      if (stryMutAct_9fa48("255")) {
        {}
      } else {
        stryCov_9fa48("255");
        if (stryMutAct_9fa48("258") ? tg.shareURL : stryMutAct_9fa48("257") ? false : stryMutAct_9fa48("256") ? true : (stryCov_9fa48("256", "257", "258"), tg?.shareURL)) {
          if (stryMutAct_9fa48("259")) {
            {}
          } else {
            stryCov_9fa48("259");
            tg.shareURL(finalShareUrl);
            return stryMutAct_9fa48("260") ? false : (stryCov_9fa48("260"), true);
          }
        }
      }
    } catch {
      /* ignore */
    }

    // 2) Web Share API
    try {
      if (stryMutAct_9fa48("261")) {
        {}
      } else {
        stryCov_9fa48("261");
        if (stryMutAct_9fa48("263") ? false : stryMutAct_9fa48("262") ? true : (stryCov_9fa48("262", "263"), nav.share)) {
          if (stryMutAct_9fa48("264")) {
            {}
          } else {
            stryCov_9fa48("264");
            await nav.share(stryMutAct_9fa48("265") ? {} : (stryCov_9fa48("265"), {
              url: finalShareUrl,
              title
            }));
            return stryMutAct_9fa48("266") ? false : (stryCov_9fa48("266"), true);
          }
        }
      }
    } catch {
      /* ignore */
    }

    // 3) Clipboard API
    try {
      if (stryMutAct_9fa48("267")) {
        {}
      } else {
        stryCov_9fa48("267");
        if (stryMutAct_9fa48("270") ? navigator.clipboard.writeText : stryMutAct_9fa48("269") ? false : stryMutAct_9fa48("268") ? true : (stryCov_9fa48("268", "269", "270"), navigator.clipboard?.writeText)) {
          if (stryMutAct_9fa48("271")) {
            {}
          } else {
            stryCov_9fa48("271");
            await navigator.clipboard.writeText(finalShareUrl);
            stryMutAct_9fa48("273") ? tg.showPopup?.({
              title: 'Скопировано',
              message: 'Ссылка скопирована в буфер обмена.',
              buttons: [{
                type: 'ok'
              }]
            }) : stryMutAct_9fa48("272") ? tg?.showPopup({
              title: 'Скопировано',
              message: 'Ссылка скопирована в буфер обмена.',
              buttons: [{
                type: 'ok'
              }]
            }) : (stryCov_9fa48("272", "273"), tg?.showPopup?.(stryMutAct_9fa48("274") ? {} : (stryCov_9fa48("274"), {
              title: stryMutAct_9fa48("275") ? "" : (stryCov_9fa48("275"), 'Скопировано'),
              message: stryMutAct_9fa48("276") ? "" : (stryCov_9fa48("276"), 'Ссылка скопирована в буфер обмена.'),
              buttons: stryMutAct_9fa48("277") ? [] : (stryCov_9fa48("277"), [stryMutAct_9fa48("278") ? {} : (stryCov_9fa48("278"), {
                type: stryMutAct_9fa48("279") ? "" : (stryCov_9fa48("279"), 'ok')
              })])
            })));
            return stryMutAct_9fa48("280") ? false : (stryCov_9fa48("280"), true);
          }
        }
      }
    } catch {
      /* ignore */
    }

    // 4) Фолбэк
    try {
      if (stryMutAct_9fa48("281")) {
        {}
      } else {
        stryCov_9fa48("281");
        alert(stryMutAct_9fa48("282") ? `` : (stryCov_9fa48("282"), `Скопируй ссылку:\n${finalShareUrl}`));
      }
    } catch {
      /* ignore */
    }
    return stryMutAct_9fa48("283") ? true : (stryCov_9fa48("283"), false);
  }
}

// Вспомогательная функция для извлечения canonical из документа
function getCanonicalFromDocument(): string | undefined {
  if (stryMutAct_9fa48("284")) {
    {}
  } else {
    stryCov_9fa48("284");
    try {
      if (stryMutAct_9fa48("285")) {
        {}
      } else {
        stryCov_9fa48("285");
        const link = document.querySelector('link[rel="canonical"]') as HTMLLinkElement | null;
        return stryMutAct_9fa48("288") ? link?.href && undefined : stryMutAct_9fa48("287") ? false : stryMutAct_9fa48("286") ? true : (stryCov_9fa48("286", "287", "288"), (stryMutAct_9fa48("289") ? link.href : (stryCov_9fa48("289"), link?.href)) || undefined);
      }
    } catch {
      if (stryMutAct_9fa48("290")) {
        {}
      } else {
        stryCov_9fa48("290");
        return undefined;
      }
    }
  }
}

// Фолбэк на случай полностью невалидного URL
function getCleanFallbackUrl(): string {
  if (stryMutAct_9fa48("291")) {
    {}
  } else {
    stryCov_9fa48("291");
    try {
      if (stryMutAct_9fa48("292")) {
        {}
      } else {
        stryCov_9fa48("292");
        const url = new URL(window.location.href);
        return stryMutAct_9fa48("293") ? `` : (stryCov_9fa48("293"), `${url.origin}${url.pathname}`);
      }
    } catch {
      if (stryMutAct_9fa48("294")) {
        {}
      } else {
        stryCov_9fa48("294");
        return stryMutAct_9fa48("295") ? "Stryker was here!" : (stryCov_9fa48("295"), '');
      }
    }
  }
}