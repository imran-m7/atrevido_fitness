import React from 'react'
import { Plus, Edit, Trash2, Users, Calendar, Trophy, Eye } from 'lucide-react'

const challenges = [
  { id: 1, title: '30-Day Fitness Challenge',  status: 'Active',    startDate: 'March 1, 2024',   endDate: 'March 30, 2024',  participants: 45, progress: 65,  type: 'Consistency' },
  { id: 2, title: 'Spring Strength Challenge', status: 'Active',    startDate: 'March 15, 2024',  endDate: 'April 26, 2024',  participants: 28, progress: 25,  type: 'Strength' },
  { id: 3, title: 'Team Cardio Blitz',         status: 'Upcoming',  startDate: 'April 1, 2024',   endDate: 'April 30, 2024',  participants: 60, progress: 0,   type: 'Team Cardio' },
  { id: 4, title: 'New Year Challenge',        status: 'Completed', startDate: 'January 1, 2024', endDate: 'January 31, 2024',participants: 52, progress: 100, type: 'Consistency' },
]

const statusColors = {
  Active:    'bg-green-100 text-green-700',
  Upcoming:  'bg-blue-100 text-blue-700',
  Completed: 'bg-gray-100 text-gray-700',
}

const statCards = [
  { label: 'Total Challenges',   value: '4',   bg: 'bg-primary/10', color: 'text-primary',      icon: Trophy },
  { label: 'Active',             value: '2',   bg: 'bg-green-100',  color: 'text-green-600',    icon: Trophy },
  { label: 'Total Participants', value: '133', bg: 'bg-purple-100', color: 'text-purple-600',   icon: Users },
]

export default function AdminChallenges() {
  return (
    <div className="p-4 lg:p-8">
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground lg:text-3xl">Manage Challenges</h1>
          <p className="text-muted-foreground">Create and manage fitness challenges</p>
        </div>
        <button className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground hover:opacity-90 transition-opacity">
          <Plus size={16} /> Create Challenge
        </button>
      </div>

      {/* Stats */}
      <div className="mb-6 grid gap-4 md:grid-cols-3 w-fit mx-auto">
        {statCards.map(({ label, value, bg, color, icon: Icon }) => (
          <div key={label} className="rounded-lg border border-border bg-card p-5 shadow-sm">
            <div className="flex items-center gap-3">
              <div className={`flex h-10 w-10 items-center justify-center rounded-full ${bg}`}>
                <Icon size={20} className={color} />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">{value}</p>
                <p className="text-sm text-muted-foreground">{label}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Challenges List */}
      <div className="grid gap-6">
        {challenges.map((c) => (
          <div key={c.id} className="rounded-lg border border-border bg-card shadow-sm p-5">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
              <div className="flex items-start gap-4">
                <div className="flex h-14 w-14 items-center justify-center rounded-lg bg-primary/10 shrink-0">
                  <Trophy size={28} className="text-primary" />
                </div>
                <div>
                  <div className="flex flex-wrap items-center gap-2 mb-2">
                    <h3 className="font-semibold text-foreground">{c.title}</h3>
                    <span className={`rounded-full px-2.5 py-1 text-xs font-medium ${statusColors[c.status]}`}>{c.status}</span>
                    <span className="rounded border border-border px-2 py-0.5 text-xs text-muted-foreground">{c.type}</span>
                  </div>
                  <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground mb-3">
                    <span className="flex items-center gap-1"><Calendar size={14} />{c.startDate} – {c.endDate}</span>
                    <span className="flex items-center gap-1"><Users size={14} />{c.participants} participants</span>
                  </div>
                  {c.status !== 'Upcoming' && (
                    <div className="w-64">
                      <div className="mb-1 flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">Progress</span>
                        <span className="text-foreground">{c.progress}%</span>
                      </div>
                      <div className="h-2 overflow-hidden rounded-full bg-muted">
                        <div className="h-full bg-primary rounded-full" style={{ width: `${c.progress}%` }} />
                      </div>
                    </div>
                  )}
                </div>
              </div>
              <div className="flex flex-wrap gap-2">
                <button className="inline-flex items-center gap-2 rounded-lg border border-border px-3 py-2 text-sm font-medium text-foreground hover:bg-muted transition-colors">
                  <Eye size={14} /> View Participants
                </button>
                <button className="inline-flex items-center gap-2 rounded-lg border border-border px-3 py-2 text-sm font-medium text-foreground hover:bg-muted transition-colors">
                  <Edit size={14} /> Edit
                </button>
                {c.status !== 'Active' && (
                  <button className="inline-flex items-center gap-2 rounded-lg border border-border px-3 py-2 text-sm font-medium text-destructive hover:bg-muted transition-colors">
                    <Trash2 size={14} /> Delete
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
