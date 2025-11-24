// biome-ignore assist/source/organizeImports: keep React import first for JSX runtime
import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
void React;
import { HelloButton } from './HelloButton';

describe('HelloButton', () => {
  it('renders correctly', () => {
    render(<HelloButton />);
    expect(screen.getByRole('button', { name: /hello/i })).toBeInTheDocument();
  });

  it('handles click using user-event', async () => {
    // 1. Настраиваем юзера
    const user = userEvent.setup();
    const consoleSpy = vi.spyOn(console, 'log').mockImplementation(() => {});

    render(<HelloButton />);

    // 2. Имитируем реальный клик (асинхронно!)
    const btn = screen.getByRole('button', { name: /hello/i });
    await user.click(btn);

    // 3. Проверка
    expect(consoleSpy).toHaveBeenCalledWith('Hello');
    consoleSpy.mockRestore();
  });
});
