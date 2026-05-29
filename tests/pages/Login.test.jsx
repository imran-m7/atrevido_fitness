import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { MemoryRouter } from 'react-router-dom'
import Login from '../../src/pages/public/Login'

// mock navigate
const mockedNavigate = vi.fn()

// mock react-router-dom
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom')
  return {
    ...actual,
    useNavigate: () => mockedNavigate,
    useLocation: () => ({ state: {} }),
    Link: ({ children, to }) => <a href={to}>{children}</a>,
  }
})

// mock auth context (IMPORTANT FIX)
const mockLogin = vi.fn()

vi.mock('../../src/context/AuthContext', () => {
  return {
    useAuth: () => ({
      login: mockLogin,
    }),
  }
})

// mock API
vi.mock('../../src/services/api', () => ({
  authApi: {
    login: vi.fn(),
  },
}))

import { authApi } from '../../src/services/api'

const renderPage = () => {
  return render(
    <MemoryRouter>
      <Login />
    </MemoryRouter>
  )
}

describe('Login page', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders login form correctly', () => {
    renderPage()

    expect(screen.getByLabelText(/korisničko ime/i)).toBeInTheDocument()
    expect(screen.getByPlaceholderText(/unesite korisničko ime/i)).toBeInTheDocument()
    expect(screen.getByPlaceholderText(/unesite šifru/i)).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /log in/i })).toBeInTheDocument()
  })

  it('shows error when fields are empty', async () => {
    renderPage()

    fireEvent.click(screen.getByRole('button', { name: /log in/i }))

    expect(await screen.findByText(/molimo unesite/i)).toBeInTheDocument()
  })

  it('logs in successfully and navigates user', async () => {
    authApi.login.mockResolvedValue({
      role: 'Member',
    })

    renderPage()

    fireEvent.change(screen.getByPlaceholderText(/unesite korisničko ime/i), {
      target: { value: 'testuser' },
    })

    fireEvent.change(screen.getByPlaceholderText(/unesite šifru/i), {
      target: { value: '123456' },
    })

    fireEvent.click(screen.getByRole('button', { name: /log in/i }))

    await waitFor(() => {
      expect(authApi.login).toHaveBeenCalledWith('testuser', '123456')
      expect(mockLogin).toHaveBeenCalled()
      expect(mockedNavigate).toHaveBeenCalledWith('/member/dashboard')
    })
  })
})