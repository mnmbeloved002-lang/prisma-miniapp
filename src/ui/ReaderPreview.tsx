import React from "react";
import { useState, useEffect, useRef, lazy, Suspense, memo } from "react";




import { shareLink } from '../infrastructure/utils/share' // Убираем buildItemShareUrl

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
    return () => {
      try { window.speechSynthesis.cancel() } catch { /* ignore */ }
    }
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
    } catch { /* ignore */ }
  }

  const handleClose = () => {
    stopSpeaking()
    onClose()
  }

  const handleShare = () => {
    shareLink() // URL автоматически определяется внутри shareLink
  }

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex flex-col">
      {/* Верхняя панель */}
      <div className="sticky top-0 flex items-center justify-between gap-3 px-4 py-3 border-b border-white/10 bg-surface/95">
        <h2 className="text-base sm:text-lg font-semibold">Просмотр</h2>
        <div className="flex items-center gap-2">
          <button
            onClick={onBookmark}
            className="px-3 py-2 rounded-xl ring-1 ring-white/10 hover:bg-white/10"
            title="В закладки / убрать из закладок"
            aria-label="Переключить закладку"
          >
            ★
          </button>

          <button
            onClick={onOpenSource}
            className="px-3 py-2 rounded-xl ring-1 ring-white/10 hover:bg-white/10"
            title="Открыть источник"
            aria-label="Открыть источник"
          >
            Открыть
          </button>

          <button
            onClick={handleShare}
            className="px-3 py-2 rounded-xl ring-1 ring-white/10 hover:bg-white/10"
            title="Поделиться ссылкой"
            aria-label="Поделиться"
          >
            Поделиться
          </button>

          <button
            onClick={handleClose}
            className="px-3 py-2 rounded-xl ring-1 ring-white/10 hover:bg-white/10"
            title="Закрыть"
            aria-label="Закрыть"
          >
            ✕
          </button>
        </div>
      </div>

      {/* Контент */}
      <div
        ref={ref}
        className="flex-1 overflow-y-auto px-4 sm:px-6 py-4 max-w-3xl mx-auto leading-relaxed text-[15px] sm:text-base bg-surface text-fg"
        dangerouslySetInnerHTML={{ __html: html }}
      />

      {/* Нижняя панель TTS */}
      {canSpeak && (
        <div className="flex justify-center gap-3 py-3 sm:py-4 border-t border-white/10 bg-surface/95">
          <button
            onClick={isSpeaking ? stopSpeaking : speakFromHtml}
            className="px-4 py-2 rounded-xl ring-1 ring-white/10 hover:bg-white/10"
            aria-label={isSpeaking ? 'Остановить озвучку' : 'Включить озвучку'}
          >
            {isSpeaking ? '⏹ Остановить' : '🔊 Слушать'}
          </button>
        </div>
      )}
    </div>
  )
}
