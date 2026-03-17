import React from 'react'
import Sidebar from '../components/Sidebar.jsx'
import {
  Dumbbell,
  Users,
  Clock,
  Star,
  MapPin,
  Phone,
  Mail,
  ChevronRight,
  Heart,
  Zap,
  Target,
} from 'lucide-react'

/* ── Data ────────────────────────────────────────────── */

const features = [
  {
    icon: Dumbbell,
    title: 'State-of-the-Art Equipment',
    description: 'Premium fitness equipment designed specifically for women\'s training needs and goals.',
  },
  {
    icon: Users,
    title: 'Expert Female Trainers',
    description: 'Our certified trainers understand the unique needs of women\'s fitness journeys.',
  },
  {
    icon: Heart,
    title: 'Supportive Community',
    description: 'Join a welcoming community of women who motivate and inspire each other.',
  },
  {
    icon: Target,
    title: 'Personalized Programs',
    description: 'Custom workout and nutrition plans tailored to your specific goals.',
  },
]

const classes = [
  { name: 'HIIT Training',           time: 'Mon, Wed, Fri – 6:00 AM',   spots: 8 },
  { name: 'Yoga Flow',               time: 'Tue, Thu – 7:00 AM',        spots: 12 },
  { name: 'Strength & Conditioning', time: 'Mon, Wed – 5:30 PM',        spots: 6 },
  { name: 'Spin Class',              time: 'Tue, Thu, Sat – 6:30 PM',   spots: 15 },
  { name: 'Pilates',                 time: 'Wed, Fri – 12:00 PM',       spots: 10 },
]

const testimonials = [
  {
    name: 'Maria Santos',
    role: 'Member for 2 years',
    content: 'Atrevido Fitness changed my life. The trainers genuinely care about your progress, and the community feels like family.',
    rating: 5,
  },
  {
    name: 'Jessica Rodriguez',
    role: 'Member for 1 year',
    content: "I've tried many gyms, but none compare to the welcoming atmosphere and expert guidance here. Highly recommend!",
    rating: 5,
  },
  {
    name: 'Ana Martinez',
    role: 'Member for 6 months',
    content: 'The personalized nutrition plans and workout programs helped me achieve results I never thought possible.',
    rating: 5,
  },
]

const stats = [
  { value: '500+', label: 'Active Members' },
  { value: '15+',  label: 'Expert Trainers' },
  { value: '50+',  label: 'Weekly Classes' },
  { value: '98%',  label: 'Satisfaction Rate' },
]

/* ── Reusable mini-components ────────────────────────── */

function Card({ children, style = {} }) {
  return (
    <div style={{
      background: 'var(--card)',
      borderRadius: 'var(--radius)',
      border: '1px solid var(--border)',
      boxShadow: '0 1px 3px rgba(0,0,0,0.06)',
      ...style,
    }}>
      {children}
    </div>
  )
}

function Btn({ children, variant = 'primary', size = 'md', style = {}, ...props }) {
  const base = {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '0.4rem',
    fontWeight: 600,
    borderRadius: 'var(--radius)',
    cursor: 'pointer',
    transition: 'opacity 0.15s, background 0.15s',
    fontFamily: 'var(--font-sans)',
    border: 'none',
    fontSize: size === 'lg' ? '1rem' : size === 'sm' ? '0.8rem' : '0.875rem',
    padding: size === 'lg' ? '0.75rem 1.5rem' : size === 'sm' ? '0.35rem 0.75rem' : '0.5rem 1rem',
  }
  const variants = {
    primary:  { background: 'var(--primary)',   color: 'var(--primary-foreground)' },
    secondary:{ background: '#ffffff',          color: 'var(--primary)' },
    outline:  { background: 'transparent',      color: '#ffffff', border: '1px solid rgba(255,255,255,0.35)' },
    'outline-border': { background: 'transparent', color: 'var(--foreground)', border: '1px solid var(--border)' },
  }
  return (
    <button
      style={{ ...base, ...variants[variant], ...style }}
      onMouseEnter={e => { e.currentTarget.style.opacity = '0.88' }}
      onMouseLeave={e => { e.currentTarget.style.opacity = '1' }}
      {...props}
    >
      {children}
    </button>
  )
}

