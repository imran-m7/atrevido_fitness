import React from 'react'
import { Link } from 'react-router-dom'
import { Users, Calendar, Trophy, BookOpen, Salad, Clock, TrendingUp, ArrowRight, Plus } from 'lucide-react'

const stats = [
  { title: 'Ukupno Članova',       value: '127', change: '+5 ovaj mjesec',        icon: Users,     trend: 'up' },
  { title: "Današnji Treninzi",    value: '8',   change: '3 završena',           icon: Calendar,  trend: null },
  { title: 'Aktivni Izazovi',   value: '3',   change: '45 članova',       icon: Trophy,    trend: null },
]

const upcomingSessions = [
  { time: '5:30 PM', name: 'HIIT Training', group: 'Grupa 1', registered: 10, capacity: 12 },
  { time: '7:00 PM', name: 'Yoga Flow',     group: 'Grupa 2', registered: 13, capacity: 15 },
  { time: '7:00 PM', name: 'Pilates',       group: 'Grupa 2', registered: 7,  capacity: 12 },
]

const recentMembers = [
  { name: 'Amanda Wilson',  email: 'amanda@email.com',   subscription: 'Individualni trening + Ishrana', joined: 'prije 2 dana' },
  { name: 'Michelle Chen',  email: 'michelle@email.com', subscription: 'Grupni trening',         joined: 'prije 3 dana' },
  { name: 'Rachel Adams',   email: 'rachel@email.com',   subscription: 'Individualni trening',             joined: 'prije 5 dana' },
]

const quickActions = [
  { label: 'Upravljanje Treninzima',  href: '/admin/trainings',  icon: Calendar },
  { label: 'Upravljanje Članovima',    href: '/admin/members',    icon: Users },
  { label: 'Upravljanje Napretkom',   href: '/admin/progress',   icon: TrendingUp },
  { label: 'Upravljanje Izazovima', href: '/admin/challenges', icon: Trophy },
    { label: 'Upravljanje Ishranom',  href: '/admin/nutrition',  icon: Salad },
  { label: 'Upravljanje Blogovima',     href: '/admin/blog',       icon: BookOpen },
]

const activeChallenges = [
  { title: '30-Day Fitness Challenge',  dates: 'March 1 - March 30, 2024',     participants: 45, progress: 65 },
  { title: 'Spring Strength Challenge', dates: 'March 15 - April 26, 2024',    participants: 28, progress: 25 },
]

export default function AdminDashboard() {
  return (
    <div className="p-4 lg:p-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-foreground lg:text-3xl">Dobrodošli nazad, Dika Hodžić-Afaneh!</h1>
        <p className="text-muted-foreground">Ovdje je vaš pregled sistema.</p>
      </div>

      {/* Stats */}
      <div className="mb-8 grid gap-4 md:grid-cols-2 lg:grid-cols-3 w-fit mx-auto">
        {stats.map((stat) => {
          const Icon = stat.icon
          return (
            <div key={stat.title} className="rounded-lg border border-border bg-card p-5 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">{stat.title}</p>
                  <p className="text-3xl font-bold text-foreground">{stat.value}</p>
                  <p className={`text-sm ${stat.trend === 'up' ? 'text-green-600' : 'text-muted-foreground'}`}>
                    {stat.change}
                  </p>
                </div>
                <div className="flex h-14 w-14 items-center justify-center rounded-full bg-primary/10">
                  <Icon size={28} className="text-primary" />
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {/* Quick Actions */}
      <div className="mb-8">
        <h2 className="mb-4 text-lg font-semibold text-foreground">Brzo Upravljanje</h2>
        <div className="flex flex-wrap gap-3">
          {quickActions.map((action) => {
            const Icon = action.icon
            return (
              <Link
                key={action.label}
                to={action.href}
                className="inline-flex items-center gap-2 rounded-lg border border-border px-4 py-2 text-sm font-medium text-foreground hover:bg-muted transition-colors"
              >
                <Icon size={16} />
                {action.label}
              </Link>
            )
          })}
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Upcoming Sessions */}
        <div className="rounded-lg border border-border bg-card shadow-sm">
          <div className="flex items-center justify-between p-5 border-b border-border">
            <div className="flex items-center gap-2">
              <Clock size={20} className="text-primary" />
              <h3 className="font-semibold text-foreground">Nadolazeći Treninzi Danas</h3>
            </div>
            <Link to="/admin/trainings" className="text-sm font-medium text-primary hover:underline">Vidi Sve</Link>
          </div>
          <div className="p-5 space-y-4">
            {upcomingSessions.map((session, i) => (
              <div
                key={i}
                className={`flex items-center justify-between ${i < upcomingSessions.length - 1 ? 'border-b border-border pb-4' : ''}`}
              >
                <div className="flex items-center gap-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 shrink-0">
                    <Calendar size={20} className="text-primary" />
                  </div>
                  <div>
                    <p className="font-medium text-foreground">{session.name}</p>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <span>{session.time}</span>
                      <span className="rounded border border-border px-1.5 py-0.5 text-xs">{session.group}</span>
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-medium text-foreground">{session.registered}/{session.capacity}</p>
                  <p className="text-sm text-muted-foreground">registered</p>
                </div>
              </div>
            ))}
          </div>
        </div>



        {/* Active Challenges */}
        <div className="rounded-lg border border-border bg-card shadow-sm">
          <div className="flex items-center justify-between p-5 border-b border-border">
            <div className="flex items-center gap-2">
              <Trophy size={20} className="text-primary" />
              <h3 className="font-semibold text-foreground">Pregled Aktivnih Izazova</h3>
            </div>
            <Link to="/admin/challenges" className="inline-flex items-center gap-1 text-sm font-medium text-primary hover:underline">
              Upravljanje Izazovima <ArrowRight size={16} />
            </Link>
          </div>
          <div className="p-5">
            <div className="grid gap-6 md:grid-cols-3">
              {activeChallenges.map((c) => (
                <div key={c.title} className="rounded-lg border border-border p-4">
                  <h4 className="font-semibold text-foreground">{c.title}</h4>
                  <p className="mt-1 text-sm text-muted-foreground">{c.dates}</p>
                  <div className="mt-4 flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Učesnici</span>
                    <span className="font-semibold text-foreground">{c.participants}</span>
                  </div>
                  <div className="mt-2">
                    <div className="mb-1 flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Napredak</span>
                      <span className="text-foreground">{c.progress}%</span>
                    </div>
                    <div className="h-2 overflow-hidden rounded-full bg-muted">
                      <div className="h-full bg-primary rounded-full" style={{ width: `${c.progress}%` }} />
                    </div>
                  </div>
                </div>
              ))}
              <div className="flex items-center justify-center rounded-lg border border-dashed border-border p-4">
                <Link
                  to="/admin/challenges"
                  className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
                >
                  <Plus size={16} /> Kreiraj Novi Izazov
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
