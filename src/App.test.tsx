// biome-ignore assist/source/organizeImports: keep React import first for JSX runtime
import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
void React;
import { useRitualStore } from './application/ritual-store';
import AppShell from './ui/AppShell';

vi.mock('./application/ritual-store');

describe('App (Integration)', () => {
  it('рендерит заголовок Prisma Ritual AI', async () => {
    vi.mocked(useRitualStore).mockReturnValue({
      loading: false,
      ritualItem: {
        id: '1',
        title: 'Test',
        motivation: 'M',
        task: 'T',
        affirmation: 'A',
      },
      error: null,
      fetchRitual: vi.fn(),
    });

    render(<AppShell />);

    await waitFor(() => {
      expect(screen.getByText('Prisma Ritual AI')).toBeInTheDocument();
    });
  });
});