/* ── Page ────────────────────────────────────────────── */

export default function HomePage() {
  return (
    <div style={{ minHeight: '100vh', background: 'var(--background)' }}>
      <Sidebar />

      {/* Main content pushed right on desktop */}
      <main style={{ paddingLeft: 0 }} className="main-content">

        {/* ── Hero ───────────────────────────────────── */}
        <section style={{
          position: 'relative',
          overflow: 'hidden',
          background: 'linear-gradient(135deg, var(--primary) 0%, var(--accent) 100%)',
        }}>
          {/* Decorative blobs */}
          <div style={{ position: 'absolute', inset: 0, opacity: 0.1, pointerEvents: 'none' }}>
            <div style={{ position: 'absolute', top: '5rem', right: '5rem', width: '16rem', height: '16rem', borderRadius: '50%', background: 'white', filter: 'blur(60px)' }} />
            <div style={{ position: 'absolute', bottom: '5rem', left: '5rem', width: '12rem', height: '12rem', borderRadius: '50%', background: 'white', filter: 'blur(60px)' }} />
          </div>

          <div style={{ position: 'relative', padding: '4rem 2rem 6rem', textAlign: 'center' }}>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', borderRadius: '9999px', background: 'rgba(255,255,255,0.2)', padding: '0.4rem 1rem', fontSize: '0.85rem', color: '#fff', marginBottom: '1.5rem' }}>
              <Zap size={16} />
              Women-Only Fitness Center
            </div>

            <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(2rem, 5vw, 3.5rem)', fontWeight: 800, color: '#fff', marginBottom: '1.25rem', lineHeight: 1.15 }}>
              Welcome to Atrevido Fitness
            </h1>

            <p style={{ fontSize: 'clamp(1rem, 2vw, 1.2rem)', color: 'rgba(255,255,255,0.9)', maxWidth: '42rem', margin: '0 auto 2rem', lineHeight: 1.7 }}>
              Empowering women to achieve their fitness goals in a supportive,
              judgment-free environment. Your transformation journey starts here.
            </p>

            <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '1rem' }}>
              <Btn variant="secondary" size="lg">
                Start Your Journey
                <ChevronRight size={18} />
              </Btn>
              <Btn variant="outline" size="lg">
                View Class Schedule
              </Btn>
            </div>
          </div>
        </section>

        {/* ── Stats Bar ──────────────────────────────── */}
        <section style={{ borderBottom: '1px solid var(--border)', background: 'var(--card)' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)' }} className="stats-grid">
            {stats.map((stat, i) => (
              <div
                key={stat.label}
                style={{
                  padding: '1.5rem',
                  textAlign: 'center',
                  borderRight: i % 2 === 0 ? '1px solid var(--border)' : 'none',
                  borderBottom: i < 2 ? '1px solid var(--border)' : 'none',
                }}
              >
                <p style={{ fontSize: '1.875rem', fontWeight: 700, color: 'var(--primary)', fontFamily: 'var(--font-display)' }}>{stat.value}</p>
                <p style={{ fontSize: '0.85rem', color: 'var(--muted-foreground)' }}>{stat.label}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ── Features ───────────────────────────────── */}
        <section style={{ padding: '4rem 2rem' }}>
          <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(1.5rem, 3vw, 2rem)', fontWeight: 700, color: 'var(--foreground)', marginBottom: '1rem' }}>
              Why Choose Atrevido Fitness?
            </h2>
            <p style={{ color: 'var(--muted-foreground)', maxWidth: '40rem', margin: '0 auto' }}>
              We provide everything you need to succeed in your fitness journey,
              from top-tier equipment to personalized coaching.
            </p>
          </div>

          <div style={{ display: 'grid', gap: '1.5rem', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', maxWidth: '1100px', margin: '0 auto' }}>
            {features.map((f) => {
              const Icon = f.icon
              return (
                <Card key={f.title} style={{ padding: '2rem 1.5rem', textAlign: 'center' }}>
                  <div style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '3.5rem', height: '3.5rem', borderRadius: '50%', background: 'rgba(192,82,122,0.1)', marginBottom: '1rem' }}>
                    <Icon size={28} color="var(--primary)" />
                  </div>
                  <h3 style={{ fontWeight: 600, marginBottom: '0.5rem', color: 'var(--foreground)' }}>{f.title}</h3>
                  <p style={{ fontSize: '0.875rem', color: 'var(--muted-foreground)', lineHeight: 1.6 }}>{f.description}</p>
                </Card>
              )
            })}
          </div>
        </section>

        {/* ── Classes ────────────────────────────────── */}
        <section style={{ background: 'var(--muted)', padding: '4rem 2rem' }}>
          <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(1.5rem, 3vw, 2rem)', fontWeight: 700, color: 'var(--foreground)', marginBottom: '1rem' }}>
              Popular Classes
            </h2>
            <p style={{ color: 'var(--muted-foreground)', maxWidth: '40rem', margin: '0 auto' }}>
              From high-intensity training to relaxing yoga sessions,
              we offer a variety of classes to fit every fitness level.
            </p>
          </div>

          <div style={{ maxWidth: '48rem', margin: '0 auto' }}>
            <Card>
              {classes.map((cls, i) => (
                <div
                  key={cls.name}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '1rem 1.25rem',
                    borderBottom: i < classes.length - 1 ? '1px solid var(--border)' : 'none',
                    gap: '1rem',
                    flexWrap: 'wrap',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '2.5rem', height: '2.5rem', borderRadius: 'var(--radius)', background: 'rgba(192,82,122,0.1)', flexShrink: 0 }}>
                      <Dumbbell size={20} color="var(--primary)" />
                    </div>
                    <div>
                      <p style={{ fontWeight: 500, color: 'var(--foreground)' }}>{cls.name}</p>
                      <p style={{ fontSize: '0.8rem', color: 'var(--muted-foreground)', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                        <Clock size={12} /> {cls.time}
                      </p>
                    </div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <p style={{ fontSize: '0.8rem', color: 'var(--muted-foreground)', marginBottom: '0.25rem' }}>{cls.spots} spots left</p>
                    <Btn variant="outline-border" size="sm">Book Now</Btn>
                  </div>
                </div>
              ))}
            </Card>
          </div>
        </section>

        {/* ── Testimonials ───────────────────────────── */}
        <section style={{ padding: '4rem 2rem' }}>
          <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(1.5rem, 3vw, 2rem)', fontWeight: 700, color: 'var(--foreground)', marginBottom: '1rem' }}>
              What Our Members Say
            </h2>
            <p style={{ color: 'var(--muted-foreground)', maxWidth: '40rem', margin: '0 auto' }}>
              Hear from real members about their experience at Atrevido Fitness.
            </p>
          </div>

          <div style={{ display: 'grid', gap: '1.5rem', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', maxWidth: '1000px', margin: '0 auto' }}>
            {testimonials.map((t) => (
              <Card key={t.name} style={{ padding: '1.75rem' }}>
                <div style={{ display: 'flex', gap: '0.25rem', marginBottom: '1rem' }}>
                  {Array.from({ length: t.rating }).map((_, i) => (
                    <Star key={i} size={16} color="var(--primary)" fill="var(--primary)" />
                  ))}
                </div>
                <p style={{ color: 'var(--muted-foreground)', marginBottom: '1rem', lineHeight: 1.7, fontSize: '0.9rem' }}>
                  "{t.content}"
                </p>
                <p style={{ fontWeight: 600, color: 'var(--foreground)' }}>{t.name}</p>
                <p style={{ fontSize: '0.8rem', color: 'var(--muted-foreground)' }}>{t.role}</p>
              </Card>
            ))}
          </div>
        </section>

        {/* ── Contact ────────────────────────────────── */}
        <section style={{ background: 'var(--muted)', padding: '4rem 2rem' }}>
          <div style={{ maxWidth: '56rem', margin: '0 auto' }}>
            <Card>
              <div style={{ padding: '2rem', textAlign: 'center', borderBottom: '1px solid var(--border)' }}>
                <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.5rem', fontWeight: 700, color: 'var(--foreground)' }}>
                  Visit Us Today
                </h2>
              </div>
              <div style={{ padding: '2rem' }}>
                <div style={{ display: 'grid', gap: '1.5rem', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', marginBottom: '2rem' }}>
                  {[
                    { Icon: MapPin, label: 'Location', value: '123 Fitness Street, Downtown' },
                    { Icon: Phone, label: 'Phone',    value: '(555) 123-4567' },
                    { Icon: Mail,  label: 'Email',    value: 'hello@atrevidofitness.com' },
                  ].map(({ Icon, label, value }) => (
                    <div key={label} style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '3rem', height: '3rem', borderRadius: '50%', background: 'rgba(192,82,122,0.1)', flexShrink: 0 }}>
                        <Icon size={22} color="var(--primary)" />
                      </div>
                      <div>
                        <p style={{ fontWeight: 500, color: 'var(--foreground)' }}>{label}</p>
                        <p style={{ fontSize: '0.85rem', color: 'var(--muted-foreground)' }}>{value}</p>
                      </div>
                    </div>
                  ))}
                </div>

                <div style={{ background: 'var(--muted)', borderRadius: 'var(--radius)', padding: '1.5rem', textAlign: 'center' }}>
                  <h3 style={{ fontWeight: 600, color: 'var(--foreground)', marginBottom: '0.5rem' }}>Operating Hours</h3>
                  {['Monday – Friday: 5:00 AM – 10:00 PM', 'Saturday: 6:00 AM – 8:00 PM', 'Sunday: 7:00 AM – 6:00 PM'].map(h => (
                    <p key={h} style={{ color: 'var(--muted-foreground)', fontSize: '0.9rem' }}>{h}</p>
                  ))}
                </div>
              </div>
            </Card>
          </div>
        </section>

        {/* ── CTA ────────────────────────────────────── */}
        <section style={{ background: 'linear-gradient(135deg, var(--primary) 0%, var(--accent) 100%)', padding: '4rem 2rem', textAlign: 'center' }}>
          <div style={{ maxWidth: '44rem', margin: '0 auto' }}>
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(1.5rem, 3vw, 2rem)', fontWeight: 800, color: '#fff', marginBottom: '1rem' }}>
              Ready to Transform Your Life?
            </h2>
            <p style={{ color: 'rgba(255,255,255,0.9)', marginBottom: '2rem', lineHeight: 1.7 }}>
              Join Atrevido Fitness today and become part of our empowering community.
              Your first week is on us!
            </p>
            <Btn variant="secondary" size="lg">
              Claim Your Free Trial
              <ChevronRight size={18} />
            </Btn>
          </div>
        </section>

        {/* ── Footer ─────────────────────────────────── */}
        <footer style={{ borderTop: '1px solid var(--border)', background: 'var(--card)', padding: '2rem' }}>
          <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: '1rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Dumbbell size={20} color="var(--primary)" />
              <span style={{ fontWeight: 700, color: 'var(--foreground)', fontFamily: 'var(--font-display)' }}>Atrevido Fitness</span>
            </div>
            <p style={{ fontSize: '0.875rem', color: 'var(--muted-foreground)' }}>
              © 2026 Atrevido Fitness. All rights reserved.
            </p>
          </div>
        </footer>
      </main>

      {/* Responsive layout helpers */}
      <style>{`
        .main-content {
          margin-left: 0;
          padding-left: 0;
          position: relative;
          z-index: 0;
        }
        @media (min-width: 1024px) {
          .main-content {
            margin-left: 16rem;
          }
        }
        @media (min-width: 1024px) {
          .stats-grid {
            grid-template-columns: repeat(4, 1fr) !important;
          }
          .stats-grid > div {
            border-bottom: none !important;
          }
          .stats-grid > div:nth-child(2) {
            border-right: 1px solid var(--border) !important;
          }
          .stats-grid > div:nth-child(4) {
            border-right: none !important;
          }
        }
      `}</style>
    </div>
  )
}