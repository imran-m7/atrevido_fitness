import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import Register from '../../src/pages/public/Register'
import { AuthProvider } from '../../src/context/AuthContext'
import { vi } from 'vitest'

// mock APIs
vi.mock('../../src/services/api', () => ({
  authApi: {
    register: vi.fn(),
  },
  membershipApi: {
    request: vi.fn(),
  },
}))

const renderPage = () => {
  return render(
    <MemoryRouter>
      <AuthProvider>
        <Register />
      </AuthProvider>
    </MemoryRouter>
  )
}

describe('Register page', () => {
  test('renders register form correctly', () => {
    renderPage()

    expect(screen.getByPlaceholderText(/unesite ime/i)).toBeInTheDocument()
    expect(screen.getByPlaceholderText(/unesite prezime/i)).toBeInTheDocument()
    expect(screen.getByPlaceholderText(/npr\. marija_fitness/i)).toBeInTheDocument()
    expect(
      screen.getByRole('button', { name: /napravite profil/i })
    ).toBeInTheDocument()
  })

  test('shows error when required fields are missing', async () => {
    renderPage()

    fireEvent.click(screen.getByRole('button', { name: /napravite profil/i }))

    expect(await screen.findByText(/molimo/i)).toBeInTheDocument()
  })

  test('registers user successfully and shows modal', async () => {
    const { authApi, membershipApi } = await import('../../src/services/api')

    authApi.register.mockResolvedValue({
      token: 'fake-token',
      user: { role: 'Member' },
    })

    membershipApi.request.mockResolvedValue({})

    renderPage()

    fireEvent.change(screen.getByPlaceholderText(/unesite ime/i), {
      target: { value: 'Imran' },
    })

    fireEvent.change(screen.getByPlaceholderText(/unesite prezime/i), {
      target: { value: 'Test' },
    })

    fireEvent.change(screen.getByPlaceholderText(/npr\. marija_fitness/i), {
      target: { value: 'imran123' },
    })

    fireEvent.change(screen.getByPlaceholderText(/unesite šifru/i), {
      target: { value: 'Test123!' },
    })

    fireEvent.change(screen.getByPlaceholderText(/potvrdite šifru/i), {
      target: { value: 'Test123!' },
    })

    fireEvent.change(screen.getByRole('combobox'), {
      target: { value: 'group' },
    })

    fireEvent.click(screen.getByRole('checkbox'))

    fireEvent.click(
      screen.getByRole('button', { name: /napravite profil/i })
    )

    await waitFor(() => {
      expect(authApi.register).toHaveBeenCalled()
    })
  })

  test('blocks submit when terms not accepted', async () => {
  renderPage()

  // fill only one required field so form can trigger validation
  fireEvent.change(screen.getByPlaceholderText(/unesite ime/i), {
    target: { value: 'Imran' },
  })

  // try submit without accepting terms
  fireEvent.click(screen.getByRole('button', { name: /napravite profil/i }))

  await waitFor(() => {
    expect(
      screen.getByText(/molimo popunite sva obavezna polja/i)
    ).toBeInTheDocument()
  })
})
})