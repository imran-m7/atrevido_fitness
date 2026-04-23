import React from 'react'
import { Trophy, Flame, Footprints } from 'lucide-react'

const challenges = [
  { title: '30-Day Plank Challenge', progress: 73, daysLeft: 8,  icon: Flame,     color: 'text-orange-500' },
  { title: '10K Steps Daily',        progress: 45, daysLeft: 15, icon: Footprints, color: 'text-blue-500' },
  { title: 'Hydration Hero',         progress: 90, daysLeft: 3,  icon: Trophy,    color: 'text-yellow-500' },
]

export default function ActiveChallenges() {
  return (
    <div className="rounded-lg border border-border bg-card shadow-sm">
      <div className="flex items-center gap-2 p-5 border-b border-border">
        <Trophy size={20} className="text-primary" />
        <h3 className="font-semibold text-foreground">Aktivni izazovi</h3>
      </div>
      <div className="p-5 space-y-4">
        {challenges.map((challenge, i) => {
          const Icon = challenge.icon
          return (
            <div key={i} className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Icon size={16} className={challenge.color} />
                  <span className="text-sm font-medium text-foreground">{challenge.title}</span>
                </div>
                <span className="text-xs text-muted-foreground">{challenge.daysLeft} dana preostalo</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="flex-1 h-2 rounded-full bg-muted overflow-hidden">
                  <div
                    className="h-full bg-primary transition-all rounded-full"
                    style={{ width: `${challenge.progress}%` }}
                  />
                </div>
                <span className="text-xs font-medium text-primary w-10 text-right">{challenge.progress}%</span>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
