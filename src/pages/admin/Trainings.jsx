import React, { useState, useEffect } from 'react'
import { Plus, Search, Edit, Trash2, Users, Clock, X, Calendar, Zap } from 'lucide-react'
import { trainingSessionsApi, trainingRegistrationsApi } from '../../services/api'

const inputClass = 'w-full rounded-lg border border-input bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring'

const days = ['Ponedjeljak', 'Utorak', 'Srijeda', 'Četvrtak', 'Petak']
const dayToEnglish = {
  Ponedjeljak: 'Monday', Utorak: 'Tuesday', Srijeda: 'Wednesday',
  Četvrtak: 'Thursday', Petak: 'Friday', Subota: 'Saturday', Nedjelja: 'Sunday'
}
const dayToBosanski = {
  Monday: 'Ponedjeljak', Tuesday: 'Utorak', Wednesday: 'Srijeda',
  Thursday: 'Četvrtak', Friday: 'Petak', Saturday: 'Subota', Sunday: 'Nedjelja'
}

const _mjHelper = ['Januar', 'Februar', 'Mart', 'April', 'Maj', 'Juni', 'Juli', 'August', 'Septembar', 'Oktobar', 'Novembar', 'Decembar']

// Vikend = true ako je subota(6) ili nedjelja(0)
function isWeekend() {
  const day = new Date().getDay()
  return day === 0 || day === 6
}

// Vrati range sedmice za koju se prave treninzi:
// vikend → sljedeca sedmica, radni dan → ova sedmica
function getTargetWeekRange() {
  const today = new Date()
  const day = today.getDay()
  let diffToMon
  if (isWeekend()) {
    // Sljedeca sedmica — sljedeci ponedjeljak
    diffToMon = day === 0 ? 1 : 8 - day
  } else {
    // Ova sedmica — prosli/danasnji ponedjeljak
    diffToMon = day === 0 ? -6 : 1 - day
  }
  const mon = new Date(today)
  mon.setDate(today.getDate() + diffToMon)
  const fri = new Date(mon)
  fri.setDate(mon.getDate() + 4)
  const fmt = (d) => `${d.getDate()}. ${_mjHelper[d.getMonth()]}`
  return `${fmt(mon)} – ${fmt(fri)} ${mon.getFullYear()}.`
}

// Ova sedmica range (za info banner)
function getCurrentWeekRange() {
  const today = new Date()
  const day = today.getDay()
  const diffToMon = day === 0 ? -6 : 1 - day
  const mon = new Date(today)
  mon.setDate(today.getDate() + diffToMon)
  const fri = new Date(mon)
  fri.setDate(mon.getDate() + 4)
  const fmt = (d) => `${d.getDate()}. ${_mjHelper[d.getMonth()]}`
  return `${fmt(mon)} – ${fmt(fri)} ${mon.getFullYear()}.`
}

