import React from 'react'
import { Link } from 'react-router-dom'
import { Calendar, Trophy, TrendingUp, Plus, Clock, Target, ArrowRight, Scale } from 'lucide-react'
import StatsCards from '../../components/dashboard/StatsCards.jsx'
import UpcomingSessions from '../../components/dashboard/UpcomingSessions.jsx'
import ActiveChallenges from '../../components/dashboard/ActiveChallenges.jsx'
import LeaderboardPreview from '../../components/dashboard/LeaderboardPreview.jsx'
import QuickActions from '../../components/dashboard/QuickActions.jsx'
import RecentBlog from '../../components/dashboard/RecentBlog.jsx'

const nextSession = { name: 'HIIT Training', date: 'Today', time: '5:30 PM', trainer: 'Elena R.', group: 'Group 1' }
const activeChallenges = [
  { name: '30-Day Fitness', progress: 65, daysLeft: 10 },
  { name: 'Spring Strength', progress: 40, daysLeft: 25 },
]
const recentWeights = [
  { date: 'Mar 20', weight: 145 },
  { date: 'Mar 13', weight: 146 },
  { date: 'Mar 6',  weight: 147 },
  { date: 'Feb 28', weight: 148 },
]

export default function MemberDashboard() {
  const weightChange = recentWeights[1].weight - recentWeights[0].weight

  return (
    <div className="p-4 lg:p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-foreground lg:text-3xl">Welcome back, Sarah!</h1>
        <p className="text-muted-foreground">Here's your fitness overview for today.</p>
      </div>

      {/* Quick Actions Buttons */}
      <div className="mb-8 flex flex-wrap gap-3">
        <Link
          to="/member/progress"
          className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground hover:opacity-90 transition-opacity"
        >
          <Plus size={16} /> Add Progress
        </Link>
        <Link
          to="/member/progress"
          className="inline-flex items-center gap-2 rounded-lg border border-border px-4 py-2 text-sm font-medium text-foreground hover:bg-muted transition-colors"
        >
          <TrendingUp size={16} /> View Progress
        </Link>
      </div>

      {/* Stats Cards */}
      <div className="mb-8">
        <StatsCards />
      </div>

      {/* Main Grid */}
      <div className="grid gap-6 lg:grid-cols-2 mb-6">
        {/* Next Session */}
        <div className="rounded-lg border border-border bg-card shadow-sm">
          <div className="flex items-center justify-between p-5 border-b border-border">
            <h3 className="font-semibold text-foreground">Next Training Session</h3>
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
                  <p>Trainer: {nextSession.trainer}</p>
                  <span className="inline-block rounded border border-border px-2 py-0.5 text-xs">{nextSession.group}</span>
                </div>
              </div>
            </div>
            <Link
              to="/member/schedule"
              className="mt-4 flex w-full items-center justify-center gap-2 rounded-lg border border-border px-4 py-2 text-sm font-medium text-foreground hover:bg-muted transition-colors"
            >
              View Full Schedule <ArrowRight size={16} />
            </Link>
          </div>
        </div>

        {/* Challenge Progress */}
        <div className="rounded-lg border border-border bg-card shadow-sm">
          <div className="flex items-center justify-between p-5 border-b border-border">
            <h3 className="font-semibold text-foreground">Challenge Progress</h3>
            <Link to="/member/challenges" className="text-sm font-medium text-primary hover:underline">
              View All
            </Link>
          </div>
          <div className="p-5 space-y-4">
            {activeChallenges.map((c) => (
              <div key={c.name}>
                <div className="mb-1 flex items-center justify-between">
                  <span className="font-medium text-foreground">{c.name}</span>
                  <span className="text-sm text-muted-foreground">{c.daysLeft} days left</span>
                </div>
                <div className="h-2 overflow-hidden rounded-full bg-muted">
                  <div className="h-full bg-primary transition-all rounded-full" style={{ width: `${c.progress}%` }} />
                </div>
                <p className="mt-1 text-sm text-muted-foreground">{c.progress}% complete</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Weight Progress */}
      <div className="rounded-lg border border-border bg-card shadow-sm mb-6">
        <div className="flex items-center justify-between p-5 border-b border-border">
          <h3 className="font-semibold text-foreground">Weight Progress</h3>
          <Link to="/member/progress" className="text-sm font-medium text-primary hover:underline">View Details</Link>
        </div>
        <div className="p-5">
          <div className="flex h-48 items-center justify-center rounded-lg bg-muted/50">
            <div className="text-center text-muted-foreground">
              <TrendingUp size={32} className="mx-auto mb-2" />
              <p>Weight Progress Chart</p>
              <p className="text-sm">Chart visualization would go here</p>
            </div>
          </div>
          <div className="mt-4 grid grid-cols-4 gap-4">
            {recentWeights.map((e) => (
              <div key={e.date} className="text-center">
                <p className="text-sm text-muted-foreground">{e.date}</p>
                <p className="font-semibold text-foreground">{e.weight} lbs</p>
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
