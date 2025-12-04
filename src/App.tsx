import { useTelegramInit } from './infrastructure/useTelegram';
import { AppShell } from './ui/AppShell';
import { TelegramWelcome } from './ui/TelegramWelcome';

export function App(): JSX.Element {
  const { isInitialized, isInTelegram } = useTelegramInit();

  // Показываем загрузку пока инициализируется SDK
  if (!isInitialized) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Загрузка...</p>
      </div>
    );
  }

  // Если запущено в Telegram - показываем приветствие
  if (isInTelegram) {
    return <TelegramWelcome />;
  }

  // Если не в Telegram - показываем старый AppShell (для обратной совместимости)
  return <AppShell />;
}

// biome-ignore lint/style/noDefaultExport: главный React-рут-компонент оставляем default-экспортом для совместимости с Vite/Vercel и существующими тестами
export default App;
