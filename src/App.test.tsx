// src/App.test.tsx

import React from 'react';
import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import App from './App';

describe('App root', () => {
  it('по умолчанию рендерит страницу игры "Городской убийца"', () => {
    render(<App />);

    expect(
      screen.getByText(/ГОРОДСКОЙ УБИЙЦА/i),
    ).toBeInTheDocument();
  });
});
