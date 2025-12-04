import { render, screen, waitFor } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import * as ritualStore from '../application/ritual-store';

vi.mock('../application/ritual-store');

describe('RitualView', () => {
  const fetchMock = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(ritualStore.useRitualStore).mockReturnValue({
      ritualItem: null,
      loading: false,
      error: null,
      fetchRitual: fetchMock,
    });
  });

  it('показывает загрузку', async () => {
    vi.mocked(ritualStore.useRitualStore).mockReturnValue({
      ritualItem: null,
      loading: true,
      error: null,
      fetchRitual: fetchMock,
    });

    const { RitualView } = await import('./RitualView');
    render(<RitualView />);
    expect(screen.getByText(/Загрузка.../i)).toBeInTheDocument();
  });

  it('вызывает fetchRitual при монтировании', async () => {
    const { RitualView } = await import('./RitualView');
    render(<RitualView />);

    await waitFor(() => {
      expect(fetchMock).toHaveBeenCalledTimes(1);
    });
  });

  it('показывает ошибку', async () => {
    vi.mocked(ritualStore.useRitualStore).mockReturnValue({
      ritualItem: null,
      loading: false,
      error: 'Сбой связи',
      fetchRitual: fetchMock,
    });

    const { RitualView } = await import('./RitualView');
    render(<RitualView />);
    expect(screen.getByText(/Ошибка:.*Сбой связи/)).toBeInTheDocument();
  });
});
