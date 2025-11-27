// biome-ignore assist/source/organizeImports: keep React import first
import React from 'react';
import { render, waitFor } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
void React;

import { useRitualStore } from '../application/ritual-store';
import AppShell from './AppShell';

// Partial mock - мокируем только fetchRitual, остальное реально
vi.mock('../application/ritual-store', () => ({
  useRitualStore: vi.fn(),
}));

describe('AppShell (Mutation Coverage - useEffect)', () => {
  const fetchMock = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('calls fetchRitual immediately on mount (kills useEffect body mutation)', async () => {
    // Mock возвращает функцию, которую мы можем отследить
    vi.mocked(useRitualStore).mockReturnValue({
      loading: false,
      ritualItem: null,
      error: null,
      fetchRitual: fetchMock,
    });

    render(<AppShell />);

    // Критично: fetchRitual должен быть вызван сразу при монтировании
    await waitFor(() => {
      expect(fetchMock).toHaveBeenCalledTimes(1);
    });
  });

  it('calls fetchRitual again when fetchRitual reference changes (kills dependency array mutation)', async () => {
    const firstFetch = vi.fn();

    // Первый рендер
    vi.mocked(useRitualStore).mockReturnValue({
      loading: false,
      ritualItem: null,
      error: null,
      fetchRitual: firstFetch,
    });

    const { rerender } = render(<AppShell />);

    await waitFor(() => {
      expect(firstFetch).toHaveBeenCalledTimes(1);
    });

    // Меняем fetchRitual на новую функцию (имитация re-render с новым стором)
    const secondFetch = vi.fn();
    vi.mocked(useRitualStore).mockReturnValue({
      loading: false,
      ritualItem: null,
      error: null,
      fetchRitual: secondFetch,
    });

    // Re-render с новым fetchRitual
    rerender(<AppShell />);

    // Критично: новый fetchRitual должен быть вызван при изменении зависимости
    await waitFor(() => {
      expect(secondFetch).toHaveBeenCalledTimes(1);
    });

    // Старый НЕ должен вызываться повторно
    expect(firstFetch).toHaveBeenCalledTimes(1);
  });
});
