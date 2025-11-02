import { render, screen } from '@testing-library/react'
import App from './App'

describe('App Component (L1.8 Test)', () => {
  it('should render the custom welcome page', async () => {
    render(<App />)
    const heading = await screen.findByRole('heading', {
      name: /Prisma (News|MiniApp)/i,
    })
    expect(heading).toBeInTheDocument()
  })
})
