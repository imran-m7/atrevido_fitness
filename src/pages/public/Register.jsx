import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { Dumbbell } from 'lucide-react'
 
export default function Register() {
  const [form, setForm] = useState({ firstName: '', lastName: '', email: '', phone: '', password: '', confirmPassword: '', terms: false })
  const handleChange = (e) => setForm({ ...form, [e.target.id]: e.target.value })
 
  const inputClass = 'w-full rounded-lg border border-input bg-background px-3 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring transition-colors'
  const labelClass = 'block mb-1.5 text-sm font-medium text-foreground'
 
  return (
    <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center px-4 py-12">
      <div className="w-full max-w-md rounded-lg border border-border bg-card shadow-sm">
 
        {/* Header */}
        <div className="border-b border-border p-6 text-center">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-primary">
            <Dumbbell size={24} className="text-primary-foreground" />
          </div>
          <h1 className="text-2xl font-bold text-foreground">Create Account</h1>
          <p className="mt-1 text-sm text-muted-foreground">Join Atrevido Fitness and start your journey</p>
        </div>
 
        {/* Form */}
        <div className="p-6 space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <label htmlFor="firstName" className={labelClass}>First Name</label>
              <input id="firstName" className={inputClass} placeholder="Enter first name" value={form.firstName} onChange={handleChange} />
            </div>
            <div>
              <label htmlFor="lastName" className={labelClass}>Last Name</label>
              <input id="lastName" className={inputClass} placeholder="Enter last name" value={form.lastName} onChange={handleChange} />
            </div>
          </div>
          <div>
            <label htmlFor="email" className={labelClass}>Email</label>
            <input id="email" type="email" className={inputClass} placeholder="Enter your email" value={form.email} onChange={handleChange} />
          </div>
          <div>
            <label htmlFor="phone" className={labelClass}>Phone Number</label>
            <input id="phone" type="tel" className={inputClass} placeholder="Enter your phone number" value={form.phone} onChange={handleChange} />
          </div>
          <div>
            <label htmlFor="password" className={labelClass}>Password</label>
            <input id="password" type="password" className={inputClass} placeholder="Create a password" value={form.password} onChange={handleChange} />
          </div>
          <div>
            <label htmlFor="confirmPassword" className={labelClass}>Confirm Password</label>
            <input id="confirmPassword" type="password" className={inputClass} placeholder="Confirm your password" value={form.confirmPassword} onChange={handleChange} />
          </div>
          <div className="flex items-start gap-2">
            <input
              id="terms"
              type="checkbox"
              className="mt-1 h-4 w-4 rounded border-border accent-primary"
              checked={form.terms}
              onChange={(e) => setForm({ ...form, terms: e.target.checked })}
            />
            <label htmlFor="terms" className="text-sm text-muted-foreground">
              I agree to the{' '}
              <Link to="/terms" className="text-primary hover:underline">Terms of Service</Link>
              {' '}and{' '}
              <Link to="/privacy" className="text-primary hover:underline">Privacy Policy</Link>
            </label>
          </div>
          <button className="w-full rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground hover:opacity-90 transition-opacity">
            Create Account
          </button>
        </div>
 
        {/* Footer */}
        <div className="border-t border-border p-4 text-center">
          <p className="text-sm text-muted-foreground">
            Already have an account?{' '}
            <Link to="/login" className="text-primary hover:underline font-medium">Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  )
}