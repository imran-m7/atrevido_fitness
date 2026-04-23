import React from 'react'
import { Calendar, Clock, Users } from 'lucide-react'

const sessions = [
  { title: 'HIIT Training',    date: 'Danas',        time: '18:00',  trainer: 'Trenerica Dika', spots: '3 preostala mjesta', type: 'Grupni' },
  { title: 'Yoga Flow',        date: 'Sutra',     time: '7:00',  trainer: 'Trenerica Dika',  spots: '5 preostalih mjesta', type: 'Grupni' },
  { title: 'Strength Training',date: 'Srijeda, 19. mart',  time: '17:30',  trainer: 'Trenerica Dika', spots: '2 preostala mjesta', type: 'Grupni' },
]

export default function UpcomingSessions() {
  return (
    <div className="rounded-lg border border-border bg-card shadow-sm">
      <div className="flex items-center gap-2 p-5 border-b border-border">
        <Calendar size={20} className="text-primary" />
        <h3 className="font-semibold text-foreground">Sljedeći treninzi</h3>
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
