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
  { name: 'Homepage',         href: '/',            icon: Home },
  { name: 'About Us',         href: '/about',       icon: Users },
  { name: 'Membership Status',href: '/membership',  icon: CreditCard },
  { name: 'User Schedule',    href: '/schedule',    icon: Calendar },
  { name: 'Leaderboard',      href: '/leaderboard', icon: Trophy },
  { name: 'Nutrition Plan',   href: '/nutrition',   icon: Apple },
  { name: 'User Profile',     href: '/profile',     icon: User },
  { name: 'Blog',             href: '/blog',        icon: FileText },
  { name: 'Contact Us',       href: '/contact',     icon: Mail },
]

export default function Sidebar() {
  const { pathname } = useLocation()
  const [mobileOpen, setMobileOpen] = useState(false)

  return (
    <>
      {/* Mobile Menu Button */}
      <button
        className="mobile-menu-btn"
        onClick={() => setMobileOpen(!mobileOpen)}
        aria-label="Toggle navigation"
        style={{
          position: 'fixed',
          top: '1rem',
          left: '1rem',
          zIndex: 50,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          width: '2.5rem',
          height: '2.5rem',
          borderRadius: 'var(--radius)',
          background: 'var(--sidebar)',
          color: 'var(--sidebar-foreground)',
          border: '1px solid var(--sidebar-border)',
        }}
      >
        {mobileOpen ? <X size={20} /> : <Menu size={20} />}
      </button>

      {/* Mobile Overlay */}
      {mobileOpen && (
        <div
          onClick={() => setMobileOpen(false)}
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 30,
            background: 'rgba(0,0,0,0.5)',
          }}
        />
      )}

      {/* Sidebar */}
      <aside style={{
        position: 'fixed',
        left: 0,
        top: 0,
        zIndex: 40,
        height: '100vh',
        width: '16rem',
        background: 'var(--sidebar)',
        color: 'var(--sidebar-foreground)',
        display: 'flex',
        flexDirection: 'column',
        transition: 'transform 0.3s ease',
        transform: mobileOpen ? 'translateX(0)' : 'translateX(-100%)',
      }}
        className="sidebar"
      >
        {/* Logo */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.75rem',
          height: '5rem',
          padding: '0 1.5rem',
          borderBottom: '1px solid var(--sidebar-border)',
          flexShrink: 0,
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '2.5rem',
            height: '2.5rem',
            borderRadius: '50%',
            background: 'var(--sidebar-primary)',
          }}>
            <Dumbbell size={20} color="var(--sidebar-primary-foreground)" />
          </div>
          <div>
            <h1 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--sidebar-foreground)', fontFamily: 'var(--font-display)' }}>
              Atrevido
            </h1>
            <p style={{ fontSize: '0.7rem', color: 'rgba(245,237,242,0.7)' }}>
              Women's Fitness
            </p>
          </div>
        </div>

        {/* Navigation */}
        <nav style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '0.25rem',
          padding: '1rem',
          flex: 1,
          overflowY: 'auto',
        }}>
          {navigationItems.map((item) => {
            const isActive = pathname === item.href
            const Icon = item.icon
            return (
              <Link
                key={item.name}
                to={item.href}
                onClick={() => setMobileOpen(false)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.75rem',
                  borderRadius: 'var(--radius)',
                  padding: '0.75rem 1rem',
                  fontSize: '0.875rem',
                  fontWeight: 500,
                  transition: 'background 0.15s, color 0.15s',
                  background: isActive ? 'var(--sidebar-primary)' : 'transparent',
                  color: isActive
                    ? 'var(--sidebar-primary-foreground)'
                    : 'rgba(245,237,242,0.8)',
                }}
                onMouseEnter={e => {
                  if (!isActive) {
                    e.currentTarget.style.background = 'var(--sidebar-accent)'
                    e.currentTarget.style.color = 'var(--sidebar-accent-foreground)'
                  }
                }}
                onMouseLeave={e => {
                  if (!isActive) {
                    e.currentTarget.style.background = 'transparent'
                    e.currentTarget.style.color = 'rgba(245,237,242,0.8)'
                  }
                }}
              >
                <Icon size={20} />
                {item.name}
              </Link>
            )
          })}
        </nav>

        {/* Footer / User */}
        <div style={{
          borderTop: '1px solid var(--sidebar-border)',
          padding: '1rem',
          flexShrink: 0,
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.75rem',
            borderRadius: 'var(--radius)',
            background: 'var(--sidebar-accent)',
            padding: '0.75rem 1rem',
          }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: '2rem',
              height: '2rem',
              borderRadius: '50%',
              background: 'var(--sidebar-primary)',
              flexShrink: 0,
            }}>
              <User size={16} color="var(--sidebar-primary-foreground)" />
            </div>
            <div style={{ minWidth: 0 }}>
              <p style={{ fontSize: '0.875rem', fontWeight: 500, color: 'var(--sidebar-foreground)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                Guest User
              </p>
              <p style={{ fontSize: '0.75rem', color: 'rgba(245,237,242,0.7)' }}>
                Sign in to continue
              </p>
            </div>
          </div>
        </div>
      </aside>

      {/* Desktop sidebar always visible */}
      <style>{`
        @media (min-width: 1024px) {
          .sidebar {
            transform: translateX(0) !important;
          }
          .mobile-menu-btn {
            display: none !important;
          }
        }
      `}</style>
    </>
  )
}