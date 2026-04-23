import React, { useState } from 'react'
import { TrendingUp, Plus, Calendar, Scale, Ruler, Search } from 'lucide-react'

const membersData = [
  { id: 1, name: 'Sarah Johnson', email: 'sarah.johnson@email.com' },
  { id: 2, name: 'Amanda Wilson', email: 'amanda@email.com' },
  { id: 3, name: 'Michelle Chen', email: 'michelle@email.com' },
  { id: 4, name: 'Rachel Adams', email: 'rachel@email.com' },
  { id: 5, name: 'Jennifer Kim', email: 'jennifer.kim@email.com' },
]

const progressHistory = [
  { date: 'March 20, 2024', memberId: 1, height: 165, weight: 65, ruka: 28, t1: 85, t2: 78, t3: 82, bokovi: 96, noga: 55 },
  { date: 'March 13, 2024', memberId: 1, height: 165, weight: 66, ruka: 28.5, t1: 86, t2: 79, t3: 83, bokovi: 97, noga: 56 },
  { date: 'March 6, 2024', memberId: 1, height: 165, weight: 67, ruka: 29, t1: 87, t2: 80, t3: 84, bokovi: 99, noga: 57 },
  { date: 'February 28, 2024', memberId: 2, height: 172, weight: 58, ruka: 26, t1: 80, t2: 74, t3: 78, bokovi: 92, noga: 52 },
  { date: 'February 21, 2024', memberId: 2, height: 172, weight: 59, ruka: 26.5, t1: 81, t2: 75, t3: 79, bokovi: 94, noga: 53 },
  { date: 'February 14, 2024', memberId: 3, height: 158, weight: 72, ruka: 32, t1: 92, t2: 84, t3: 89, bokovi: 102, noga: 60 },
]

const inputClass = 'w-full rounded-lg border border-input bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring transition-colors'
const labelClass = 'block mb-1.5 text-sm font-medium text-foreground'

