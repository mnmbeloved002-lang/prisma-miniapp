import ReactDOM from "react-dom/client";

import App from './App.tsx';
import './index.css';
import { reportError } from './infrastructure/utils/reportError';

// UEC FIX: Удалены все лишние/дублирующие импорты React/useState.
//         Используется React 17+ JSX Runtime, который не требует импорта React.

reportError('App started successfully'); // Логирование для Observability

const root = ReactDOM.createRoot(document.getElementById('root')!);
root.render(<App />);
