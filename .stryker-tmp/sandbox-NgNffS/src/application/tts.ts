// @ts-nocheck
// src/application/tts.ts

// Безопасная ссылка на SpeechSynthesis (в браузере) 
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
const synth: SpeechSynthesis | null = (stryMutAct_9fa48("66") ? typeof window !== 'undefined' || 'speechSynthesis' in window : stryMutAct_9fa48("65") ? false : stryMutAct_9fa48("64") ? true : (stryCov_9fa48("64", "65", "66"), (stryMutAct_9fa48("68") ? typeof window === 'undefined' : stryMutAct_9fa48("67") ? true : (stryCov_9fa48("67", "68"), typeof window !== (stryMutAct_9fa48("69") ? "" : (stryCov_9fa48("69"), 'undefined')))) && (stryMutAct_9fa48("70") ? "" : (stryCov_9fa48("70"), 'speechSynthesis')) in window)) ? window.speechSynthesis : null;

/** Проверка поддержки Web Speech API (TTS) */
export function supported(): boolean {
  if (stryMutAct_9fa48("71")) {
    {}
  } else {
    stryCov_9fa48("71");
    return stryMutAct_9fa48("72") ? !synth : (stryCov_9fa48("72"), !(stryMutAct_9fa48("73") ? synth : (stryCov_9fa48("73"), !synth)));
  }
}

/** Остановить озвучивание (если поддерживается) */
export function stop(): void {
  if (stryMutAct_9fa48("74")) {
    {}
  } else {
    stryCov_9fa48("74");
    if (stryMutAct_9fa48("77") ? false : stryMutAct_9fa48("76") ? true : stryMutAct_9fa48("75") ? synth : (stryCov_9fa48("75", "76", "77"), !synth)) return;
    try {
      if (stryMutAct_9fa48("78")) {
        {}
      } else {
        stryCov_9fa48("78");
        synth.cancel();
      }
    } catch {
      /* no-op */
    }
  }
}

/** Озвучить: берём title + «голый» текст из HTML (без тегов) */
export async function speakFromHtml(title: string, html: string): Promise<void> {
  if (stryMutAct_9fa48("79")) {
    {}
  } else {
    stryCov_9fa48("79");
    if (stryMutAct_9fa48("82") ? false : stryMutAct_9fa48("81") ? true : stryMutAct_9fa48("80") ? synth : (stryCov_9fa48("80", "81", "82"), !synth)) return;

    // На всякий случай гасим предыдущее
    stop();
    const tmp = document.createElement(stryMutAct_9fa48("83") ? "" : (stryCov_9fa48("83"), 'div'));
    tmp.innerHTML = html;
    const body = stryMutAct_9fa48("84") ? tmp.textContent ?? '' : (stryCov_9fa48("84"), (stryMutAct_9fa48("85") ? tmp.textContent && '' : (stryCov_9fa48("85"), tmp.textContent ?? (stryMutAct_9fa48("86") ? "Stryker was here!" : (stryCov_9fa48("86"), '')))).trim());
    const text = stryMutAct_9fa48("87") ? (title ? `${title}. ` : '') - body : (stryCov_9fa48("87"), (title ? stryMutAct_9fa48("88") ? `` : (stryCov_9fa48("88"), `${title}. `) : stryMutAct_9fa48("89") ? "Stryker was here!" : (stryCov_9fa48("89"), '')) + body);
    if (stryMutAct_9fa48("92") ? false : stryMutAct_9fa48("91") ? true : stryMutAct_9fa48("90") ? text : (stryCov_9fa48("90", "91", "92"), !text)) return;
    const utter = new SpeechSynthesisUtterance(text);
    // Можно подстроить при желании:
    utter.rate = 1;
    utter.pitch = 1;
    await new Promise<void>(resolve => {
      if (stryMutAct_9fa48("93")) {
        {}
      } else {
        stryCov_9fa48("93");
        utter.onend = stryMutAct_9fa48("94") ? () => undefined : (stryCov_9fa48("94"), () => resolve());
        utter.onerror = stryMutAct_9fa48("95") ? () => undefined : (stryCov_9fa48("95"), () => resolve()); // не рушим UX, просто завершаем
        try {
          if (stryMutAct_9fa48("96")) {
            {}
          } else {
            stryCov_9fa48("96");
            synth.speak(utter);
          }
        } catch {
          if (stryMutAct_9fa48("97")) {
            {}
          } else {
            stryCov_9fa48("97");
            resolve();
          }
        }
      }
    });
  }
}