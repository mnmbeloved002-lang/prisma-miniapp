// @ts-nocheck
// src/application/bookmarks.ts
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
import type { NewsItem } from '../domain/types';
import { storage } from '../infrastructure/storage';
const KEY = stryMutAct_9fa48("0") ? "" : (stryCov_9fa48("0"), 'bookmarks-v1');
let cache: NewsItem[] | null = null;
let loaded = stryMutAct_9fa48("1") ? true : (stryCov_9fa48("1"), false);
function ensureLoaded() {
  if (stryMutAct_9fa48("2")) {
    {}
  } else {
    stryCov_9fa48("2");
    if (stryMutAct_9fa48("5") ? false : stryMutAct_9fa48("4") ? true : stryMutAct_9fa48("3") ? loaded : (stryCov_9fa48("3", "4", "5"), !loaded)) {
      if (stryMutAct_9fa48("6")) {
        {}
      } else {
        stryCov_9fa48("6");
        loaded = stryMutAct_9fa48("7") ? false : (stryCov_9fa48("7"), true);
        const data = storage.get<NewsItem[]>(KEY);
        cache = Array.isArray(data) ? stryMutAct_9fa48("8") ? data : (stryCov_9fa48("8"), data.slice()) : stryMutAct_9fa48("9") ? ["Stryker was here"] : (stryCov_9fa48("9"), []);
      }
    }
  }
}
function persist() {
  if (stryMutAct_9fa48("10")) {
    {}
  } else {
    stryCov_9fa48("10");
    /* c8 ignore next */
    if (stryMutAct_9fa48("13") ? cache === null : stryMutAct_9fa48("12") ? false : stryMutAct_9fa48("11") ? true : (stryCov_9fa48("11", "12", "13"), cache !== null)) {
      if (stryMutAct_9fa48("14")) {
        {}
      } else {
        stryCov_9fa48("14");
        storage.set(KEY, cache);
      }
    }
  }
}
export function list(): NewsItem[] {
  if (stryMutAct_9fa48("15")) {
    {}
  } else {
    stryCov_9fa48("15");
    ensureLoaded();
    return stryMutAct_9fa48("16") ? cache! : (stryCov_9fa48("16"), cache!.slice());
  }
}
export function getList(): NewsItem[] {
  if (stryMutAct_9fa48("17")) {
    {}
  } else {
    stryCov_9fa48("17");
    return list();
  }
}
export function has(id: string): boolean {
  if (stryMutAct_9fa48("18")) {
    {}
  } else {
    stryCov_9fa48("18");
    ensureLoaded();
    return stryMutAct_9fa48("19") ? cache!.every(n => n.id === id) : (stryCov_9fa48("19"), cache!.some(stryMutAct_9fa48("20") ? () => undefined : (stryCov_9fa48("20"), n => stryMutAct_9fa48("23") ? n.id !== id : stryMutAct_9fa48("22") ? false : stryMutAct_9fa48("21") ? true : (stryCov_9fa48("21", "22", "23"), n.id === id))));
  }
}
export function add(item: NewsItem): void {
  if (stryMutAct_9fa48("24")) {
    {}
  } else {
    stryCov_9fa48("24");
    ensureLoaded();
    if (stryMutAct_9fa48("26") ? false : stryMutAct_9fa48("25") ? true : (stryCov_9fa48("25", "26"), has(item.id))) return;
    // Добавляем в начало списка (новые закладки сверху)
    cache = stryMutAct_9fa48("27") ? [] : (stryCov_9fa48("27"), [item, ...cache!]);
    persist();
  }
}
export function remove(id: string): void {
  if (stryMutAct_9fa48("28")) {
    {}
  } else {
    stryCov_9fa48("28");
    ensureLoaded();
    const initialLength = cache!.length;
    cache = stryMutAct_9fa48("29") ? cache! : (stryCov_9fa48("29"), cache!.filter(stryMutAct_9fa48("30") ? () => undefined : (stryCov_9fa48("30"), n => stryMutAct_9fa48("33") ? n.id === id : stryMutAct_9fa48("32") ? false : stryMutAct_9fa48("31") ? true : (stryCov_9fa48("31", "32", "33"), n.id !== id))));
    if (stryMutAct_9fa48("36") ? cache.length === initialLength : stryMutAct_9fa48("35") ? false : stryMutAct_9fa48("34") ? true : (stryCov_9fa48("34", "35", "36"), cache.length !== initialLength)) {
      if (stryMutAct_9fa48("37")) {
        {}
      } else {
        stryCov_9fa48("37");
        persist();
      }
    }
  }
}
export function toggle(item: NewsItem): void {
  if (stryMutAct_9fa48("38")) {
    {}
  } else {
    stryCov_9fa48("38");
    if (stryMutAct_9fa48("40") ? false : stryMutAct_9fa48("39") ? true : (stryCov_9fa48("39", "40"), has(item.id))) {
      if (stryMutAct_9fa48("41")) {
        {}
      } else {
        stryCov_9fa48("41");
        remove(item.id);
      }
    } else {
      if (stryMutAct_9fa48("42")) {
        {}
      } else {
        stryCov_9fa48("42");
        add(item);
      }
    }
  }
}

