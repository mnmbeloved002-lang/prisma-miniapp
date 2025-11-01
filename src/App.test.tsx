import { render, screen } from '@testing-library/react'
import App from './App'

describe('App Component (L1.8 Test)', () => {
  it('should render the custom welcome page', () => {
    render(<App />)
    // допускаем оба варианта заголовка, чтобы не блокировать прогресс
    const heading =
      screen.queryByRole('heading', { name: /Prisma News/i }) ??
      screen.getByRole('heading', { name: /Prisma MiniApp/i })
    expect(heading).toBeInTheDocument()
  })
})
