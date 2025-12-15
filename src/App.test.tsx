import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import App from './App';

describe('App root', () => {
  it('по умолчанию рендерит страницу игры "Городской убийца"', () => {
    render(<App />);
    expect(screen.getByRole('button', { name: /войти в город/i })).toBeInTheDocument();
  });
});
