import React from 'react'
import { render, screen } from '@testing-library/react'
import AppShell from './ui/AppShell'

describe('AppShell (Prisma Ritual AI)', () => {
  it('рендерит заголовок Prisma Ritual AI', () => {
    render(<AppShell />)
    expect(screen.getByText('Prisma Ritual AI')).toBeInTheDocument()
  })
})
