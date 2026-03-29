import React from 'react'
import { Link } from 'react-router-dom'
import { Users, Calendar, Trophy, BookOpen, Salad, Clock, TrendingUp, ArrowRight, Plus } from 'lucide-react'

const stats = [
  { title: 'Total Members',       value: '127', change: '+5 this month',        icon: Users,     trend: 'up' },
  { title: "Today's Sessions",    value: '8',   change: '3 completed',           icon: Calendar,  trend: null },
  { title: 'Active Challenges',   value: '3',   change: '45 participants',       icon: Trophy,    trend: null },
  { title: 'Weekly Registrations',value: '34',  change: '+12% vs last week',     icon: TrendingUp,trend: 'up' },
]

const upcomingSessions = [
  { time: '5:30 PM', name: 'HIIT Training', group: 'Group 1', registered: 10, capacity: 12 },
  { time: '7:00 PM', name: 'Yoga Flow',     group: 'Group 2', registered: 13, capacity: 15 },
  { time: '7:00 PM', name: 'Pilates',       group: 'Group 2', registered: 7,  capacity: 12 },
]

const recentMembers = [
  { name: 'Amanda Wilson',  email: 'amanda@email.com',   subscription: 'Individual + Nutrition', joined: '2 days ago' },
  { name: 'Michelle Chen',  email: 'michelle@email.com', subscription: 'Group Training',         joined: '3 days ago' },
  { name: 'Rachel Adams',   email: 'rachel@email.com',   subscription: 'Individual',             joined: '5 days ago' },
]

const quickActions = [
  { label: 'Manage Trainings',  href: '/admin/trainings',  icon: Calendar },
  { label: 'Manage Members',    href: '/admin/members',    icon: Users },
  { label: 'Manage Challenges', href: '/admin/challenges', icon: Trophy },
  { label: 'Add Blog Post',     href: '/admin/blog',       icon: BookOpen },
  { label: 'Manage Nutrition',  href: '/admin/nutrition',  icon: Salad },
]

const activeChallenges = [
  { title: '30-Day Fitness Challenge',  dates: 'March 1 - March 30, 2024',     participants: 45, progress: 65 },
  { title: 'Spring Strength Challenge', dates: 'March 15 - April 26, 2024',    participants: 28, progress: 25 },
]

export default function AdminDashboard() {
  return (
    <div className="p-4 lg:p-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-foreground lg:text-3xl">Admin Dashboard</h1>
        <p className="text-muted-foreground">Welcome back, Elena. Here's your system overview.</p>
      </div>

      {/* Stats */}
      <div className="mb-8 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
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
        <h2 className="mb-4 text-lg font-semibold text-foreground">Quick Actions</h2>
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
              <h3 className="font-semibold text-foreground">Upcoming Sessions Today</h3>
            </div>
            <Link to="/admin/trainings" className="text-sm font-medium text-primary hover:underline">View All</Link>
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

        {/* Recent Members */}
        <div className="rounded-lg border border-border bg-card shadow-sm">
          <div className="flex items-center justify-between p-5 border-b border-border">
            <div className="flex items-center gap-2">
              <Users size={20} className="text-primary" />
              <h3 className="font-semibold text-foreground">Recent Members</h3>
            </div>
            <Link to="/admin/members" className="text-sm font-medium text-primary hover:underline">View All</Link>
          </div>
          <div className="p-5 space-y-4">
            {recentMembers.map((member, i) => (
              <div
                key={member.email}
                className={`flex items-center justify-between ${i < recentMembers.length - 1 ? 'border-b border-border pb-4' : ''}`}
              >
                <div className="flex items-center gap-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 shrink-0">
                    <Users size={20} className="text-primary" />
                  </div>
                  <div>
                    <p className="font-medium text-foreground">{member.name}</p>
                    <p className="text-sm text-muted-foreground">{member.email}</p>
                  </div>
                </div>
                <div className="text-right">
                  <span className="inline-block rounded-full bg-secondary px-2.5 py-1 text-xs font-medium text-secondary-foreground">
                    {member.subscription}
                  </span>
                  <p className="mt-1 text-xs text-muted-foreground">{member.joined}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Active Challenges */}
        <div className="rounded-lg border border-border bg-card shadow-sm lg:col-span-2">
          <div className="flex items-center justify-between p-5 border-b border-border">
            <div className="flex items-center gap-2">
              <Trophy size={20} className="text-primary" />
              <h3 className="font-semibold text-foreground">Active Challenge Overview</h3>
            </div>
            <Link to="/admin/challenges" className="inline-flex items-center gap-1 text-sm font-medium text-primary hover:underline">
              Manage Challenges <ArrowRight size={16} />
            </Link>
          </div>
          <div className="p-5">
            <div className="grid gap-6 md:grid-cols-3">
              {activeChallenges.map((c) => (
                <div key={c.title} className="rounded-lg border border-border p-4">
                  <h4 className="font-semibold text-foreground">{c.title}</h4>
                  <p className="mt-1 text-sm text-muted-foreground">{c.dates}</p>
                  <div className="mt-4 flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Participants</span>
                    <span className="font-semibold text-foreground">{c.participants}</span>
                  </div>
                  <div className="mt-2">
                    <div className="mb-1 flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Progress</span>
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
                  <Plus size={16} /> Create New Challenge
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
