import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { describe, it, expect } from 'vitest'
import PublicNavbar from '../../src/components/PublicNavbar'

const renderNavbar = () => {
  return render(
    <MemoryRouter initialEntries={['/']}>
      <PublicNavbar />
    </MemoryRouter>
  )
}

describe('PublicNavbar', () => {

  it('renders logo and brand name', () => {
    renderNavbar()

    expect(screen.getByText(/Atrevido/i)).toBeInTheDocument()
    expect(screen.getByText(/Fitness/i)).toBeInTheDocument()
  })

  it('renders all navigation links', () => {
    renderNavbar()

    expect(screen.getByText('Home')).toBeInTheDocument()
    expect(screen.getByText('O nama')).toBeInTheDocument()
    expect(screen.getByText('Programi')).toBeInTheDocument()
    expect(screen.getByText('Blog')).toBeInTheDocument()
    expect(screen.getByText('Kontakt')).toBeInTheDocument()
  })

  it('renders login and register buttons', () => {
    renderNavbar()

    expect(screen.getByText(/Log In/i)).toBeInTheDocument()
    expect(screen.getByText(/Započni/i)).toBeInTheDocument()
  })

  it('mobile menu button exists', () => {
    renderNavbar()

    expect(screen.getByLabelText(/toggle menu/i)).toBeInTheDocument()
  })

})