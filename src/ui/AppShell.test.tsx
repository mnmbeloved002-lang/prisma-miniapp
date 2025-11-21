import React from 'react'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import AppShell from './AppShell'
import { useRitualStore } from '../application/ritual-store'

// Мокаем стор полностью
vi.mock('../application/ritual-store')

const mockRitual = {
  id: 'test-1',
  title: 'Тестовый Ритуал',
  motivation: 'Ты справишься',
  task: 'Выпей воды',
  affirmation: 'Я есть сила',
  imagePrompt: 'test',
  publishedAt: '2025-01-01'
}

describe('AppShell Integration', () => {
  const fetchMock = vi.fn()

  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('показывает загрузку', () => {
    // @ts-expect-error mock
    vi.mocked(useRitualStore).mockReturnValue({
      loading: true, ritualItem: null, error: null, fetchRitual: fetchMock
    })
    render(<AppShell />)
    expect(screen.getByText(/Загрузка.../i)).toBeInTheDocument()
  })

  it('рендерит ритуал', () => {
    // @ts-expect-error mock
    vi.mocked(useRitualStore).mockReturnValue({
      loading: false, ritualItem: mockRitual, error: null, fetchRitual: fetchMock
    })
    render(<AppShell />)
    expect(screen.getByText('Тестовый Ритуал')).toBeInTheDocument()
    expect(screen.getByText('"Ты справишься"')).toBeInTheDocument()
  })

  it('показывает ошибку и кнопку повтора', async () => {
    const user = userEvent.setup()
    // @ts-expect-error mock
    vi.mocked(useRitualStore).mockReturnValue({
      loading: false, ritualItem: null, error: 'Сбой связи', fetchRitual: fetchMock
    })
    
    render(<AppShell />)
    expect(screen.getByText('Сбой связи')).toBeInTheDocument()
    
    const retryBtn = screen.getByRole('button', { name: /Попробовать снова/i })
    await user.click(retryBtn)
    expect(fetchMock).toHaveBeenCalled()
  })
})
