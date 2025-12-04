import ReactDOM from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import { initSentry } from './infrastructure/sentry';
import { initTelegram } from './infrastructure/telegram';
import { ErrorBoundary } from './ui/ErrorBoundary';

// Инициализируем Sentry ПЕРВЫМ (до любых ошибок)
initSentry();

// Инициализируем Telegram SDK
initTelegram();

const container = document.getElementById('root');
if (!container) {
  throw new Error('Root element with id "root" not found');
}

const root = ReactDOM.createRoot(container);
root.render(
  <ErrorBoundary>
    <App />
  </ErrorBoundary>,
);
