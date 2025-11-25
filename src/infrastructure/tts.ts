// src/application/tts.ts

// Безопасная ссылка на SpeechSynthesis (в браузере)
const synth: SpeechSynthesis | null =
  typeof window !== 'undefined' &&
  // biome-ignore lint/security/noSecrets: 'speechSynthesis' — имя Web API, а не секрет
  'speechSynthesis' in window
    ? window.speechSynthesis
    : null;

/** Проверка поддержки Web Speech API (TTS) */
export function isSupported(): boolean {
  return !!synth;
}

/** Остановить озвучивание (если поддерживается) */
export function stop(): void {
  if (!synth) {
    return;
  }
  try {
    synth.cancel();
  } catch (error) {
    console.error('TTS error during cancel:', error);
  }
}

/** Озвучить: берём title + «голый» текст из HTML (без тегов) */
export async function speakFromHtml(title: string, html: string): Promise<void> {
  if (!synth) {
    return;
  }

  // На всякий случай гасим предыдущее
  stop();

  // Удаляем все теги
  const body = html.replace(/<[^>]*>/g, '').trim();
  const text = (title ? `${title}. ` : '') + body;

  if (!text) {
    return;
  }

  const utter = new SpeechSynthesisUtterance(text);
  // Настройка голоса (если требуется)

  try {
    synth.speak(utter);
  } catch (error) {
    console.error('TTS error during speak:', error);
  }
}
