import React from 'react'
import { Clock, Users, CheckCircle2 } from 'lucide-react'

const weeklySchedule = [
  { day: 'Monday',    date: 'March 25', sessions: [{ time: '5:30 PM', name: 'Strength Training', status: 'booked',    group: 'Group 1' }] },
  { day: 'Tuesday',   date: 'March 26', sessions: [{ time: '6:00 AM', name: 'HIIT Training',      status: 'completed', group: 'Group 1' }] },
  { day: 'Wednesday', date: 'March 27', sessions: [{ time: '5:30 PM', name: 'Full Body Workout',  status: 'booked',    group: 'Group 2' }] },
  { day: 'Thursday',  date: 'March 28', sessions: [] },
  { day: 'Friday',    date: 'March 29', sessions: [{ time: '5:00 PM', name: 'Friday Burn',        status: 'booked',    group: 'Group 2' }] },
  { day: 'Saturday',  date: 'March 30', sessions: [] },
  { day: 'Sunday',    date: 'March 31', sessions: [] },
]

export default function MemberSchedule() {
  return (
    <div className="p-4 lg:p-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-foreground lg:text-3xl">My Schedule</h1>
        <p className="text-muted-foreground">Your booked training sessions for this week</p>
      </div>

      <div className="grid gap-4">
        {weeklySchedule.map((day) => (
          <div key={day.day} className="rounded-lg border border-border bg-card shadow-sm">
            <div className="flex items-center justify-between p-4 border-b border-border">
              <h3 className="font-semibold text-foreground">{day.day}</h3>
              <span className="text-sm text-muted-foreground">{day.date}</span>
            </div>
            <div className="p-4">
              {day.sessions.length > 0 ? (
                <div className="space-y-3">
                  {day.sessions.map((session, i) => (
                    <div
                      key={i}
                      className={[
                        'flex items-center justify-between rounded-lg border p-4',
                        session.status === 'completed' ? 'bg-muted/50 border-border' : 'bg-card border-border',
                      ].join(' ')}
                    >
                      <div className="flex items-center gap-4">
                        <div className={[
                          'flex h-10 w-10 items-center justify-center rounded-lg shrink-0',
                          session.status === 'completed' ? 'bg-green-100' : 'bg-primary/10',
                        ].join(' ')}>
                          {session.status === 'completed'
                            ? <CheckCircle2 size={20} className="text-green-600" />
                            : <Clock size={20} className="text-primary" />
                          }
                        </div>
                        <div>
                          <p className={`font-medium ${session.status === 'completed' ? 'text-muted-foreground' : 'text-foreground'}`}>
                            {session.name}
                          </p>
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <Clock size={12} />{session.time}
                            <Users size={12} className="ml-2" />{session.group}
                          </div>
                        </div>
                      </div>
                      <span className={[
                        'rounded-full px-3 py-1 text-xs font-medium',
                        session.status === 'completed'
                          ? 'bg-secondary text-secondary-foreground'
                          : 'bg-primary text-primary-foreground',
                      ].join(' ')}>
                        {session.status === 'completed' ? 'Completed' : 'Booked'}
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="py-4 text-center text-muted-foreground">No sessions scheduled</p>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
