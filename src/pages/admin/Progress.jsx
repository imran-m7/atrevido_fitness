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
  { date: 'March 20, 2024', memberId: 1, weight: 65, waist: 71, hips: 96, chest: 86 },
  { date: 'March 13, 2024', memberId: 1, weight: 66, waist: 72, hips: 97, chest: 86 },
  { date: 'March 6, 2024', memberId: 1, weight: 67, waist: 73, hips: 99, chest: 87 },
  { date: 'February 28, 2024', memberId: 2, weight: 58, waist: 68, hips: 92, chest: 84 },
  { date: 'February 21, 2024', memberId: 2, weight: 59, waist: 69, hips: 94, chest: 85 },
  { date: 'February 14, 2024', memberId: 3, weight: 72, waist: 76, hips: 102, chest: 89 },
]

const inputClass = 'w-full rounded-lg border border-input bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring transition-colors'
const labelClass = 'block mb-1.5 text-sm font-medium text-foreground'

export default function AdminProgress() {
  const [selectedMember, setSelectedMember] = useState(membersData[0])
  const [memberSearch, setMemberSearch] = useState('')
  const [form, setForm] = useState({ date: '', weight: '', waist: '', hips: '', chest: '' })

  const filteredMembers = membersData.filter(m =>
    m.name.toLowerCase().includes(memberSearch.toLowerCase()) ||
    m.email.toLowerCase().includes(memberSearch.toLowerCase())
  )

  const memberHistory = progressHistory.filter(h => h.memberId === selectedMember.id)
  const latestEntry = memberHistory[0]

  const handleChange = (e) => setForm({ ...form, [e.target.id]: e.target.value })
  const handleSubmit = (e) => {
    e.preventDefault()
    alert(`Progress saved for ${selectedMember.name}!`)
    setForm({ date: '', weight: '', waist: '', hips: '', chest: '' })
  }

  return (
    <div className="p-4 lg:p-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-foreground lg:text-3xl">Manage Progress</h1>
        <p className="text-muted-foreground">Track and manage member measurements</p>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Member Selection & Form */}
        <div className="space-y-4">
          {/* Member Selector */}
          <div className="rounded-lg border border-border bg-card shadow-sm">
            <div className="flex items-center gap-2 p-5 border-b border-border">
              <Search size={20} />
              <h3 className="font-semibold text-foreground">Select Member</h3>
            </div>
            <div className="p-4">
              <div className="relative mb-4">
                <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                <input
                  type="text"
                  className={inputClass + ' pl-9'}
                  placeholder="Search member..."
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
              <h3 className="font-semibold text-foreground">Add Progress Entry</h3>
            </div>
            <div className="p-5">
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label htmlFor="date" className={labelClass}>Date</label>
                  <input id="date" type="date" className={inputClass} value={form.date} onChange={handleChange} />
                </div>
                <div>
                  <label htmlFor="weight" className={labelClass}>Weight (kg)</label>
                  <input id="weight" type="number" step="0.1" className={inputClass} placeholder="Enter weight" value={form.weight} onChange={handleChange} />
                </div>
                <div>
                  <label htmlFor="waist" className={labelClass}>Waist (cm)</label>
                  <input id="waist" type="number" step="0.1" className={inputClass} placeholder="Enter measurement" value={form.waist} onChange={handleChange} />
                </div>
                <div>
                  <label htmlFor="hips" className={labelClass}>Hips (cm)</label>
                  <input id="hips" type="number" step="0.1" className={inputClass} placeholder="Enter measurement" value={form.hips} onChange={handleChange} />
                </div>
                <div>
                  <label htmlFor="chest" className={labelClass}>Chest (cm)</label>
                  <input id="chest" type="number" step="0.1" className={inputClass} placeholder="Enter measurement" value={form.chest} onChange={handleChange} />
                </div>
                <button type="submit" className="w-full rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground hover:opacity-90 transition-opacity">
                  Save Progress
                </button>
              </form>
            </div>
          </div>
        </div>

        {/* Stats + Chart + Table */}
        <div className="space-y-4 lg:col-span-2">
          {/* Summary Cards */}
          <div className="grid gap-4 md:grid-cols-4">
            {[
              { icon: Scale, label: 'Current Weight', value: latestEntry ? `${latestEntry.weight} kg` : 'N/A', trend: latestEntry ? '-5 kg total' : 'No data' },
              { icon: Ruler, label: 'Waist', value: latestEntry ? `${latestEntry.waist} cm` : 'N/A', trend: latestEntry ? '-2 cm total' : 'No data' },
              { icon: Ruler, label: 'Hips', value: latestEntry ? `${latestEntry.hips} cm` : 'N/A', trend: latestEntry ? '-2 cm total' : 'No data' },
              { icon: Ruler, label: 'Chest', value: latestEntry ? `${latestEntry.chest} cm` : 'N/A', trend: latestEntry ? '-1 cm total' : 'No data' },
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
              <h3 className="font-semibold text-foreground">Progress Chart</h3>
            </div>
            <div className="p-5">
              <div className="flex h-64 items-center justify-center rounded-lg bg-muted/50">
                <div className="text-center text-muted-foreground">
                  <TrendingUp size={48} className="mx-auto mb-2" />
                  <p>Progress Chart Visualization</p>
                  <p className="text-sm">Weight and measurements over time</p>
                </div>
              </div>
            </div>
          </div>

          {/* History Table */}
          <div className="rounded-lg border border-border bg-card shadow-sm">
            <div className="p-5 border-b border-border">
              <h3 className="font-semibold text-foreground">Progress History - {selectedMember.name}</h3>
            </div>
            <div className="p-5 overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border">
                    {['Date', 'Weight', 'Waist', 'Hips', 'Chest'].map(h => (
                      <th key={h} className={`pb-3 text-sm font-medium text-muted-foreground ${h === 'Date' ? 'text-left' : 'text-right'}`}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {memberHistory.length > 0 ? (
                    memberHistory.map((entry, i) => (
                      <tr key={`${entry.date}-${i}`} className={i < memberHistory.length - 1 ? 'border-b border-border' : ''}>
                        <td className="py-3 text-sm text-foreground">{entry.date}</td>
                        <td className="py-3 text-right text-sm text-foreground">{entry.weight} kg</td>
                        <td className="py-3 text-right text-sm text-foreground">{entry.waist} cm</td>
                        <td className="py-3 text-right text-sm text-foreground">{entry.hips} cm</td>
                        <td className="py-3 text-right text-sm text-foreground">{entry.chest} cm</td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="5" className="py-6 text-center text-sm text-muted-foreground">
                        No progress entries for this member yet
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
