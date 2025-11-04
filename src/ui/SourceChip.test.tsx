// src/ui/SourceChip.test.tsx
import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { SourceChip } from './SourceChip';

describe('SourceChip', () => {
  it('should render logo if brand is known (e.g., RBC)', () => {
    render(<SourceChip brand="RBC" />);
    
    // Ищем img по alt-тексту
    const logo = screen.getByRole('img', { name: 'RBC' });
    expect(logo).toBeInTheDocument();
    expect(logo).toHaveAttribute('src', 'https://logo.clearbit.com/rbc.ru');
  });

  it('should render a fallback square if brand is unknown', () => {
    render(<SourceChip brand="Unknown Brand" />);
    
    // Логотипа (img) быть не должно
    expect(screen.queryByRole('img')).toBeNull();
    
    // Должен быть fallback (пустой span)
    const fallback = screen.getByText('Unknown Brand').previousSibling;
    expect(fallback).toHaveClass('w-4 h-4 rounded-sm bg-white/10');
  });
});
