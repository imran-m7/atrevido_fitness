import React, { useEffect, useState } from 'react'
import { Plus, Edit, Trash2, Users, Calendar, Trophy, Eye, X } from 'lucide-react'

const statusColors = {
  Aktivan: 'bg-green-100 text-green-700',
  Nadolazi: 'bg-blue-100 text-blue-700',
  Zavrsen: 'bg-gray-100 text-gray-700',
}

const challengeTypes = ['Konstantnost', 'Snaga', 'Kardio', 'Fleksibilnost', 'Timski Kardio', 'Izdrzljivost']
const challengeStatuses = ['Aktivan', 'Nadolazi', 'Zavrsen']

const inputClass = 'w-full rounded-lg border border-input bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring'
const labelClass = 'block mb-1.5 text-sm font-medium text-foreground'

function getToken() {
  return localStorage.getItem('token') || ''
}

function getRequestErrorMessage(status, defaultMessage) {
  if (status === 401) return 'Morate biti prijavljeni.'
  if (status === 403) return 'Nemate dozvolu za pristup.'
  if (status === 500) return 'Greška na serveru.'
  return defaultMessage
}

function mapBackendStatusToUi(status) {
  if (status === 'Active') return 'Aktivan'
  if (status === 'Upcoming') return 'Nadolazi'
  if (status === 'Completed') return 'Zavrsen'
  if (status === 'Aktivan' || status === 'Nadolazi' || status === 'Zavrsen') return status
  return 'Nadolazi'
}

function mapUiStatusToBackend(status) {
  if (status === 'Aktivan') return 'Active'
  if (status === 'Nadolazi') return 'Upcoming'
  if (status === 'Zavrsen') return 'Completed'
  if (status === 'Active' || status === 'Upcoming' || status === 'Completed') return status
  return 'Upcoming'
}

function formatDate(value) {
  if (!value) return '-'

  const date = new Date(value)
  if (Number.isNaN(date.getTime())) {
    return value
  }

  return date.toLocaleDateString('bs-BA', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })
}

function toInputDate(value) {
  if (!value) return ''

  const date = new Date(value)
  if (Number.isNaN(date.getTime())) {
    return typeof value === 'string' ? value.slice(0, 10) : ''
  }

  return date.toISOString().slice(0, 10)
}

