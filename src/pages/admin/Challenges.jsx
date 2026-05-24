import React, { useEffect, useState } from 'react'
import { Plus, Edit, Trash2, Users, Calendar, Trophy, Eye, X, Medal, Flame } from 'lucide-react'
import { challengesApi } from '../../services/api'

const statusColors = {
  Aktivan: 'bg-green-100 text-green-700',
  Nadolazi: 'bg-blue-100 text-blue-700',
  Zavrsen: 'bg-gray-100 text-gray-700',
}

const challengeStatuses = ['Aktivan', 'Nadolazi', 'Zavrsen']

const inputClass = 'w-full rounded-lg border border-input bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring'
const labelClass = 'block mb-1.5 text-sm font-medium text-foreground'

function mapBackendStatusToUi(status) {
  if (status === 'Active') return 'Aktivan'
  if (status === 'Upcoming') return 'Nadolazi'
  if (status === 'Completed') return 'Zavrsen'
  return status || 'Nadolazi'
}

function mapUiStatusToBackend(status) {
  if (status === 'Aktivan') return 'Active'
  if (status === 'Nadolazi') return 'Upcoming'
  if (status === 'Zavrsen') return 'Completed'
  return status || 'Upcoming'
}

function formatDate(value) {
  if (!value) return '-'
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return value
  return date.toLocaleDateString('bs-BA', { day: 'numeric', month: 'long', year: 'numeric' })
}

function toInputDate(value) {
  if (!value) return ''
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return typeof value === 'string' ? value.slice(0, 10) : ''
  return date.toISOString().slice(0, 10)
}

function normalizeChallenge(c) {
  return {
    id: c.id ?? c.Id,
    title: c.title ?? c.Title ?? '',
    description: c.description ?? c.Description ?? '',
    rules: c.rules ?? c.Rules ?? '',
    status: mapBackendStatusToUi(c.status ?? c.Status),
    startDate: c.startDate ?? c.StartDate ?? '',
    endDate: c.endDate ?? c.EndDate ?? '',
    participants: c.participantCount ?? c.ParticipantCount ?? 0,
    type: 'Izazov',
    progress: 0,
  }
}

const emptyForm = { title: '', description: '', rules: '', startDate: '', endDate: '', status: 'Aktivan', isPublic: true }

