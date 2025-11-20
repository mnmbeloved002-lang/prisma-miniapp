import React from 'react'
import { render, screen, waitFor } from '@testing-library/react'
import { vi, describe, it, expect } from 'vitest'
import AppShell from './ui/AppShell'
import { useRitualStore } from './application/ritual-store'

vi.mock('./application/ritual-store')

describe('App (Integration)', () => {
  it('рендерит заголовок Prisma Ritual AI', async () => {
    // @ts-expect-error mock
    vi.mocked(useRitualStore).mockReturnValue({
      loading: false,
      ritualItem: { id: '1', title: 'Test', motivation: 'M', task: 'T', affirmation: 'A' }, 
      error: null,
      fetchRitual: vi.fn()
    })

    render(<AppShell />)
    
    await waitFor(() => {
      expect(screen.getByText('Prisma Ritual AI')).toBeInTheDocument()
    })
  })
})
