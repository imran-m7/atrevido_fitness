import React, { useEffect, useMemo, useState } from 'react'
import { TrendingUp, Calendar, Scale, Ruler } from 'lucide-react'

const API_URL = import.meta.env.VITE_API_URL

function getToken() {
  return localStorage.getItem('token') || ''
}

function authHeaders(token) {
  return { Authorization: `Bearer ${token}` }
}

function getRequestErrorMessage(status, defaultMessage) {
  if (status === 401) return 'Morate biti prijavljeni.'
  if (status === 403) return 'Nemate dozvolu za pristup.'
  if (status === 500) return 'Greška na serveru.'
  return defaultMessage
}

function normalizeProgressEntry(entry) {
  return {
    id: entry.id ?? entry.Id,
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

function formatDate(value) {
  if (!value) return '-'
  return String(value).split('T')[0]
}

function formatValue(value, unit) {
  if (value === null || value === undefined || value === '') return '-'
  return `${Number(value).toFixed(1)} ${unit}`
}

function formatTrend(oldestValue, latestValue, unit) {
  if (
    oldestValue === null ||
    oldestValue === undefined ||
    latestValue === null ||
    latestValue === undefined
  ) {
    return ''
  }

  const difference = Number(latestValue) - Number(oldestValue)
  const sign = difference > 0 ? '+' : ''
  return `${sign}${difference.toFixed(1)} ${unit} ukupno`
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

export default function MemberProgress() {
  const [progressEntries, setProgressEntries] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    async function loadProgress() {
      const token = getToken()

      if (!token) {
        setProgressEntries([])
        setError('Morate biti prijavljeni.')
        setLoading(false)
        return
      }

      setLoading(true)
      setError('')

      try {
        const response = await fetch(`${API_URL}/api/progress/mine`, {
          headers: authHeaders(token),
        })

        if (!response.ok) {
          throw new Error(getRequestErrorMessage(response.status, 'Nije moguće učitati podatke o napretku.'))
        }

        const data = await response.json()
        const entries = Array.isArray(data)
          ? data
            .map(normalizeProgressEntry)
            .sort((a, b) => new Date(b.entryDate) - new Date(a.entryDate))
          : []

        console.log('loaded progress entries', entries)
        setProgressEntries(entries)
      } catch (err) {
        setProgressEntries([])
        setError(err.message || 'Nije moguće učitati podatke o napretku.')
      } finally {
        setLoading(false)
      }
    }

    loadProgress()
  }, [])

  const summary = useMemo(() => {
    const latest = progressEntries[0] ?? null
    const oldest = progressEntries[progressEntries.length - 1] ?? null

    return [
      {
        icon: Scale,
        label: 'Trenutna težina',
        value: formatValue(latest?.weightKg, 'kg'),
        trend: oldest && latest ? formatTrend(oldest.weightKg, latest.weightKg, 'kg') : '',
      },
      {
        icon: Ruler,
        label: 'Struk',
        value: formatValue(latest?.waistCm, 'cm'),
        trend: oldest && latest ? formatTrend(oldest.waistCm, latest.waistCm, 'cm') : '',
      },
      {
        icon: Ruler,
        label: 'Kukovi',
        value: formatValue(latest?.hipsCm, 'cm'),
        trend: oldest && latest ? formatTrend(oldest.hipsCm, latest.hipsCm, 'cm') : '',
      },
      {
        icon: Calendar,
        label: 'Praćenje',
        value: `${progressEntries.length}`,
        trend: latest ? `Od ${formatDate(oldest?.entryDate)}` : '',
        neutral: true,
      },
    ]
  }, [progressEntries])

  return (
    <div className="p-4 lg:p-8">

      {/* Modal za dodavanje */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setShowForm(false)} />
          <div className="relative z-10 w-full max-w-lg rounded-lg border border-border bg-card p-6 shadow-lg max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-foreground">Dodaj nova mjerenja</h3>
              <button onClick={() => setShowForm(false)} className="text-muted-foreground hover:text-foreground"><X size={20} /></button>
            </div>
            {error && (
              <div className="mb-4 rounded-lg border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive">{error}</div>
            )}
            <form onSubmit={handleSubmit} className="space-y-4">
              <div><label htmlFor="entryDate" className={labelClass}>Datum</label>
                <input id="entryDate" type="date" className={inputClass} value={form.entryDate} onChange={handleChange} required /></div>
              <div><label htmlFor="visina" className={labelClass}>Visina (cm)</label>
                <input id="visina" type="number" step="0.1" className={inputClass} placeholder="npr. 168" value={form.visina} onChange={handleChange} /></div>
              <div><label htmlFor="weightKg" className={labelClass}>Težina (kg)</label>
                <input id="weightKg" type="number" step="0.1" className={inputClass} placeholder="npr. 68.5" value={form.weightKg} onChange={handleChange} /></div>
              <div><label htmlFor="armCm" className={labelClass}>Ruka — sredina nadlaktice (cm)</label>
                <input id="armCm" type="number" step="0.1" className={inputClass} placeholder="npr. 28" value={form.armCm} onChange={handleChange} /></div>
              <div><label htmlFor="waistCm" className={labelClass}>Struk — najuži dio (cm)</label>
                <input id="waistCm" type="number" step="0.1" className={inputClass} placeholder="npr. 72" value={form.waistCm} onChange={handleChange} /></div>
              <div><label htmlFor="hipsCm" className={labelClass}>Bokovi — najširi dio (cm)</label>
                <input id="hipsCm" type="number" step="0.1" className={inputClass} placeholder="npr. 96" value={form.hipsCm} onChange={handleChange} /></div>
              <div><label htmlFor="chestCm" className={labelClass}>Grudi (cm)</label>
                <input id="chestCm" type="number" step="0.1" className={inputClass} placeholder="npr. 88" value={form.chestCm} onChange={handleChange} /></div>
              <div><label htmlFor="thighCm" className={labelClass}>Noga — najširi dio natkoljenice (cm)</label>
                <input id="thighCm" type="number" step="0.1" className={inputClass} placeholder="npr. 54" value={form.thighCm} onChange={handleChange} /></div>
              <div><label htmlFor="notes" className={labelClass}>Bilješka (opcionalno)</label>
                <textarea id="notes" className={`${inputClass} min-h-16 resize-none`} placeholder="npr. Početna mjerenja" value={form.notes} onChange={handleChange} /></div>
              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => setShowForm(false)}
                  className="flex-1 rounded-lg border border-border px-4 py-2.5 text-sm font-medium text-foreground hover:bg-muted transition-colors">
                  Otkaži
                </button>
                <button type="submit" disabled={saving}
                  className="flex-1 rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground hover:opacity-90 transition-opacity disabled:opacity-50">
                  {saving ? 'Čuvanje...' : 'Sačuvaj mjerenja'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground lg:text-3xl">Pregled napretka</h1>
          <p className="text-muted-foreground">Prati svoja mjerenja i vidi napredak tokom vremena</p>
        </div>
        <button onClick={() => setShowForm(true)}
          className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground hover:opacity-90 transition-opacity">
          <Plus size={16} /> Dodaj mjerenja
        </button>
      </div>

      <div className="space-y-6">
        {/* Stats + Chart + Table */}
        <div className="space-y-4">
          {/* Summary Cards */}
          <div className="grid gap-4 md:grid-cols-4">
            {summary.map(({ icon: Icon, label, value, trend, neutral }) => (
              <div key={label} className="rounded-lg border border-border bg-card p-4 shadow-sm">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 shrink-0">
                    <Icon size={18} className="text-primary" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">{label}</p>
                    <p className="text-lg font-bold text-foreground">{value}</p>
                    <p className={`text-xs ${neutral ? 'text-muted-foreground' : 'text-green-600'}`}>{trend}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Chart Placeholder */}
          <div className="rounded-lg border border-border bg-card shadow-sm">
            <div className="flex items-center gap-2 p-5 border-b border-border">
              <TrendingUp size={20} className="text-primary" />
              <h3 className="font-semibold text-foreground">Graf napretka</h3>
            </div>
            <div className="p-5">
              <ScoreProgressChart entries={progressEntries} />
            </div>

          </div>

          {/* History Table */}
          <div className="rounded-lg border border-border bg-card shadow-sm">
            <div className="p-5 border-b border-border">
              <h3 className="font-semibold text-foreground">Historija napretka</h3>
            </div>
            <div className="p-5 overflow-x-auto">
              {loading ? (
                <p className="py-6 text-center text-sm text-muted-foreground">Učitavanje podataka o napretku...</p>
              ) : error ? (
                <p className="py-6 text-center text-sm text-destructive">{error}</p>
              ) : progressEntries.length === 0 ? (
                <p className="py-6 text-center text-sm text-muted-foreground">Nema podataka o napretku.</p>
              ) : (
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-border">
                      {['Datum', 'Težina', 'Struk', 'Kukovi', 'Prs'].map(h => (
                        <th key={h} className={`pb-3 text-sm font-medium text-muted-foreground ${h === 'Datum' ? 'text-left' : 'text-right'}`}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {progressEntries.map((entry, i) => (
                      <tr key={entry.id ?? entry.entryDate} className={i < progressEntries.length - 1 ? 'border-b border-border' : ''}>
                        <td className="py-3 text-sm text-foreground">{formatDate(entry.entryDate)}</td>
                        <td className="py-3 text-right text-sm text-foreground">{formatValue(entry.weightKg, 'kg')}</td>
                        <td className="py-3 text-right text-sm text-foreground">{formatValue(entry.waistCm, 'cm')}</td>
                        <td className="py-3 text-right text-sm text-foreground">{formatValue(entry.hipsCm, 'cm')}</td>
                        <td className="py-3 text-right text-sm text-foreground">{formatValue(entry.chestCm, 'cm')}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}