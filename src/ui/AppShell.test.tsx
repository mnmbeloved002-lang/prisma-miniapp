import React from 'react'
import { render, screen } from '@testing-library/react'
import { vi, describe, it, expect, beforeEach } from 'vitest'
import AppShell from './AppShell'
import { useRitualStore } from '../application/ritual-store'

// Мокаем сам стор
vi.mock('../application/ritual-store')

const mockRitual = {
  id: '1',
  title: 'Утренний свет',
  motivation: 'Ты лучше всех',
  task: 'Вдохни',
  affirmation: 'Я могу',
  imagePrompt: 'sun'
}

describe('AppShell (Ritual AI)', () => {
  const fetchMock = vi.fn()

  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('показывает загрузку', () => {
    // @ts-expect-error mock
    vi.mocked(useRitualStore).mockReturnValue({
      loading: true,
      ritualItem: null,
      error: null,
      fetchRitual: fetchMock
    })

    render(<AppShell />)
    expect(screen.getByText(/Загрузка.../i)).toBeInTheDocument()
  })

  it('рендерит ритуал', () => {
    // @ts-expect-error mock
    vi.mocked(useRitualStore).mockReturnValue({
      loading: false,
      ritualItem: mockRitual,
      error: null,
      fetchRitual: fetchMock
    })

    render(<AppShell />)
    expect(screen.getByText('Утренний свет')).toBeInTheDocument()
  })

  it('показывает ошибку', () => {
    // @ts-expect-error mock
    vi.mocked(useRitualStore).mockReturnValue({
      loading: false,
      ritualItem: null,
      error: 'Karma error',
      fetchRitual: fetchMock
    })

    render(<AppShell />)
    expect(screen.getByText(/Karma error/i)).toBeInTheDocument()
  })
})