const weekTemplate = [
  {
    day: 'Monday', label: 'Ponedjeljak',
    sessions: [
      { groupName: 'Jutarnji trening', startTime: '07:00:00', endTime: '09:00:00', type: 'Group', maxCapacity: 12, minCapacity: 2 },
      { groupName: 'Popodnevni trening', startTime: '16:30:00', endTime: '18:00:00', type: 'Group', maxCapacity: 12, minCapacity: 2 },
      { groupName: 'Večernji trening', startTime: '18:15:00', endTime: '20:15:00', type: 'Group', maxCapacity: 12, minCapacity: 2 },
    ]
  },
  {
    day: 'Tuesday', label: 'Utorak',
    sessions: [
      { groupName: 'Jutarnji trening', startTime: '08:00:00', endTime: '09:00:00', type: 'Individual', maxCapacity: 1, minCapacity: 1 },
      { groupName: 'Popodnevni trening', startTime: '17:00:00', endTime: '18:00:00', type: 'Individual', maxCapacity: 1, minCapacity: 1 },
      { groupName: 'Večernji trening', startTime: '18:00:00', endTime: '19:00:00', type: 'Individual', maxCapacity: 1, minCapacity: 1 },
    ]
  },
  {
    day: 'Wednesday', label: 'Srijeda',
    sessions: [
      { groupName: 'Jutarnji trening', startTime: '07:00:00', endTime: '09:00:00', type: 'Group', maxCapacity: 12, minCapacity: 2 },
      { groupName: 'Popodnevni trening', startTime: '16:30:00', endTime: '18:00:00', type: 'Group', maxCapacity: 12, minCapacity: 2 },
      { groupName: 'Večernji trening', startTime: '18:15:00', endTime: '20:15:00', type: 'Group', maxCapacity: 12, minCapacity: 2 },
    ]
  },
  {
    day: 'Thursday', label: 'Četvrtak',
    sessions: [
      { groupName: 'Jutarnji trening', startTime: '08:00:00', endTime: '09:00:00', type: 'Individual', maxCapacity: 1, minCapacity: 1 },
      { groupName: 'Popodnevni trening', startTime: '17:00:00', endTime: '18:00:00', type: 'Individual', maxCapacity: 1, minCapacity: 1 },
      { groupName: 'Večernji trening', startTime: '18:00:00', endTime: '19:00:00', type: 'Individual', maxCapacity: 1, minCapacity: 1 },
    ]
  },
  {
    day: 'Friday', label: 'Petak',
    sessions: [
      { groupName: 'Jutarnji trening', startTime: '07:00:00', endTime: '09:00:00', type: 'Group', maxCapacity: 12, minCapacity: 2 },
      { groupName: 'Popodnevni trening', startTime: '16:30:00', endTime: '18:00:00', type: 'Group', maxCapacity: 12, minCapacity: 2 },
      { groupName: 'Večernji trening', startTime: '18:15:00', endTime: '20:15:00', type: 'Group', maxCapacity: 12, minCapacity: 2 },
    ]
  },
]


// Provjeri da li je termin (dan u sedmici) vec prosao ove sedmice
function isSessionPast(dayOfWeek) {
  const today = new Date()
  const todayDay = today.getDay() // 0=Ned, 1=Pon...
  const engDays = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
  const sessionDay = engDays.indexOf(dayOfWeek)
  if (sessionDay === -1) return false
  // Ako je sessionDay manji od danasnjeg dana u sedmici = prosao
  // Ako je jednak = danas (nije prosao)
  return sessionDay < todayDay
}

const emptyForm = {
  groupName: '', type: 'Group', day: 'Ponedjeljak',
  time: '06:00', endTime: '07:00', capacity: '12', minCapacity: '2', location: '', notes: ''
}

