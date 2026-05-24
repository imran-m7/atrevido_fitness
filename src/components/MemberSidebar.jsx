import React, { useState, useEffect } from 'react'
import logo from '../assets/logo2.png'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import {
  LayoutDashboard, Calendar, CalendarPlus, Trophy,
  TrendingUp, Salad, BookOpen, User, LogOut,
  Menu, X, Bell,
} from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { membershipApi } from '../services/api'

const navItems = [
  { href: '/member/dashboard', label: 'Početna', icon: LayoutDashboard },
  { href: '/member/schedule', label: 'Raspored', icon: Calendar },
  { href: '/member/book', label: 'Rezervacija treninga', icon: CalendarPlus },
  { href: '/member/challenges', label: 'Izazovi', icon: Trophy },
  { href: '/member/progress', label: 'Napredak', icon: TrendingUp },
  { href: '/member/nutrition', label: 'Ishrana', icon: Salad },
  { href: '/member/blog', label: 'Blog', icon: BookOpen },
  { href: '/member/profile', label: 'Profil', icon: User },
]

export default function MemberSidebar() {
  const { user, logout } = useAuth()
  const { pathname } = useLocation()
  const navigate = useNavigate()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [membership, setMembership] = useState(null)

  useEffect(() => {
    membershipApi.getMine()
      .then(data => setMembership(data))
      .catch(() => { })
  }, [])

  const getMembershipLabel = () => {
    if (!membership) return 'Na čekanju'
    if (membership.trainingType === 'Individual' && membership.nutritionEnabled)
      return 'Individualni trening + Ishrana'
    if (membership.trainingType === 'Individual')
      return 'Individualni trening'
    return 'Grupni trening'
  }

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    <>
      {/* Mobile Header */}
      <header className="fixed left-0 right-0 top-0 z-50 flex h-16 items-center justify-between border-b border-border bg-background px-4 lg:hidden">
        <Link to="/member/dashboard" className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg overflow-hidden">
            <img src={logo} alt="Atrevido Logo" className="h-full w-full object-contain" />
          </div>
          <span className="font-bold text-foreground">Atrevido</span>
        </Link>
        <div className="flex items-center gap-2">
          <button className="flex h-9 w-9 items-center justify-center rounded-lg hover:bg-muted transition-colors">
            <Bell size={20} className="text-foreground" />
          </button>
          <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
            {mobileMenuOpen
              ? <X size={24} className="text-foreground" />
              : <Menu size={24} className="text-foreground" />
            }
          </button>
        </div>
      </header>

      {/* Mobile Overlay */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          onClick={() => setMobileMenuOpen(false)} />
      )}

      {/* Sidebar */}
      <aside className={[
        'fixed left-0 top-0 z-40 h-full w-64 flex flex-col',
        'border-r border-neutral-800 bg-black',
        'transition-transform duration-200 lg:translate-x-0',
        mobileMenuOpen ? 'translate-x-0' : '-translate-x-full',
      ].join(' ')}>

        {/* Logo */}
        <div className="flex h-16 items-center gap-3 border-b border-sidebar-border px-4 shrink-0">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg overflow-hidden">
            <img src={logo} alt="Atrevido Logo" className="h-full w-full object-contain" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-sidebar-foreground">Atrevido</h1>
            <p className="text-xs text-sidebar-foreground/70">Portal za članice</p>
          </div>
        </div>

        {/* User Info */}
        <div className="border-b border-sidebar-border p-4 shrink-0">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-sidebar-accent shrink-0">
              <User size={20} className="text-sidebar-accent-foreground" />
            </div>
            <div className="min-w-0">
              <p className="truncate font-medium text-sidebar-foreground">
                {user?.firstName || 'Članica'}
              </p>
              <span className="inline-block rounded-full bg-secondary px-2 py-0.5 text-xs font-medium text-secondary-foreground">
                {getMembershipLabel()}
              </span>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto p-4">
          <ul className="space-y-1">
            {navItems.map((item) => {
              const isActive = pathname === item.href
              const Icon = item.icon
              return (
                <li key={item.href}>
                  <Link
                    to={item.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className={[
                      'flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors',
                      isActive
                        ? 'bg-sidebar-primary text-sidebar-primary-foreground'
                        : 'text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground',
                    ].join(' ')}
                  >
                    <Icon size={20} />
                    {item.label}
                  </Link>
                </li>
              )
            })}
          </ul>
        </nav>

        {/* Footer */}
        <div className="border-t border-sidebar-border p-4 shrink-0">
          <button
            onClick={handleLogout}
            className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground transition-colors"
          >
            <LogOut size={20} />
            Odjava
          </button>
        </div>
      </aside>
    </>
  )
}