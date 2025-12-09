// src/App.tsx
import React from 'react';
import { AppShell } from './ui/AppShell';
import { CityMysteryPage } from './modules/city-mystery/ui/CityMysteryPage';

export const App: React.FC = () => {
  return (
    <AppShell>
      <CityMysteryPage />
    </AppShell>
  );
};

export default App;
