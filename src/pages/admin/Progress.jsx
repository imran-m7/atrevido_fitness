import React, { useEffect, useMemo, useState } from 'react'
import { TrendingUp, Plus, Scale, Ruler, Search } from 'lucide-react'

const API_URL = import.meta.env.VITE_API_URL

const inputClass = 'w-full rounded-lg border border-input bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring transition-colors'
const labelClass = 'block mb-1.5 text-sm font-medium text-foreground'
const emptyForm = { date: '', height: '', weight: '', ruka: '', t1: '', t2: '', t3: '', bokovi: '', noga: '' }

function getToken() {
  return localStorage.getItem('token') || ''
}

function authHeaders(token) {
  return { Authorization: `Bearer ${token}` }
}

function jsonAuthHeaders(token) {
  return {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${token}`,
  }
}

function getRequestErrorMessage(status, defaultMessage) {
  if (status === 401) return 'Morate biti prijavljeni.'
  if (status === 403) return 'Nemate dozvolu za pristup.'
  if (status === 500) return 'Greška na serveru.'
  return defaultMessage
}

function normalizeMember(member) {
  return {
    id: member.id ?? member.Id,
    firstName: member.firstName ?? member.FirstName ?? '',
    lastName: member.lastName ?? member.LastName ?? '',
    email: member.email ?? member.Email ?? '',
    role: member.role ?? member.Role ?? '',
  }
}

function normalizeProgressEntry(entry) {
  return {
    id: entry.id ?? entry.Id,
    userId: entry.userId ?? entry.UserId,
    entryDate: entry.entryDate ?? entry.EntryDate,
    weightKg: entry.weightKg ?? entry.WeightKg ?? null,
    waistCm: entry.waistCm ?? entry.WaistCm ?? null,
    hipsCm: entry.hipsCm ?? entry.HipsCm ?? null,
    chestCm: entry.chestCm ?? entry.ChestCm ?? null,
    armCm: entry.armCm ?? entry.ArmCm ?? null,
    thighCm: entry.thighCm ?? entry.ThighCm ?? null,
    notes: entry.notes ?? entry.Notes ?? '',
  }
}

function formatMemberName(member) {
  if (!member) return ''
  const name = `${member.firstName} ${member.lastName}`.trim()
  return name || member.email || `Member #${member.id}`
}

function formatDate(value) {
  if (!value) return '-'
  return String(value).split('T')[0]
}

function formatValue(value, unit) {
  if (value === null || value === undefined || value === '') return '-'
  return `${Number(value).toFixed(1)} ${unit}`
}

function toNullableNumber(value) {
  if (value === '' || value === null || value === undefined) return null
  return Number(value)
}

function measurementValue(value) {
  return Number(value ?? 0)
}

function buildScoreChartData(entries) {
  const sortedEntries = [...entries].sort((a, b) => new Date(a.entryDate) - new Date(b.entryDate))

  if (sortedEntries.length === 0) return []

  const first = sortedEntries[0]

  return sortedEntries.map((entry) => {
    const weightLoss = measurementValue(first.weightKg) - measurementValue(entry.weightKg)
    const waistLoss = measurementValue(first.waistCm) - measurementValue(entry.waistCm)
    const armLoss = measurementValue(first.armCm) - measurementValue(entry.armCm)
    const thighLoss = measurementValue(first.thighCm) - measurementValue(entry.thighCm)
    const score = (weightLoss * 10) + (waistLoss * 3) + (armLoss * 2) + (thighLoss * 2)

    return {
      date: formatDate(entry.entryDate),
      score: sortedEntries.length === 1 ? 0 : Number(score.toFixed(2)),
    }
  })
}

function ScoreProgressChart({ entries }) {
  const chartData = buildScoreChartData(entries)

  if (chartData.length < 2) {
    return (
      <div className="flex h-64 items-center justify-center rounded-lg bg-muted/50">
        <p className="text-center text-sm text-muted-foreground">
          Potrebna su najmanje dva unosa za prikaz grafa.
        </p>
      </div>
    )
  }

  const width = 640
  const height = 220
  const padding = 36
  const scores = chartData.map(item => item.score)
  const minScore = Math.min(0, ...scores)
  const maxScore = Math.max(0, ...scores)
  const scoreRange = maxScore - minScore || 1

  const points = chartData.map((item, index) => {
    const x = padding + (index / (chartData.length - 1)) * (width - padding * 2)
    const y = height - padding - ((item.score - minScore) / scoreRange) * (height - padding * 2)
    return { ...item, x, y }
  })

  const linePath = points
    .map((point, index) => `${index === 0 ? 'M' : 'L'} ${point.x} ${point.y}`)
    .join(' ')

  return (
    <div className="h-64 rounded-lg bg-muted/50 p-4">
      <svg className="h-full w-full" viewBox={`0 0 ${width} ${height}`} role="img" aria-label="Graf rezultata napretka kroz vrijeme">
        <line x1={padding} y1={padding} x2={padding} y2={height - padding} stroke="hsl(var(--border))" strokeWidth="1" />
        <line x1={padding} y1={height - padding} x2={width - padding} y2={height - padding} stroke="hsl(var(--border))" strokeWidth="1" />
        {[0, 0.5, 1].map((ratio) => {
          const y = padding + ratio * (height - padding * 2)
          const score = maxScore - ratio * scoreRange
          return (
            <g key={ratio}>
              <line x1={padding} y1={y} x2={width - padding} y2={y} stroke="hsl(var(--border))" strokeWidth="0.75" opacity="0.45" />
              <text x={padding - 8} y={y + 4} textAnchor="end" className="fill-muted-foreground text-[10px]">
                {score.toFixed(0)}
              </text>
            </g>
          )
        })}
        <path d={linePath} fill="none" stroke="hsl(var(--primary))" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
        {points.map((point, index) => (
          <g key={`${point.date}-${index}`}>
            <circle cx={point.x} cy={point.y} r="5" fill="hsl(var(--primary))">
              <title>{`${point.date}: score ${point.score}`}</title>
            </circle>
            <text x={point.x} y={height - 10} textAnchor="middle" className="fill-muted-foreground text-[10px]">
              {point.date.slice(5)}
            </text>
          </g>
        ))}
      </svg>
    </div>
  )
}

export default function AdminProgress() {
  const [members, setMembers] = useState([])
  const [selectedMember, setSelectedMember] = useState(null)
  const [memberSearch, setMemberSearch] = useState('')
  const [form, setForm] = useState(emptyForm)
  const [progressEntries, setProgressEntries] = useState([])
  const [membersLoading, setMembersLoading] = useState(true)
  const [progressLoading, setProgressLoading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    async function loadMembers() {
      const token = getToken()

      if (!token) {
        setMembers([])
        setSelectedMember(null)
        setError('Morate biti prijavljeni.')
        setMembersLoading(false)
        return
      }

      setMembersLoading(true)
      setError('')

      try {
        const response = await fetch(`${API_URL}/api/users/members`, {
          headers: authHeaders(token),
        })

        if (!response.ok) {
          throw new Error(getRequestErrorMessage(response.status, 'Nije moguće učitati članove iz backend-a.'))
        }

        const data = await response.json()
        const loadedMembers = Array.isArray(data)
          ? data
            .map(normalizeMember)
            .filter(member => member.id)
          : []

        console.log('loaded members', loadedMembers)

        setMembers(loadedMembers)
        setSelectedMember(loadedMembers[0] ?? null)
      } catch (err) {
        setMembers([])
        setSelectedMember(null)
        setError(err.message || 'Nije moguće učitati članove iz backend-a.')
      } finally {
        setMembersLoading(false)
      }
    }

    loadMembers()
  }, [])

  useEffect(() => {
    async function loadProgress() {
      const token = getToken()

      if (!selectedMember?.id) {
        setProgressEntries([])
        return
      }

      if (!token) {
        setProgressEntries([])
        setError('Morate biti prijavljeni.')
        return
      }

      console.log('selected member id', selectedMember.id)

      setProgressLoading(true)
      setError('')

      try {
        const response = await fetch(`${API_URL}/api/progress/user/${selectedMember.id}`, {
          headers: authHeaders(token),
        })

        if (!response.ok) {
          throw new Error(getRequestErrorMessage(response.status, 'Nije moguće učitati napredak za odabranog člana.'))
        }

        const data = await response.json()
        const loadedEntries = Array.isArray(data)
          ? data
            .map(normalizeProgressEntry)
            .sort((a, b) => new Date(b.entryDate) - new Date(a.entryDate))
          : []

        console.log('loaded progress entries', loadedEntries)
        setProgressEntries(loadedEntries)
      } catch (err) {
        setProgressEntries([])
        setError(err.message || 'Nije moguće učitati napredak za odabranog člana.')
      } finally {
        setProgressLoading(false)
      }
    }

    loadProgress()
  }, [selectedMember?.id])

  const filteredMembers = useMemo(() => {
    const search = memberSearch.trim().toLowerCase()

    if (!search) return members

    return members.filter(member => {
      const text = `${formatMemberName(member)} ${member.email}`.toLowerCase()
      return text.includes(search)
    })
  }, [memberSearch, members])

  const latestEntry = progressEntries[0] ?? null
  const handleChange = (e) => setForm({ ...form, [e.target.id]: e.target.value })

  const refreshSelectedMemberProgress = async (token) => {
    const progressResponse = await fetch(`${API_URL}/api/progress/user/${selectedMember.id}`, {
      headers: authHeaders(token),
    })

    if (!progressResponse.ok) {
      throw new Error(getRequestErrorMessage(progressResponse.status, 'Napredak je sačuvan, ali osvježavanje nije uspjelo.'))
    }

    const data = await progressResponse.json()
    const loadedEntries = Array.isArray(data)
      ? data
        .map(normalizeProgressEntry)
        .sort((a, b) => new Date(b.entryDate) - new Date(a.entryDate))
      : []

    console.log('loaded progress entries', loadedEntries)
    setProgressEntries(loadedEntries)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    const token = getToken()

    if (!token) {
      setError('Morate biti prijavljeni.')
      return
    }

    if (!selectedMember?.id) {
      setError('Odaberite člana prije spremanja napretka.')
      return
    }

    setSaving(true)
    setError('')

    try {
      const notes = [
        form.t2 ? `T2: ${form.t2} cm` : '',
        form.t3 ? `T3: ${form.t3} cm` : '',
      ].filter(Boolean).join(' | ')

      const response = await fetch(`${API_URL}/api/progress/user/${selectedMember.id}`, {
        method: 'POST',
        headers: jsonAuthHeaders(token),
        body: JSON.stringify({
          entryDate: form.date,
          weightKg: toNullableNumber(form.weight),
          waistCm: toNullableNumber(form.t1),
          hipsCm: toNullableNumber(form.bokovi),
          armCm: toNullableNumber(form.ruka),
          thighCm: toNullableNumber(form.noga),
          notes: notes || null,
        }),
      })

      if (!response.ok) {
        throw new Error(getRequestErrorMessage(response.status, 'Nije moguće sačuvati napredak.'))
      }

      setForm(emptyForm)
      await refreshSelectedMemberProgress(token)
    } catch (err) {
      setError(err.message || 'Nije moguće sačuvati napredak.')
    } finally {
      setSaving(false)
    }
  }

  const tableHeaders = ['Datum', 'Visina', 'Težina', 'Ruka', 'Struk', 'Bokovi', 'Grudi', 'Noga', 'Bilješka']

  return (
    <div className="p-4 lg:p-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-foreground lg:text-3xl">Upravljanje Napretkom</h1>
        <p className="text-muted-foreground">Prati i upravljaj mjerama članova</p>
      </div>

      {error && (
        <div className="mb-4 rounded-lg border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive">
          {error}
        </div>
      )}

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Lijeva kolona */}
        <div className="space-y-4">
          <div className="rounded-lg border border-border bg-card shadow-sm">
            <div className="flex items-center gap-2 p-5 border-b border-border">
              <Search size={20} />
              <h3 className="font-semibold text-foreground">Izaberi člana</h3>
            </div>
            <div className="p-4">
              <div className="relative mb-4">
                <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                <input type="text" className={inputClass + ' pl-9'} placeholder="Pretraži člana..."
                  value={memberSearch} onChange={e => setMemberSearch(e.target.value)} />
              </div>
              <div className="max-h-48 overflow-y-auto space-y-2">
                {membersLoading ? (
                  <p className="px-3 py-6 text-center text-sm text-muted-foreground">Učitavanje članova...</p>
                ) : filteredMembers.length > 0 ? (
                  filteredMembers.map(member => (
                    <button
                      key={member.id}
                      onClick={() => {
                        setSelectedMember(member)
                        setMemberSearch('')
                      }}
                      className={`w-full rounded-lg px-3 py-2.5 text-sm text-left transition-colors ${selectedMember?.id === member.id
                          ? 'bg-primary text-primary-foreground'
                          : 'hover:bg-muted text-foreground'
                        }`}
                    >
                      <p className="font-medium">{formatMemberName(member)}</p>
                      <p className="text-xs opacity-70">{member.email}</p>
                    </button>
                  ))
                ) : (
                  <p className="px-3 py-6 text-center text-sm text-muted-foreground">Nema članova za prikaz.</p>
                )}
              </div>
            </div>
          </div>

          <div className="rounded-lg border border-border bg-card shadow-sm">
            <div className="flex items-center gap-2 p-5 border-b border-border">
              <Plus size={20} />
              <h3 className="font-semibold text-foreground">Dodaj unos napretka</h3>
            </div>
            <div className="p-5">
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label htmlFor="date" className={labelClass}>Datum</label>
                  <input id="date" type="date" className={inputClass} value={form.date} onChange={handleChange} required />
                </div>
                <div>
                  <label htmlFor="height" className={labelClass}>Visina (cm)</label>
                  <input id="height" type="number" step="0.1" className={inputClass} placeholder="Unesite visinu" value={form.height} onChange={handleChange} />
                </div>
                <div>
                  <label htmlFor="weight" className={labelClass}>Težina (kg)</label>
                  <input id="weight" type="number" step="0.1" className={inputClass} placeholder="Unesite težinu" value={form.weight} onChange={handleChange} required />
                </div>
                <div>
                  <label htmlFor="ruka" className={labelClass}>Ruka - sredina nadlaktice (cm)</label>
                  <input id="ruka" type="number" step="0.1" className={inputClass} placeholder="Unesite mjeru" value={form.ruka} onChange={handleChange} required />
                </div>
                <div>
                  <label htmlFor="t1" className={labelClass}>T1 - najuži dio-struk (cm)</label>
                  <input id="t1" type="number" step="0.1" className={inputClass} placeholder="Unesite mjeru" value={form.t1} onChange={handleChange} required />
                </div>
                <div>
                  <label htmlFor="t2" className={labelClass}>T2 - oko pupka (cm)</label>
                  <input id="t2" type="number" step="0.1" className={inputClass} placeholder="Unesite mjeru" value={form.t2} onChange={handleChange} />
                </div>
                <div>
                  <label htmlFor="t3" className={labelClass}>T3 - najširi dio (cm)</label>
                  <input id="t3" type="number" step="0.1" className={inputClass} placeholder="Unesite mjeru" value={form.t3} onChange={handleChange} />
                </div>
                <div>
                  <label htmlFor="bokovi" className={labelClass}>Bokovi - najširi dio (cm)</label>
                  <input id="bokovi" type="number" step="0.1" className={inputClass} placeholder="Unesite mjeru" value={form.bokovi} onChange={handleChange} required />
                </div>
                <div>
                  <label htmlFor="noga" className={labelClass}>Noga - najširi dio natkoljenice (cm)</label>
                  <input id="noga" type="number" step="0.1" className={inputClass} placeholder="Unesite mjeru" value={form.noga} onChange={handleChange} required />
                </div>
                <button type="submit" disabled={saving || !selectedMember} className="w-full rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground hover:opacity-90 transition-opacity disabled:cursor-not-allowed disabled:opacity-60">
                  {saving ? 'Spremanje...' : 'Sačuvaj napredak'}
                </button>
              </form>
            </div>
          </div>
        </div>

        {/* Desna kolona */}
        <div className="space-y-4 lg:col-span-2">
          <div className="grid gap-4 md:grid-cols-5">
            {[
              { icon: Ruler, label: 'Visina', value: '-', trend: '', neutral: true },
              { icon: Scale, label: 'Težina', value: formatValue(latestEntry?.weightKg, 'kg'), trend: latestEntry ? 'Zadnji unos' : '' },
              { icon: Ruler, label: 'Ruka', value: formatValue(latestEntry?.armCm, 'cm'), trend: latestEntry ? 'Zadnji unos' : '' },
              { icon: Ruler, label: 'Bokovi', value: formatValue(latestEntry?.hipsCm, 'cm'), trend: latestEntry ? 'Zadnji unos' : '' },
              { icon: Ruler, label: 'Noga', value: formatValue(latestEntry?.thighCm, 'cm'), trend: latestEntry ? 'Zadnji unos' : '' },
            ].map(({ icon: Icon, label, value, trend, neutral }) => (
              <div key={label} className="rounded-lg border border-border bg-card p-4 shadow-sm">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 shrink-0"><Icon size={18} className="text-primary" /></div>
                  <div>
                    <p className="text-sm text-muted-foreground">{label}</p>
                    <p className="text-lg font-bold text-foreground">{value}</p>
                    <p className="text-xs text-muted-foreground">{latestEntry ? 'Zadnji unos' : ''}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="rounded-lg border border-border bg-card shadow-sm">
            <div className="flex items-center gap-2 p-5 border-b border-border">
              <TrendingUp size={20} className="text-primary" />
              <h3 className="font-semibold text-foreground">Chart napretka</h3>
            </div>
            <div className="p-5">
              <ScoreProgressChart entries={progressEntries} />
            </div>
          </div>

          <div className="rounded-lg border border-border bg-card shadow-sm">
            <div className="p-5 border-b border-border">
              <h3 className="font-semibold text-foreground">Historija napretka - {selectedMember ? formatMemberName(selectedMember) : 'nema odabranog člana'}</h3>
            </div>
            <div className="p-5 overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border">
                    {tableHeaders.map(h => (
                      <th key={h} className={`pb-3 px-1 text-xs font-medium text-muted-foreground whitespace-nowrap ${h === 'Datum' ? 'text-left' : 'text-right'}`}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {progressLoading ? (
                    <tr>
                      <td colSpan="9" className="py-6 text-center text-sm text-muted-foreground">
                        Učitavanje napretka...
                      </td>
                    </tr>
                  ) : progressEntries.length > 0 ? (
                    progressEntries.map((entry, i) => (
                      <tr key={entry.id ?? entry.entryDate} className={i < progressEntries.length - 1 ? 'border-b border-border' : ''}>
                        <td className="py-3 text-foreground">{formatDate(entry.entryDate)}</td>
                        <td className="py-3 text-right text-foreground">-</td>
                        <td className="py-3 text-right text-foreground">{formatValue(entry.weightKg, 'kg')}</td>
                        <td className="py-3 text-right text-foreground">{formatValue(entry.armCm, 'cm')}</td>
                        <td className="py-3 text-right text-foreground">{formatValue(entry.waistCm, 'cm')}</td>
                        <td className="py-3 text-right text-foreground">-</td>
                        <td className="py-3 text-right text-foreground">-</td>
                        <td className="py-3 text-right text-foreground">{formatValue(entry.hipsCm, 'cm')}</td>
                        <td className="py-3 text-right text-foreground">{formatValue(entry.thighCm, 'cm')}</td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="9" className="py-6 text-center text-sm text-muted-foreground">
                        Nema podataka o napretku.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}