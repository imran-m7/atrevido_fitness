import React from 'react'
import { Trophy, Calendar, Users, Target, Medal, Flame, CheckCircle2 } from 'lucide-react'

const activeChallenges = [
  { id: 1, title: '30-Day Fitness Challenge',  description: 'Complete 30 days of consistent workouts and track your progress.', startDate: 'March 1, 2024',  endDate: 'March 30, 2024',  progress: 65, daysCompleted: 20, totalDays: 30, rank: 8,  totalParticipants: 45 },
  { id: 2, title: 'Spring Strength Challenge', description: 'Focus on building strength over 6 weeks with progressive overload training.', startDate: 'March 15, 2024', endDate: 'April 26, 2024', progress: 40, daysCompleted: 10, totalDays: 42, rank: 12, totalParticipants: 28 },
]

const availableChallenges = [
  { id: 3, title: 'Team Cardio Blitz', description: 'Join a team and compete in total cardio minutes.', startDate: 'April 1, 2024', endDate: 'April 30, 2024', participants: 60, type: 'Team' },
]

const leaderboard = [
  { rank: 1,  name: 'Maria S.',    points: 2850, isCurrentUser: false },
  { rank: 2,  name: 'Jennifer K.', points: 2720, isCurrentUser: false },
  { rank: 3,  name: 'Amanda R.',   points: 2680, isCurrentUser: false },
  { rank: 4,  name: 'Michelle T.', points: 2550, isCurrentUser: false },
  { rank: 5,  name: 'Lisa P.',     points: 2480, isCurrentUser: false },
  { rank: 6,  name: 'Nicole W.',   points: 2350, isCurrentUser: false },
  { rank: 7,  name: 'Emily D.',    points: 2290, isCurrentUser: false },
  { rank: 8,  name: 'Sarah J.',    points: 2150, isCurrentUser: true  },
  { rank: 9,  name: 'Rachel M.',   points: 2080, isCurrentUser: false },
  { rank: 10, name: 'Karen L.',    points: 1950, isCurrentUser: false },
]

function RankBadge({ rank }) {
  const base = 'flex h-8 w-8 items-center justify-center rounded-full text-sm font-medium'
  if (rank === 1) return <div className={`${base} bg-yellow-100 text-yellow-600`}><Medal size={16} /></div>
  if (rank === 2) return <div className={`${base} bg-gray-100 text-gray-600`}><Medal size={16} /></div>
  if (rank === 3) return <div className={`${base} bg-orange-100 text-orange-600`}><Medal size={16} /></div>
  return <div className={`${base} bg-muted text-muted-foreground`}>{rank}</div>
}

export default function MemberChallenges() {
  return (
    <div className="p-4 lg:p-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-foreground lg:text-3xl">Challenges</h1>
        <p className="text-muted-foreground">Track your challenges and compete on the leaderboard</p>
      </div>

      <div className="grid gap-8 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">

          {/* Active */}
          <div>
            <h2 className="mb-4 text-xl font-semibold text-foreground">My Active Challenges</h2>
            <div className="grid gap-4">
              {activeChallenges.map((c) => (
                <div key={c.id} className="rounded-lg border border-border bg-card shadow-sm p-5">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <span className="inline-flex items-center gap-1 rounded-full bg-green-100 px-2.5 py-1 text-xs font-medium text-green-700 mb-2">
                        <CheckCircle2 size={12} /> Joined
                      </span>
                      <h3 className="text-lg font-semibold text-foreground">{c.title}</h3>
                    </div>
                    <div className="text-right shrink-0 ml-4">
                      <p className="text-2xl font-bold text-primary">#{c.rank}</p>
                      <p className="text-xs text-muted-foreground">of {c.totalParticipants}</p>
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground mb-4">{c.description}</p>
                  <div className="flex items-center gap-1 text-sm text-muted-foreground mb-4">
                    <Calendar size={14} /> {c.startDate} – {c.endDate}
                  </div>
                  <div className="flex items-center justify-between text-sm mb-1">
                    <span className="text-muted-foreground">Progress</span>
                    <span className="font-medium text-foreground">{c.daysCompleted}/{c.totalDays} days</span>
                  </div>
                  <div className="h-3 overflow-hidden rounded-full bg-muted">
                    <div className="h-full bg-primary rounded-full" style={{ width: `${c.progress}%` }} />
                  </div>
                  <p className="mt-1 text-sm text-muted-foreground">{c.progress}% complete</p>
                </div>
              ))}
            </div>
          </div>

          {/* Available */}
          <div>
            <h2 className="mb-4 text-xl font-semibold text-foreground">Available Challenges</h2>
            <div className="grid gap-4">
              {availableChallenges.map((c) => (
                <div key={c.id} className="rounded-lg border border-border bg-card shadow-sm p-5">
                  <div className="flex items-center justify-between mb-2">
                    <span className="rounded-full bg-secondary px-3 py-1 text-xs font-medium text-secondary-foreground">{c.type}</span>
                    <span className="flex items-center gap-1 text-sm text-muted-foreground"><Users size={14} />{c.participants} joined</span>
                  </div>
                  <h3 className="text-lg font-semibold text-foreground mb-2">{c.title}</h3>
                  <p className="text-sm text-muted-foreground mb-4">{c.description}</p>
                  <div className="flex items-center gap-1 text-sm text-muted-foreground mb-4">
                    <Calendar size={14} /> {c.startDate} – {c.endDate}
                  </div>
                  <button className="flex w-full items-center justify-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground hover:opacity-90 transition-opacity">
                    <Target size={16} /> Join Challenge
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Leaderboard */}
        <div>
          <div className="rounded-lg border border-border bg-card shadow-sm">
            <div className="p-5 border-b border-border">
              <div className="flex items-center gap-2 mb-1">
                <Trophy size={20} className="text-primary" />
                <h3 className="font-semibold text-foreground">Leaderboard</h3>
              </div>
              <p className="text-sm text-muted-foreground">30-Day Fitness Challenge</p>
            </div>
            <div>
              {leaderboard.map((entry, i) => (
                <div
                  key={entry.rank}
                  className={[
                    'flex items-center justify-between px-4 py-3',
                    i < leaderboard.length - 1 ? 'border-b border-border' : '',
                    entry.isCurrentUser ? 'bg-primary/5' : '',
                  ].join(' ')}
                >
                  <div className="flex items-center gap-3">
                    <RankBadge rank={entry.rank} />
                    <p className={`text-sm font-medium ${entry.isCurrentUser ? 'text-primary' : 'text-foreground'}`}>
                      {entry.name} {entry.isCurrentUser && '(You)'}
                    </p>
                  </div>
                  <div className="flex items-center gap-1">
                    <Flame size={16} className="text-primary" />
                    <span className="font-semibold text-foreground">{entry.points.toLocaleString()}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
