import React from 'react'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, it, expect, vi } from 'vitest'
import { HelloButton } from './HelloButton'

describe('HelloButton', () => {
  it('renders correctly', () => {
    render(<HelloButton />)
    expect(screen.getByRole('button', { name: /hello/i })).toBeInTheDocument()
  })

  it('handles click using user-event', async () => {
    // 1. Настраиваем юзера
    const user = userEvent.setup()
    const consoleSpy = vi.spyOn(console, 'log').mockImplementation(() => {})
    
    render(<HelloButton />)
    
    // 2. Имитируем реальный клик (асинхронно!)
    const btn = screen.getByRole('button', { name: /hello/i })
    await user.click(btn)
    
    // 3. Проверка
    expect(consoleSpy).toHaveBeenCalledWith('Hello')
    consoleSpy.mockRestore()
  })
})
