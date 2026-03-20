import React, { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import {
  Home,
  Users,
  CreditCard,
  Calendar,
  Trophy,
  Apple,
  User,
  FileText,
  Mail,
  Dumbbell,
  Menu,
  X,
} from 'lucide-react'

const navigationItems = [
  { name: 'Homepage',          href: '/',            icon: Home },
  { name: 'About Us',          href: '/about',       icon: Users },
  { name: 'Membership Status', href: '/membership',  icon: CreditCard },
  { name: 'User Schedule',     href: '/schedule',    icon: Calendar },
  { name: 'Leaderboard',       href: '/leaderboard', icon: Trophy },
  { name: 'Nutrition Plan',    href: '/nutrition',   icon: Apple },
  { name: 'User Profile',      href: '/profile',     icon: User },
  { name: 'Blog',              href: '/blog',        icon: FileText },
  { name: 'Contact Us',        href: '/contact',     icon: Mail },
]

export default function Sidebar() {
  const { pathname } = useLocation()
  const [mobileOpen, setMobileOpen] = useState(false)

  return (
    <>
      {/* Mobile Menu Button */}
      <button
        onClick={() => setMobileOpen(!mobileOpen)}
        aria-label="Toggle navigation"
        className="fixed top-4 left-4 z-50 lg:hidden flex items-center justify-center w-10 h-10 rounded-lg bg-sidebar text-sidebar-foreground border border-sidebar-border"
      >
        {mobileOpen ? <X size={20} /> : <Menu size={20} />}
      </button>

      {/* Mobile Overlay */}
      {mobileOpen && (
        <div
          onClick={() => setMobileOpen(false)}
          className="fixed inset-0 z-30 bg-black/50 lg:hidden"
        />
      )}

      {/* Sidebar */}
      <aside
        className={[
          'fixed left-0 top-0 z-40 h-screen w-64 flex flex-col',
          'bg-sidebar text-sidebar-foreground',
          'transition-transform duration-300',
          'lg:translate-x-0',
          mobileOpen ? 'translate-x-0' : '-translate-x-full',
        ].join(' ')}
      >
        {/* Logo */}
        <div className="flex items-center gap-3 h-20 px-6 border-b border-sidebar-border shrink-0">
          <div className="flex items-center justify-center w-10 h-10 rounded-full bg-sidebar-primary shrink-0">
            <Dumbbell size={20} className="text-sidebar-primary-foreground" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-sidebar-foreground">Atrevido</h1>
            <p className="text-xs text-sidebar-foreground/70">Women's Fitness</p>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex flex-col gap-1 p-4 flex-1 overflow-y-auto">
          {navigationItems.map((item) => {
            const isActive = pathname === item.href
            const Icon = item.icon
            return (
              <Link
                key={item.name}
                to={item.href}
                onClick={() => setMobileOpen(false)}
                className={[
                  'flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium transition-colors',
                  isActive
                    ? 'bg-sidebar-primary text-sidebar-primary-foreground'
                    : 'text-sidebar-foreground/80 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground',
                ].join(' ')}
              >
                <Icon size={20} />
                {item.name}
              </Link>
            )
          })}
        </nav>

        {/* Footer / User */}
        <div className="border-t border-sidebar-border p-4 shrink-0">
          <div className="flex items-center gap-3 rounded-lg bg-sidebar-accent px-4 py-3">
            <div className="flex items-center justify-center w-8 h-8 rounded-full bg-sidebar-primary shrink-0">
              <User size={16} className="text-sidebar-primary-foreground" />
            </div>
            <div className="min-w-0">
              <p className="text-sm font-medium text-sidebar-foreground truncate">Guest User</p>
              <p className="text-xs text-sidebar-foreground/70">Sign in to continue</p>
            </div>
          </div>
        </div>
      </aside>
    </>
  )
}