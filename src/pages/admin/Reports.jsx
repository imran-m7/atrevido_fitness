import React, { useState } from 'react'
import { BarChart3, Download, TrendingUp, Users, Calendar, DollarSign, Activity, Target } from 'lucide-react'

const reportTypes = [
  { id: 'membership', title: 'Membership Report',      description: 'Active members, new signups, cancellations, and retention rates',          icon: Users,      lastGenerated: 'Mar 25, 2026' },
  { id: 'revenue',    title: 'Revenue Report',          description: 'Monthly revenue, subscription breakdown, and payment analytics',           icon: DollarSign, lastGenerated: 'Mar 25, 2026' },
  { id: 'attendance', title: 'Attendance Report',       description: 'Class attendance, peak hours, and trainer utilization',                    icon: Calendar,   lastGenerated: 'Mar 24, 2026' },
  { id: 'challenges', title: 'Challenge Performance',   description: 'Challenge participation, completion rates, and engagement metrics',        icon: Target,     lastGenerated: 'Mar 23, 2026' },
  { id: 'progress',   title: 'Member Progress Report',  description: 'Aggregate fitness progress, goal achievements, and milestones',           icon: Activity,   lastGenerated: 'Mar 22, 2026' },
  { id: 'growth',     title: 'Growth Analytics',        description: 'Month-over-month growth, trends, and forecasting',                        icon: TrendingUp, lastGenerated: 'Mar 20, 2026' },
]

const quickStats = [
  { label: 'Total Revenue (MTD)', value: '$45,230', change: '+12.5%' },
  { label: 'Active Members',      value: '487',     change: '+8.3%' },
  { label: 'Avg. Attendance',     value: '78%',     change: '+5.2%' },
  { label: 'Retention Rate',      value: '94%',     change: '+2.1%' },
]

const recentFiles = [
  { name: 'Membership_Report_March_2026.pdf',    date: 'Mar 25, 2026', size: '2.4 MB' },
  { name: 'Revenue_Report_March_2026.xlsx',      date: 'Mar 25, 2026', size: '1.8 MB' },
  { name: 'Attendance_Report_Week12_2026.pdf',   date: 'Mar 24, 2026', size: '1.2 MB' },
  { name: 'Challenge_Performance_Q1_2026.pdf',   date: 'Mar 23, 2026', size: '3.1 MB' },
]

const months = ['March 2026', 'February 2026', 'January 2026']

export default function AdminReports() {
  const [selectedMonth, setSelectedMonth] = useState('March 2026')

  return (
    <div className="p-4 lg:p-8 space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Reports & Analytics</h1>
          <p className="text-muted-foreground">Generate and download business reports</p>
        </div>
        <div className="flex items-center gap-3">
          <select
            value={selectedMonth}
            onChange={e => setSelectedMonth(e.target.value)}
            className="w-44 rounded-lg border border-input bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
          >
            {months.map(m => <option key={m}>{m}</option>)}
          </select>
          <button className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground hover:opacity-90 transition-opacity">
            <BarChart3 size={16} /> Generate All
          </button>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        {quickStats.map((stat) => (
          <div key={stat.label} className="rounded-lg border border-border bg-card p-4 shadow-sm">
            <p className="text-sm text-muted-foreground">{stat.label}</p>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="text-2xl font-bold text-foreground">{stat.value}</span>
              <span className="text-sm text-green-600">{stat.change}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Report Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {reportTypes.map((report) => {
          const Icon = report.icon
          return (
            <div key={report.id} className="rounded-lg border border-border bg-card shadow-sm hover:shadow-md transition-shadow">
              <div className="p-5 pb-3">
                <div className="flex items-start justify-between mb-3">
                  <div className="rounded-lg bg-primary/10 p-2">
                    <Icon size={20} className="text-primary" />
                  </div>
                  <button className="flex h-8 w-8 items-center justify-center rounded-lg hover:bg-muted transition-colors text-muted-foreground hover:text-foreground">
                    <Download size={16} />
                  </button>
                </div>
                <h3 className="font-semibold text-foreground mb-1">{report.title}</h3>
                <p className="text-sm text-muted-foreground">{report.description}</p>
              </div>
              <div className="px-5 pb-5 flex items-center justify-between">
                <span className="text-xs text-muted-foreground">Last: {report.lastGenerated}</span>
                <button className="rounded-lg border border-border px-3 py-1.5 text-sm font-medium text-foreground hover:bg-muted transition-colors">
                  Generate
                </button>
              </div>
            </div>
          )
        })}
      </div>

      {/* Recent Reports */}
      <div className="rounded-lg border border-border bg-card shadow-sm">
        <div className="p-5 border-b border-border">
          <h3 className="font-semibold text-foreground">Recently Generated Reports</h3>
          <p className="text-sm text-muted-foreground">Download your previously generated reports</p>
        </div>
        <div className="p-5 space-y-3">
          {recentFiles.map((file) => (
            <div key={file.name} className="flex items-center justify-between rounded-lg bg-muted/50 p-3">
              <div className="flex items-center gap-3">
                <div className="rounded bg-background p-2">
                  <BarChart3 size={16} className="text-muted-foreground" />
                </div>
                <div>
                  <p className="text-sm font-medium text-foreground">{file.name}</p>
                  <p className="text-xs text-muted-foreground">{file.date} – {file.size}</p>
                </div>
              </div>
              <button className="flex h-8 w-8 items-center justify-center rounded-lg hover:bg-muted transition-colors text-muted-foreground hover:text-foreground">
                <Download size={16} />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
