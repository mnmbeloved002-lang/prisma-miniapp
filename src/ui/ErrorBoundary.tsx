import * as Sentry from '@sentry/react';
import { Component, type ReactNode } from 'react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: { componentStack: string }) {
    // Логируем в Sentry (если инициализирован)
    Sentry.captureException(error, {
      contexts: {
        react: {
          componentStack: errorInfo.componentStack,
        },
      },
    });
  }

  render() {
    if (this.state.hasError) {
      // Используем custom fallback или дефолтный UI
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-purple-900 to-violet-900 px-4">
          <div className="max-w-md w-full text-center">
            <div className="mb-8">
              <div className="text-6xl mb-4">💫</div>
              <h1 className="text-3xl font-bold text-white mb-2">Космический сбой</h1>
              <p className="text-gray-300">Что-то пошло не так в параллельной вселенной</p>
            </div>

            <div className="bg-white/10 backdrop-blur-lg rounded-lg p-6 mb-6">
              <p className="text-sm text-gray-300 mb-4">
                {this.state.error?.message || 'Неизвестная ошибка'}
              </p>
              <button
                type="button"
                onClick={() => window.location.reload()}
                className="w-full bg-purple-600 hover:bg-purple-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors"
              >
                🔄 Перезагрузить приложение
              </button>
            </div>

            <p className="text-xs text-gray-400">
              Ошибка была автоматически отправлена для исправления
            </p>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
