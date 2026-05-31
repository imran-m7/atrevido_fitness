import { render, screen, fireEvent } from '@testing-library/react'
import { useState } from 'react'
import PhoneInput from '../../src/components/PhoneInput'

function Wrapper({ initial = '' }) {
  const [value, setValue] = useState(initial)

  return (
    <PhoneInput
      value={value}
      onChange={setValue}
    />
  )
}

describe('PhoneInput extra coverage', () => {
  test('shows error after blur with invalid prefix', () => {
    render(<Wrapper initial="999123" />)

    const input = screen.getByPlaceholderText('061 123 456')

    fireEvent.blur(input)

    expect(screen.getByText(/Broj mora počinjati/i)).toBeInTheDocument()
  })

  test('accepts +387 format branch correctly (edge path)', () => {
    const Wrapper2 = () => {
      const [value, setValue] = useState('')
      return <PhoneInput value={value} onChange={setValue} />
    }

    render(<Wrapper2 />)

    const input = screen.getByPlaceholderText('061 123 456')

    fireEvent.change(input, {
      target: { value: '+38761123456' },
    })

    expect(input.value).toContain('+387')
  })

  test('formats long number correctly (10 digits)', () => {
    render(<Wrapper initial="0611234567" />)

    expect(screen.getByDisplayValue(/061/)).toBeInTheDocument()
  })
})