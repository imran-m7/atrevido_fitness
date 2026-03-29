import React, { useState } from 'react'
import { Plus, Search, Edit, Trash2, Users, Clock } from 'lucide-react'

const trainingSessions = [
  { id: 1,  name: 'HIIT Training',    type: 'Group', day: 'Monday',    time: '6:00 AM',  duration: '1 hour', registered: 8,  capacity: 12, group: 'Group 1' },
  { id: 2,  name: 'Yoga Flow',        type: 'Group', day: 'Monday',    time: '9:00 AM',  duration: '1 hour', registered: 12, capacity: 15, group: 'Group 2' },
  { id: 3,  name: 'Strength Training',type: 'Group', day: 'Monday',    time: '5:30 PM',  duration: '1 hour', registered: 10, capacity: 10, group: 'Group 1' },
  { id: 4,  name: 'Pilates',          type: 'Group', day: 'Monday',    time: '7:00 PM',  duration: '1 hour', registered: 7,  capacity: 12, group: 'Group 2' },
  { id: 5,  name: 'Spin Class',       type: 'Group', day: 'Tuesday',   time: '6:00 AM',  duration: '1 hour', registered: 15, capacity: 20, group: 'Group 1' },
  { id: 6,  name: 'Low Impact Cardio',type: 'Group', day: 'Tuesday',   time: '10:00 AM', duration: '1 hour', registered: 9,  capacity: 15, group: 'Group 2' },
  { id: 7,  name: 'HIIT Training',    type: 'Group', day: 'Tuesday',   time: '5:30 PM',  duration: '1 hour', registered: 11, capacity: 12, group: 'Group 1' },
  { id: 8,  name: 'Yoga Flow',        type: 'Group', day: 'Tuesday',   time: '7:00 PM',  duration: '1 hour', registered: 13, capacity: 15, group: 'Group 2' },
  { id: 9,  name: 'Strength Training',type: 'Group', day: 'Wednesday', time: '6:00 AM',  duration: '1 hour', registered: 6,  capacity: 10, group: 'Group 1' },
  { id: 10, name: 'Pilates',          type: 'Group', day: 'Wednesday', time: '9:00 AM',  duration: '1 hour', registered: 8,  capacity: 12, group: 'Group 2' },
]

const inputClass = 'w-full rounded-lg border border-input bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring'

export default function AdminTrainings() {
  const [search, setSearch] = useState('')
  const filtered = trainingSessions.filter(s =>
    s.name.toLowerCase().includes(search.toLowerCase()) ||
    s.day.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="p-4 lg:p-8">
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground lg:text-3xl">Manage Trainings</h1>
          <p className="text-muted-foreground">View and manage training sessions</p>
        </div>
        <button className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground hover:opacity-90 transition-opacity">
          <Plus size={16} /> Add Training
        </button>
      </div>

      {/* Search */}
      <div className="mb-6 rounded-lg border border-border bg-card p-4 shadow-sm">
        <div className="flex gap-4">
          <div className="relative flex-1">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <input
              className={inputClass + ' pl-9'}
              placeholder="Search trainings..."
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>
          <button className="rounded-lg border border-border px-4 py-2 text-sm font-medium text-foreground hover:bg-muted transition-colors">
            Filter
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="rounded-lg border border-border bg-card shadow-sm">
        <div className="p-5 border-b border-border">
          <h3 className="font-semibold text-foreground">Training Sessions</h3>
        </div>
        <div className="p-5 overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border">
                {['Training','Type','Day','Time','Registered','Actions'].map((h, i) => (
                  <th key={h} className={`pb-3 text-sm font-medium text-muted-foreground ${i === 5 ? 'text-right' : 'text-left'}`}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((session, i) => {
                const isFull = session.registered >= session.capacity
                return (
                  <tr key={session.id} className={i < filtered.length - 1 ? 'border-b border-border' : ''}>
                    <td className="py-4">
                      <p className="font-medium text-foreground">{session.name}</p>
                      <span className="inline-block mt-1 rounded border border-border px-1.5 py-0.5 text-xs text-muted-foreground">{session.group}</span>
                    </td>
                    <td className="py-4">
                      <span className="rounded-full bg-secondary px-2.5 py-1 text-xs font-medium text-secondary-foreground">{session.type}</span>
                    </td>
                    <td className="py-4 text-sm text-foreground">{session.day}</td>
                    <td className="py-4">
                      <div className="flex items-center gap-1 text-sm text-foreground">
                        <Clock size={12} className="text-muted-foreground" />{session.time}
                      </div>
                      <p className="text-xs text-muted-foreground">{session.duration}</p>
                    </td>
                    <td className="py-4">
                      <div className="flex items-center gap-2">
                        <Users size={16} className="text-muted-foreground" />
                        <span className={`font-medium ${isFull ? 'text-destructive' : 'text-foreground'}`}>
                          {session.registered}/{session.capacity}
                        </span>
                        {isFull && <span className="rounded-full bg-destructive/10 px-2 py-0.5 text-xs font-medium text-destructive">Full</span>}
                      </div>
                    </td>
                    <td className="py-4">
                      <div className="flex justify-end gap-1">
                        <button className="flex h-8 w-8 items-center justify-center rounded-lg hover:bg-muted transition-colors text-muted-foreground hover:text-foreground">
                          <Edit size={16} />
                        </button>
                        <button className="flex h-8 w-8 items-center justify-center rounded-lg hover:bg-muted transition-colors text-destructive">
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
