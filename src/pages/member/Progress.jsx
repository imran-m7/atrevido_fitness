import React from 'react'
import { TrendingUp, Calendar, Scale, Ruler } from 'lucide-react'

const progressHistory = [
  { date: '20. mart 2024',   weight: 65, waist: 28,   hips: 38,   chest: 34   },
  { date: '13. mart 2024',   weight: 146, waist: 28.5, hips: 38.5, chest: 34   },
  { date: '6. mart 2024',    weight: 147, waist: 29,   hips: 39,   chest: 34.5 },
  { date: '28. februar 2024',weight: 148, waist: 29,   hips: 39,   chest: 34.5 },
  { date: '21. februar 2024',weight: 149, waist: 29.5, hips: 39.5, chest: 35   },
  { date: '14. februar 2024',weight: 150, waist: 30,   hips: 40,   chest: 35   },
]

export default function MemberProgress() {
  return (
    <div className="p-4 lg:p-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-foreground lg:text-3xl">Pregled napretka</h1>
        <p className="text-muted-foreground">Prati svoja mjerenja i vidi svoj napredak tokom vremena</p>
      </div>

      <div className="space-y-6">
        {/* Stats + Chart + Table */}
        <div className="space-y-4">
          {/* Summary Cards */}
          <div className="grid gap-4 md:grid-cols-4">
            {[
              { icon: Scale,    label: 'Trenutna težina', value: '66 kg', trend: '-2 kg ukupno' },
              { icon: Ruler,    label: 'Struk',          value: '71 cm',     trend: '-5 cm ukupno' },
              { icon: Ruler,    label: 'Kukovi',           value: '98 cm',     trend: '-5 cm ukupno' },
              { icon: Calendar, label: 'Praćenje',       value: '6 nedelja', trend: 'Od 14. februar', neutral: true },
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
              <h3 className="font-semibold text-foreground">Graf napretka</h3>
            </div>
            <div className="p-5">
              <div className="flex h-64 items-center justify-center rounded-lg bg-muted/50">
                <div className="text-center text-muted-foreground">
                  <TrendingUp size={48} className="mx-auto mb-2" />
                  <p>Prikaz grafa napretka</p>
                  <p className="text-sm"></p>
                </div>
              </div>
            </div>
          </div>

          {/* History Table */}
          <div className="rounded-lg border border-border bg-card shadow-sm">
            <div className="p-5 border-b border-border">
              <h3 className="font-semibold text-foreground">Historija napretka</h3>
            </div>
            <div className="p-5 overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border">
                    {['Datum','Težina','Struk','Kukovi','Prs'].map(h => (
                      <th key={h} className={`pb-3 text-sm font-medium text-muted-foreground ${h === 'Datum' ? 'text-left' : 'text-right'}`}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {progressHistory.map((entry, i) => (
                    <tr key={entry.date} className={i < progressHistory.length - 1 ? 'border-b border-border' : ''}>
                      <td className="py-3 text-sm text-foreground">{entry.date}</td>
                      <td className="py-3 text-right text-sm text-foreground">{entry.weight} kg</td>
                      <td className="py-3 text-right text-sm text-foreground">{entry.waist} cm</td>
                      <td className="py-3 text-right text-sm text-foreground">{entry.hips} cm</td>
                      <td className="py-3 text-right text-sm text-foreground">{entry.chest} cm</td>
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
