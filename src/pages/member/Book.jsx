import React, { useState } from 'react'
import { Clock, Users, CheckCircle2 } from 'lucide-react'

const initialSessions = [
  {
    day: 'Utorak', date: '26. mart',
    sessions: [
      { time: '6:00 AM',  name: 'Spin Class',        group: 'Grupa 1', spots: 20, available: 5,  booked: false },
      { time: '10:00 AM', name: 'Low Impact Cardio',  group: 'Grupa 2', spots: 15, available: 9,  booked: false },
      { time: '5:30 PM',  name: 'HIIT Training',      group: 'Grupa 1', spots: 12, available: 1,  booked: true  },
      { time: '7:00 PM',  name: 'Yoga Flow',          group: 'Grupa 2', spots: 15, available: 3,  booked: false },
    ],
  },
  {
    day: 'Srijeda', date: '27. mart',
    sessions: [
      { time: '6:00 AM',  name: 'Strength Training',  group: 'Grupa 1', spots: 10, available: 4,  booked: false },
      { time: '9:00 AM',  name: 'Pilates',            group: 'Grupa 2', spots: 12, available: 4,  booked: false },
      { time: '12:00 PM', name: 'Express HIIT',       group: 'Grupa 1', spots: 15, available: 5,  booked: false },
      { time: '6:00 PM',  name: 'Full Body Workout',  group: 'Grupa 2', spots: 12, available: 3,  booked: true  },
    ],
  },
  {
    day: 'Četvrtak', date: '28. mart',
    sessions: [
      { time: '6:00 AM',  name: 'Spin Class',         group: 'Grupa 1', spots: 20, available: 2,  booked: false },
      { time: '10:00 AM', name: 'Gentle Yoga',         group: 'Grupa 2', spots: 15, available: 8,  booked: false },
      { time: '5:30 PM',  name: 'Strength Training',  group: 'Grupa 1', spots: 10, available: 2,  booked: false },
      { time: '7:00 PM',  name: 'Dance Fitness',      group: 'Grupa 2', spots: 20, available: 4,  booked: false },
    ],
  },
  {
    day: 'Petak', date: '29. mart',
    sessions: [
      { time: '6:00 AM',  name: 'HIIT Training',      group: 'Grupa 1', spots: 12, available: 3,  booked: false },
      { time: '9:00 AM',  name: 'Barre',              group: 'Grupa 2', spots: 12, available: 2,  booked: false },
      { time: '12:00 PM', name: 'Pilates',            group: 'Grupa 1', spots: 12, available: 7,  booked: false },
      { time: '5:00 PM',  name: 'Friday Burn',        group: 'Grupa 2', spots: 15, available: 1,  booked: true  },
    ],
  },
]

