import * as Sentry from '@sentry/react';

/**
 * Инициализация Sentry для error tracking и performance monitoring
 * Работает только в production окружении
 */
export function initSentry() {
  // Инициализируем только в production
  if (process.env.NODE_ENV !== 'production') {
    console.log('[Sentry] Skipped in development');
    return;
  }

  // DSN из environment variable (настраивается в Vercel)
  const dsn = import.meta.env.VITE_SENTRY_DSN;

  if (!dsn) {
    console.warn('[Sentry] No DSN provided, error tracking disabled');
    return;
  }

  Sentry.init({
    dsn,

    // Environment
    environment: import.meta.env.MODE || 'production',

    // Release tracking (для source maps)
    release: import.meta.env.VITE_APP_VERSION || 'unknown',

    // Integrations
    integrations: [
      // Browser tracing для performance
      Sentry.browserTracingIntegration({
        // Трейсим навигацию
        // @ts-expect-error tracePropagationTargets поддерживается рантаймом Sentry, но отсутствует в типах BrowserTracingOptions
        tracePropagationTargets: ['localhost', /^\//],
      }),

      // Replay для записи сессий с ошибками
      Sentry.replayIntegration({
        maskAllText: true, // Скрываем весь текст (GDPR)
        blockAllMedia: true, // Скрываем медиа
      }),
    ],

    // Performance monitoring
    tracesSampleRate: 0.1, // 10% сессий трейсим

    // Session replay (только при ошибках)
    replaysSessionSampleRate: 0, // Не записываем обычные сессии
    replaysOnErrorSampleRate: 1.0, // Записываем 100% сессий с ошибками

    // Фильтруем ошибки
    beforeSend(event, hint) {
      // Игнорируем известные безобидные ошибки
      const error = hint.originalException;

      if (error instanceof Error) {
        // Игнорируем network errors от блокировщиков рекламы
        if (error.message.includes('adsbygoogle')) {
          return null;
        }

        // Игнорируем Telegram Bot API errors (не критично)
        // biome-ignore lint/security/noSecrets: TelegramGameProxy is an API name, not a secret
        if (error.message.includes('TelegramGameProxy')) {
          return null;
        }
      }

      return event;
    },
  });

  console.log('[Sentry] Initialized successfully');
}

/**
 * Вспомогательная функция для отправки custom events
 */
export function trackEvent(eventName: string, data?: Record<string, unknown>) {
  Sentry.addBreadcrumb({
    category: 'user-action',
    message: eventName,
    data,
    level: 'info',
  });
}

/**
 * Устанавливает user context (анонимно)
 */
export function setUserContext(userId: string) {
  Sentry.setUser({ id: userId });
}