function normalizeChallenge(challenge) {
  return {
    id: challenge?.id ?? challenge?.Id,
    title: challenge?.title ?? challenge?.Title ?? '',
    description: challenge?.description ?? challenge?.Description ?? '',
    rules: challenge?.rules ?? challenge?.Rules ?? '',
    status: mapBackendStatusToUi(challenge?.status ?? challenge?.Status),
    startDate: challenge?.startDate ?? challenge?.StartDate ?? '',
    endDate: challenge?.endDate ?? challenge?.EndDate ?? '',
    participants: challenge?.participantCount ?? challenge?.ParticipantCount ?? 0,
    type: 'Izazov',
    progress: 0,
  }
}

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
  const [formData, setFormData] = useState({
    title: '',
    type: 'Konstantnost',
    description: '',
    startDate: '',
    endDate: '',
    status: 'Aktivan',
  })

  const apiUrl = import.meta.env.VITE_API_URL

  const stats = [
    { label: 'Ukupno Izazova', value: challengesList.length, bg: 'bg-primary/10', color: 'text-primary', icon: Trophy },
    { label: 'Aktivni Izazovi', value: challengesList.filter((c) => c.status === 'Aktivan').length, bg: 'bg-green-100', color: 'text-green-600', icon: Trophy },
    { label: 'Ukupno Ucesnika', value: challengesList.reduce((sum, c) => sum + c.participants, 0), bg: 'bg-purple-100', color: 'text-purple-600', icon: Users },
  ]

  function getAuthHeaders(token, includeJson = false) {
    const headers = {}

    headers.Authorization = `Bearer ${token}`

    if (includeJson) {
      headers['Content-Type'] = 'application/json'
    }

    return headers
  }

  async function fetchChallenges() {
    const url = `${apiUrl}/api/challenges/admin/all`

    if (!apiUrl) {
      setError('API not configured')
      setChallengesList([])
      setLoading(false)
      return
    }

    const token = getToken()

    if (!token) {
      setError('Morate biti prijavljeni.')
      setChallengesList([])
      setLoading(false)
      return
    }

    try {
      setLoading(true)
      setError(null)

      const response = await fetch(url, {
        headers: getAuthHeaders(token),
      })

      if (!response.ok) {
        const body = await response.text()
        console.error('Failed to load challenges:', url, response.status, body)
        throw new Error(getRequestErrorMessage(response.status, 'Failed to load challenges'))
      }

      const data = await response.json()
      setChallengesList(Array.isArray(data) ? data.map(normalizeChallenge) : [])
    } catch (fetchError) {
      console.error('Failed to load challenges:', fetchError)
      setError(fetchError.message || 'Failed to load challenges')
      setChallengesList([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchChallenges()
  }, [apiUrl])

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const resetForm = () => {
    setFormData({
      title: '',
      type: 'Konstantnost',
      description: '',
      startDate: '',
      endDate: '',
      status: 'Aktivan',
    })
  }

  const resetForm = () => setFormData(emptyForm)

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
      startDate: toInputDate(challenge.startDate),
      endDate: toInputDate(challenge.endDate),
      status: challenge.status,
    })
    setShowModal(true)
  }

  const handleOpenParticipantsModal = async (challenge) => {
    const url = `${apiUrl}/api/challenges/${challenge.id}/participants`

    setSelectedChallenge(challenge)
    setParticipants([])
    setShowParticipantsModal(true)

    if (!apiUrl) {
      setError('API not configured')
      return
    }

    const token = getToken()

    if (!token) {
      setError('Morate biti prijavljeni.')
      return
    }

    try {
      setParticipantsLoading(true)
      setError(null)

      const response = await fetch(url, {
        headers: getAuthHeaders(token),
      })

      if (!response.ok) {
        const body = await response.text()
        console.error('Failed to load participants:', url, response.status, body)
        throw new Error(getRequestErrorMessage(response.status, 'Failed to load participants'))
      }

      const data = await response.json()
      setParticipants(Array.isArray(data) ? data : [])
    } catch (participantsError) {
      console.error('Failed to load participants:', participantsError)
      setError(participantsError.message || 'Failed to load participants')
      setParticipants([])
    } finally {
      setParticipantsLoading(false)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!apiUrl) {
      setError('API not configured')
      return
    }

    const token = getToken()

    if (!token) {
      setError('Morate biti prijavljeni.')
      return
    }

    const payload = {
      title: formData.title,
      description: formData.description,
      rules: formData.description,
      startDate: formData.startDate,
      endDate: formData.endDate,
      status: mapUiStatusToBackend(formData.status),
      isPublic: true,
    }

    try {
      setError(null)

      const url = editingId
        ? `${apiUrl}/api/challenges/${editingId}`
        : `${apiUrl}/api/challenges`

      const method = editingId ? 'PUT' : 'POST'

      const response = await fetch(url, {
        method,
        headers: getAuthHeaders(token, true),
        body: JSON.stringify(payload),
      })

      if (!response.ok) {
        const body = await response.text()
        console.error('Failed to save challenge:', url, response.status, body)
        throw new Error(getRequestErrorMessage(response.status, 'Failed to save challenge'))
      }

      setShowModal(false)
      setEditingId(null)
      resetForm()
      await fetchChallenges()
    } catch (submitError) {
      console.error('Failed to save challenge:', submitError)
      setError(submitError.message || 'Failed to save challenge')
    }
  }

  const handleDelete = (id) => {
    console.warn(`Delete endpoint is not implemented for challenge ${id}.`)
    setError('Brisanje izazova jos nije povezano sa backendom.')
  }

  return (
    <div className="p-4 lg:p-8">
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground lg:text-3xl">Upravljaj Izazovima</h1>
          <p className="text-muted-foreground">Napravi i upravljaj izazovima</p>
        </div>
        <button onClick={handleOpenAddModal}
          className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground hover:opacity-90 transition-opacity">
          <Plus size={16} /> Napravi Izazov
        </button>
      </div>

      {error && (
        <div className="mb-6 rounded-lg border border-destructive/20 bg-destructive/10 px-4 py-3 text-sm text-destructive">
          {error}
        </div>
      )}

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

              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <label htmlFor="type" className={labelClass}>Tip Izazova</label>
                  <select
                    id="type"
                    name="type"
                    className={inputClass}
                    value={formData.type}
                    onChange={handleInputChange}
                  >
                    {challengeTypes.map((t) => (
                      <option key={t} value={t}>{t}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label htmlFor="status" className={labelClass}>Status Izazova</label>
                  <select
                    id="status"
                    name="status"
                    className={inputClass}
                    value={formData.status}
                    onChange={handleInputChange}
                  >
                    {challengeStatuses.map((s) => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                </div>
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
                  <input
                    id="startDate"
                    name="startDate"
                    type="date"
                    className={inputClass}
                    value={formData.startDate}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div>
                  <label htmlFor="endDate" className={labelClass}>Datum Zavrsetka</label>
                  <input
                    id="endDate"
                    name="endDate"
                    type="date"
                    className={inputClass}
                    value={formData.endDate}
                    onChange={handleInputChange}
                    required
                  />
                </div>
              </div>

              <div className="flex gap-3 pt-6">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="flex-1 rounded-lg border border-border px-4 py-2.5 text-sm font-medium text-foreground hover:bg-muted transition-colors"
                >
                  Otkazi
                </button>
                <button
                  type="submit"
                  className="flex-1 rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground hover:opacity-90 transition-opacity"
                >
                  {editingId ? 'Azuriraj Izazov' : 'Napravi Izazov'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showParticipantsModal && selectedChallenge && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setShowParticipantsModal(false)} />
          <div className="relative z-10 w-full max-w-2xl rounded-lg border border-border bg-card p-8 shadow-lg max-h-[90vh] overflow-y-auto">
            <div className="mb-6 flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-foreground">Ucesnici Izazova</h2>
                <p className="mt-1 text-sm text-muted-foreground">{selectedChallenge.title}</p>
              </div>
              <button onClick={() => setShowParticipantsModal(false)} className="text-muted-foreground hover:text-foreground">
                <X size={24} />
              </button>
            </div>

            {participantsLoading ? (
              <div className="rounded-lg border border-border bg-muted/50 p-8 text-center">
                <p className="text-muted-foreground">Ucitavanje ucesnika...</p>
              </div>
            ) : participants.length === 0 ? (
              <div className="rounded-lg border border-border bg-muted/50 p-8 text-center">
                <Users size={48} className="mx-auto mb-3 text-muted-foreground opacity-50" />
                <p className="text-muted-foreground">Ucesnici ce se pojaviti ovdje</p>
                <p className="mt-1 text-sm text-muted-foreground">Ukupno ucesnika: {selectedChallenge.participants}</p>
              </div>
            ) : (
              <div className="grid gap-3">
                {participants.map((participant) => (
                  <div key={participant.id} className="rounded-lg border border-border bg-card p-4">
                    <div className="flex items-center justify-between gap-4">
                      <div>
                        <p className="font-medium text-foreground">{participant.userFirstName} {participant.userLastName}</p>
                        <p className="text-sm text-muted-foreground">{mapBackendStatusToUi(participant.status)}</p>
                      </div>
                      <p className="text-sm text-muted-foreground">{formatDate(participant.joinedAt)}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      <div className="mb-6 grid w-fit gap-4 md:grid-cols-3 mx-auto">
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

      {loading ? (
        <div className="rounded-lg border border-border bg-card p-8 text-center text-muted-foreground shadow-sm">
          Ucitavanje izazova...
        </div>
      ) : (
        <div className="grid gap-6">
          {challengesList.map((c) => (
            <div key={c.id} className="rounded-lg border border-border bg-card shadow-sm p-5">
              <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                <div className="flex items-start gap-4">
                  <div className="flex h-14 w-14 items-center justify-center rounded-lg bg-primary/10 shrink-0">
                    <Trophy size={28} className="text-primary" />
                  </div>
                  <div>
                    <div className="mb-2 flex flex-wrap items-center gap-2">
                      <h3 className="font-semibold text-foreground">{c.title}</h3>
                      <span className={`rounded-full px-2.5 py-1 text-xs font-medium ${statusColors[c.status]}`}>{c.status}</span>
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
                  <button onClick={() => handleOpenParticipantsModal(c)} className="inline-flex items-center gap-2 rounded-lg border border-border px-3 py-2 text-sm font-medium text-foreground hover:bg-muted transition-colors">
                    <Eye size={14} /> Vidi Ucesnike
                  </button>
                  <button onClick={() => handleOpenEditModal(c)} className="inline-flex items-center gap-2 rounded-lg border border-border px-3 py-2 text-sm font-medium text-foreground hover:bg-muted transition-colors">
                    <Edit size={14} /> Uredi
                  </button>
                  <button onClick={() => handleDelete(c.id)} className="inline-flex items-center gap-2 rounded-lg border border-border px-3 py-2 text-sm font-medium text-destructive hover:bg-muted transition-colors">
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