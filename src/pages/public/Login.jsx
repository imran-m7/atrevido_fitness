import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import logo from '../../assets/logo2.png'

export default function Login() {
  const [form, setForm] = useState({ email: '', password: '', remember: false })
  const handleChange = (e) => setForm({ ...form, [e.target.id]: e.target.value })
 
  const inputClass = 'w-full rounded-lg border border-input bg-background px-3 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring transition-colors'
  const labelClass = 'block mb-1.5 text-sm font-medium text-foreground'
 
  return (
    <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center px-4 py-12">
      <div className="w-full max-w-md rounded-lg border border-border bg-card shadow-sm">
 
        {/* Header */}
        <div className="border-b border-border p-6 text-center">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-lg">
            <img src={logo} alt="Atrevido Fitness Logo" className="h-12 w-auto"/>
          </div>
          <h1 className="text-2xl font-bold text-foreground">Dobrodošli Nazad</h1>
          <p className="mt-1 text-sm text-muted-foreground">Prijavite se na Vaš Atrevido Fitness račun</p>
        </div>
 
        {/* Form */}
        <div className="p-6 space-y-4">
          <div>
            <label htmlFor="email" className={labelClass}>Korisničko Ime</label>
            <input id="email" type="email" className={inputClass} placeholder="Unesite korisničko ime" value={form.email} onChange={handleChange} />
          </div>
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label htmlFor="password" className="text-sm font-medium text-foreground">Šifra</label>
              <Link to="/forgot-password" className="text-sm text-primary hover:underline">Zaboravili ste šifru?</Link>
            </div>
            <input id="password" type="password" className={inputClass} placeholder="Unesite šifru" value={form.password} onChange={handleChange} />
          </div>
          <div className="flex items-center gap-2">
            <input
              id="remember"
              type="checkbox"
              className="h-4 w-4 rounded border-border accent-primary"
              checked={form.remember}
              onChange={(e) => setForm({ ...form, remember: e.target.checked })}
            />
            <label htmlFor="remember" className="text-sm text-muted-foreground">Zapamti me</label>
          </div>
          <button className="w-full rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground hover:opacity-90 transition-opacity">
            Log In
          </button>
 
          {/* Demo access */}
          <div className="relative mt-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-border" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-card px-2 text-muted-foreground">Demo Access</span>
            </div>
          </div>
          <div className="grid gap-2">
            <Link
              to="/member/dashboard"
              className="flex w-full items-center justify-center rounded-lg border border-border px-4 py-2.5 text-sm font-medium text-foreground hover:bg-muted transition-colors"
            >
              View Member Dashboard
            </Link>
            <Link
              to="/admin/dashboard"
              className="flex w-full items-center justify-center rounded-lg border border-border px-4 py-2.5 text-sm font-medium text-foreground hover:bg-muted transition-colors"
            >
              View Admin Dashboard
            </Link>
          </div>
        </div>
 
        {/* Footer */}
        <div className="border-t border-border p-4 text-center">
          <p className="text-sm text-muted-foreground">
            Nemate račun?{' '}
            <Link to="/register" className="text-primary hover:underline font-medium">Prijavite se</Link>
          </p>
        </div>
      </div>
    </div>
  )
}
