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
export const storage = stryMutAct_9fa48("170") ? {} : (stryCov_9fa48("170"), {
  get<T>(key: string): T | null {
    if (stryMutAct_9fa48("171")) {
      {}
    } else {
      stryCov_9fa48("171");
      try {
        if (stryMutAct_9fa48("172")) {
          {}
        } else {
          stryCov_9fa48("172");
          const raw = localStorage.getItem(key);
          return raw ? JSON.parse(raw) as T : null;
        }
      } catch {
        if (stryMutAct_9fa48("173")) {
          {}
        } else {
          stryCov_9fa48("173");
          return null; // parse/JSON/localStorage error → тихий фолбэк
        }
      }
    }
  },
  set(key: string, value: unknown) {
    if (stryMutAct_9fa48("174")) {
      {}
    } else {
      stryCov_9fa48("174");
      try {
        if (stryMutAct_9fa48("175")) {
          {}
        } else {
          stryCov_9fa48("175");
          localStorage.setItem(key, JSON.stringify(value));
        }
      } catch {
        if (stryMutAct_9fa48("176")) {
          {}
        } else {
          stryCov_9fa48("176");
          void 0; // quota/offline — игнорируем
        }
      }
    }
  },
  del(key: string) {
    if (stryMutAct_9fa48("177")) {
      {}
    } else {
      stryCov_9fa48("177");
      try {
        if (stryMutAct_9fa48("178")) {
          {}
        } else {
          stryCov_9fa48("178");
          localStorage.removeItem(key);
        }
      } catch {
        if (stryMutAct_9fa48("179")) {
          {}
        } else {
          stryCov_9fa48("179");
          void 0; // приватный режим/ограничения — игнорируем
        }
      }
    }
  }
});