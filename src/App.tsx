import { useEffect } from 'react';
import AppShell from './ui/AppShell';
import { initTelegramUI } from './utils/tg';

export default function App() {
  useEffect(() => {
    initTelegramUI();
  }, []);

  return <AppShell />;
}
