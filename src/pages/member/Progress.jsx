import React, { useState } from 'react'
import { TrendingUp, Plus, Calendar, Scale, Ruler } from 'lucide-react'

const progressHistory = [
  { date: 'March 20, 2024',   weight: 145, waist: 28,   hips: 38,   chest: 34   },
  { date: 'March 13, 2024',   weight: 146, waist: 28.5, hips: 38.5, chest: 34   },
  { date: 'March 6, 2024',    weight: 147, waist: 29,   hips: 39,   chest: 34.5 },
  { date: 'February 28, 2024',weight: 148, waist: 29,   hips: 39,   chest: 34.5 },
  { date: 'February 21, 2024',weight: 149, waist: 29.5, hips: 39.5, chest: 35   },
  { date: 'February 14, 2024',weight: 150, waist: 30,   hips: 40,   chest: 35   },
]

const inputClass = 'w-full rounded-lg border border-input bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring transition-colors'
const labelClass = 'block mb-1.5 text-sm font-medium text-foreground'

export default function MemberProgress() {
  const [form, setForm] = useState({ date: '', weight: '', waist: '', hips: '', chest: '' })
  const handleChange = (e) => setForm({ ...form, [e.target.id]: e.target.value })
  const handleSubmit = (e) => { e.preventDefault(); alert('Progress saved!') }

  return (
    <div className="p-4 lg:p-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-foreground lg:text-3xl">Progress Tracking</h1>
        <p className="text-muted-foreground">Track your measurements and see your progress over time</p>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
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
                <label htmlFor="weight" className={labelClass}>Weight (lbs)</label>
                <input id="weight" type="number" step="0.1" className={inputClass} placeholder="Enter weight" value={form.weight} onChange={handleChange} />
              </div>
              <div>
                <label htmlFor="waist" className={labelClass}>Waist (inches)</label>
                <input id="waist" type="number" step="0.1" className={inputClass} placeholder="Enter measurement" value={form.waist} onChange={handleChange} />
              </div>
              <div>
                <label htmlFor="hips" className={labelClass}>Hips (inches)</label>
                <input id="hips" type="number" step="0.1" className={inputClass} placeholder="Enter measurement" value={form.hips} onChange={handleChange} />
              </div>
              <div>
                <label htmlFor="chest" className={labelClass}>Chest (inches)</label>
                <input id="chest" type="number" step="0.1" className={inputClass} placeholder="Enter measurement" value={form.chest} onChange={handleChange} />
              </div>
              <button type="submit" className="w-full rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground hover:opacity-90 transition-opacity">
                Save Progress
              </button>
            </form>
          </div>
        </div>

        {/* Stats + Chart + Table */}
        <div className="space-y-4 lg:col-span-2">
          {/* Summary Cards */}
          <div className="grid gap-4 md:grid-cols-4">
            {[
              { icon: Scale,    label: 'Current Weight', value: '145 lbs', trend: '-5 lbs total' },
              { icon: Ruler,    label: 'Waist',          value: '28"',     trend: '-2" total' },
              { icon: Ruler,    label: 'Hips',           value: '38"',     trend: '-2" total' },
              { icon: Calendar, label: 'Tracking',       value: '6 weeks', trend: 'Since Feb 14', neutral: true },
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
              <h3 className="font-semibold text-foreground">Progress History</h3>
            </div>
            <div className="p-5 overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border">
                    {['Date','Weight','Waist','Hips','Chest'].map(h => (
                      <th key={h} className={`pb-3 text-sm font-medium text-muted-foreground ${h === 'Date' ? 'text-left' : 'text-right'}`}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {progressHistory.map((entry, i) => (
                    <tr key={entry.date} className={i < progressHistory.length - 1 ? 'border-b border-border' : ''}>
                      <td className="py-3 text-sm text-foreground">{entry.date}</td>
                      <td className="py-3 text-right text-sm text-foreground">{entry.weight} lbs</td>
                      <td className="py-3 text-right text-sm text-foreground">{entry.waist}"</td>
                      <td className="py-3 text-right text-sm text-foreground">{entry.hips}"</td>
                      <td className="py-3 text-right text-sm text-foreground">{entry.chest}"</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
