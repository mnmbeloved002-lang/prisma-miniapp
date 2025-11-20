import React from 'react'
import { render, screen, waitFor, act } from '@testing-library/react'
import AppShell from './AppShell'
import { loadTodayRitual } from '../application/ritual-service'
import type { Ritual } from '../domain/ritual-types'

vi.mock('../application/ritual-service')

const mockRitual: Ritual = {
  id: 'test-2025',
  title: 'Тестовый ритуал гармонии',
  motivation: 'Ты в гармонии с миром',
  task: 'Сделай глубокий вдох',
  affirmation: 'Я спокоен и уверен',
  imagePrompt: 'test'
}

describe('AppShell (Prisma Ritual AI)', () => {
  beforeEach(() => {
    vi.mocked(loadTodayRitual).mockReset()
  })

  it('рендерит ритуал после загрузки', async () => {
    vi.mocked(loadTodayRitual).mockResolvedValue(mockRitual)

    await act(async () => {
      render(<AppShell />)
    })

    // Suspense fallback теперь гарантированно рендерится
    expect(screen.getByText(/Загрузка ритуала/i)).toBeInTheDocument()

    await waitFor(() => {
      expect(screen.getByText(mockRitual.title)).toBeInTheDocument()
      expect(screen.getByText(mockRitual.motivation)).toBeInTheDocument()
      expect(screen.getByText(mockRitual.task)).toBeInTheDocument()
    })
  })

  it('показывает ошибку при падении загрузки', async () => {
    vi.mocked(loadTodayRitual).mockRejectedValue(new Error('Network error'))

    await act(async () => {
      render(<AppShell />)
    })

    await waitFor(() => {
      expect(screen.getByText(/Не удалось загрузить ритуал/i)).toBeInTheDocument()
    })
  })
})