export default function AdminChallenges() {
  const [challengesList, setChallengesList] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [participants, setParticipants] = useState([])
  const [participantsLoading, setParticipantsLoading] = useState(false)
  const [showModal, setShowModal] = useState(false)
  const [showParticipantsModal, setShowParticipantsModal] = useState(false)
  const [editingId, setEditingId] = useState(null)
  const [selectedChallenge, setSelectedChallenge] = useState(null)
  const [saving, setSaving] = useState(false)
  const [formData, setFormData] = useState(emptyForm)
  const [leaderboard, setLeaderboard] = useState([])
  const [leaderboardLoading, setLeaderboardLoading] = useState(false)

  const stats = [
    { label: 'Ukupno izazova', value: challengesList.length, bg: 'bg-primary/10', color: 'text-primary', icon: Trophy },
    { label: 'Aktivni izazovi', value: challengesList.filter(c => c.status === 'Aktivan').length, bg: 'bg-green-100', color: 'text-green-600', icon: Trophy },
    { label: 'Ukupno učesnika', value: challengesList.reduce((sum, c) => sum + c.participants, 0), bg: 'bg-purple-100', color: 'text-purple-600', icon: Users },
  ]

  async function fetchChallenges() {
    try {
      setLoading(true)
      setError(null)
      const data = await challengesApi.getAllAdmin()
      setChallengesList(Array.isArray(data) ? data.map(normalizeChallenge) : [])
    } catch (err) {
      setError(err.message || 'Greška pri učitavanju izazova')
      setChallengesList([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchChallenges() }, [])

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleOpenAddModal = () => {
    setEditingId(null)
    resetForm()
    setShowModal(true)
  }

  const handleOpenEditModal = (challenge) => {
    setEditingId(challenge.id)
    setFormData({
      title: challenge.title,
      description: challenge.description,
      rules: challenge.rules || '',
      startDate: toInputDate(challenge.startDate),
      endDate: toInputDate(challenge.endDate),
      status: challenge.status,
      isPublic: true,
    })
    setShowModal(true)
  }

  const handleOpenParticipantsModal = async (challenge) => {
    setSelectedChallenge(challenge)
    setParticipants([])
    setLeaderboard([])
    setShowParticipantsModal(true)
    setParticipantsLoading(true)
    setLeaderboardLoading(true)
    try {
      const [parts, lb] = await Promise.all([
        challengesApi.getParticipants(challenge.id),
        challengesApi.getLeaderboard(challenge.id),
      ])
      setParticipants(Array.isArray(parts) ? parts : [])
      setLeaderboard(Array.isArray(lb) ? lb : [])
    } catch (err) {
      setError(err.message || 'Greška pri učitavanju učesnika')
      setParticipants([])
      setLeaderboard([])
    } finally {
      setParticipantsLoading(false)
      setLeaderboardLoading(false)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSaving(true)
    setError(null)
    try {
      const payload = {
        title: formData.title,
        description: formData.description,
        rules: formData.rules || formData.description,
        startDate: formData.startDate,
        endDate: formData.endDate,
        status: mapUiStatusToBackend(formData.status),
        isPublic: formData.isPublic,
      }
      if (editingId) {
        await challengesApi.update(editingId, payload)
      } else {
        await challengesApi.create(payload)
      }
      setShowModal(false)
      setEditingId(null)
      resetForm()
      await fetchChallenges()
    } catch (err) {
      setError(err.message || 'Greška pri čuvanju.')
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async (id) => {
    if (!confirm('Jesi li sigurna da želiš obrisati ovaj izazov? Ova akcija se ne može poništiti.')) return
    try {
      await challengesApi.delete(id)
      await fetchChallenges()
    } catch (err) {
      setError(err.message || 'Greška pri brisanju.')
    }
  }

  return (
    <div className="p-4 lg:p-8">
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground lg:text-3xl">Upravljaj izazovima</h1>
          <p className="text-muted-foreground">Napravi i upravljaj izazovima</p>
        </div>
        <button onClick={handleOpenAddModal}
          className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground hover:opacity-90 transition-opacity">
          <Plus size={16} /> Napravi izazov
        </button>
      </div>

      {error && (
        <div className="mb-6 rounded-lg border border-destructive/20 bg-destructive/10 px-4 py-3 text-sm text-destructive">
          {error}
        </div>
      )}

      {/* Modal kreiranje/uređivanje */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setShowModal(false)} />
          <div className="relative z-10 w-full max-w-2xl rounded-lg border border-border bg-card p-8 shadow-lg max-h-[90vh] overflow-y-auto">
            <div className="mb-6 flex items-center justify-between">
              <h2 className="text-2xl font-bold text-foreground">{editingId ? 'Uredi Izazov' : 'Napravi Novi Izazov'}</h2>
              <button onClick={() => setShowModal(false)} className="text-muted-foreground hover:text-foreground"><X size={24} /></button>
            </div>
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label htmlFor="title" className={labelClass}>Naziv Izazova</label>
                <input id="title" name="title" type="text" className={inputClass}
                  placeholder="Unesite naziv izazova" value={formData.title} onChange={handleInputChange} required />
              </div>
              <div>
                <label htmlFor="status" className={labelClass}>Status Izazova</label>
                <select id="status" name="status" className={inputClass} value={formData.status} onChange={handleInputChange}>
                  {challengeStatuses.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
              <div>
                <label htmlFor="description" className={labelClass}>Opis Izazova</label>
                <textarea id="description" name="description" className={`${inputClass} min-h-32 resize-none`}
                  placeholder="Unesite opis izazova" value={formData.description} onChange={handleInputChange} required />
              </div>
              <div>
                <label htmlFor="rules" className={labelClass}>Pravila</label>
                <textarea id="rules" name="rules" className={`${inputClass} min-h-20 resize-none`}
                  placeholder="Unesite pravila izazova" value={formData.rules} onChange={handleInputChange} />
              </div>
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <label htmlFor="startDate" className={labelClass}>Datum Pocetka</label>
                  <input id="startDate" name="startDate" type="date" className={inputClass}
                    value={formData.startDate} onChange={handleInputChange} required />
                </div>
                <div>
                  <label htmlFor="endDate" className={labelClass}>Datum Zavrsetka</label>
                  <input id="endDate" name="endDate" type="date" className={inputClass}
                    value={formData.endDate} onChange={handleInputChange} required />
                </div>
              </div>
              <div className="flex gap-3 pt-6">
                <button type="button" onClick={() => setShowModal(false)}
                  className="flex-1 rounded-lg border border-border px-4 py-2.5 text-sm font-medium text-foreground hover:bg-muted transition-colors">
                  Otkazi
                </button>
                <button type="submit" disabled={saving}
                  className="flex-1 rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground hover:opacity-90 transition-opacity disabled:opacity-50">
                  {saving ? 'Cuvanje...' : editingId ? 'Azuriraj Izazov' : 'Napravi Izazov'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal učesnici */}
      {showParticipantsModal && selectedChallenge && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setShowParticipantsModal(false)} />
          <div className="relative z-10 w-full max-w-2xl rounded-lg border border-border bg-card p-8 shadow-lg max-h-[90vh] overflow-y-auto">
            <div className="mb-6 flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-foreground">Učesnici izazova</h2>
                <p className="mt-1 text-sm text-muted-foreground">{selectedChallenge.title}</p>
              </div>
              <button onClick={() => setShowParticipantsModal(false)} className="text-muted-foreground hover:text-foreground"><X size={24} /></button>
            </div>
            {participantsLoading || leaderboardLoading ? (
              <div className="rounded-lg border border-border bg-muted/50 p-8 text-center">
                <div className="h-6 w-6 animate-spin rounded-full border-4 border-primary border-t-transparent mx-auto mb-2" />
                <p className="text-muted-foreground">Učitavanje...</p>
              </div>
            ) : participants.length === 0 ? (
              <div className="rounded-lg border border-border bg-muted/50 p-8 text-center">
                <Users size={48} className="mx-auto mb-3 text-muted-foreground opacity-50" />
                <p className="text-muted-foreground">Nema učesnika za ovaj izazov</p>
              </div>
            ) : (
              <div>
                {/* Rang-lista ako ima score podataka */}
                {leaderboard.length > 0 ? (
                  <div>
                    <p className="text-xs text-muted-foreground mb-3">Rang-lista na osnovu napretka (težina × 10 + struk × 3 + ruka × 2 + noga × 2)</p>
                    {leaderboard.map((entry, i) => (
                      <div key={entry.userId}
                        className={['flex items-center justify-between px-3 py-3 rounded-lg mb-1', i % 2 === 0 ? 'bg-muted/30' : ''].join(' ')}>
                        <div className="flex items-center gap-3">
                          {entry.rank === 1 ? <div className="flex h-8 w-8 items-center justify-center rounded-full bg-yellow-100 text-yellow-600 shrink-0"><Medal size={16} /></div>
                            : entry.rank === 2 ? <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-200 text-gray-600 shrink-0"><Medal size={16} /></div>
                              : entry.rank === 3 ? <div className="flex h-8 w-8 items-center justify-center rounded-full bg-orange-100 text-orange-600 shrink-0"><Medal size={16} /></div>
                                : <div className="flex h-8 w-8 items-center justify-center rounded-full bg-muted text-muted-foreground text-sm font-medium shrink-0">{entry.rank}</div>
                          }
                          <p className="text-sm font-medium text-foreground">{entry.name}</p>
                        </div>
                        <div className="flex items-center gap-1">
                          <Flame size={16} className="text-primary" />
                          <span className="font-semibold text-foreground text-sm">{Number(entry.score).toFixed(1)} pts</span>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  /* Samo lista ucesnika ako nema score-a */
                  <div className="space-y-2">
                    {participants.map(participant => (
                      <div key={participant.id} className="flex items-center justify-between rounded-lg border border-border px-4 py-3">
                        <div className="flex items-center gap-3">
                          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/10 shrink-0">
                            <span className="text-sm font-semibold text-primary">
                              {participant.userFirstName?.[0]}{participant.userLastName?.[0]}
                            </span>
                          </div>
                          <div>
                            <p className="font-medium text-foreground">{participant.userFirstName} {participant.userLastName}</p>
                            <p className="text-xs text-muted-foreground">Pridruženo: {formatDate(participant.joinedAt)}</p>
                          </div>
                        </div>
                        <span className={`rounded-full px-2.5 py-1 text-xs font-medium ${participant.status === 'Active' ? 'bg-green-100 text-green-700' :
                          participant.status === 'Completed' ? 'bg-blue-100 text-blue-700' :
                            'bg-gray-100 text-gray-600'
                          }`}>
                          {mapBackendStatusToUi(participant.status)}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Stats */}
      <div className="mb-6 grid w-fit gap-4 md:grid-cols-3">
        {stats.map(({ label, value, bg, color, icon: Icon }) => (
          <div key={label} className="rounded-lg border border-border bg-card p-5 shadow-sm">
            <div className="flex items-center gap-3">
              <div className={`flex h-10 w-10 items-center justify-center rounded-full ${bg}`}><Icon size={20} className={color} /></div>
              <div>
                <p className="text-2xl font-bold text-foreground">{value}</p>
                <p className="text-sm text-muted-foreground">{label}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Lista izazova */}
      {loading ? (
        <div className="rounded-lg border border-border bg-card p-8 text-center text-muted-foreground shadow-sm">Učitavanje izazova...</div>
      ) : (
        <div className="grid gap-6">
          {challengesList.map(c => (
            <div key={c.id} className="rounded-lg border border-border bg-card shadow-sm p-5">
              <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                <div className="flex items-start gap-4">
                  <div className="flex h-14 w-14 items-center justify-center rounded-lg bg-primary/10 shrink-0">
                    <Trophy size={28} className="text-primary" />
                  </div>
                  <div>
                    <div className="mb-2 flex flex-wrap items-center gap-2">
                      <h3 className="font-semibold text-foreground">{c.title}</h3>
                      <span className={`rounded-full px-2.5 py-1 text-xs font-medium ${statusColors[c.status] || 'bg-gray-100 text-gray-700'}`}>{c.status}</span>
                      <span className="rounded border border-border px-2 py-0.5 text-xs text-muted-foreground">{c.type}</span>
                    </div>
                    <p className="mb-3 text-sm text-muted-foreground">{c.description}</p>
                    <div className="mb-3 flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                      <span className="flex items-center gap-1"><Calendar size={14} />{formatDate(c.startDate)} - {formatDate(c.endDate)}</span>
                      <span className="flex items-center gap-1"><Users size={14} />{c.participants} participants</span>
                    </div>
                    {c.status !== 'Nadolazi' && (
                      <div className="w-64">
                        <div className="mb-1 flex items-center justify-between text-sm">
                          <span className="text-muted-foreground">Progress</span>
                          <span className="text-foreground">{c.progress}%</span>
                        </div>
                        <div className="h-2 overflow-hidden rounded-full bg-muted">
                          <div className="h-full rounded-full bg-primary" style={{ width: `${c.progress}%` }} />
                        </div>
                      </div>
                    )}
                  </div>
                </div>
                <div className="flex flex-wrap gap-2">
                  <button onClick={() => handleOpenParticipantsModal(c)}
                    className="inline-flex items-center gap-2 rounded-lg border border-border px-3 py-2 text-sm font-medium text-foreground hover:bg-muted transition-colors">
                    <Eye size={14} /> Vidi Ucesnike
                  </button>
                  <button onClick={() => handleOpenEditModal(c)}
                    className="inline-flex items-center gap-2 rounded-lg border border-border px-3 py-2 text-sm font-medium text-foreground hover:bg-muted transition-colors">
                    <Edit size={14} /> Uredi
                  </button>
                  <button onClick={() => handleDelete(c.id)}
                    className="inline-flex items-center gap-2 rounded-lg border border-border px-3 py-2 text-sm font-medium text-destructive hover:bg-muted transition-colors">
                    <Trash2 size={14} /> Obrisi
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}