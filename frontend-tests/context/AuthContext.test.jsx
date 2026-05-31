import React from 'react'
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react'
import { AuthProvider, useAuth } from '../../src/context/AuthContext'
import { profileApi } from '../../src/services/api'

// mock API
vi.mock('../../src/services/api', () => ({
  profileApi: {
    get: vi.fn(),
  },
}))

function TestComponent() {
  const auth = useAuth()

  return (
    <div>
      <div data-testid="admin">{String(auth.isAdmin())}</div>
      <div data-testid="member">{String(auth.isMember())}</div>
      <div data-testid="logged">{String(auth.isLoggedIn())}</div>
      <div data-testid="active">{String(auth.isAccountActive())}</div>

      <button
        onClick={() =>
          auth.login({
            token: '123',
            role: 'Admin',
            firstName: 'Test',
            username: 'testuser',
            id: 1,
            isActive: true,
          })
        }
      >
        login
      </button>

      <button onClick={() => auth.logout()}>logout</button>

      <button onClick={() => auth.updateIsActive(false)}>
        deactivate
      </button>

      <button onClick={() => auth.updateProfile('NewName', 'newuser', 'img123')}>
        updateProfile
      </button>

      <button onClick={() => auth.updateProfile('OnlyName')}>
        updateProfileNoImage
      </button>
    </div>
  )
}

function renderAuth() {
  return render(
    <AuthProvider>
      <TestComponent />
    </AuthProvider>
  )
}

describe('AuthContext', () => {
  beforeEach(() => {
    localStorage.clear()
    vi.clearAllMocks()
  })

  test('loads user from localStorage', async () => {
    localStorage.setItem('token', 't')
    localStorage.setItem('role', 'Admin')
    localStorage.setItem('firstName', 'Imran')
    localStorage.setItem('username', 'imran')
    localStorage.setItem('userId', '1')
    localStorage.setItem('isActive', 'true')

    renderAuth()

    await waitFor(() => {
      expect(screen.getByTestId('logged')).toHaveTextContent('true')
    })
  })

  test('login sets user and calls profileApi', async () => {
    profileApi.get.mockResolvedValue({ profileImageBase64: 'img' })

    renderAuth()

    await act(async () => {
      fireEvent.click(screen.getByText('login'))
    })

    await waitFor(() => {
      expect(profileApi.get).toHaveBeenCalled()
      expect(screen.getByTestId('logged')).toHaveTextContent('true')
      expect(screen.getByTestId('admin')).toHaveTextContent('true')
    })
  })

  test('logout clears user', async () => {
    renderAuth()

    await act(async () => {
      fireEvent.click(screen.getByText('login'))
    })

    await act(async () => {
      fireEvent.click(screen.getByText('logout'))
    })

    await waitFor(() => {
      expect(screen.getByTestId('logged')).toHaveTextContent('false')
    })
  })

  test('role helpers work correctly', async () => {
    renderAuth()

    await act(async () => {
      fireEvent.click(screen.getByText('login'))
    })

    await waitFor(() => {
      expect(screen.getByTestId('admin')).toHaveTextContent('true')
      expect(screen.getByTestId('member')).toHaveTextContent('false')
      expect(screen.getByTestId('logged')).toHaveTextContent('true')
    })
  })

  // =========================
  // NEW TESTS (COVERAGE BOOST)
  // =========================

  test('login handles profileApi failure gracefully', async () => {
    profileApi.get.mockRejectedValue(new Error('fail'))

    renderAuth()

    await act(async () => {
      fireEvent.click(screen.getByText('login'))
    })

    await waitFor(() => {
      expect(screen.getByTestId('logged')).toHaveTextContent('true')
    })
  })

  test('updateIsActive updates user state', async () => {
    renderAuth()

    await act(async () => {
      fireEvent.click(screen.getByText('login'))
    })

    await act(async () => {
      fireEvent.click(screen.getByText('deactivate'))
    })

    await waitFor(() => {
      expect(screen.getByTestId('active')).toHaveTextContent('false')
    })
  })

  test('updateProfile updates name and image', async () => {
    renderAuth()

    await act(async () => {
      fireEvent.click(screen.getByText('login'))
    })

    await act(async () => {
      fireEvent.click(screen.getByText('updateProfile'))
    })

    await waitFor(() => {
      expect(localStorage.getItem('firstName')).toBe('NewName')
      expect(localStorage.getItem('username')).toBe('newuser')
      expect(localStorage.getItem('profileImage')).toBe('img123')
    })
  })

  test('updateProfile removes image when undefined', async () => {
    renderAuth()

    await act(async () => {
      fireEvent.click(screen.getByText('login'))
    })

    await act(async () => {
      fireEvent.click(screen.getByText('updateProfileNoImage'))
    })

    await waitFor(() => {
      expect(localStorage.getItem('profileImage')).toBeNull()
    })
  })
})