export default function MemberBook() {
  const [days, setDays] = useState(initialSessions)
  const [selectedDay, setSelectedDay] = useState(initialSessions[0].day)

  const currentWeekLabel = '25. mart - 31. mart'
  const weekTabs = ['Ponedjeljak', 'Utorak', 'Srijeda', 'Četvrtak', 'Petak', 'Subota', 'Nedjelja']
  const dayDates = {
    Ponedjeljak: '25. mart',
    Utorak: '26. mart',
    Srijeda: '27. mart',
    Četvrtak: '28. mart',
    Petak: '29. mart',
    Subota: '30. mart',
    Nedjelja: '31. mart',
  }
  const selectedDayIndex = days.findIndex((day) => day.day === selectedDay)
  const currentDay = selectedDayIndex !== -1
    ? days[selectedDayIndex]
    : { day: selectedDay, date: dayDates[selectedDay] || '', sessions: [] }


  const toggleBook = (dayIdx, sessionIdx) => {
    setDays(prev => prev.map((d, di) => di !== dayIdx ? d : {
      ...d,
      sessions: d.sessions.map((s, si) => si !== sessionIdx ? s : {
        ...s,
        booked: !s.booked,
        available: s.booked ? s.available + 1 : s.available - 1,
      }),
    }))
  }

  return (
    <div className="p-4 lg:p-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-foreground lg:text-3xl">Rezervacija treninga</h1>
        <p className="text-muted-foreground">Rezervišite dostupne grupe treninga</p>
      </div>

      <div className="mb-6">
        <div className="rounded-lg border border-border bg-card p-4 shadow-sm">
          <p className="text-sm font-medium text-muted-foreground">Ova sedmica</p>
          <p className="mt-1 text-lg font-semibold text-foreground">{currentWeekLabel}</p>
        </div>
      </div>

      <div className="mb-6 flex flex-wrap gap-2">
          {weekTabs.map((day) => (
            <button
              key={day}
              type="button"
              onClick={() => setSelectedDay(day)}
              className={`rounded-full px-4 py-2 text-sm font-medium transition ${
                selectedDay === day
                  ? 'bg-primary text-primary-foreground'
                  : 'border border-border bg-card text-foreground hover:bg-muted'
              }`}
            >
              {day}
            </button>
          ))}
      </div>

      <div className="grid gap-6">
        <div className="rounded-lg border border-border bg-card shadow-sm">
          <div className="flex items-center justify-between p-4 border-b border-border">
            <h3 className="font-semibold text-foreground">
              {`${currentDay.day}${currentDay.date ? `, ${currentDay.date}` : ''}`}
            </h3>
            <span className="text-sm text-muted-foreground">
              {currentDay.sessions.length === 0 ? 'Nema zakazanih treninga' : ''}
            </span>
          </div>
          <div className="p-4">
            <div className="grid gap-3 md:grid-cols-2">
              {currentDay.sessions.length > 0 ? currentDay.sessions.map((session, sessionIdx) => {
                const isFull = session.available === 0 && !session.booked
                return (
                  <div
                    key={sessionIdx}
                    className={[
                      'rounded-lg border p-4',
                      session.booked ? 'border-primary bg-primary/5' : 'border-border',
                    ].join(' ')}
                  >
                    <div className="mb-3 flex items-center justify-between">
                      <span className="rounded border border-border px-2 py-0.5 text-xs font-medium text-foreground">
                        {session.group}
                      </span>
                      {session.booked ? (
                        <span className="inline-flex items-center gap-1 rounded-full bg-green-100 px-2.5 py-1 text-xs font-medium text-green-700">
                          <CheckCircle2 size={12} /> Rezervisano
                        </span>
                      ) : isFull ? (
                        <span className="rounded-full bg-destructive/10 px-2.5 py-1 text-xs font-medium text-destructive">Popunjeno</span>
                      ) : session.available <= 3 ? (
                        <span className="rounded-full bg-secondary px-2.5 py-1 text-xs font-medium text-secondary-foreground">{session.available} mjesta</span>
                      ) : (
                        <span className="rounded-full border border-border px-2.5 py-1 text-xs font-medium text-muted-foreground">{session.available} mjesta</span>
                      )}
                    </div>
                    <h4 className="font-semibold text-foreground">{session.name}</h4>
                    <div className="mt-2 flex items-center gap-4 text-sm text-muted-foreground">
                      <span className="flex items-center gap-1"><Clock size={12} />{session.time}</span>
                      <span className="flex items-center gap-1"><Users size={12} />{session.spots - session.available}/{session.spots}</span>
                    </div>
                    <button
                      onClick={() => toggleBook(selectedDayIndex, sessionIdx)}
                      disabled={isFull}
                      className={[
                        'mt-3 w-full rounded-lg px-3 py-2 text-sm font-medium transition-colors',
                        session.booked
                          ? 'bg-secondary text-secondary-foreground hover:bg-secondary/80'
                          : isFull
                          ? 'bg-muted text-muted-foreground cursor-not-allowed'
                          : 'bg-primary text-primary-foreground hover:opacity-90',
                      ].join(' ')}
                    >
                      {session.booked ? 'Otkaži registraciju' : isFull ? 'Popunjeno' : 'Rezerviši'}
                    </button>
                  </div>
                )
              }) : (
                <p className="py-4 text-center text-muted-foreground">Nema dostupnih treninga za ovaj dan.</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
