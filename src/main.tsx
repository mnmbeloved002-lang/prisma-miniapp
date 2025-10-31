import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { reportError } from './utils/reportError';

// Глобальные обработчики ошибок (MVP Error Reporting L2)
window.addEventListener('error', (e) => {
  void reportError(e.error ?? new Error(e.message), {
    context: 'window.error',
  });
});

window.addEventListener('unhandledrejection', (e) => {
  void reportError(
    e.reason instanceof Error ? e.reason : new Error(String(e.reason)),
    { context: 'unhandledrejection' },
  );
});


ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