// Синхронизация между вкладками
/* c8 ignore next */
if (stryMutAct_9fa48("45") ? typeof window === 'undefined' : stryMutAct_9fa48("44") ? false : stryMutAct_9fa48("43") ? true : (stryCov_9fa48("43", "44", "45"), typeof window !== (stryMutAct_9fa48("46") ? "" : (stryCov_9fa48("46"), 'undefined')))) {
  if (stryMutAct_9fa48("47")) {
    {}
  } else {
    stryCov_9fa48("47");
    window.addEventListener(stryMutAct_9fa48("48") ? "" : (stryCov_9fa48("48"), 'storage'), e => {
      if (stryMutAct_9fa48("49")) {
        {}
      } else {
        stryCov_9fa48("49");
        if (stryMutAct_9fa48("52") ? e.key !== KEY : stryMutAct_9fa48("51") ? false : stryMutAct_9fa48("50") ? true : (stryCov_9fa48("50", "51", "52"), e.key === KEY)) {
          if (stryMutAct_9fa48("53")) {
            {}
          } else {
            stryCov_9fa48("53");
            loaded = stryMutAct_9fa48("54") ? true : (stryCov_9fa48("54"), false); // Форсим перечитывание при следующем обращении
            cache = null;
            // Опционально: можно диспатчить кастомное событие для уведомления UI
            // window.dispatchEvent(new CustomEvent('bookmarks-changed'))
          }
        }
      }
    });
  }
}

/** Вспомогательно для unit-тестов */
export function __unsafe__resetForTests(seed?: NewsItem[]) {
  if (stryMutAct_9fa48("55")) {
    {}
  } else {
    stryCov_9fa48("55");
    loaded = stryMutAct_9fa48("56") ? true : (stryCov_9fa48("56"), false);
    cache = null;
    if (stryMutAct_9fa48("59") ? seed === undefined : stryMutAct_9fa48("58") ? false : stryMutAct_9fa48("57") ? true : (stryCov_9fa48("57", "58", "59"), seed !== undefined)) {
      if (stryMutAct_9fa48("60")) {
        {}
      } else {
        stryCov_9fa48("60");
        cache = stryMutAct_9fa48("61") ? [] : (stryCov_9fa48("61"), [...seed]);
        loaded = stryMutAct_9fa48("62") ? false : (stryCov_9fa48("62"), true);
        storage.set(KEY, cache); // Синхронизируем с storage для тестов
      }
    } else {
      if (stryMutAct_9fa48("63")) {
        {}
      } else {
        stryCov_9fa48("63");
        storage.del(KEY); // Полная очистка
      }
    }
  }
}