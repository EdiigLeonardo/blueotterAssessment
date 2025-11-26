import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import SyncUserPage from '../pages/SyncUserPage'
import { Provider } from 'react-redux'
import { store } from '../store/store'
import { addUser } from '../store/storageSlice'

vi.mock('../lib/api', () => ({
  syncUser: async (_u: string) => ({ status: 'ok' }),
}))

function Wrapper({ children }: { children: React.ReactNode }) {
  return <Provider store={store}>{children}</Provider>
}

test('disables sync button for already synced user', async () => {
  const user = userEvent.setup()
  store.dispatch(addUser('octocat'))
  render(<SyncUserPage />, { wrapper: Wrapper })

  const input = screen.getByPlaceholderText(/username/i)
  await user.clear(input)
  await user.type(input, 'octocat')
  const btn = screen.getByRole('button', { name: /sync/i })
  expect(btn).toBeDisabled()
})
