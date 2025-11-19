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
import { CACHE_TTL_MS } from '../config';
import type { NewsItem } from '../domain/types';
import { storage } from './storage';

// 1. Определяем тип *реального* ответа от API
type NewsResponse = {
  news: NewsItem[];
  [key: string]: unknown; // Позволяем иметь другие поля (timestamp, etc.)
};
type CacheEntry = {
  ts: number;
  etag?: string;
  data: NewsItem[];
};
const KEY = stryMutAct_9fa48("98") ? "" : (stryCov_9fa48("98"), 'news-cache-v1');
export async function getNewsCached(): Promise<NewsItem[]> {
  if (stryMutAct_9fa48("99")) {
    {}
  } else {
    stryCov_9fa48("99");
    const cached = storage.get<CacheEntry>(KEY);
    const headers: Record<string, string> = {};
    if (stryMutAct_9fa48("102") ? cached.etag : stryMutAct_9fa48("101") ? false : stryMutAct_9fa48("100") ? true : (stryCov_9fa48("100", "101", "102"), cached?.etag)) headers[stryMutAct_9fa48("103") ? "" : (stryCov_9fa48("103"), 'If-None-Match')] = cached.etag;
    const freshAllowed = stryMutAct_9fa48("106") ? !cached && Date.now() - cached.ts > CACHE_TTL_MS : stryMutAct_9fa48("105") ? false : stryMutAct_9fa48("104") ? true : (stryCov_9fa48("104", "105", "106"), (stryMutAct_9fa48("107") ? cached : (stryCov_9fa48("107"), !cached)) || (stryMutAct_9fa48("110") ? Date.now() - cached.ts <= CACHE_TTL_MS : stryMutAct_9fa48("109") ? Date.now() - cached.ts >= CACHE_TTL_MS : stryMutAct_9fa48("108") ? false : (stryCov_9fa48("108", "109", "110"), (stryMutAct_9fa48("111") ? Date.now() + cached.ts : (stryCov_9fa48("111"), Date.now() - cached.ts)) > CACHE_TTL_MS)));
    if (stryMutAct_9fa48("114") ? !freshAllowed || cached?.data : stryMutAct_9fa48("113") ? false : stryMutAct_9fa48("112") ? true : (stryCov_9fa48("112", "113", "114"), (stryMutAct_9fa48("115") ? freshAllowed : (stryCov_9fa48("115"), !freshAllowed)) && (stryMutAct_9fa48("116") ? cached.data : (stryCov_9fa48("116"), cached?.data)))) return cached.data;
    try {
      if (stryMutAct_9fa48("117")) {
        {}
      } else {
        stryCov_9fa48("117");
        const res = await fetch(stryMutAct_9fa48("118") ? "" : (stryCov_9fa48("118"), '/news.json'), stryMutAct_9fa48("119") ? {} : (stryCov_9fa48("119"), {
          headers
        }));
        if (stryMutAct_9fa48("122") ? res.status === 304 || cached?.data : stryMutAct_9fa48("121") ? false : stryMutAct_9fa48("120") ? true : (stryCov_9fa48("120", "121", "122"), (stryMutAct_9fa48("124") ? res.status !== 304 : stryMutAct_9fa48("123") ? true : (stryCov_9fa48("123", "124"), res.status === 304)) && (stryMutAct_9fa48("125") ? cached.data : (stryCov_9fa48("125"), cached?.data)))) return cached.data;
        const etag = stryMutAct_9fa48("126") ? res.headers.get('ETag') && undefined : (stryCov_9fa48("126"), res.headers.get(stryMutAct_9fa48("127") ? "" : (stryCov_9fa48("127"), 'ETag')) ?? undefined);

        // --- ИСПРАВЛЕНИЕ ЗДЕСЬ ---
        // Получаем ВЕСЬ объект, как он есть
        const responseJson = (await res.json()) as NewsResponse;
        // Извлекаем из него массив новостей
        const data = responseJson.news;
        // --- КОНЕЦ ИСПРАВЛЕНИЯ ---

        // Дополнительная защита, чтобы сделать систему "ещё лучше"
        if (stryMutAct_9fa48("130") ? false : stryMutAct_9fa48("129") ? true : stryMutAct_9fa48("128") ? Array.isArray(data) : (stryCov_9fa48("128", "129", "130"), !Array.isArray(data))) {
          if (stryMutAct_9fa48("131")) {
            {}
          } else {
            stryCov_9fa48("131");
            throw new Error(stryMutAct_9fa48("132") ? "" : (stryCov_9fa48("132"), 'Invalid API response: "news" field is not an array.'));
          }
        }
        storage.set(KEY, stryMutAct_9fa48("133") ? {} : (stryCov_9fa48("133"), {
          ts: Date.now(),
          etag,
          data
        }));
        return data;
      }
    } catch (e) {
      if (stryMutAct_9fa48("134")) {
        {}
      } else {
        stryCov_9fa48("134");
        console.error(stryMutAct_9fa48("135") ? "" : (stryCov_9fa48("135"), 'Failed to fetch news'), e);
        if (stryMutAct_9fa48("138") ? cached.data : stryMutAct_9fa48("137") ? false : stryMutAct_9fa48("136") ? true : (stryCov_9fa48("136", "137", "138"), cached?.data)) return cached.data; // оффлайн фолбэк
        throw new Error(stryMutAct_9fa48("139") ? "" : (stryCov_9fa48("139"), 'Network failed and no cache available'));
      }
    }
  }
}

