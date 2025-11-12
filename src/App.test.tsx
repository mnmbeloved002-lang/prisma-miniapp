// src/App.test.tsx
import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import App from './App';

// --- (НАЧАЛО ИСПРАВЛЕНИЯ) ---
// Мокируем api-client, чтобы он не ходил в сеть во время юнит-теста
vi.mock('./infrastructure/api-client', () => ({
  getNewsCached: vi.fn().mockResolvedValue([
    // Возвращаем 1-2 фейковые новости, чтобы компонент отрендерился
    { id: 'mock1', title: 'Mock News 1', preview: '...', source: 'Mock' },
    { id: 'mock2', title: 'Mock News 2', preview: '...', source: 'Mock' },
  ]),
}));
// --- (КОНЕЦ ИСПРАВЛЕНИЯ) ---

describe('App Component', () => {
  it('should render the custom welcome page', async () => {
    // Мокируем IntersectionObserver, т.к. в jsdom его нет (нужно для framer-motion)
    const mockIntersectionObserver = vi.fn();
    mockIntersectionObserver.mockReturnValue({
      observe: () => null,
      unobserve: () => null,
      disconnect: () => null,
    });
    window.IntersectionObserver = mockIntersectionObserver;

    render(<App />);

    // Ищем заголовок в Header, который рендерится в AppShell
    const heading = await screen.findByRole('heading', {
      name: /Prisma MiniApp/i, // Этот 'h1' у нас .sr-only в Header
    });

    expect(heading).toBeInTheDocument();

    // (Опционально, но рекомендуется) Проверим, что наши моки новостей тоже отрисовались
    expect(await screen.findByText('Mock News 1')).toBeInTheDocument();
  });
});
