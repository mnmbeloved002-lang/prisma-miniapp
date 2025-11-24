// biome-ignore assist/source/organizeImports: keep React import first for JSX runtime
import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it, vi } from 'vitest';
void React;
import { useBookmarks } from '../application/bookmarks';
import { RitualCard } from './RitualCard';

// 1. Мокаем хук стора
vi.mock('../application/bookmarks');

const mockRitual = {
  id: 'ritual-123',
  title: 'Утренний Свет',
  motivation: 'Ты сильный',
  task: 'Улыбнись',
  affirmation: 'Я есть',
  imagePrompt: 'sun',
};

describe('RitualCard (Behavior)', () => {
  const addMock = vi.fn();
  const removeMock = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('вызывает add(id), если ритуал еще не в избранном', async () => {
    // Setup: False
    // @ts-expect-error mock types
    vi.mocked(useBookmarks).mockReturnValue({
      has: () => false,
      add: addMock,
      remove: removeMock,
    });

    const user = userEvent.setup();
    render(<RitualCard item={mockRitual} />);

    // Ищем актуальный текст: "☆ Сохранить Ритуал"
    const btn = screen.getByRole('button', { name: /Сохранить Ритуал/i });
    await user.click(btn);

    expect(addMock).toHaveBeenCalledWith('ritual-123');
  });

  it('вызывает remove(id), если ритуал уже в избранном', async () => {
    // Setup: True
    // @ts-expect-error mock types
    vi.mocked(useBookmarks).mockReturnValue({
      has: () => true,
      add: addMock,
      remove: removeMock,
    });

    const user = userEvent.setup();
    render(<RitualCard item={mockRitual} />);

    // Ищем актуальный текст: "★ Сохранено"
    const btn = screen.getByRole('button', { name: /Сохранено/i });
    await user.click(btn);

    expect(removeMock).toHaveBeenCalledWith('ritual-123');
  });
});