// Принудительно тянем свежак (мимо TTL), аккуратно обновляя кэш
export async function getNewsFresh(): Promise<NewsItem[]> {
  if (stryMutAct_9fa48("140")) {
    {}
  } else {
    stryCov_9fa48("140");
    const cached = storage.get<CacheEntry>(KEY);
    try {
      if (stryMutAct_9fa48("141")) {
        {}
      } else {
        stryCov_9fa48("141");
        const headers: Record<string, string> = {};
        if (stryMutAct_9fa48("144") ? cached.etag : stryMutAct_9fa48("143") ? false : stryMutAct_9fa48("142") ? true : (stryCov_9fa48("142", "143", "144"), cached?.etag)) headers[stryMutAct_9fa48("145") ? "" : (stryCov_9fa48("145"), 'If-None-Match')] = cached.etag;
        const res = await fetch(stryMutAct_9fa48("146") ? "" : (stryCov_9fa48("146"), '/news.json'), stryMutAct_9fa48("147") ? {} : (stryCov_9fa48("147"), {
          headers
        }));
        if (stryMutAct_9fa48("150") ? res.status === 304 || cached?.data : stryMutAct_9fa48("149") ? false : stryMutAct_9fa48("148") ? true : (stryCov_9fa48("148", "149", "150"), (stryMutAct_9fa48("152") ? res.status !== 304 : stryMutAct_9fa48("151") ? true : (stryCov_9fa48("151", "152"), res.status === 304)) && (stryMutAct_9fa48("153") ? cached.data : (stryCov_9fa48("153"), cached?.data)))) return cached.data;
        const etag = stryMutAct_9fa48("154") ? res.headers.get('ETag') && undefined : (stryCov_9fa48("154"), res.headers.get(stryMutAct_9fa48("155") ? "" : (stryCov_9fa48("155"), 'ETag')) ?? undefined);

        // --- ИСПРАВЛЕНИЕ ЗДЕСЬ (аналогично) ---
        const responseJson = (await res.json()) as NewsResponse;
        const data = responseJson.news;
        // --- КОНЕЦ ИСПРАВЛЕНИЯ ---

        // Дополнительная защита
        if (stryMutAct_9fa48("158") ? false : stryMutAct_9fa48("157") ? true : stryMutAct_9fa48("156") ? Array.isArray(data) : (stryCov_9fa48("156", "157", "158"), !Array.isArray(data))) {
          if (stryMutAct_9fa48("159")) {
            {}
          } else {
            stryCov_9fa48("159");
            console.error(stryMutAct_9fa48("160") ? "" : (stryCov_9fa48("160"), 'Invalid fresh API response: "news" field is not an array.'));
            return stryMutAct_9fa48("161") ? cached?.data && [] : (stryCov_9fa48("161"), (stryMutAct_9fa48("162") ? cached.data : (stryCov_9fa48("162"), cached?.data)) ?? (stryMutAct_9fa48("163") ? ["Stryker was here"] : (stryCov_9fa48("163"), []))); // Безопасно отдаем кэш
          }
        }
        storage.set(KEY, stryMutAct_9fa48("164") ? {} : (stryCov_9fa48("164"), {
          ts: Date.now(),
          etag,
          data
        }));
        return data;
      }
    } catch (e) {
      if (stryMutAct_9fa48("165")) {
        {}
      } else {
        stryCov_9fa48("165");
        console.error(stryMutAct_9fa48("166") ? "" : (stryCov_9fa48("166"), 'Failed to fetch fresh news'), e);
        return stryMutAct_9fa48("167") ? cached?.data && [] : (stryCov_9fa48("167"), (stryMutAct_9fa48("168") ? cached.data : (stryCov_9fa48("168"), cached?.data)) ?? (stryMutAct_9fa48("169") ? ["Stryker was here"] : (stryCov_9fa48("169"), [])));
      }
    }
  }
}