import React from 'react'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { RitualCard } from './RitualCard'
import { useBookmarks } from '../application/bookmarks'

// 1. Мокаем хук стора
vi.mock('../application/bookmarks')

const mockRitual = {
  id: 'ritual-123',
  title: 'Утренний Свет',
  motivation: 'Ты сильный',
  task: 'Улыбнись',
  affirmation: 'Я есть',
  imagePrompt: 'sun'
}

describe('RitualCard (Behavior)', () => {
  // Спаи для проверки вызовов
  const addMock = vi.fn()
  const removeMock = vi.fn()

  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('вызывает add(id), если ритуал еще не в избранном', async () => {
    // Setup: Ритуала НЕТ в закладках
    // @ts-expect-error mock types
    vi.mocked(useBookmarks).mockReturnValue({
      has: () => false,
      add: addMock,
      remove: removeMock
    })

    const user = userEvent.setup()
    render(<RitualCard item={mockRitual} />)

    // Action: Кликаем "В избранное"
    const btn = screen.getByRole('button', { name: /☆ В избранное/i })
    await user.click(btn)

    // Assert: Функция добавления вызвана с правильным ID
    expect(addMock).toHaveBeenCalledTimes(1)
    expect(addMock).toHaveBeenCalledWith('ritual-123')
  })

  it('вызывает remove(id), если ритуал уже в избранном', async () => {
    // Setup: Ритуал ЕСТЬ в закладках
    // @ts-expect-error mock types
    vi.mocked(useBookmarks).mockReturnValue({
      has: () => true, // <--- True
      add: addMock,
      remove: removeMock
    })

    const user = userEvent.setup()
    render(<RitualCard item={mockRitual} />)

    // Action: Кликаем "В избранном" (текст кнопки другой)
    const btn = screen.getByRole('button', { name: /★ В избранном/i })
    await user.click(btn)

    // Assert: Функция удаления вызвана
    expect(removeMock).toHaveBeenCalledTimes(1)
    expect(removeMock).toHaveBeenCalledWith('ritual-123')
  })
})
