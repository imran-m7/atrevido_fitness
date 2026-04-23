import React from 'react'
import { Link } from 'react-router-dom'
import { Calendar, Trophy, TrendingUp, Clock, Target, ArrowRight } from 'lucide-react'
import UpcomingSessions from '../../components/dashboard/UpcomingSessions.jsx'
import ActiveChallenges from '../../components/dashboard/ActiveChallenges.jsx'
import LeaderboardPreview from '../../components/dashboard/LeaderboardPreview.jsx'
import QuickActions from '../../components/dashboard/QuickActions.jsx'
import RecentBlog from '../../components/dashboard/RecentBlog.jsx'

const nextSession = { name: 'HIIT Training', date: 'Danas', time: '16:30', trainer: 'Dika', group: 'Grupa 1' }
const activeChallenges = [
  { name: '30-Day Fitness', progress: 65, daysLeft: 10 },
  { name: 'Spring Strength', progress: 40, daysLeft: 25 },
]
const statsCards = [
  { title: 'Sedmični Treninzi', value: '4/5', description: 'Još 1 trening do cilja', icon: Trophy, trend: '+12%' },
  { title: 'Aktivni Izazovi', value: '3', description: '2 završavaju ovu sedmicu', icon: Target, trend: 'Aktivno' },
  { title: 'Sati Treniranja', value: '12.5h', description: 'Ovaj mjesec', icon: Clock, trend: '+8%' },
]
const recentWeights = [
  { date: '20. mart', weight: 80 },
  { date: '13. mart', weight: 78 },
  { date: '6. mart',  weight: 77 },
  { date: '28. februar', weight: 76 },
]

export default function MemberDashboard() {
  const weightChange = recentWeights[1].weight - recentWeights[0].weight

  return (
    <div className="p-4 lg:p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-foreground lg:text-3xl">Dobro došla nazad, Sarah!</h1>
        <p className="text-muted-foreground">Pregled tvojih aktivnosti za danas</p>
      </div>

      {/* Quick Actions Buttons */}
      <div className="mb-8 flex flex-wrap gap-3">
        <Link
          to="/member/progress"
          className="inline-flex items-center gap-2 rounded-lg border border-border px-4 py-2 text-sm font-medium text-foreground hover:bg-muted transition-colors"
        >
          <TrendingUp size={16} />Pregled napretka
        </Link>
      </div>

      {/* Stats Cards */}
      <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {statsCards.map((stat) => {
          const Icon = stat.icon
          return (
            <div key={stat.title} className="rounded-lg border border-border bg-card p-5 shadow-sm">
              <div className="flex items-center justify-between pb-2">
                <p className="text-sm font-medium text-muted-foreground">{stat.title}</p>
                <div className="rounded-full bg-primary/10 p-2">
                  <Icon size={16} className="text-primary" />
                </div>
              </div>
              <div className="text-2xl font-bold text-foreground">{stat.value}</div>
              <div className="flex items-center justify-between mt-1">
                <p className="text-xs text-muted-foreground">{stat.description}</p>
                <span className="text-xs font-medium text-primary">{stat.trend}</span>
              </div>
            </div>
          )
        })}
      </div>

      {/* Main Grid */}
      <div className="grid gap-6 lg:grid-cols-2 mb-6">
        {/* Next Session */}
        <div className="rounded-lg border border-border bg-card shadow-sm">
          <div className="flex items-center justify-between p-5 border-b border-border">
            <h3 className="font-semibold text-foreground">Sljedeći trening</h3>
            <span className="rounded-full bg-secondary px-3 py-1 text-xs font-medium text-secondary-foreground">
              {nextSession.date}
            </span>
          </div>
          <div className="p-5">
            <div className="flex items-start gap-4">
              <div className="flex h-14 w-14 items-center justify-center rounded-lg bg-primary/10 shrink-0">
                <Calendar size={28} className="text-primary" />
              </div>
              <div className="flex-1">
                <h4 className="font-semibold text-foreground">{nextSession.name}</h4>
                <div className="mt-1 space-y-1 text-sm text-muted-foreground">
                  <p className="flex items-center gap-2"><Clock size={14} />{nextSession.time}</p>
                  <p>Trenerica: {nextSession.trainer}</p>
                  <span className="inline-block rounded border border-border px-2 py-0.5 text-xs">{nextSession.group}</span>
                </div>
              </div>
            </div>
            <Link
              to="/member/schedule"
              className="mt-4 flex w-full items-center justify-center gap-2 rounded-lg border border-border px-4 py-2 text-sm font-medium text-foreground hover:bg-muted transition-colors"
            >
              Pregled čitavog rasporeda <ArrowRight size={16} />
            </Link>
          </div>
        </div>

        {/* Challenge Progress */}
        <div className="rounded-lg border border-border bg-card shadow-sm">
          <div className="flex items-center justify-between p-5 border-b border-border">
            <h3 className="font-semibold text-foreground">Napredak izazova</h3>
            <Link to="/member/challenges" className="text-sm font-medium text-primary hover:underline">
              Pregled svih izazova
            </Link>
          </div>
          <div className="p-5 space-y-4">
            {activeChallenges.map((c) => (
              <div key={c.name}>
                <div className="mb-1 flex items-center justify-between">
                  <span className="font-medium text-foreground">{c.name}</span>
                  <span className="text-sm text-muted-foreground">{c.daysLeft} dana preostalo</span>
                </div>
                <div className="h-2 overflow-hidden rounded-full bg-muted">
                  <div className="h-full bg-primary transition-all rounded-full" style={{ width: `${c.progress}%` }} />
                </div>
                <p className="mt-1 text-sm text-muted-foreground">{c.progress}% završeno</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Weight Progress */}
      <div className="rounded-lg border border-border bg-card shadow-sm mb-6">
        <div className="flex items-center justify-between p-5 border-b border-border">
          <h3 className="font-semibold text-foreground">Napredak težine</h3>
          <Link to="/member/progress" className="text-sm font-medium text-primary hover:underline">Pregled detalja</Link>
        </div>
        <div className="p-5">
          <div className="flex h-48 items-center justify-center rounded-lg bg-muted/50">
            <div className="text-center text-muted-foreground">
              <TrendingUp size={32} className="mx-auto mb-2" />
              <p>Chart napretka težine</p>
              <p className="text-sm">Vizualizacija charta bi ovdje bila</p>
            </div>
          </div>
          <div className="mt-4 grid grid-cols-4 gap-4">
            {recentWeights.map((e) => (
              <div key={e.date} className="text-center">
                <p className="text-sm text-muted-foreground">{e.date}</p>
                <p className="font-semibold text-foreground">{e.weight} kg</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom Grid */}
      <div className="grid gap-6 lg:grid-cols-2 mb-6">
        <UpcomingSessions />
        <ActiveChallenges />
      </div>
      <div className="grid gap-6 lg:grid-cols-2">
        <QuickActions />
        <RecentBlog />
      </div>
    </div>
  )
}
