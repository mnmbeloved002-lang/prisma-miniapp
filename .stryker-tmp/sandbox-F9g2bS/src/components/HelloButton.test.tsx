// @ts-nocheck
// src/components/HelloButton.test.tsx
import { render, screen, fireEvent } from '@testing-library/react';
import { HelloButton } from './HelloButton';

describe('HelloButton', () => {
  it('increments counter on click', () => {
    render(<HelloButton />);
    const btn = screen.getByRole('button', { name: /click me/i });
    const clicks = screen.getByTestId('clicks');
    expect(clicks.textContent).toMatch(/0/);
    fireEvent.click(btn);
    fireEvent.click(btn);
    expect(clicks.textContent).toMatch(/2/);
  });
});
