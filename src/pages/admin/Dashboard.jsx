import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Users, Calendar, Trophy, BookOpen, Salad, Clock, TrendingUp, ArrowRight, Plus } from 'lucide-react'

const API_URL = 'https://localhost:7087'

const quickActions = [
  { label: 'Upravljanje treninzima', href: '/admin/trainings', icon: Calendar },
  { label: 'Upravljanje članovima', href: '/admin/members', icon: Users },
  { label: 'Upravljanje napretkom', href: '/admin/progress', icon: TrendingUp },
  { label: 'Upravljanje izazovima', href: '/admin/challenges', icon: Trophy },
  { label: 'Upravljanje ishranom', href: '/admin/nutrition', icon: Salad },
  { label: 'Upravljanje blogovima', href: '/admin/blog', icon: BookOpen },
]

export default function AdminDashboard() {
  const [dashData, setDashData] = useState(null)
  const [sessions, setSessions] = useState([])
  const [challenges, setChallenges] = useState([])
  const token = localStorage.getItem('token')
  const firstName = localStorage.getItem('firstName') || 'Admin'

  // Danas kao dateKey npr "2026-04-29"
  const todayDateKey = new Date().toISOString().split('T')[0]

  useEffect(() => {
    const fetchAll = async () => {
      try {
        const [dashRes, sessionsRes, challengesRes] = await Promise.all([
          fetch(`${API_URL}/api/admin/dashboard`, {
            headers: { 'Authorization': `Bearer ${token}` }
          }),
          fetch(`${API_URL}/api/trainingsessions`, {
            headers: { 'Authorization': `Bearer ${token}` }
          }),
          fetch(`${API_URL}/api/challenges`, {
            headers: { 'Authorization': `Bearer ${token}` }
          })
        ])
        const dash = await dashRes.json()
        const sess = await sessionsRes.json()
        setDashData(dash)
        setSessions(Array.isArray(sess) ? sess : [])
        if (challengesRes.ok) {
          const chall = await challengesRes.json()
          setChallenges(chall.filter(c => c.status === 'Active'))
        }
      } catch (err) {
        console.error('Greška pri učitavanju')
      }
    }
    fetchAll()
  }, [])

  const stats = [
    { title: 'Ukupno članova', value: dashData?.totalMembers ?? '...', change: 'Registrovani članovi', icon: Users, trend: 'up' },
    { title: 'Današnji treninzi', value: dashData?.todaySessions ?? '...', change: 'Termini danas', icon: Calendar, trend: null },
    { title: 'Prijave ove sedmice', value: dashData?.weekRegistrations ?? '...', change: 'Prijave na treninge', icon: Trophy, trend: null },
  ]

  // Filtriraj treninge za danas
  const todayName = new Date().toLocaleDateString('en-US', { weekday: 'long' })
  const todaySessions = sessions.filter(s => s.dayOfWeek === todayName)

  return (
    <div className="p-4 lg:p-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-foreground lg:text-3xl">Dobrodošli nazad, Dika Hodžić-Afaneh!</h1>
        <p className="text-muted-foreground">Ovdje je vaš pregled sistema.</p>
      </div>

      {/* Stats */}
      <div className="mb-8 grid gap-4 md:grid-cols-2 lg:grid-cols-3 w-fit">
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
        <h2 className="mb-4 text-lg font-semibold text-foreground">Brzo upravljanje</h2>
        <div className="flex flex-wrap gap-3">
          {quickActions.map((action) => {
            const Icon = action.icon
            return (
              <Link key={action.label} to={action.href}
                className="inline-flex items-center gap-2 rounded-lg border border-border px-4 py-2 text-sm font-medium text-foreground hover:bg-muted transition-colors">
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
              <h3 className="font-semibold text-foreground">Nadolazeći treninzi danas</h3>
            </div>
            <Link to="/admin/trainings" className="text-sm font-medium text-primary hover:underline">Vidi sve</Link>
          </div>
          <div className="p-5 space-y-4">
            {todaySessions.length > 0 ? todaySessions.map((session, i) => {
              // Broj prijavljenih za danas iz registrations arraya
              const registeredToday = session.registrations?.filter(
                r => r.sessionDate === todayDateKey && r.status === 'Registered'
              ).length ?? 0

              return (
                <div key={session.id}
                  className={`flex items-center justify-between ${i < todaySessions.length - 1 ? 'border-b border-border pb-4' : ''}`}>
                  <div className="flex items-center gap-4">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 shrink-0">
                      <Calendar size={20} className="text-primary" />
                    </div>
                    <div>
                      <p className="font-medium text-foreground">{session.groupName}</p>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <span>{session.startTime?.substring(0, 5)}</span>
                        <span className="rounded border border-border px-1.5 py-0.5 text-xs">
                          {session.type === 'Group' ? 'Grupni' : 'Individualni'}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-medium text-foreground">{registeredToday}/{session.maxCapacity}</p>
                    <p className="text-sm text-muted-foreground">prijavljeno</p>
                  </div>
                </div>
              )
            }) : (
              <p className="text-center text-muted-foreground py-4">Nema treninga danas</p>
            )}
          </div>
        </div>

        {/* Active Challenges */}
        <div className="rounded-lg border border-border bg-card shadow-sm">
          <div className="flex items-center justify-between p-5 border-b border-border">
            <div className="flex items-center gap-2">
              <Trophy size={20} className="text-primary" />
              <h3 className="font-semibold text-foreground">Pregled aktivnih izazova</h3>
            </div>
            <Link to="/admin/challenges"
              className="inline-flex items-center gap-1 text-sm font-medium text-primary hover:underline">
              Upravljanje izazovima <ArrowRight size={16} />
            </Link>
          </div>
          <div className="p-5">
            <div className="grid gap-4 md:grid-cols-2">
              {challenges.length > 0 ? challenges.map((c) => (
                <div key={c.id} className="rounded-lg border border-border p-4">
                  <h4 className="font-semibold text-foreground">{c.title}</h4>
                  <p className="mt-1 text-sm text-muted-foreground">
                    {new Date(c.startDate).toLocaleDateString('bs-BA')} – {new Date(c.endDate).toLocaleDateString('bs-BA')}
                  </p>
                  <div className="mt-4 flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Učesnici</span>
                    <span className="font-semibold text-foreground">{c.participantCount}</span>
                  </div>
                </div>
              )) : (
                <p className="text-muted-foreground text-sm">Nema aktivnih izazova</p>
              )}
              <div className="flex items-center justify-center rounded-lg border border-dashed border-border p-4">
                <Link to="/admin/challenges"
                  className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
                  <Plus size={16} /> Kreiraj novi izazov
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}