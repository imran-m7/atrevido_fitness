import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { authApi, membershipApi } from '../../services/api'
import logo from '../../assets/logo2.png'

const programs = [
  { id: 'group', title: 'Grupni Treninzi' },
  { id: 'individual', title: 'Individualni Treninzi' },
  { id: 'individual-nutrition', title: 'Individualni Trening + Ishrana' },
]

function validatePassword(password) {
  if (password.length < 6) return 'Šifra mora imati najmanje 6 karaktera.'
  if (!/[A-Z]/.test(password)) return 'Šifra mora sadržati najmanje jedno veliko slovo.'
  if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password))
    return 'Šifra mora sadržati najmanje jedan specijalni znak (!@#$%^&* itd.).'
  return null
}

export default function Register() {
  const navigate = useNavigate()
  const { login } = useAuth()

  const [form, setForm] = useState({
    firstName: '', lastName: '', username: '', email: '', phone: '',
    password: '', confirmPassword: '', trainingProgram: '', terms: false
  })
  const [showModal, setShowModal] = useState(false)
  const [error, setError] = useState('')
  const [passwordError, setPasswordError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleChange = (e) => {
    const { id, value } = e.target
    setForm(prev => ({ ...prev, [id]: value }))
    // Live password validacija
    if (id === 'password') {
      setPasswordError(validatePassword(value) || '')
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    if (!form.firstName || !form.lastName || !form.username || !form.password) {
      setError('Molimo popunite sva obavezna polja.')
      return
    }
    if (form.username.length < 3) {
      setError('Korisničko ime mora imati najmanje 3 karaktera.')
      return
    }
    if (form.username.includes(' ')) {
      setError('Korisničko ime ne smije sadržati razmake.')
      return
    }
    const pwdErr = validatePassword(form.password)
    if (pwdErr) { setError(pwdErr); return }
    if (form.password !== form.confirmPassword) {
      setError('Šifre se ne poklapaju.')
      return
    }
    if (!form.trainingProgram) {
      setError('Molimo odaberite trening program.')
      return
    }
    if (!form.terms) {
      setError('Molimo prihvatite uslove korištenja.')
      return
    }

    setLoading(true)
    try {
      const registerData = await authApi.register({
        firstName: form.firstName,
        lastName: form.lastName,
        username: form.username,
        email: form.email || null,
        phoneNumber: form.phone || null,
        password: form.password
      })
      login(registerData)
      await membershipApi.request(form.trainingProgram)
      setShowModal(true)
    } catch (err) {
      setError(err.message || 'Greška pri registraciji.')
    } finally {
      setLoading(false)
    }
  }

  const handleCloseModal = () => {
    setShowModal(false)
    navigate('/')
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
          <h1 className="text-2xl font-bold text-foreground">Napravi Račun</h1>
          <p className="mt-1 text-sm text-muted-foreground">Pridruži se Atrevido Fitness</p>
        </div>

        <div className="p-6 space-y-4">
          {error && (
            <div className="rounded-lg bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-600">
              {error}
            </div>
          )}

          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <label htmlFor="firstName" className={labelClass}>Ime *</label>
              <input id="firstName" className={inputClass} placeholder="Unesite ime"
                value={form.firstName} onChange={handleChange} />
            </div>
            <div>
              <label htmlFor="lastName" className={labelClass}>Prezime *</label>
              <input id="lastName" className={inputClass} placeholder="Unesite prezime"
                value={form.lastName} onChange={handleChange} />
            </div>
          </div>

          <div>
            <label htmlFor="username" className={labelClass}>Korisničko ime *</label>
            <input id="username" type="text" className={inputClass}
              placeholder="npr. korisnik.trening (bez razmaka)"
              value={form.username} onChange={handleChange} />
            <p className="mt-1 text-xs text-muted-foreground">Minimalno 3 karaktera, bez razmaka</p>
          </div>

          <div>
            <label htmlFor="email" className={labelClass}>Email (opciono)</label>
            <input id="email" type="email" className={inputClass}
              placeholder="Unesite email adresu"
              value={form.email} onChange={handleChange} />
          </div>

          <div>
            <label htmlFor="phone" className={labelClass}>Broj Telefona</label>
            <input id="phone" type="tel" className={inputClass}
              placeholder="Unesite broj telefona"
              value={form.phone} onChange={handleChange} />
          </div>

          <div>
            <label htmlFor="password" className={labelClass}>Šifra *</label>
            <input id="password" type="password" className={inputClass}
              placeholder="Unesite šifru" value={form.password} onChange={handleChange} />
            {/* Live password validacija */}
            <div className="mt-2 space-y-1">
              <p className={`text-xs flex items-center gap-1 ${form.password.length >= 6 ? 'text-green-600' : 'text-muted-foreground'}`}>
                <span>{form.password.length >= 6 ? '✓' : '○'}</span> Minimalno 6 karaktera
              </p>
              <p className={`text-xs flex items-center gap-1 ${/[A-Z]/.test(form.password) ? 'text-green-600' : 'text-muted-foreground'}`}>
                <span>{/[A-Z]/.test(form.password) ? '✓' : '○'}</span> Jedno veliko slovo
              </p>
              <p className={`text-xs flex items-center gap-1 ${/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(form.password) ? 'text-green-600' : 'text-muted-foreground'}`}>
                <span>{/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(form.password) ? '✓' : '○'}</span> Jedan specijalni znak
              </p>
            </div>
          </div>

          <div>
            <label htmlFor="confirmPassword" className={labelClass}>Potvrdite Šifru *</label>
            <input id="confirmPassword" type="password" className={inputClass}
              placeholder="Potvrdite šifru" value={form.confirmPassword} onChange={handleChange} />
            {form.confirmPassword && form.password !== form.confirmPassword && (
              <p className="mt-1 text-xs text-red-500">Šifre se ne poklapaju</p>
            )}
            {form.confirmPassword && form.password === form.confirmPassword && form.confirmPassword.length > 0 && (
              <p className="mt-1 text-xs text-green-600">✓ Šifre se poklapaju</p>
            )}
          </div>

          <div>
            <label htmlFor="trainingProgram" className={labelClass}>Odaberite Trening Program *</label>
            <select id="trainingProgram" value={form.trainingProgram}
              onChange={(e) => setForm({ ...form, trainingProgram: e.target.value })}
              className={`${inputClass} ${!form.trainingProgram ? 'text-muted-foreground' : 'text-foreground'}`}>
              <option value="" disabled>-- Odaberite program --</option>
              {programs.map((p) => (
                <option key={p.id} value={p.id}>{p.title}</option>
              ))}
            </select>
          </div>

          <div className="flex items-start gap-2">
            <input id="terms" type="checkbox"
              className="mt-1 h-4 w-4 rounded border-border accent-primary"
              checked={form.terms}
              onChange={(e) => setForm({ ...form, terms: e.target.checked })} />
            <label htmlFor="terms" className="text-sm text-muted-foreground">
              Slažem se s{' '}
              <Link to="/terms" className="text-primary hover:underline">Uslovima korištenja</Link>
              {' '}i{' '}
              <Link to="/privacy" className="text-primary hover:underline">Politikom privatnosti</Link>
            </label>
          </div>

          <button onClick={handleSubmit} disabled={loading}
            className="w-full rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground hover:opacity-90 transition-opacity disabled:opacity-50">
            {loading ? 'Slanje...' : 'Napravite Profil'}
          </button>
        </div>

        <div className="border-t border-border p-4 text-center">
          <p className="text-sm text-muted-foreground">
            Već imate račun?{' '}
            <Link to="/login" className="text-primary hover:underline font-medium">Log In</Link>
          </p>
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm z-50">
          <div className="rounded-lg border border-border bg-card shadow-lg p-8 max-w-md w-full mx-4 text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
              <svg className="h-8 w-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-foreground mb-4">Prijava Poslana!</h2>
            <p className="text-muted-foreground mb-6">
              Vaša prijava je poslana adminu na odobrenje. Profil će biti aktiviran nakon plaćanja uživo.
            </p>
            <button onClick={handleCloseModal}
              className="w-full rounded-lg bg-primary px-4 py-3 text-sm font-semibold text-primary-foreground hover:opacity-90 transition-opacity">
              OK
            </button>
          </div>
        </div>
      )}
    </div>
  )
}