export default function AdminTrainings() {
  const [trainingSessions, setTrainingSessions] = useState([])
  const [search, setSearch] = useState('')
  const [showModal, setShowModal] = useState(false)
  const [editingId, setEditingId] = useState(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [formData, setFormData] = useState(emptyForm)

  const [showRegistrationsModal, setShowRegistrationsModal] = useState(false)
  const [selectedSession, setSelectedSession] = useState(null)
  const [registrations, setRegistrations] = useState([])

  const [showGenerateModal, setShowGenerateModal] = useState(false)
  const [view, setView] = useState('active') // 'active' | 'past'
  const [generating, setGenerating] = useState(false)
  const [generateResult, setGenerateResult] = useState(null)

  const fetchSessions = async () => {
    try {
      const data = await trainingSessionsApi.getAll()
      setTrainingSessions(Array.isArray(data) ? data : [])
    } catch (err) {
      console.error('Greška pri učitavanju treninga')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchSessions() }, [])

  const handleGenerateWeek = async () => {
    setGenerating(true)
    setGenerateResult(null)
    let created = 0
    let skipped = 0
    try {
      for (const dayTemplate of weekTemplate) {
        for (const sess of dayTemplate.sessions) {
          const exists = trainingSessions.some(s =>
            s.dayOfWeek === dayTemplate.day &&
            s.startTime?.substring(0, 5) === sess.startTime.substring(0, 5) &&
            s.type === sess.type
          )
          if (exists) { skipped++; continue }
          await trainingSessionsApi.create({
            groupName: sess.groupName,
            type: sess.type,
            dayOfWeek: dayTemplate.day,
            startTime: sess.startTime,
            endTime: sess.endTime,
            maxCapacity: sess.maxCapacity,
            minCapacity: sess.minCapacity,
            isActive: true,
            location: null,
            notes: null,
          })
          created++
        }
      }
      setGenerateResult({ created, skipped })
      await fetchSessions()
    } catch (err) {
      alert('Greška pri generisanju: ' + err.message)
    } finally {
      setGenerating(false)
    }
  }

  const handleViewRegistrations = (session) => {
    setSelectedSession(session)
    setRegistrations(session.registrations || [])
    setShowRegistrationsModal(true)
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleOpenAddModal = () => {
    setEditingId(null)
    setFormData(emptyForm)
    setShowModal(true)
  }

  const handleOpenEditModal = (session) => {
    setEditingId(session.id)
    setFormData({
      groupName: session.groupName,
      type: session.type,
      day: dayToBosanski[session.dayOfWeek] || session.dayOfWeek,
      time: session.startTime?.substring(0, 5) || '06:00',
      endTime: session.endTime?.substring(0, 5) || '07:00',
      capacity: session.maxCapacity,
      minCapacity: session.minCapacity,
      location: session.location || '',
      notes: session.notes || ''
    })
    setShowModal(true)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSaving(true)
    const body = {
      groupName: formData.groupName,
      type: formData.type,
      dayOfWeek: dayToEnglish[formData.day] || formData.day,
      startTime: `${formData.time}:00`,
      endTime: `${formData.endTime}:00`,
      maxCapacity: parseInt(formData.capacity),
      minCapacity: parseInt(formData.minCapacity),
      isActive: true,
      location: formData.location || null,
      notes: formData.notes || null
    }
    try {
      if (editingId) {
        await trainingSessionsApi.update(editingId, body)
      } else {
        await trainingSessionsApi.create(body)
      }
      await fetchSessions()
      setShowModal(false)
    } catch (err) {
      alert('Greška pri snimanju: ' + err.message)
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async (id) => {
    if (!confirm('Jeste li sigurni? Ovo će obrisati trening i sve rezervacije.')) return
    try {
      await trainingSessionsApi.delete(id)
      await fetchSessions()
    } catch (err) {
      alert('Greška pri brisanju.')
    }
  }

  const filtered = trainingSessions.filter(s =>
    s.groupName?.toLowerCase().includes(search.toLowerCase()) ||
    (dayToBosanski[s.dayOfWeek] || s.dayOfWeek)?.toLowerCase().includes(search.toLowerCase())
  )

  const orderedDays = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday']

  // Filtriraj po view: aktivni (danas i budući) ili prošli
  const filteredByView = filtered.filter(s =>
    view === 'past' ? isSessionPast(s.dayOfWeek) : !isSessionPast(s.dayOfWeek)
  )

  const grouped = orderedDays.map(day => ({
    day,
    label: dayToBosanski[day],
    sessions: filteredByView.filter(s => s.dayOfWeek === day)
  })).filter(g => g.sessions.length > 0)

  const timeOptions = Array.from({ length: 24 }, (_, h) =>
    ['00', '15', '30', '45'].map(m => `${String(h).padStart(2, '0')}:${m}`)
  ).flat()

  // Provjeri koji je dan — ako je vikend, prikaži "sljedeća sedmica" info
  const todayDay = new Date().getDay() // 0=Ned, 6=Sub
  const isWeekend = todayDay === 0 || todayDay === 6

  if (loading) return <div className="p-8 text-center">Učitavanje...</div>

  return (
    <div className="p-4 lg:p-8">
      {/* Header */}
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground lg:text-3xl">Upravljaj Treninzima</h1>
          <p className="text-muted-foreground">Pregled i upravljanje treninzima</p>
        </div>
        <div className="flex gap-2">
          <button onClick={() => { setGenerateResult(null); setShowGenerateModal(true) }}
            className="inline-flex items-center gap-2 rounded-lg border border-border bg-card px-4 py-2.5 text-sm font-semibold text-foreground hover:bg-muted transition-colors">
            <Zap size={16} className="text-primary" /> Generiši sedmicu
          </button>
          <button onClick={handleOpenAddModal}
            className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground hover:opacity-90 transition-opacity">
            <Plus size={16} /> Dodaj Trening
          </button>
        </div>
      </div>

      {/* ── Sedmica info banner ── */}
      <div className={`mb-6 flex items-center gap-3 rounded-lg border p-4 ${isWeekend
          ? 'border-primary/30 bg-primary/5'
          : 'border-border bg-card'
        }`}>
        <Calendar size={18} className={isWeekend ? 'text-primary shrink-0' : 'text-muted-foreground shrink-0'} />
        <div>
          {isWeekend ? (
            <>
              <p className="text-sm font-semibold text-foreground">
                Vikend — kreirajte treninge za sljedeću sedmicu!
              </p>
              <p className="text-xs text-muted-foreground mt-0.5">
                Treninzi će biti vidljivi za: <span className="font-medium text-primary">{getTargetWeekRange()}</span>
              </p>
            </>
          ) : (
            <>
              <p className="text-sm font-medium text-foreground">
                Kreirajte treninge za: <span className="font-semibold">{getTargetWeekRange()}</span>
              </p>
              <p className="text-xs text-muted-foreground mt-0.5">
                Članice mogu rezervisati treninge samo za ovu sedmicu
              </p>
            </>
          )}
        </div>
      </div>

      {/* ── Generate Week Modal ── */}
      {showGenerateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => !generating && setShowGenerateModal(false)} />
          <div className="relative z-10 w-full max-w-lg rounded-lg border border-border bg-card p-8 shadow-lg max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-xl font-bold text-foreground">Generiši standardnu sedmicu</h2>
                <p className="text-sm text-muted-foreground mt-1">Kreira treninge prema radnom vremenu teretane</p>
              </div>
              {!generating && (
                <button onClick={() => setShowGenerateModal(false)} className="text-muted-foreground hover:text-foreground">
                  <X size={20} />
                </button>
              )}
            </div>

            {/* Sedmica range banner u modalu */}
            <div className="mb-5 flex items-center gap-2 rounded-lg border border-primary/20 bg-primary/5 px-4 py-3">
              <Calendar size={15} className="text-primary shrink-0" />
              <div>
                <p className="text-xs text-muted-foreground">Kreirat će se termini za sljedeću sedmicu:</p>
                <p className="text-sm font-semibold text-primary">{getTargetWeekRange()}</p>
              </div>
            </div>

            {!generateResult && (
              <div className="mb-6 space-y-3">
                {weekTemplate.map(day => (
                  <div key={day.day} className="rounded-lg border border-border p-3">
                    <p className="font-medium text-foreground text-sm mb-2">{day.label}</p>
                    <div className="space-y-1">
                      {day.sessions.map((s, i) => (
                        <div key={i} className="flex items-center justify-between text-xs text-muted-foreground">
                          <span className="flex items-center gap-1.5">
                            <Clock size={10} />
                            {s.startTime.substring(0, 5)} – {s.endTime.substring(0, 5)}
                            <span className="font-medium text-foreground ml-1">{s.groupName}</span>
                          </span>
                          <span className={`rounded-full px-2 py-0.5 font-medium ${s.type === 'Group' ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'}`}>
                            {s.type === 'Group' ? 'Grupni' : 'Ind.'}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
                <p className="text-xs text-muted-foreground pt-1">
                  * Subota i nedjelja su slobodni dani. Dupli treninzi će biti preskočeni.
                </p>
              </div>
            )}

            {generateResult && (
              <div className="mb-6 rounded-lg border border-green-200 bg-green-50 p-4 text-center">
                <p className="font-semibold text-green-800 text-lg">✓ Gotovo!</p>
                <p className="text-sm text-green-700 mt-1">
                  Kreirano: <strong>{generateResult.created}</strong> treninga
                  {generateResult.skipped > 0 && `, preskočeno: ${generateResult.skipped} (već postoje)`}
                </p>
              </div>
            )}

            <div className="flex gap-3">
              <button onClick={() => setShowGenerateModal(false)} disabled={generating}
                className="flex-1 rounded-lg border border-border px-4 py-2.5 text-sm font-medium text-foreground hover:bg-muted transition-colors disabled:opacity-50">
                {generateResult ? 'Zatvori' : 'Otkaži'}
              </button>
              {!generateResult && (
                <button onClick={handleGenerateWeek} disabled={generating}
                  className="flex-1 rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground hover:opacity-90 disabled:opacity-50">
                  {generating ? (
                    <span className="flex items-center justify-center gap-2">
                      <span className="h-4 w-4 animate-spin rounded-full border-2 border-primary-foreground border-t-transparent" />
                      Kreira se...
                    </span>
                  ) : 'Generiši'}
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ── Add/Edit Modal ── */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setShowModal(false)} />
          <div className="relative z-10 w-full max-w-2xl rounded-lg border border-border bg-card p-8 shadow-lg max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-2xl font-bold text-foreground">
                  {editingId ? 'Uredi Trening' : 'Dodaj Trening'}
                </h2>
                {/* Sedmica info u Add/Edit modalu */}
                {!editingId && (
                  <div className="flex items-center gap-1.5 mt-1.5">
                    <Calendar size={13} className="text-primary" />
                    <p className="text-xs text-muted-foreground">
                      {isWeekend ? 'Sljedeća sedmica' : 'Ova sedmica'}:{' '}
                      <span className="font-semibold text-primary">{getTargetWeekRange()}</span>
                    </p>
                  </div>
                )}
              </div>
            </div>
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Naziv grupe</label>
                <input type="text" name="groupName" value={formData.groupName}
                  onChange={handleInputChange} placeholder="npr. Jutarnji HIIT"
                  className={inputClass} required />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Tip</label>
                <div className="flex gap-3">
                  {['Group', 'Individual'].map(t => (
                    <button key={t} type="button"
                      onClick={() => setFormData(prev => ({
                        ...prev,
                        type: t,
                        capacity: t === 'Individual' ? '1' : prev.capacity === '1' ? '12' : prev.capacity,
                        minCapacity: t === 'Individual' ? '1' : prev.minCapacity === '1' ? '2' : prev.minCapacity
                      }))}
                      className={`flex-1 rounded-lg px-4 py-2 text-sm font-medium transition-colors ${formData.type === t
                        ? 'bg-primary text-primary-foreground'
                        : 'border border-border bg-background text-foreground hover:bg-muted'}`}>
                      {t === 'Group' ? 'Grupni' : 'Individualni'}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Dan</label>
                <select name="day" value={formData.day} onChange={handleInputChange} className={inputClass}>
                  {days.map(day => <option key={day} value={day}>{day}</option>)}
                </select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">Početak</label>
                  <select name="time" value={formData.time} onChange={handleInputChange} className={inputClass}>
                    {timeOptions.map(v => <option key={v} value={v}>{v}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">Kraj</label>
                  <select name="endTime" value={formData.endTime} onChange={handleInputChange} className={inputClass}>
                    {timeOptions.map(v => <option key={v} value={v}>{v}</option>)}
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">Max kapacitet</label>
                  <input type="number" name="capacity" value={formData.capacity}
                    onChange={handleInputChange} placeholder="npr. 12" min="1"
                    className={inputClass} required />
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">Min kapacitet</label>
                  <input type="number" name="minCapacity" value={formData.minCapacity}
                    onChange={handleInputChange} placeholder="npr. 2" min="1"
                    className={inputClass} />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Lokacija (opciono)</label>
                <input type="text" name="location" value={formData.location}
                  onChange={handleInputChange} placeholder="npr. Sala 1" className={inputClass} />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Napomene (opciono)</label>
                <input type="text" name="notes" value={formData.notes}
                  onChange={handleInputChange} placeholder="Dodatne napomene..." className={inputClass} />
              </div>
              <div className="flex gap-3 pt-4">
                <button type="button" onClick={() => setShowModal(false)}
                  className="flex-1 rounded-lg border border-border px-4 py-2 text-sm font-medium text-foreground hover:bg-muted transition-colors">
                  Otkaži
                </button>
                <button type="submit" disabled={saving}
                  className="flex-1 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground hover:opacity-90 disabled:opacity-50">
                  {saving ? 'Snimanje...' : editingId ? 'Ažuriraj' : 'Napravi Trening'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── Prijavljeni Modal ── */}
      {showRegistrationsModal && selectedSession && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setShowRegistrationsModal(false)} />
          <div className="relative z-10 w-full max-w-lg rounded-lg border border-border bg-card shadow-lg max-h-[80vh] flex flex-col">
            <div className="flex items-center justify-between p-6 border-b border-border shrink-0">
              <div>
                <h2 className="text-lg font-bold text-foreground">{selectedSession.groupName}</h2>
                <div className="flex items-center gap-3 mt-1 text-sm text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <Clock size={12} />
                    {selectedSession.startTime?.substring(0, 5)} – {selectedSession.endTime?.substring(0, 5)}
                  </span>
                  <span>{dayToBosanski[selectedSession.dayOfWeek] || selectedSession.dayOfWeek}</span>
                </div>
              </div>
              <button onClick={() => setShowRegistrationsModal(false)} className="text-muted-foreground hover:text-foreground">
                <X size={20} />
              </button>
            </div>
            <div className="px-6 py-3 border-b border-border bg-muted/30 shrink-0">
              <div className="flex items-center gap-3">
                <Users size={16} className="text-muted-foreground shrink-0" />
                <span className="text-sm font-medium text-foreground whitespace-nowrap">
                  {registrations.length} / {selectedSession.maxCapacity} prijavljenih
                </span>
                <div className="flex-1 h-2 rounded-full bg-muted overflow-hidden">
                  <div className={`h-full rounded-full transition-all ${registrations.length >= selectedSession.maxCapacity ? 'bg-destructive' : 'bg-primary'
                    }`} style={{ width: `${Math.min((registrations.length / selectedSession.maxCapacity) * 100, 100)}%` }} />
                </div>
                <span className="text-xs text-muted-foreground whitespace-nowrap">
                  {selectedSession.maxCapacity - registrations.length} slobodnih
                </span>
              </div>
            </div>
            <div className="overflow-y-auto flex-1 p-6">
              {registrations.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <Users size={32} className="mx-auto mb-2 opacity-40" />
                  <p className="text-sm">Niko nije prijavljen za ovaj trening</p>
                </div>
              ) : (
                <div className="space-y-2">
                  {registrations.map((reg, i) => (
                    <div key={i} className="flex items-center gap-3 rounded-lg border border-border p-3">
                      <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/10 shrink-0">
                        <span className="text-xs font-semibold text-primary">
                          {reg.userFirstName?.[0] || '?'}{reg.userLastName?.[0] || ''}
                        </span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-foreground text-sm">
                          {reg.userFirstName} {reg.userLastName}
                        </p>
                        <div className="flex items-center gap-1.5 text-xs text-muted-foreground mt-0.5">
                          <Calendar size={10} />
                          <span>{(() => {
                            const _d = new Date(reg.sessionDate + 'T12:00:00')
                            const _mj = ['Jan', 'Feb', 'Mar', 'Apr', 'Maj', 'Jun', 'Jul', 'Aug', 'Sep', 'Okt', 'Nov', 'Dec']
                            const _dn = ['Ned', 'Pon', 'Uto', 'Sri', 'Čet', 'Pet', 'Sub']
                            return `${_dn[_d.getDay()]}, ${_d.getDate()}. ${_mj[_d.getMonth()]} ${_d.getFullYear()}.`
                          })()}</span>
                        </div>
                      </div>
                      <span className="rounded-full bg-green-100 px-2.5 py-1 text-xs font-medium text-green-700 shrink-0">
                        Rezervisano
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
            <div className="p-4 border-t border-border shrink-0">
              <button onClick={() => setShowRegistrationsModal(false)}
                className="w-full rounded-lg border border-border px-4 py-2 text-sm font-medium text-foreground hover:bg-muted transition-colors">
                Zatvori
              </button>
            </div>
          </div>
        </div>
      )}


      {/* Filter tabovi */}
      <div className="mb-6 flex items-center gap-2">
        <button
          onClick={() => setView('active')}
          className={view === 'active'
            ? 'rounded-lg px-4 py-2 text-sm font-medium bg-primary text-primary-foreground'
            : 'rounded-lg px-4 py-2 text-sm font-medium border border-border bg-card text-foreground hover:bg-muted transition-colors'}
        >
          Aktivni treninzi
        </button>
        <button
          onClick={() => setView('past')}
          className={view === 'past'
            ? 'rounded-lg px-4 py-2 text-sm font-medium bg-secondary text-secondary-foreground'
            : 'rounded-lg px-4 py-2 text-sm font-medium border border-border bg-card text-foreground hover:bg-muted transition-colors'}
        >
          Prošli treninzi
        </button>
        {view === 'past' && (
          <span className="text-xs text-muted-foreground ml-2">
            Treninzi čiji je dan u sedmici već prošao
          </span>
        )}
      </div>

      {/* Search */}
      <div className="mb-6 rounded-lg border border-border bg-card p-4 shadow-sm">
        <div className="relative">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <input className={inputClass + ' pl-9'} placeholder="Istraži treninge..."
            value={search} onChange={e => setSearch(e.target.value)} />
        </div>
      </div>

      {/* Tabela */}
      {grouped.length === 0 ? (
        <div className="rounded-lg border border-border bg-card p-12 text-center text-muted-foreground">
          <Calendar size={40} className="mx-auto mb-3 opacity-40" />
          <p className="font-medium">{view === 'past' ? 'Nema prošlih treninga.' : 'Nema treninga.'}</p>
          <p className="text-sm mt-1">{view === 'past' ? 'Svi treninzi su aktivni za ovu sedmicu.' : 'Klikni "Generiši sedmicu" ili "Dodaj Trening" ručno.'}</p>
        </div>
      ) : (
        <div className="space-y-4">
          {grouped.map(({ day, label, sessions: daySessions }) => (
            <div key={day} className="rounded-lg border border-border bg-card shadow-sm">
              <div className="px-5 py-3 border-b border-border bg-muted/30 flex items-center gap-2">
                <Calendar size={15} className="text-muted-foreground" />
                <h3 className="font-semibold text-foreground text-sm">{label}</h3>
                <span className="text-xs text-muted-foreground">({daySessions.length} treninga)</span>
              </div>
              <div className="divide-y divide-border">
                {daySessions.map((session) => {
                  const registered = session.registrations?.length ?? 0
                  const isFull = registered >= session.maxCapacity
                  return (
                    <div key={session.id} className={[
                      "flex items-center gap-4 px-5 py-4",
                      view === 'past' ? 'bg-muted/20' : ''
                    ].join(' ')}>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <p className={view === 'past' ? 'font-medium text-muted-foreground text-sm' : 'font-medium text-foreground text-sm'}>{session.groupName}</p>
                          {view === 'past' && (
                            <span className="rounded-full bg-secondary px-2 py-0.5 text-xs font-medium text-secondary-foreground">
                              Završeno
                            </span>
                          )}
                        </div>
                        {session.location && <p className="text-xs text-muted-foreground">{session.location}</p>}
                        {session.notes && <p className="text-xs text-muted-foreground italic">{session.notes}</p>}
                      </div>
                      <span className={`rounded-full px-2.5 py-1 text-xs font-medium shrink-0 ${session.type === 'Group' ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'
                        }`}>
                        {session.type === 'Group' ? 'Grupni' : 'Individualni'}
                      </span>
                      <div className="flex items-center gap-1 text-sm text-foreground shrink-0">
                        <Clock size={12} className="text-muted-foreground" />
                        {session.startTime?.substring(0, 5)} – {session.endTime?.substring(0, 5)}
                      </div>
                      <button
                        onClick={() => handleViewRegistrations(session)}
                        title="Klikni da vidiš prijavljene"
                        className="flex items-center gap-1.5 rounded-lg border border-border px-3 py-1.5 hover:bg-muted transition-colors shrink-0 group"
                      >
                        <Users size={14} className="text-muted-foreground group-hover:text-foreground transition-colors" />
                        <span className={`text-sm font-semibold ${isFull ? 'text-destructive' : 'text-foreground'}`}>
                          {registered}/{session.maxCapacity}
                        </span>
                        {isFull && (
                          <span className="rounded-full bg-destructive/10 px-1.5 py-0.5 text-xs text-destructive font-medium">Puno</span>
                        )}
                      </button>
                      <div className="flex items-center gap-1 shrink-0">
                        <button onClick={() => handleOpenEditModal(session)}
                          className="flex h-8 w-8 items-center justify-center rounded-lg hover:bg-muted transition-colors text-muted-foreground hover:text-foreground">
                          <Edit size={15} />
                        </button>
                        <button onClick={() => handleDelete(session.id)}
                          className="flex h-8 w-8 items-center justify-center rounded-lg hover:bg-muted transition-colors text-destructive">
                          <Trash2 size={15} />
                        </button>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}