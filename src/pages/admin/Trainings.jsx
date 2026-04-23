import React, { useState } from 'react'
import { Plus, Search, Edit, Trash2, Users, Clock } from 'lucide-react'

const initialTrainingSessions = [
  { id: 1,  name: 'HIIT Training',    type: 'Group', day: 'Monday',    time: '06:00',  duration: '1 hour', registered: 8,  capacity: 12, group: 'Group 1' },
  { id: 2,  name: 'Yoga Flow',        type: 'Group', day: 'Monday',    time: '09:00',  duration: '1 hour', registered: 12, capacity: 15, group: 'Group 2' },
  { id: 3,  name: 'Strength Training',type: 'Group', day: 'Monday',    time: '17:30',  duration: '1 hour', registered: 10, capacity: 10, group: 'Group 1' },
  { id: 4,  name: 'Pilates',          type: 'Group', day: 'Monday',    time: '19:00',  duration: '1 hour', registered: 7,  capacity: 12, group: 'Group 2' },
  { id: 5,  name: 'Spin Class',       type: 'Group', day: 'Tuesday',   time: '06:00',  duration: '1 hour', registered: 15, capacity: 20, group: 'Group 1' },
  { id: 6,  name: 'Low Impact Cardio',type: 'Group', day: 'Tuesday',   time: '10:00', duration: '1 hour', registered: 9,  capacity: 15, group: 'Group 2' },
  { id: 7,  name: 'HIIT Training',    type: 'Group', day: 'Tuesday',   time: '17:30',  duration: '1 hour', registered: 11, capacity: 12, group: 'Group 1' },
  { id: 8,  name: 'Yoga Flow',        type: 'Group', day: 'Tuesday',   time: '19:00',  duration: '1 hour', registered: 13, capacity: 15, group: 'Group 2' },
  { id: 9,  name: 'Strength Training',type: 'Group', day: 'Wednesday', time: '06:00',  duration: '1 hour', registered: 6,  capacity: 10, group: 'Group 1' },
  { id: 10, name: 'Pilates',          type: 'Group', day: 'Wednesday', time: '09:00',  duration: '1 hour', registered: 8,  capacity: 12, group: 'Group 2' },
]

const inputClass = 'w-full rounded-lg border border-input bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring'

