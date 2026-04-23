import React, { useState } from 'react'
import { Clock, Users, CheckCircle2 } from 'lucide-react'

const weeklySchedule = [
  { day: 'Ponedjeljak',    date: '25. mart', sessions: [{ time: '17:30', name: 'Strength Training', status: 'booked',    group: 'Grupa 1' }] },
  { day: 'Utorak',   date: '26. mart', sessions: [{ time: '6:00', name: 'HIIT Training',      status: 'completed', group: 'Grupa 1' }] },
  { day: 'Srijeda', date: '27. mart', sessions: [{ time: '17:30', name: 'Full Body Workout',  status: 'booked',    group: 'Grupa 2' }] },
  { day: 'Četvrtak',  date: '28. mart', sessions: [] },
  { day: 'Petak',    date: '29. mart', sessions: [{ time: '17:00', name: 'Friday Burn',        status: 'booked',    group: 'Grupa 2' }] },
  { day: 'Subota',  date: '30. mart', sessions: [] },
  { day: 'Nedelja',    date: '31. mart', sessions: [] },
]

const monthDays = Array.from({ length: 31 }, (_, i) => i + 1)
const monthStartOffset = 4 // March starts on Friday in this example
const weekdays = ['Pon', 'Uto', 'Sre', 'Čet', 'Pet', 'Sub', 'Ned']

export default function MemberSchedule() {
  const [selectedDate, setSelectedDate] = useState(weeklySchedule[0].date)
  const selectedDay = weeklySchedule.find((day) => day.date === selectedDate) || { day: '', date: selectedDate, sessions: [] }

  return (
    <div className="p-4 lg:p-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-foreground lg:text-3xl">Moj raspored</h1>
        <p className="text-muted-foreground">Vaš rezervisani treninzi za ovaj sedmični period</p>
      </div>

      <div className="grid gap-6">
        <div className="rounded-lg border border-border bg-card shadow-sm">
          <div className="flex items-center justify-between p-4 border-b border-border">
            <div>
              <h3 className="font-semibold text-foreground">Kalendar za mart</h3>
              <p className="text-sm text-muted-foreground">Izaberite datum da pregledate vaše rezervisane treninge.</p>
            </div>
            <span className="rounded-full bg-secondary px-3 py-1 text-xs font-medium text-secondary-foreground">
              {selectedDate}
            </span>
          </div>
          <div className="p-4">
            <div className="grid grid-cols-7 gap-2 text-center text-xs uppercase text-muted-foreground">
              {weekdays.map((weekday) => (
                <div key={weekday} className="font-semibold">{weekday}</div>
              ))}
            </div>
            <div className="mt-3 grid grid-cols-7 gap-2">
              {Array.from({ length: monthStartOffset }).map((_, idx) => (
                <div key={`empty-${idx}`} className="h-16 rounded-lg bg-muted/50" />
              ))}
              {monthDays.map((day) => {
                const dateLabel = `${day}. mart`
                const isActive = weeklySchedule.some((entry) => entry.date === dateLabel)
                const isSelected = selectedDate === dateLabel
                return (
                  <button
                    type="button"
                    key={day}
                    onClick={() => setSelectedDate(dateLabel)}
                    className={`flex h-16 flex-col items-center justify-center rounded-lg border px-2 py-3 text-sm transition focus:outline-none ${
                      isSelected
                        ? 'border-primary bg-primary/10 text-foreground'
                        : 'border-border bg-card hover:bg-muted'
                    }`}
                  >
                    <span className="font-medium">{day}</span>
                    {isActive ? <span className="mt-1 h-2 w-2 rounded-full bg-primary" /> : <span className="mt-1 h-2 w-2 rounded-full bg-transparent" />}
                  </button>
                )
              })}
            </div>
          </div>
        </div>

        <div className="rounded-lg border border-border bg-card shadow-sm">
          <div className="flex items-center justify-between p-4 border-b border-border">
            <div>
              <h3 className="font-semibold text-foreground">Treninzi za {selectedDay.date}</h3>
              <p className="text-sm text-muted-foreground">Rezervisani i završeni treninzi za izabrani dan.</p>
            </div>
            <span className="rounded-full bg-secondary px-3 py-1 text-xs font-medium text-secondary-foreground">
              {selectedDay.day}
            </span>
          </div>
          <div className="p-4">
            {selectedDay.sessions.length > 0 ? (
              <div className="space-y-3">
                {selectedDay.sessions.map((session, i) => (
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
                      {session.status === 'completed' ? 'Završeno' : 'Rezervisano'}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="py-4 text-center text-muted-foreground">Nema rezervisanih treninga za ovaj datum.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
