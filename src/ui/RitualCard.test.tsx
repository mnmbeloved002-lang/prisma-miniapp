import React from 'react'
import { render, screen } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import { RitualCard } from './RitualCard'

// Мокаем хук закладок
vi.mock('../application/bookmarks', () => ({
  useBookmarks: () => ({
    has: vi.fn(),
    add: vi.fn(),
    remove: vi.fn()
  })
}))

const mockRitual = {
  id: '1',
  title: 'Test Ritual',
  motivation: 'Go!',
  task: 'Do it',
  affirmation: 'Yes',
  imagePrompt: 'img'
}

describe('RitualCard', () => {
  it('renders content', () => {
    render(<RitualCard item={mockRitual} />)
    expect(screen.getByText('Test Ritual')).toBeInTheDocument()
  })
})
