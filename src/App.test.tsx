import { render, screen } from '@testing-library/react'
import App from './App'

describe('App Component (L1.8 Test)', () => {
  it('should render the custom welcome page', () => {
    render(<App />)
    // Ищем заголовок Prisma News
    expect(screen.getByRole('heading', { name: /Prisma News/i })).toBeInTheDocument()
  })
})