export default function AdminTrainings() {
  const [trainingSessions, setTrainingSessions] = useState(initialTrainingSessions)
  const [search, setSearch] = useState('')
  const [showModal, setShowModal] = useState(false)
  const [editingId, setEditingId] = useState(null)
  const [formData, setFormData] = useState({
    name: '',
    type: 'Group',
    day: 'Monday',
    time: '06:00',
    capacity: ''
  })

  const filtered = trainingSessions.filter(s =>
    s.name.toLowerCase().includes(search.toLowerCase()) ||
    s.day.toLowerCase().includes(search.toLowerCase())
  )

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleTypeChange = (type) => {
    setFormData(prev => ({
      ...prev,
      type
    }))
  }

  const handleOpenAddModal = () => {
    setEditingId(null)
    setFormData({
      name: '',
      type: 'Group',
      day: 'Monday',
      time: '06:00',
      capacity: ''
    })
    setShowModal(true)
  }

  const handleOpenEditModal = (session) => {
    setEditingId(session.id)
    setFormData({
      name: session.name,
      type: session.type,
      day: session.day,
      time: session.time,
      capacity: session.capacity
    })
    setShowModal(true)
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (editingId) {
      setTrainingSessions(prev => 
        prev.map(s => s.id === editingId ? { ...s, ...formData } : s)
      )
    } else {
      const newTraining = {
        id: Math.max(...trainingSessions.map(s => s.id), 0) + 1,
        ...formData,
        duration: '1 hour',
        registered: 0,
        group: 'Group 1'
      }
      setTrainingSessions(prev => [...prev, newTraining])
    }
    setShowModal(false)
    setFormData({
      name: '',
      type: 'Group',
      day: 'Monday',
      time: '06:00',
      capacity: ''
    })
    setEditingId(null)
  }

  const handleDelete = (id) => {
    setTrainingSessions(prev => prev.filter(s => s.id !== id))
  }

  const days = ['Ponedjeljak', 'Utorak', 'Srijeda', 'Četvrtak', 'Petak', 'Subota', 'Nedjelja']

  return (
    <div className="p-4 lg:p-8">
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground lg:text-3xl">Upravljaj Treninzima</h1>
          <p className="text-muted-foreground">Pregled i upravljanje treninzima</p>
        </div>
        <button onClick={handleOpenAddModal} className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground hover:opacity-90 transition-opacity">
          <Plus size={16} /> Dodaj Trening
        </button>
      </div>

      {/* Add Training Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          {/* Backdrop with blur */}
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setShowModal(false)} />
          
          {/* Modal Content */}
          <div className="relative z-10 w-full max-w-2xl rounded-lg border border-border bg-card p-8 shadow-lg">
            <h2 className="text-2xl font-bold text-foreground mb-8">{editingId ? 'Edit Training' : 'Add Training'}</h2>
            
            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Training Name */}
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Trening</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="npr. HIIT Training"
                  className={inputClass}
                  required
                />
              </div>

              {/* Type Selection */}
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Tip</label>
                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={() => handleTypeChange('Group')}
                    className={`flex-1 rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
                      formData.type === 'Group'
                        ? 'bg-primary text-primary-foreground'
                        : 'border border-border bg-background text-foreground hover:bg-muted'
                    }`}
                  >
                    Grupni Trening
                  </button>
                  <button
                    type="button"
                    onClick={() => handleTypeChange('Individual')}
                    className={`flex-1 rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
                      formData.type === 'Individual'
                        ? 'bg-primary text-primary-foreground'
                        : 'border border-border bg-background text-foreground hover:bg-muted'
                    }`}
                  >
                    Individualni Trening
                  </button>
                </div>
              </div>

              {/* Day Selection */}
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Dan</label>
                <select
                  name="day"
                  value={formData.day}
                  onChange={handleInputChange}
                  className={inputClass}
                >
                  {days.map(day => (
                    <option key={day} value={day}>{day}</option>
                  ))}
                </select>
              </div>

              {/* Time */}
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Vrijeme</label>
                <select
                  name="time"
                  value={formData.time}
                  onChange={handleInputChange}
                  className={inputClass}
                  required
                >
                  {Array.from({ length: 24 }, (_, h) =>
                    ['00', '15', '30', '45'].map(m => {
                      const timeVal = `${String(h).padStart(2, '0')}:${m}`
                      return (
                        <option key={timeVal} value={timeVal}>
                          {timeVal}
                        </option>
                      )
                    })
                  ).flat()}
                </select>
              </div>

              {/* Capacity */}
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Max Kapacitet</label>
                <input
                  type="number"
                  name="capacity"
                  value={formData.capacity}
                  onChange={handleInputChange}
                  placeholder="npr. 12"
                  min="1"
                  className={inputClass}
                  required
                />
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="flex-1 rounded-lg border border-border px-4 py-2 text-sm font-medium text-foreground hover:bg-muted transition-colors"
                >
                  Otkaži
                </button>
                <button
                  type="submit"
                  className="flex-1 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground hover:opacity-90 transition-opacity"
                >
                  {editingId ? 'Ažurirajte Trening' : 'Napravite Trening'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Search */}
      <div className="mb-6 rounded-lg border border-border bg-card p-4 shadow-sm">
        <div className="relative flex-1">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <input
            className={inputClass + ' pl-9'}
            placeholder="Istraži treninge..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>
      </div>

      {/* Table */}
      <div className="rounded-lg border border-border bg-card shadow-sm">
        <div className="p-5 border-b border-border">
          <h3 className="font-semibold text-foreground">Treninzi</h3>
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
                        <button onClick={() => handleOpenEditModal(session)} className="flex h-8 w-8 items-center justify-center rounded-lg hover:bg-muted transition-colors text-muted-foreground hover:text-foreground">
                          <Edit size={16} />
                        </button>
                        <button onClick={() => handleDelete(session.id)} className="flex h-8 w-8 items-center justify-center rounded-lg hover:bg-muted transition-colors text-destructive">
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
