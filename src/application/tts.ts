// src/application/tts.ts

// Безопасная ссылка на SpeechSynthesis (в браузере) 
const synth: SpeechSynthesis | null =
  typeof window !== 'undefined' && 'speechSynthesis' in window
    ? window.speechSynthesis
    : null;

/** Проверка поддержки Web Speech API (TTS) */
export function supported(): boolean {
  return !!synth;
}

/** Остановить озвучивание (если поддерживается) */
export function stop(): void {
  if (!synth) return;
  try {
    synth.cancel();
  } catch {
    /* no-op */
  }
}

/** Озвучить: берём title + «голый» текст из HTML (без тегов) */
export async function speakFromHtml(title: string, html: string): Promise<void> {
  if (!synth) return;

  // На всякий случай гасим предыдущее
  stop();

  const tmp = document.createElement('div');
  tmp.innerHTML = html;
  const body = (tmp.textContent ?? '').trim();
  const text = (title ? `${title}. ` : '') + body;

  if (!text) return;

  const utter = new SpeechSynthesisUtterance(text);
  // Можно подстроить при желании:
  utter.rate = 1;
  utter.pitch = 1;

  await new Promise<void>((resolve) => {
    utter.onend = () => resolve();
    utter.onerror = () => resolve(); // не рушим UX, просто завершаем
    try {
      synth.speak(utter);
    } catch {
      resolve();
    }
  });
}
