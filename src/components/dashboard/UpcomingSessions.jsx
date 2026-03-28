import React from 'react'
import { Calendar, Clock, Users } from 'lucide-react'

const sessions = [
  { title: 'HIIT Training',    date: 'Today',        time: '6:00 PM',  trainer: 'Coach Sarah', spots: '3 spots left', type: 'Group' },
  { title: 'Yoga Flow',        date: 'Tomorrow',     time: '7:00 AM',  trainer: 'Coach Maya',  spots: '5 spots left', type: 'Group' },
  { title: 'Strength Training',date: 'Wed, Mar 19',  time: '5:30 PM',  trainer: 'Coach Sarah', spots: '2 spots left', type: 'Group' },
]

export default function UpcomingSessions() {
  return (
    <div className="rounded-lg border border-border bg-card shadow-sm">
      <div className="flex items-center gap-2 p-5 border-b border-border">
        <Calendar size={20} className="text-primary" />
        <h3 className="font-semibold text-foreground">Upcoming Sessions</h3>
      </div>
      <div className="p-5 space-y-4">
        {sessions.map((session, i) => (
          <div key={i} className="flex items-center justify-between rounded-lg border border-border bg-muted/30 p-4">
            <div className="space-y-1">
              <h4 className="font-semibold text-foreground">{session.title}</h4>
              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                <span className="flex items-center gap-1"><Calendar size={12} />{session.date}</span>
                <span className="flex items-center gap-1"><Clock size={12} />{session.time}</span>
              </div>
              <p className="text-xs text-muted-foreground">{session.trainer}</p>
            </div>
            <div className="text-right space-y-2">
              <span className="inline-flex items-center gap-1 rounded-full bg-primary/10 px-2.5 py-1 text-xs font-medium text-primary">
                <Users size={12} />{session.type}
              </span>
              <p className="text-xs font-medium text-primary">{session.spots}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
