// src/App.tsx
import { useEffect } from 'react';

import AppShell from './ui/AppShell';
import { initTelegramUI } from './utils/tg';

export default function App() {
  useEffect(() => {
// безопасно и неблокирующе
    initTelegramUI();
  }, []);

  return <AppShell />;
}
