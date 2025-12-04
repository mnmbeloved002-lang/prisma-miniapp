import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { AppShell } from './AppShell';

describe('AppShell', () => {
  it('рендерит Header и children', () => {
    render(
      <AppShell title="Test App">
        <div>Test Content</div>
      </AppShell>,
    );

    expect(screen.getByText('Test App')).toBeInTheDocument();
    expect(screen.getByText('Test Content')).toBeInTheDocument();
  });

  it('использует дефолтный title', () => {
    render(
      <AppShell>
        <div>Content</div>
      </AppShell>,
    );
    expect(screen.getByText('Mini App')).toBeInTheDocument();
  });

  it('рендерит без children', () => {
    const { container } = render(<AppShell />);
    expect(container.querySelector('main')).toBeInTheDocument();
  });
});
