// @ts-nocheck
// src/ui/EmptyState.test.tsx
import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { EmptyState } from './EmptyState';

describe('EmptyState', () => {
  it('should render the correct heading, message, and emoji', () => {
    render(<EmptyState />);
    expect(screen.getByText('😶‍🌫️')).toBeInTheDocument();
    expect(
      screen.getByRole('heading', { name: /Ничего не найдено/i }),
    ).toBeInTheDocument();
    expect(
      screen.getByText(/Попробуйте изменить запрос или снять часть фильтров/i),
    ).toBeInTheDocument();
  });

  it('should have polite aria-live region', () => {
    const { container } = render(<EmptyState />);
    // Исправленный селектор
    const section = container.querySelector('section');
    expect(section).toHaveAttribute('aria-live', 'polite');
  });
});
