// src/ui/ReaderPreview.tsx
import { useEffect, useRef, useState } from 'react'
import { shareLink } from '../utils/share'

interface Props {
  html: string
  onOpenSource: () => void
  onBookmark: () => void
  onClose: () => void
}

export default function ReaderPreview({ html, onOpenSource, onBookmark, onClose }: Props) {
  const ref = useRef<HTMLDivElement>(null)
  const [canSpeak, setCanSpeak] = useState(false)
  const [isSpeaking, setIsSpeaking] = useState(false)

  useEffect(() => {
    setCanSpeak('speechSynthesis' in window)
  }, [])

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
    } catch {/* ignore */}
  }

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex flex-col">
      {/* Верхняя панель: слева «Просмотр», справа — действия */}
      <div className="sticky top-0 flex items-center justify-between px-4 py-3 border-b border-white/10 bg-surface/95">
        <h2 className="text-base sm:text-lg font-semibold">Просмотр</h2>
        <div className="flex gap-2">
          <button
            onClick={onBookmark}
            className="px-3 py-2 rounded-xl ring-1 ring-white/10 hover:bg-white/10"
            title="В закладки / убрать из закладок"
          >
            ★
          </button>

          <button
            onClick={onOpenSource}
            className="px-3 py-2 rounded-xl ring-1 ring-white/10 hover:bg-white/10"
            title="Открыть источник"
          >
            Открыть
          </button>

          <button
            onClick={() => shareLink(location.href)}
            className="px-3 py-2 rounded-xl ring-1 ring-white/10 hover:bg-white/10"
            title="Поделиться ссылкой"
          >
            Поделиться
          </button>

          <button
            onClick={onClose}
            className="px-3 py-2 rounded-xl ring-1 ring-white/10 hover:bg-white/10"
            title="Закрыть"
          >
            ✕
          </button>
        </div>
      </div>

      {/* Контент с нормальной шириной и отступами, хорошо на мобиле */}
      <div
        ref={ref}
        className="flex-1 overflow-y-auto px-4 sm:px-6 py-4 max-w-3xl mx-auto leading-relaxed text-[15px] sm:text-base bg-surface text-fg"
        dangerouslySetInnerHTML={{ __html: html }}
      />

      {/* Нижняя панель TTS остаётся, немного плотнее на мобиле */}
      <div className="flex justify-center gap-3 py-3 sm:py-4 border-t border-white/10 bg-surface/95">
        <button
          onClick={isSpeaking ? stopSpeaking : speakFromHtml}
          disabled={!canSpeak}
          className={`px-4 py-2 rounded-xl ring-1 ring-white/10 ${
            canSpeak ? 'hover:bg-white/10' : 'opacity-50 cursor-not-allowed'
          }`}
        >
          {canSpeak ? (isSpeaking ? '⏹ Остановить' : '🔊 Слушать') : '🔇 Не поддерживается'}
        </button>
      </div>
    </div>
  )
}
