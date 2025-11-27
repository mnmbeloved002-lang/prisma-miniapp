import ReactDOM from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import { reportError } from './infrastructure/utils/reportError';
import { ErrorBoundary } from './ui/ErrorBoundary';

// Логирование для Observability
reportError('App started successfully');

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
