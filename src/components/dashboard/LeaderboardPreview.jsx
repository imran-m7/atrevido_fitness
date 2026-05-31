import React from 'react'
import { Medal, Crown, Award } from 'lucide-react'

const topMembers = [
  { name: 'Emma Wilson',  points: 2450, rank: 1 },
  { name: 'Sofia Garcia', points: 2380, rank: 2 },
  { name: 'Olivia Chen',  points: 2290, rank: 3 },
  { name: 'Ava Johnson',  points: 2150, rank: 4 },
  { name: 'You',          points: 1980, rank: 5, isUser: true },
]

function RankIcon({ rank }) {
  if (rank === 1) return <Crown size={16} className="text-yellow-500" />
  if (rank === 2) return <Medal size={16} className="text-gray-400" />
  if (rank === 3) return <Award size={16} className="text-amber-600" />
  return <span className="w-4 text-center text-xs font-bold text-muted-foreground">{rank}</span>
}

export default function LeaderboardPreview() {
  return (
    <div className="rounded-lg border border-border bg-card shadow-sm">
      <div className="flex items-center gap-2 p-5 border-b border-border">
        <Medal size={20} className="text-primary" />
        <h3 className="font-semibold text-foreground">Leaderboard</h3>
      </div>
      <div className="p-5 space-y-3">
        {topMembers.map((member) => (
          <div
            key={member.rank}
            className={[
              'flex items-center justify-between rounded-lg p-3',
              member.isUser ? 'bg-primary/10 border border-primary/30' : 'bg-muted/30',
            ].join(' ')}
          >
            <div className="flex items-center gap-3">
              <div className="flex h-8 w-8 items-center justify-center">
                <RankIcon rank={member.rank} />
              </div>
              <span className={`text-sm font-medium ${member.isUser ? 'text-primary' : 'text-foreground'}`}>
                {member.name}
              </span>
            </div>
            <span className="text-sm font-semibold text-muted-foreground">
              {member.points.toLocaleString()} pts
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}
