import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import HomePage from '../pages/HomePage'
import { BrowserRouter } from 'react-router-dom'
import { Provider } from 'react-redux'
import { store } from '../store/store'
import { TooltipProvider } from '@radix-ui/react-tooltip'

vi.mock('../lib/api', () => ({
  getHealth: async () => ({ status: 'ok' }),
  getUsers: async () => ([{ id: 1, login: 'octocat', avatar_url: 'https://example.com/a.png' }]),
}))

function Wrapper({ children }: { children: React.ReactNode }) {
  return (
    <Provider store={store}>
      <TooltipProvider>
        <BrowserRouter>{children}</BrowserRouter>
      </TooltipProvider>
    </Provider>
  )
}

test('shows status ok after checking health', async () => {
  const user = userEvent.setup()
  render(<HomePage />, { wrapper: Wrapper })
  const btn = screen.getByRole('button', { name: /check backend health/i })
  await user.click(btn)
  expect(screen.getByText(/status: ok/i)).toBeInTheDocument()
})

test('loads users list', async () => {
  const user = userEvent.setup()
  render(<HomePage />, { wrapper: Wrapper })
  const btn = screen.getByRole('button', { name: /get users/i })
  await user.click(btn)
  expect(await screen.findByText(/octocat/i)).toBeInTheDocument()
})
