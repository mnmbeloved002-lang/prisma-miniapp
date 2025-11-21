import { useEffect } from 'react';

import { initTelegramUI } from './infrastructure/utils/tg';
import AppShell from './ui/AppShell';

export default function App() {
  useEffect(() => {
    // безопасно и неблокирующе
    initTelegramUI();
  }, []);

  return <AppShell />;
}
