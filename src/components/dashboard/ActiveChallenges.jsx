import React from 'react'
import { Trophy, Flame, Footprints } from 'lucide-react'

const challenges = [
  { title: '30-Day Plank Challenge', icon: Flame, color: 'text-orange-500' },
  { title: '10K Steps Daily', icon: Footprints, color: 'text-blue-500' },
  { title: 'Hydration Hero', icon: Trophy, color: 'text-yellow-500' },
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
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
