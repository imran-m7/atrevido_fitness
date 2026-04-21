import React, { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import {
  LayoutDashboard, Calendar, Users, Trophy,
  Salad, BookOpen, LogOut, Menu, X, Dumbbell, Bell, Shield, TrendingUp,
} from 'lucide-react'

const navItems = [
  { href: '/admin/dashboard',  label: 'Dashboard',         icon: LayoutDashboard },
  { href: '/admin/trainings',  label: 'Manage Trainings',  icon: Calendar },
  { href: '/admin/members',    label: 'Manage Members',    icon: Users },
  { href: '/admin/progress',   label: 'Manage Progress',   icon: TrendingUp },
  { href: '/admin/challenges', label: 'Manage Challenges', icon: Trophy },
  { href: '/admin/nutrition',  label: 'Manage Nutrition',  icon: Salad },
  { href: '/admin/blog',       label: 'Manage Blog',       icon: BookOpen },
]

export default function AdminSidebar() {
  const { pathname } = useLocation()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  return (
    <>
      {/* Mobile Header */}
      <header className="fixed left-0 right-0 top-0 z-50 flex h-16 items-center justify-between border-b border-border bg-background px-4 lg:hidden">
        <Link to="/admin/dashboard" className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
            <Shield size={16} className="text-primary-foreground" />
          </div>
          <span className="font-bold text-foreground">Admin</span>
        </Link>
        <div className="flex items-center gap-2">
          <button className="flex h-9 w-9 items-center justify-center rounded-lg hover:bg-muted transition-colors" aria-label="Notifications">
            <Bell size={20} className="text-foreground" />
          </button>
          <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} aria-label="Toggle menu">
            {mobileMenuOpen
              ? <X size={24} className="text-foreground" />
              : <Menu size={24} className="text-foreground" />
            }
          </button>
        </div>
      </header>

      {/* Mobile Overlay */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-40 bg-black/50 lg:hidden" onClick={() => setMobileMenuOpen(false)} />
      )}

      {/* Sidebar */}
      <aside className={[
        'fixed left-0 top-0 z-40 h-full w-64 flex flex-col',
        'border-r border-sidebar-border bg-sidebar',
        'transition-transform duration-200 lg:translate-x-0',
        mobileMenuOpen ? 'translate-x-0' : '-translate-x-full',
      ].join(' ')}>

        {/* Logo */}
        <div className="flex h-16 items-center gap-3 border-b border-sidebar-border px-4 shrink-0">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary">
            <Dumbbell size={20} className="text-primary-foreground" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-sidebar-foreground">Atrevido</h1>
            <p className="text-xs text-sidebar-foreground/70">Admin Panel</p>
          </div>
        </div>

        {/* User Info */}
        <div className="border-b border-sidebar-border p-4 shrink-0">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-sidebar-accent shrink-0">
              <Shield size={20} className="text-sidebar-accent-foreground" />
            </div>
            <div className="min-w-0">
              <p className="truncate font-medium text-sidebar-foreground">Elena Rodriguez</p>
              <span className="inline-block rounded-full bg-secondary px-2 py-0.5 text-xs font-medium text-secondary-foreground">
                Trainer / Admin
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
          <Link
            to="/"
            className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-sidebar-foreground/70 transition-colors hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
          >
            <LogOut size={20} />
            Sign Out
          </Link>
        </div>
      </aside>
    </>
  )
}
