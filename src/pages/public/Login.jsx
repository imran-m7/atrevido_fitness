import React, { useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { authApi } from '../../services/api'
import logo from '../../assets/logo2.png'

export default function Login() {
  const navigate = useNavigate()
  const location = useLocation()
  const { login } = useAuth()

  const [form, setForm] = useState({ username: '', password: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  // Poruka koja dolazi sa ForgotPassword stranice
  const successMessage = location.state?.message

  const handleChange = (e) => setForm({ ...form, [e.target.id]: e.target.value })

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    if (!form.username || !form.password) {
      setError('Molimo unesite korisničko ime i šifru.')
      return
    }
    setLoading(true)
    try {
      const data = await authApi.login(form.username, form.password)
      login(data)
      const from = location.state?.from?.pathname
      if (from) return navigate(from, { replace: true })
      if (data.role === 'Admin') navigate('/admin/dashboard')
      else navigate('/member/dashboard')
    } catch (err) {
      setError(err.message || 'Pogrešno korisničko ime ili šifra.')
    } finally {
      setLoading(false)
    }
  }

  const inputClass = 'w-full rounded-lg border border-input bg-background px-3 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring transition-colors'
  const labelClass = 'block mb-1.5 text-sm font-medium text-foreground'

  return (
    <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center px-4 py-12">
      <div className="w-full max-w-md rounded-lg border border-border bg-card shadow-sm">
        <div className="border-b border-border p-6 text-center">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-lg">
            <img src={logo} alt="Atrevido Fitness Logo" className="h-12 w-auto" />
          </div>
          <h1 className="text-2xl font-bold text-foreground">Dobrodošli nazad</h1>
          <p className="mt-1 text-sm text-muted-foreground">Prijavite se na Vaš Atrevido Fitness račun</p>
        </div>

        <div className="p-6 space-y-4">
          {successMessage && (
            <div className="rounded-lg bg-green-50 border border-green-200 px-4 py-3 text-sm text-green-700">
              {successMessage}
            </div>
          )}
          {error && (
            <div className="rounded-lg bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-600">
              {error}
            </div>
          )}
          <div>
            <label htmlFor="username" className={labelClass}>Korisničko ime</label>
            <input id="username" type="text" className={inputClass}
              placeholder="Unesite korisničko ime" value={form.username} onChange={handleChange} />
          </div>
          <div>

            <input id="password" type="password" className={inputClass}
              placeholder="Unesite šifru" value={form.password} onChange={handleChange} />
          </div>
          <button onClick={handleSubmit} disabled={loading}
            className="w-full rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground hover:opacity-90 transition-opacity disabled:opacity-50">
            {loading ? 'Prijava...' : 'Log In'}
          </button>
        </div>

        <div className="border-t border-border p-4 text-center">
          <p className="text-sm text-muted-foreground">
            Nemate račun?{' '}
            <Link to="/register" className="text-primary hover:underline font-medium">Registrujte se</Link>
          </p>
        </div>
      </div>
    </div>
  )
}