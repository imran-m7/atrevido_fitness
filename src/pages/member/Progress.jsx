import React, { useEffect, useMemo, useState } from 'react'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts'
import { TrendingUp, Calendar, Scale, Ruler, Plus, X } from 'lucide-react'
import { progressApi } from '../../services/api'

const inputClass = 'w-full rounded-lg border border-input bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring'
const labelClass = 'block mb-1.5 text-sm font-medium text-foreground'
const emptyForm = { entryDate: '', visina: '', weightKg: '', armCm: '', waistCm: '', hipsCm: '', chestCm: '', thighCm: '', notes: '' }

function normalizeProgressEntry(entry) {
  return {
    id: entry.id ?? entry.Id,
    entryDate: entry.entryDate ?? entry.EntryDate,
    heightCm: entry.heightCm ?? entry.HeightCm ?? null,
    weightKg: entry.weightKg ?? entry.WeightKg ?? null,
    armCm: entry.armCm ?? entry.ArmCm ?? null,
    waistCm: entry.waistCm ?? entry.WaistCm ?? null,
    hipsCm: entry.hipsCm ?? entry.HipsCm ?? null,
    chestCm: entry.chestCm ?? entry.ChestCm ?? null,
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
  if (oldestValue == null || latestValue == null) return ''
  const diff = Number(latestValue) - Number(oldestValue)
  return `${diff > 0 ? '+' : ''}${diff.toFixed(1)} ${unit} ukupno`
}

function measurementValue(v) { return Number(v ?? 0) }

function buildScoreChartData(entries) {
  const sorted = [...entries].sort((a, b) => new Date(a.entryDate) - new Date(b.entryDate))
  if (sorted.length === 0) return []
  const first = sorted[0]
  return sorted.map(entry => {
    const weightLoss = measurementValue(first.weightKg) - measurementValue(entry.weightKg)
    const waistLoss = measurementValue(first.waistCm) - measurementValue(entry.waistCm)
    const armLoss = measurementValue(first.armCm) - measurementValue(entry.armCm)
    const thighLoss = measurementValue(first.thighCm) - measurementValue(entry.thighCm)
    const score = (weightLoss * 10) + (waistLoss * 3) + (armLoss * 2) + (thighLoss * 2)
    return { date: formatDate(entry.entryDate), score: sorted.length === 1 ? 0 : Number(score.toFixed(2)) }
  })
}


function ScoreProgressChart({ entries }) {
  const chartData = buildScoreChartData(entries)
  if (chartData.length < 2) {
    return (
      <div className="flex h-64 items-center justify-center rounded-lg bg-muted/50">
        <p className="text-center text-sm text-muted-foreground">Potrebna su najmanje dva unosa za prikaz grafa.</p>
      </div>
    )
  }
  return (
    <div className="h-64">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={chartData} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
          <XAxis
            dataKey="date"
            tick={{ fontSize: 11, fill: 'hsl(var(--muted-foreground))' }}
            tickLine={false}
            axisLine={{ stroke: 'hsl(var(--border))' }}
          />
          <YAxis
            tick={{ fontSize: 11, fill: 'hsl(var(--muted-foreground))' }}
            tickLine={false}
            axisLine={false}
            width={40}
          />
          <Tooltip
            contentStyle={{
              background: 'hsl(var(--card))',
              border: '1px solid hsl(var(--border))',
              borderRadius: '8px',
              fontSize: '12px',
              color: 'hsl(var(--foreground))'
            }}
            formatter={(value) => [`${value} pts`, 'Score']}
          />
          <ReferenceLine y={0} stroke="hsl(var(--border))" strokeDasharray="4 4" />
          <Line
            type="monotone"
            dataKey="score"
            stroke="hsl(var(--primary))"
            strokeWidth={2.5}
            dot={{ r: 4, fill: 'hsl(var(--primary))', strokeWidth: 0 }}
            activeDot={{ r: 6, fill: 'hsl(var(--primary))' }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}

export default function MemberProgress() {
  const [progressEntries, setProgressEntries] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState(emptyForm)
  const [saving, setSaving] = useState(false)

  const fetchEntries = () => {
    setLoading(true)
    setError('')
    progressApi.getMine()
      .then(data => {
        setProgressEntries(
          Array.isArray(data)
            ? data.map(normalizeProgressEntry).sort((a, b) => new Date(b.entryDate) - new Date(a.entryDate))
            : []
        )
      })
      .catch(err => { setProgressEntries([]); setError(err.message || 'Nije moguće učitati podatke.') })
      .finally(() => setLoading(false))
  }

  useEffect(() => { fetchEntries() }, [])

  const handleChange = (e) => setForm(prev => ({ ...prev, [e.target.id]: e.target.value }))

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSaving(true)
    setError('')
    try {
      await progressApi.add({
        entryDate: form.entryDate,
        heightCm: form.visina ? parseFloat(form.visina) : null,      // ← visina → heightCm
        weightKg: form.weightKg ? parseFloat(form.weightKg) : null,
        armCm: form.armCm ? parseFloat(form.armCm) : null,
        waistCm: form.waistCm ? parseFloat(form.waistCm) : null,
        hipsCm: form.hipsCm ? parseFloat(form.hipsCm) : null,
        chestCm: form.chestCm ? parseFloat(form.chestCm) : null,
        thighCm: form.thighCm ? parseFloat(form.thighCm) : null,
        notes: form.notes || null,
        challengeId: null,
      })
      setForm(emptyForm)
      setShowForm(false)
      fetchEntries()
    } catch (err) {
      setError(err.message || 'Greška pri čuvanju.')
    } finally {
      setSaving(false)
    }
  }

  const summary = useMemo(() => {
    const latest = progressEntries[0] ?? null
    const oldest = progressEntries[progressEntries.length - 1] ?? null
    return [
      { icon: Ruler, label: 'Visina', value: formatValue(latest?.heightCm, 'cm'), trend: '', neutral: true },
      {
        icon: Scale, label: 'Trenutna težina', value: formatValue(latest?.weightKg, 'kg'),
        trend: oldest && latest && oldest !== latest ? formatTrend(oldest.weightKg, latest.weightKg, 'kg') : ''
      },
      {
        icon: Ruler, label: 'Struk', value: formatValue(latest?.waistCm, 'cm'),
        trend: oldest && latest && oldest !== latest ? formatTrend(oldest.waistCm, latest.waistCm, 'cm') : ''
      },
      {
        icon: Calendar, label: 'Praćenje', value: `${progressEntries.length} unosa`,
        trend: oldest ? `Od ${formatDate(oldest.entryDate)}` : '', neutral: true
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
        {/* Summary kartice */}
        <div className="grid gap-4 md:grid-cols-4">
          {summary.map(({ icon: Icon, label, value, trend, neutral }) => (
            <div key={label} className="rounded-lg border border-border bg-card p-4 shadow-sm">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 shrink-0"><Icon size={18} className="text-primary" /></div>
                <div>
                  <p className="text-sm text-muted-foreground">{label}</p>
                  <p className="text-lg font-bold text-foreground">{value}</p>
                  <p className={`text-xs ${neutral ? 'text-muted-foreground' : 'text-green-600'}`}>{trend}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Graf */}
        <div className="rounded-lg border border-border bg-card shadow-sm">
          <div className="flex items-center gap-2 p-5 border-b border-border">
            <TrendingUp size={20} className="text-primary" />
            <h3 className="font-semibold text-foreground">Graf napretka</h3>
          </div>
          <div className="p-5"><ScoreProgressChart entries={progressEntries} /></div>
        </div>

        {/* Historija */}
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
              <div className="py-8 text-center text-muted-foreground">
                <TrendingUp size={40} className="mx-auto mb-2 opacity-40" />
                <p className="text-sm">Nema unosa o napretku još.</p>
                <p className="text-xs mt-1">Klikni "Dodaj mjerenja" da počneš pratiti napredak.</p>
              </div>
            ) : (
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border">
                    {['Datum', 'Visina', 'Težina', 'Ruka', 'Struk', 'Bokovi', 'Grudi', 'Noga', 'Bilješka'].map(h => (
                      <th key={h} className={`pb-3 px-1 text-xs font-medium text-muted-foreground whitespace-nowrap ${h === 'Datum' ? 'text-left' : 'text-right'}`}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {progressEntries.map((entry, i) => (
                    <tr key={entry.id ?? entry.entryDate} className={i < progressEntries.length - 1 ? 'border-b border-border' : ''}>
                      <td className="py-3 px-1 text-foreground whitespace-nowrap">{formatDate(entry.entryDate)}</td>
                      <td className="py-3 px-1 text-right text-foreground">{formatValue(entry.heightCm, 'cm')}</td>
                      <td className="py-3 px-1 text-right text-foreground">{formatValue(entry.weightKg, 'kg')}</td>
                      <td className="py-3 px-1 text-right text-foreground">{formatValue(entry.armCm, 'cm')}</td>
                      <td className="py-3 px-1 text-right text-foreground">{formatValue(entry.waistCm, 'cm')}</td>
                      <td className="py-3 px-1 text-right text-foreground">{formatValue(entry.hipsCm, 'cm')}</td>
                      <td className="py-3 px-1 text-right text-foreground">{formatValue(entry.chestCm, 'cm')}</td>
                      <td className="py-3 px-1 text-right text-foreground">{formatValue(entry.thighCm, 'cm')}</td>
                      <td className="py-3 px-1 text-right text-muted-foreground text-xs">{entry.notes || '—'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}