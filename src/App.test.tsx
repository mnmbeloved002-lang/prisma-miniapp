// src/App.test.tsx
import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import App from './App';

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
  });
});
