import React from 'react'
import { render, screen } from '@testing-library/react'
import { vi, describe, it, expect } from 'vitest'
import AppShell from './ui/AppShell'
import { useRitualStore } from './application/ritual-store'

// Мокаем стор
vi.mock('./application/ritual-store')

describe('App (Integration)', () => {
  it('рендерит заголовок Prisma Ritual AI', () => {
    // Принудительно выключаем загрузку
    // @ts-expect-error mock
    vi.mocked(useRitualStore).mockReturnValue({
      loading: false, // <--- Главное исправление
      ritualItem: { id: '1', title: 'Test' }, 
      error: null,
      fetchRitual: vi.fn()
    })

    render(<AppShell />)
    
    // Теперь заголовок должен быть виден
    expect(screen.getByText('Prisma Ritual AI')).toBeInTheDocument()
  })
})
