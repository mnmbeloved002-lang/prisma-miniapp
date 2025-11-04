// src/utils/useTTSState.ts
import { useCallback, useEffect, useState } from 'react';
import { speakFromHtml, stop, supported } from '../application/tts';

export function useTTSState() {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const canTTS = supported();

  const start = useCallback(async (title: string, html: string) => {
    if (!canTTS) return;
    setIsSpeaking(true);
    try {
      await speakFromHtml(title, html);
    } finally {
      // даже если ошибка/прерывание — вернуть кнопку в исходное состояние
      setIsSpeaking(false);
    }
  }, [canTTS]);

  const halt = useCallback(() => {
    stop();
    setIsSpeaking(false);
  }, []);

  // На размонтировании / смене экрана — гарантированно остановим озвучку
  useEffect(() => () => stop(), []);

  return { canTTS, isSpeaking, start, halt };
}
