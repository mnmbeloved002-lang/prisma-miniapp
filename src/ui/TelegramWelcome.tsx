/**
 * Приветственный экран для Telegram Mini App
 * Использует Telegram UI Kit и SDK
 */

import { useTelegramTheme, useTelegramUser } from '../application/useTelegram';

export function TelegramWelcome(): JSX.Element {
  const user = useTelegramUser();
  const theme = useTelegramTheme();

  const displayName = user
    ? `${user.firstName}${user.lastName ? ` ${user.lastName}` : ''}`
    : 'Гость';

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center p-6"
      style={{
        backgroundColor: theme?.bgColor || '#0f172a',
        color: theme?.textColor || '#e2e8f0',
      }}
    >
      <div className="text-center space-y-6 max-w-md">
        {/* Аватар */}
        <div className="w-24 h-24 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 mx-auto flex items-center justify-center text-4xl font-bold">
          {user?.firstName?.[0]?.toUpperCase() || '👤'}
        </div>

        {/* Приветствие */}
        <div className="space-y-2">
          <h1 className="text-3xl font-bold">Привет, {displayName}! 👋</h1>
          <p className="text-lg opacity-80">Добро пожаловать в Telegram Mini App</p>
        </div>

        {/* Информация о пользователе */}
        {user && (
          <div className="bg-white/5 rounded-2xl p-4 space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="opacity-60">ID:</span>
              <span className="font-mono">{user.id}</span>
            </div>
            {user.username && (
              <div className="flex justify-between">
                <span className="opacity-60">Username:</span>
                <span>@{user.username}</span>
              </div>
            )}
            {user.languageCode && (
              <div className="flex justify-between">
                <span className="opacity-60">Язык:</span>
                <span>{user.languageCode.toUpperCase()}</span>
              </div>
            )}
            {user.isPremium && (
              <div className="flex justify-center pt-2">
                <span className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-3 py-1 rounded-full text-xs font-semibold">
                  ⭐ Telegram Premium
                </span>
              </div>
            )}
          </div>
        )}

        {/* Статус */}
        <div className="text-sm opacity-60">
          <p>🚀 Платформа L5 2026</p>
          <p>Работает на React 19 + Telegram SDK</p>
        </div>
      </div>
    </div>
  );
}
