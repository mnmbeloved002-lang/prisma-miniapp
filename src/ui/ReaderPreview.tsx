// src/ui/ReaderPreview.tsx
import { useEffect, useRef, useState } from 'react'
import { shareLink } from '../utils/share'

interface Props {
  html: string
  onOpenSource: () => void
  onBookmark: () => void
  onClose: () => void
}

// --- ИСПРАВЛЕНИЕ ЗДЕСЬ ---
export default function ReaderPreview({ html, onOpenSource, onBookmark, onClose }: Props) {
  const ref = useRef<HTMLDivElement>(null)
  const [canSpeak, setCanSpeak] = useState(false)
  const [isSpeaking, setIsSpeaking] = useState(false)

  // Проверяем поддержку Web Speech API
  useEffect(() => {
    setCanSpeak('speechSynthesis' in window)
  }, [])

  // Произнесение текста (TTS)
  const speakFromHtml = () => {
    if (!canSpeak) return
    try {
      const utter = new SpeechSynthesisUtterance(ref.current?.innerText ?? '')
      utter.lang = 'ru-RU'
      utter.rate = 1
      utter.pitch = 1
      utter.onend = () => setIsSpeaking(false)
      setIsSpeaking(true)
      window.speechSynthesis.cancel()
      window.speechSynthesis.speak(utter)
    } catch {
      setIsSpeaking(false)
    }
  }

  const stopSpeaking = () => {
    try {
      window.speechSynthesis.cancel()
      setIsSpeaking(false)
    } catch { /* ignore */ }
  }

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex flex-col">
      <div className="flex items-center justify-between px-4 py-3 border-b border-white/10 bg-surface">
        <h2 className="text-lg font-semibold">Просмотр</h2>
        <div className="flex gap-2">
          <button
            onClick={onBookmark}
            className="px-3 py-2 rounded-xl ring-1 ring-white/10 hover:bg-white/10"
          >
            ★
          </button>

          <button
            onClick={onOpenSource}
            className="px-3 py-2 rounded-xl ring-1 ring-white/10 hover:bg-white/10"
          >
            Открыть
          </button>

          <button
            onClick={() => shareLink(location.href)}
            className="px-3 py-2 rounded-xl ring-1 ring-white/10 hover:bg-white/10"
          >
            Поделиться
          </button>

          <button
            onClick={onClose}
            className="px-3 py-2 rounded-xl ring-1 ring-white/10 hover:bg-white/10"
          >
            ✕
          </button>
        </div>
      </div>

      <div
        ref={ref}
        className="prose prose-invert max-w-none p-4 overflow-y-auto flex-1 bg-surface text-text"
        dangerouslySetInnerHTML={{ __html: html }}
      />

      <div className="flex justify-center gap-3 py-4 border-t border-white/10 bg-surface">
        <button
          onClick={isSpeaking ? stopSpeaking : speakFromHtml}
          disabled={!canSpeak}
          className={`px-4 py-2 rounded-xl ring-1 ring-white/10 ${
            canSpeak
              ? 'hover:bg-white/10'
              : 'opacity-50 cursor-not-allowed'
          }`}
        >
          {canSpeak
            ? (isSpeaking ? '⏹ Остановить' : '🔊 Слушать')
            : '🔇 Не поддерживается'}
        </button>
      </div>
    </div>
  )
}
