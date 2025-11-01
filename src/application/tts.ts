let u: SpeechSynthesisUtterance | null = null;

function hasTTS(): boolean {
  return typeof window !== 'undefined' && 'speechSynthesis' in window;
}

export function stop() {
  try {
    if (hasTTS()) {
      window.speechSynthesis.cancel();
    }
  } catch (e) {
    // use the error to avoid no-unused-vars
    void e;
  }
  u = null;
}

export function speak(text: string, lang = 'ru-RU', rate = 1) {
  if (!hasTTS()) return;
  stop(); // отменим предыдущую озвучку
  u = new SpeechSynthesisUtterance(text);
  u.lang = lang;
  u.rate = rate;

  const voices = window.speechSynthesis.getVoices();
  const pref = voices.find(v => v.lang.toLowerCase().startsWith(lang.toLowerCase()));
  if (pref) u.voice = pref;

  window.speechSynthesis.speak(u);
}

export function speakFromHtml(html: string, lang = 'ru-RU', rate = 1) {
  // грубая очистка HTML → текст: убираем теги, схлопываем пробелы
  const text = html
    .replace(/<script[\s\S]*?>[\s\S]*?<\/script>/gi, ' ')
    .replace(/<style[\s\S]*?>[\s\S]*?<\/style>/gi, ' ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();

  if (text) speak(text, lang, rate);
}

export function isSpeaking(): boolean {
  return hasTTS() && window.speechSynthesis.speaking;
}
