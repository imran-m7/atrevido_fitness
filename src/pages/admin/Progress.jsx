import React, { useEffect, useMemo, useState } from 'react'
import { ComposedChart, Bar, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts'
import { TrendingUp, Plus, Scale, Ruler, Search } from 'lucide-react'
import { progressApi, usersApi } from '../../services/api'

const inputClass = 'w-full rounded-lg border border-input bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring transition-colors'
const labelClass = 'block mb-1.5 text-sm font-medium text-foreground'
const emptyForm = { date: '', visina: '', weight: '', ruka: '', struk: '', bokovi: '', grudi: '', noga: '', notes: '' }

function normalizeMember(m) {
  return {
    id: m.id ?? m.Id,
    firstName: m.firstName ?? m.FirstName ?? '',
    lastName: m.lastName ?? m.LastName ?? '',
    email: m.email ?? m.Email ?? '',
  }
}

function normalizeProgressEntry(entry) {
  return {
    id: entry.id ?? entry.Id,
    userId: entry.userId ?? entry.UserId,
    entryDate: entry.entryDate ?? entry.EntryDate,
    heightCm: entry.heightCm ?? entry.HeightCm ?? null,
    weightKg: entry.weightKg ?? entry.WeightKg ?? null,
    waistCm: entry.waistCm ?? entry.WaistCm ?? null,
    hipsCm: entry.hipsCm ?? entry.HipsCm ?? null,
    chestCm: entry.chestCm ?? entry.ChestCm ?? null,
    armCm: entry.armCm ?? entry.ArmCm ?? null,
    thighCm: entry.thighCm ?? entry.ThighCm ?? null,
    notes: entry.notes ?? entry.Notes ?? '',
  }
}

function formatMemberName(m) {
  if (!m) return ''
  return `${m.firstName} ${m.lastName}`.trim() || m.email || `Member #${m.id}`
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

function measurementValue(value) { return Number(value ?? 0) }

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
    <div className="h-72">
      <ResponsiveContainer width="100%" height="100%">
        <ComposedChart data={chartData} margin={{ top: 20, right: 20, left: 0, bottom: 0 }}>
          <defs>
            <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#e05594" stopOpacity={1} />
              <stop offset="100%" stopColor="#e05594" stopOpacity={0.15} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
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
          <Bar
            dataKey="score"
            fill="url(#barGradient)"
            radius={[6, 6, 0, 0]}
            maxBarSize={36}
          />
          <Line
            type="natural"
            dataKey="score"
            stroke="#e05594"
            strokeWidth={3}
            dot={{ r: 4, fill: 'hsl(var(--primary))', strokeWidth: 2, stroke: 'white' }}
            activeDot={{ r: 6, fill: 'hsl(var(--primary))', stroke: 'white', strokeWidth: 2 }}
          />
        </ComposedChart>
      </ResponsiveContainer>
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
      setMembersLoading(true)
      setError('')
      try {
        const data = await usersApi.getMembers()
        const list = Array.isArray(data) ? data.map(normalizeMember).filter(m => m.id) : []
        setMembers(list)
        setSelectedMember(list[0] ?? null)
      } catch (err) {
        setMembers([])
        setSelectedMember(null)
        setError(err.message || 'Nije moguće učitati članove.')
      } finally {
        setMembersLoading(false)
      }
    }
    loadMembers()
  }, [])

  useEffect(() => {
    if (!selectedMember?.id) { setProgressEntries([]); return }
    setProgressLoading(true)
    setError('')
    progressApi.getByUser(selectedMember.id)
      .then(data => {
        const entries = Array.isArray(data)
          ? data.map(normalizeProgressEntry).sort((a, b) => new Date(b.entryDate) - new Date(a.entryDate))
          : []
        setProgressEntries(entries)
      })
      .catch(err => { setProgressEntries([]); setError(err.message || 'Greška pri učitavanju napretka.') })
      .finally(() => setProgressLoading(false))
  }, [selectedMember?.id])

  const filteredMembers = useMemo(() => {
    const search = memberSearch.trim().toLowerCase()
    if (!search) return members
    return members.filter(m => `${formatMemberName(m)} ${m.email}`.toLowerCase().includes(search))
  }, [memberSearch, members])

  const latestEntry = progressEntries[0] ?? null
  const handleChange = (e) => setForm({ ...form, [e.target.id]: e.target.value })

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!selectedMember?.id) { setError('Odaberite člana.'); return }
    setSaving(true)
    setError('')
    try {
      await progressApi.addForUser(selectedMember.id, {
        entryDate: form.date,
        heightCm: toNullableNumber(form.visina),   // ← visina → heightCm
        weightKg: toNullableNumber(form.weight),
        armCm: toNullableNumber(form.ruka),
        waistCm: toNullableNumber(form.struk),
        hipsCm: toNullableNumber(form.bokovi),
        chestCm: toNullableNumber(form.grudi),
        thighCm: toNullableNumber(form.noga),
        notes: form.notes || null,
        challengeId: null,
      })
      setForm(emptyForm)
      const updated = await progressApi.getByUser(selectedMember.id)
      setProgressEntries(
        Array.isArray(updated)
          ? updated.map(normalizeProgressEntry).sort((a, b) => new Date(b.entryDate) - new Date(a.entryDate))
          : []
      )
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
        <div className="mb-4 rounded-lg border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive">{error}</div>
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
                  filteredMembers.map(m => (
                    <button key={m.id} onClick={() => { setSelectedMember(m); setMemberSearch('') }}
                      className={`w-full rounded-lg px-3 py-2.5 text-sm text-left transition-colors ${selectedMember?.id === m.id ? 'bg-primary text-primary-foreground' : 'hover:bg-muted text-foreground'
                        }`}>
                      <p className="font-medium">{formatMemberName(m)}</p>
                      <p className="text-xs opacity-70">{m.email}</p>
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
                <div><label htmlFor="date" className={labelClass}>Datum</label>
                  <input id="date" type="date" className={inputClass} value={form.date} onChange={handleChange} required /></div>
                <div><label htmlFor="visina" className={labelClass}>Visina (cm)</label>
                  <input id="visina" type="number" step="0.1" className={inputClass} placeholder="npr. 168" value={form.visina} onChange={handleChange} /></div>
                <div><label htmlFor="weight" className={labelClass}>Težina (kg)</label>
                  <input id="weight" type="number" step="0.1" className={inputClass} placeholder="npr. 68.5" value={form.weight} onChange={handleChange} required /></div>
                <div><label htmlFor="ruka" className={labelClass}>Ruka — sredina nadlaktice (cm)</label>
                  <input id="ruka" type="number" step="0.1" className={inputClass} placeholder="npr. 28" value={form.ruka} onChange={handleChange} /></div>
                <div><label htmlFor="struk" className={labelClass}>Struk — najuži dio (cm)</label>
                  <input id="struk" type="number" step="0.1" className={inputClass} placeholder="npr. 72" value={form.struk} onChange={handleChange} /></div>
                <div><label htmlFor="bokovi" className={labelClass}>Bokovi — najširi dio (cm)</label>
                  <input id="bokovi" type="number" step="0.1" className={inputClass} placeholder="npr. 96" value={form.bokovi} onChange={handleChange} /></div>
                <div><label htmlFor="grudi" className={labelClass}>Grudi (cm)</label>
                  <input id="grudi" type="number" step="0.1" className={inputClass} placeholder="npr. 88" value={form.grudi} onChange={handleChange} /></div>
                <div><label htmlFor="noga" className={labelClass}>Noga — najširi dio natkoljenice (cm)</label>
                  <input id="noga" type="number" step="0.1" className={inputClass} placeholder="npr. 54" value={form.noga} onChange={handleChange} /></div>
                <div><label htmlFor="notes" className={labelClass}>Bilješka (opcionalno)</label>
                  <textarea id="notes" className={`${inputClass} min-h-16 resize-none`} placeholder="npr. Početna mjerenja" value={form.notes} onChange={handleChange} /></div>
                <button type="submit" disabled={saving || !selectedMember}
                  className="w-full rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground hover:opacity-90 transition-opacity disabled:cursor-not-allowed disabled:opacity-60">
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
              { icon: Ruler, label: 'Visina', value: formatValue(latestEntry?.heightCm, 'cm'), neutral: true },
              { icon: Scale, label: 'Težina', value: formatValue(latestEntry?.weightKg, 'kg') },
              { icon: Ruler, label: 'Ruka', value: formatValue(latestEntry?.armCm, 'cm') },
              { icon: Ruler, label: 'Bokovi', value: formatValue(latestEntry?.hipsCm, 'cm') },
              { icon: Ruler, label: 'Noga', value: formatValue(latestEntry?.thighCm, 'cm') },
            ].map(({ icon: Icon, label, value, neutral }) => (
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
            <div className="p-5"><ScoreProgressChart entries={progressEntries} /></div>
          </div>

          <div className="rounded-lg border border-border bg-card shadow-sm">
            <div className="p-5 border-b border-border">
              <h3 className="font-semibold text-foreground">
                Historija napretka — {selectedMember ? formatMemberName(selectedMember) : 'nema odabranog člana'}
              </h3>
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
                    <tr><td colSpan="9" className="py-6 text-center text-sm text-muted-foreground">Učitavanje napretka...</td></tr>
                  ) : progressEntries.length > 0 ? (
                    progressEntries.map((entry, i) => (
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
                    ))
                  ) : (
                    <tr><td colSpan="9" className="py-6 text-center text-sm text-muted-foreground">Nema podataka o napretku.</td></tr>
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