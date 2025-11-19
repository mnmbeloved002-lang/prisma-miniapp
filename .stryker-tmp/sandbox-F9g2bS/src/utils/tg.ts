// @ts-nocheck
// src/utils/tg.ts
// Никаких сайд-эффектов на уровне модуля — только функция!

// Переименован в 'TgWebAppMinimal' для ясности
type TgWebAppMinimal = {
  ready?: () => void;
  expand?: () => void;
  disableVerticalSwipes?: () => void;
  MainButton?: { setText?: (s: string) => void };
};

/**
 * Безопасная и необязательная инициализация Telegram WebApp.
 * Если API нет — просто выходим. Любые ошибки глушим.
 */
export function initTelegramUI(): void {
  try {
    // 1. Используем 'any' для безопасного доступа к глобальному window.Telegram,
    // но оборачиваем в eslint-disable для устранения конфликта с жестким правилом.
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const Telegram = (window as any).Telegram; 
    
    if (!Telegram) return;

    // 2. Затем, приводим WebApp к нашему минимальному, проверенному типу.
    const tg = Telegram.WebApp as TgWebAppMinimal; 
    
    if (!tg) return;

    // Минимальные безопасные вызовы
    tg.ready?.(); 
    // Всё остальное — осознанно позже, по месту
  } catch {
    // ничего — мост НЕ должен ломать первый рендер UI
  }
}
