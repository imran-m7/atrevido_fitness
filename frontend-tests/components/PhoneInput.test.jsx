import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import PhoneInput from '../../src/components/PhoneInput'

describe('PhoneInput', () => {
  it('renders input and prefix correctly', () => {
    render(<PhoneInput value="" onChange={() => {}} />)

    expect(screen.getByPlaceholderText('061 123 456')).toBeInTheDocument()
    expect(screen.getByText('+387')).toBeInTheDocument()
    expect(screen.getByText('🇧🇦')).toBeInTheDocument()
  })

  it('calls onChange when user types', () => {
    const handleChange = vi.fn()

    render(<PhoneInput value="" onChange={handleChange} />)

    const input = screen.getByPlaceholderText('061 123 456')
    fireEvent.change(input, { target: { value: '061123456' } })

    expect(handleChange).toHaveBeenCalled()
  })

  it('formats number correctly (spaces)', () => {
    const handleChange = vi.fn()

    render(<PhoneInput value="" onChange={handleChange} />)

    const input = screen.getByPlaceholderText('061 123 456')
    fireEvent.change(input, { target: { value: '061123456' } })

    expect(handleChange).toHaveBeenCalledWith('061 123 456')
  })

  it('accepts +387 format correctly', () => {
  const handleChange = vi.fn()

  render(<PhoneInput value="" onChange={handleChange} />)

  const input = screen.getByPlaceholderText('061 123 456')

  fireEvent.change(input, { target: { value: '+38761123456' } })

  // Wait for React state update cycle
  expect(handleChange.mock.calls.length).toBeGreaterThan(0)

  // Check what actually got passed
  const lastCall = handleChange.mock.calls.at(-1)?.[0]

  expect(lastCall).toBeDefined()
  expect(lastCall.startsWith('+387')).toBe(true)
  })

  it('shows error when invalid prefix is used', () => {
    const handleChange = vi.fn()

    render(<PhoneInput value="070123456" onChange={handleChange} />)

    const input = screen.getByPlaceholderText('061 123 456')

    fireEvent.change(input, { target: { value: '070123456' } })
    fireEvent.blur(input)

    expect(screen.getByText(/Broj mora počinjati sa/i)).toBeInTheDocument()
  })

  it('does not show error when value is empty (optional field)', () => {
    render(<PhoneInput value="" onChange={() => {}} />)

    expect(screen.getByText(/Operatori:/i)).toBeInTheDocument()
  })
})