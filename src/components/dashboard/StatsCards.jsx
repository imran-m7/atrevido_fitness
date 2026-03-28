import React from 'react'
import { Flame, Target, Clock, TrendingUp } from 'lucide-react'

const stats = [
  { title: 'Weekly Workouts',  value: '4/5',   description: '1 more to hit your goal', icon: Flame,     trend: '+12%' },
  { title: 'Active Challenges',value: '3',     description: '2 ending this week',      icon: Target,    trend: 'Active' },
  { title: 'Training Hours',   value: '12.5h', description: 'This month',              icon: Clock,     trend: '+8%' },
  { title: 'Progress Score',   value: '85',    description: 'Great progress!',         icon: TrendingUp,trend: '+15%' },
]

export default function StatsCards() {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat) => {
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
  )
}
