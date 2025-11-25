import { beforeEach, describe, expect, it, vi } from 'vitest';
import * as client from './api/ritual-client';
import { useRitualStore } from './ritual-store';

// Мокаем клиент
vi.mock('./api/ritual-client');

const mockRitual = {
  id: '1',
  title: 'Unit Test Ritual',
  motivation: 'Test',
  task: 'Test',
  affirmation: 'Test',
  imagePrompt: 'Test',
};

describe('Ritual Store', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    // Сброс стейта (Zustand хранит стейт между тестами)
    useRitualStore.setState({ ritualItem: null, loading: false, error: null });
  });

  it('starts with initial state', () => {
    const state = useRitualStore.getState();
    expect(state.ritualItem).toBeNull();
    expect(state.loading).toBe(false);
    expect(state.error).toBeNull();
  });

  it('fetches ritual successfully', async () => {
    vi.mocked(client.getRitualCached).mockResolvedValue(mockRitual);

    const promise = useRitualStore.getState().fetchRitual();

    // Сразу после вызова должно быть loading: true
    expect(useRitualStore.getState().loading).toBe(true);

    await promise;

    const state = useRitualStore.getState();
    expect(state.loading).toBe(false);
    expect(state.ritualItem).toEqual(mockRitual);
    expect(state.error).toBeNull();
  });

  it('handles fetch error', async () => {
    vi.mocked(client.getRitualCached).mockRejectedValue(new Error('API Fail'));

    await useRitualStore.getState().fetchRitual();

    const state = useRitualStore.getState();
    expect(state.loading).toBe(false);
    expect(state.ritualItem).toBeNull();
    expect(state.error).toBe('API Fail');
  });

  it('handles unknown error type', async () => {
    vi.mocked(client.getRitualCached).mockRejectedValue('String Error');

    await useRitualStore.getState().fetchRitual();

    const state = useRitualStore.getState();
    expect(state.error).toBe('Неизвестная ошибка загрузки');
  });
});
