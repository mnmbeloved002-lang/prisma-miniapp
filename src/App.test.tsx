import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import App from './App';

describe('App Component (L1.8 Test)', () => {
  it('should render the custom welcome page', () => {
    render(<App />);
    const heading = screen.getByRole('heading', { name: /Prisma MiniApp/i });
    expect(heading).toBeInTheDocument();
    const paragraph = screen.getByText(/Phase 0 • L1.8.2/i);
    expect(paragraph).toBeInTheDocument();
  });
});