export default function AdminProgress() {
  const [selectedMember, setSelectedMember] = useState(membersData[0])
  const [memberSearch, setMemberSearch] = useState('')
  const [form, setForm] = useState({ date: '', height: '', weight: '', ruka: '', t1: '', t2: '', t3: '', bokovi: '', noga: '' })

  const filteredMembers = membersData.filter(m =>
    m.name.toLowerCase().includes(memberSearch.toLowerCase()) ||
    m.email.toLowerCase().includes(memberSearch.toLowerCase())
  )

  const memberHistory = progressHistory.filter(h => h.memberId === selectedMember.id)
  const latestEntry = memberHistory[0]

  const handleChange = (e) => setForm({ ...form, [e.target.id]: e.target.value })
  const handleSubmit = (e) => {
    e.preventDefault()
    alert(`Napredak sačuvan za ${selectedMember.name}!`)
    setForm({ date: '', height: '', weight: '', ruka: '', t1: '', t2: '', t3: '', bokovi: '', noga: '' })
  }

  return (
    <div className="p-4 lg:p-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-foreground lg:text-3xl">Upravljanje Napretkom</h1>
        <p className="text-muted-foreground">Prati i upravljaj mjerama članova</p>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Member Selection & Form */}
        <div className="space-y-4">
          {/* Member Selector */}
          <div className="rounded-lg border border-border bg-card shadow-sm">
            <div className="flex items-center gap-2 p-5 border-b border-border">
              <Search size={20} />
              <h3 className="font-semibold text-foreground">Izaberi Člana</h3>
            </div>
            <div className="p-4">
              <div className="relative mb-4">
                <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                <input
                  type="text"
                  className={inputClass + ' pl-9'}
                  placeholder="Pretraži člana..."
                  value={memberSearch}
                  onChange={e => setMemberSearch(e.target.value)}
                />
              </div>
              <div className="max-h-48 overflow-y-auto space-y-2">
                {filteredMembers.map(member => (
                  <button
                    key={member.id}
                    onClick={() => {
                      setSelectedMember(member)
                      setMemberSearch('')
                    }}
                    className={`w-full rounded-lg px-3 py-2.5 text-sm text-left transition-colors ${
                      selectedMember.id === member.id
                        ? 'bg-primary text-primary-foreground'
                        : 'hover:bg-muted text-foreground'
                    }`}
                  >
                    <p className="font-medium">{member.name}</p>
                    <p className="text-xs opacity-70">{member.email}</p>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Form */}
          <div className="rounded-lg border border-border bg-card shadow-sm">
            <div className="flex items-center gap-2 p-5 border-b border-border">
              <Plus size={20} />
              <h3 className="font-semibold text-foreground">Dodaj Unos Napretka</h3>
            </div>
            <div className="p-5">
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label htmlFor="date" className={labelClass}>Date</label>
                  <input id="date" type="date" className={inputClass} value={form.date} onChange={handleChange} required />
                </div>
                <div>
                  <label htmlFor="height" className={labelClass}>Height (cm)</label>
                  <input id="height" type="number" step="0.1" className={inputClass} placeholder="Unesite visinu" value={form.height} onChange={handleChange} required />
                </div>
                <div>
                  <label htmlFor="weight" className={labelClass}>Weight (kg)</label>
                  <input id="weight" type="number" step="0.1" className={inputClass} placeholder="Unesite težinu" value={form.weight} onChange={handleChange} required />
                </div>
                <div>
                  <label htmlFor="ruka" className={labelClass}>Ruka (cm)</label>
                  <input id="ruka" type="number" step="0.1" className={inputClass} placeholder="Unesite mjeru" value={form.ruka} onChange={handleChange} required />
                </div>
                <div>
                  <label htmlFor="t1" className={labelClass}>T1 (cm)</label>
                  <input id="t1" type="number" step="0.1" className={inputClass} placeholder="Unesite mjeru" value={form.t1} onChange={handleChange} required />
                </div>
                <div>
                  <label htmlFor="t2" className={labelClass}>T2 (cm)</label>
                  <input id="t2" type="number" step="0.1" className={inputClass} placeholder="Unesite mjeru" value={form.t2} onChange={handleChange} required />
                </div>
                <div>
                  <label htmlFor="t3" className={labelClass}>T3 (cm)</label>
                  <input id="t3" type="number" step="0.1" className={inputClass} placeholder="Unesite mjeru" value={form.t3} onChange={handleChange} required />
                </div>
                <div>
                  <label htmlFor="bokovi" className={labelClass}>Bokovi (cm)</label>
                  <input id="bokovi" type="number" step="0.1" className={inputClass} placeholder="Unesite mjeru" value={form.bokovi} onChange={handleChange} required />
                </div>
                <div>
                  <label htmlFor="noga" className={labelClass}>Noga (cm)</label>
                  <input id="noga" type="number" step="0.1" className={inputClass} placeholder="Unesite mjeru" value={form.noga} onChange={handleChange} required />
                </div>
                <button type="submit" className="w-full rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground hover:opacity-90 transition-opacity">
                  Sačuvaj Napredak
                </button>
              </form>
            </div>
          </div>
        </div>

        {/* Stats + Chart + Table */}
        <div className="space-y-4 lg:col-span-2">
          {/* Summary Cards */}
          <div className="grid gap-4 md:grid-cols-5">
            {[
              { icon: Ruler, label: 'Visina', value: latestEntry ? `${latestEntry.height} cm` : 'N/A', trend: 'constant' },
              { icon: Scale, label: 'Težina', value: latestEntry ? `${latestEntry.weight} kg` : 'N/A', trend: latestEntry ? '-2 kg' : 'Nema podataka' },
              { icon: Ruler, label: 'Ruka', value: latestEntry ? `${latestEntry.ruka} cm` : 'N/A', trend: 'arm' },
              { icon: Ruler, label: 'Bokovi', value: latestEntry ? `${latestEntry.bokovi} cm` : 'N/A', trend: latestEntry ? '-3 cm' : 'Nema podataka' },
              { icon: Ruler, label: 'Noga', value: latestEntry ? `${latestEntry.noga} cm` : 'N/A', trend: 'leg' },
            ].map(({ icon: Icon, label, value, trend, neutral }) => (
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
              <h3 className="font-semibold text-foreground">Chart Napretka</h3>
            </div>
            <div className="p-5">
              <div className="flex h-64 items-center justify-center rounded-lg bg-muted/50">
                <div className="text-center text-muted-foreground">
                  <TrendingUp size={48} className="mx-auto mb-2" />
                  <p>Visualizacija Chart Napretka</p>
                  <p className="text-sm">Težina i mjere preko vremena</p>
                </div>
              </div>
            </div>
          </div>

          {/* History Table */}
          <div className="rounded-lg border border-border bg-card shadow-sm">
            <div className="p-5 border-b border-border">
              <h3 className="font-semibold text-foreground">Historija Napretka- {selectedMember.name}</h3>
            </div>
            <div className="p-5 overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border">
                    {['Datum', 'Visina', 'Težina', 'Ruka (sredina nadlaktice)', 'T1 (najuži dio-struk)', 'T2 (oko pupka)', 'T3 (najširi dio)', 'Bokovi (najširi dio)', 'Noga (najširi dio natkoljenice)'].map(h => (
                      <th key={h} className={`pb-3 text-xs font-medium text-muted-foreground ${h === 'Date' ? 'text-left' : 'text-right'}`}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {memberHistory.length > 0 ? (
                    memberHistory.map((entry, i) => (
                      <tr key={`${entry.date}-${i}`} className={i < memberHistory.length - 1 ? 'border-b border-border' : ''}>
                        <td className="py-3 text-foreground">{entry.date}</td>
                        <td className="py-3 text-right text-foreground">{entry.height} cm</td>
                        <td className="py-3 text-right text-foreground">{entry.weight} kg</td>
                        <td className="py-3 text-right text-foreground">{entry.ruka} cm</td>
                        <td className="py-3 text-right text-foreground">{entry.t1} cm</td>
                        <td className="py-3 text-right text-foreground">{entry.t2} cm</td>
                        <td className="py-3 text-right text-foreground">{entry.t3} cm</td>
                        <td className="py-3 text-right text-foreground">{entry.bokovi} cm</td>
                        <td className="py-3 text-right text-foreground">{entry.noga} cm</td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="9" className="py-6 text-center text-sm text-muted-foreground">
                        Nema unosa o napretku za ovog člana još uvijek
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
