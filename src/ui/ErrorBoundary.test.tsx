// biome-ignore assist/source/organizeImports: keep React import first for JSX runtime
import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it, vi } from 'vitest';
void React;
import { ErrorBoundary } from './ErrorBoundary';

const mockConsoleError = vi.spyOn(console, 'error').mockImplementation(() => {});

describe('ErrorBoundary', () => {
  beforeEach(() => {
    mockConsoleError.mockClear();
  });

  it('shows error UI when child throws', () => {
    const ThrowError = () => {
      throw new Error('Boom!');
    };

    render(
      <ErrorBoundary>
        <ThrowError />
      </ErrorBoundary>,
    );

    expect(screen.getByText(/Космический сбой/i)).toBeInTheDocument();
    expect(screen.getByText(/Boom!/i)).toBeInTheDocument();
  });

  it('shows reload button', () => {
    const ThrowError = () => {
      throw new Error('Test error');
    };

    render(
      <ErrorBoundary>
        <ThrowError />
      </ErrorBoundary>,
    );

    expect(screen.getByRole('button', { name: /Перезагрузить приложение/i })).toBeInTheDocument();
  });

  it('renders children when no error', () => {
    render(
      <ErrorBoundary>
        <div>Working!</div>
      </ErrorBoundary>,
    );

    expect(screen.getByText('Working!')).toBeInTheDocument();
  });

  it('shows generic message when error has no message', () => {
    const ThrowNoMessage = () => {
      throw new Error('');
    };

    render(
      <ErrorBoundary>
        <ThrowNoMessage />
      </ErrorBoundary>,
    );

    expect(screen.getByText(/Неизвестная ошибка/i)).toBeInTheDocument();
  });

  it('logs errors to console', () => {
    const ThrowError = () => {
      throw new Error('Console test');
    };

    render(
      <ErrorBoundary>
        <ThrowError />
      </ErrorBoundary>,
    );

    expect(mockConsoleError).toHaveBeenCalled();
  });

  it('перезагружает страницу при клике на кнопку', async () => {
    const user = userEvent.setup();
    const reloadMock = vi.fn();
    Object.defineProperty(window, 'location', {
      value: { reload: reloadMock },
      writable: true,
      configurable: true,
    });

    const ThrowError = () => {
      throw new Error('Test reload error');
    };

    render(
      <ErrorBoundary>
        <ThrowError />
      </ErrorBoundary>,
    );

    const reloadButton = screen.getByRole('button', { name: /Перезагрузить приложение/i });
    await user.click(reloadButton);

    expect(reloadMock).toHaveBeenCalled();
  });
});

it('использует custom fallback если передан', () => {
  const ThrowError = () => {
    throw new Error('Test custom fallback');
  };

  const customFallback = <div>Кастомная ошибка!</div>;

  render(
    <ErrorBoundary fallback={customFallback}>
      <ThrowError />
    </ErrorBoundary>,
  );

  expect(screen.getByText('Кастомная ошибка!')).toBeInTheDocument();
});
