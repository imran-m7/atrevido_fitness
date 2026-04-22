import React, { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Menu, X, Dumbbell } from 'lucide-react'
import logo from '../assets/logo2.png'
 
const navLinks = [
  { href: '/',         label: 'Home' },
  { href: '/about',    label: 'O Nama' },
  { href: '/programs', label: 'Programi' },
  { href: '/blog',     label: 'Blog' },
  { href: '/contact',  label: 'Kontakt' },
]
 
export default function PublicNavbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const { pathname } = useLocation()
 
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur">
      <nav className="container mx-auto flex h-16 items-center justify-between px-4">
 
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2">
          <img src={logo} alt="Atrevido Fitness Logo" className="h-10 w-auto"/>
          <div>
            <span className="text-lg font-bold text-foreground">Atrevido </span>
            <span className="text-lg font-bold text-foreground">Fitness</span>
          </div>
        </Link>
 
        {/* Desktop Navigation */}
        <div className="hidden items-center gap-6 md:flex">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              to={link.href}
              className={[
                'text-sm font-medium transition-colors hover:text-primary',
                pathname === link.href ? 'text-primary' : 'text-muted-foreground',
              ].join(' ')}
            >
              {link.label}
            </Link>
          ))}
        </div>
 
        {/* Auth Buttons */}
        <div className="hidden items-center gap-3 md:flex">
          <Link
            to="/login"
            className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors px-4 py-2 rounded-lg hover:bg-muted"
          >
            Log In
          </Link>
          <Link
            to="/register"
            className="text-sm font-semibold bg-primary text-primary-foreground px-4 py-2 rounded-lg hover:opacity-90 transition-opacity"
          >
            Započni
          </Link>
        </div>
 
        {/* Mobile Menu Button */}
        <button
          className="md:hidden text-foreground"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label="Toggle menu"
        >
          {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </nav>
 
      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="border-t border-border bg-background md:hidden">
          <div className="container mx-auto flex flex-col gap-4 px-4 py-4">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                to={link.href}
                className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                {link.label}
              </Link>
            ))}
            <div className="flex flex-col gap-2 border-t border-border pt-4">
              <Link
                to="/login"
                className="text-sm font-medium text-muted-foreground hover:text-primary px-4 py-2 rounded-lg hover:bg-muted transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                Log In
              </Link>
              <Link
                to="/register"
                className="text-sm font-semibold text-center bg-primary text-primary-foreground px-4 py-2 rounded-lg hover:opacity-90 transition-opacity"
                onClick={() => setMobileMenuOpen(false)}
              >
                Započni
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  )
}