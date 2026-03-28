import React from 'react'
import { Link } from 'react-router-dom'
import { CalendarPlus, Trophy, Apple, FileText, Zap } from 'lucide-react'

const actions = [
  { title: 'Book Session',   description: 'Schedule your next training', icon: CalendarPlus, to: '/member/book' },
  { title: 'Join Challenge', description: 'Compete with others',         icon: Trophy,       to: '/member/challenges' },
  { title: 'View Meal Plan', description: "Today's nutrition guide",     icon: Apple,        to: '/member/nutrition' },
  { title: 'Read Blog',      description: 'Latest fitness tips',         icon: FileText,     to: '/member/blog' },
]

export default function QuickActions() {
  return (
    <div className="rounded-lg border border-border bg-card shadow-sm">
      <div className="flex items-center gap-2 p-5 border-b border-border">
        <Zap size={20} className="text-primary" />
        <h3 className="font-semibold text-foreground">Quick Actions</h3>
      </div>
      <div className="p-5 grid gap-3 sm:grid-cols-2">
        {actions.map((action) => {
          const Icon = action.icon
          return (
            <Link
              key={action.title}
              to={action.to}
              className="flex flex-col items-start gap-1 rounded-lg border border-border p-4 hover:bg-primary/5 hover:border-primary/30 transition-colors"
            >
              <div className="flex items-center gap-2">
                <Icon size={16} className="text-primary" />
                <span className="font-medium text-sm text-foreground">{action.title}</span>
              </div>
              <span className="text-xs text-muted-foreground">{action.description}</span>
            </Link>
          )
        })}
      </div>
    </div>
  )
}
