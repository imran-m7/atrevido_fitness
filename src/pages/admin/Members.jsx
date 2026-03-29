import React, { useState } from 'react'
import { Search, Eye, Mail, MoreHorizontal, Users, UserPlus } from 'lucide-react'

const members = [
  { id: 1, name: 'Sarah Johnson',  email: 'sarah.johnson@email.com', subscription: 'Individual + Nutrition', status: 'Active',   joinDate: 'Jan 15, 2024', lastActive: 'Today',       sessionsThisMonth: 12 },
  { id: 2, name: 'Amanda Wilson',  email: 'amanda@email.com',        subscription: 'Individual + Nutrition', status: 'Active',   joinDate: 'Mar 23, 2024', lastActive: 'Today',       sessionsThisMonth: 3 },
  { id: 3, name: 'Michelle Chen',  email: 'michelle@email.com',      subscription: 'Group Training',         status: 'Active',   joinDate: 'Mar 22, 2024', lastActive: 'Yesterday',   sessionsThisMonth: 4 },
  { id: 4, name: 'Rachel Adams',   email: 'rachel@email.com',        subscription: 'Individual',             status: 'Active',   joinDate: 'Mar 20, 2024', lastActive: '2 days ago',  sessionsThisMonth: 5 },
  { id: 5, name: 'Jennifer Kim',   email: 'jennifer.kim@email.com',  subscription: 'Group Training',         status: 'Active',   joinDate: 'Feb 10, 2024', lastActive: 'Today',       sessionsThisMonth: 8 },
  { id: 6, name: 'Lisa Martinez',  email: 'lisa.m@email.com',        subscription: 'Individual + Nutrition', status: 'Active',   joinDate: 'Jan 5, 2024',  lastActive: 'Today',       sessionsThisMonth: 10 },
  { id: 7, name: 'Emily Davis',    email: 'emily.d@email.com',       subscription: 'Group Training',         status: 'Inactive', joinDate: 'Dec 1, 2023',  lastActive: '2 weeks ago', sessionsThisMonth: 0 },
  { id: 8, name: 'Nicole Brown',   email: 'nicole.b@email.com',      subscription: 'Individual',             status: 'Active',   joinDate: 'Feb 28, 2024', lastActive: '3 days ago',  sessionsThisMonth: 6 },
]

const subColors = {
  'Individual + Nutrition': 'bg-purple-100 text-purple-700',
  'Individual':             'bg-blue-100 text-blue-700',
  'Group Training':         'bg-green-100 text-green-700',
}

const inputClass = 'w-full rounded-lg border border-input bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring'

export default function AdminMembers() {
  const [search, setSearch] = useState('')
  const filtered = members.filter(m =>
    m.name.toLowerCase().includes(search.toLowerCase()) ||
    m.email.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="p-4 lg:p-8">
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground lg:text-3xl">Manage Members</h1>
          <p className="text-muted-foreground">View and manage gym members</p>
        </div>
        <button className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground hover:opacity-90 transition-opacity">
          <UserPlus size={16} /> Add Member
        </button>
      </div>

      {/* Stats */}
      <div className="mb-6 grid gap-4 md:grid-cols-4">
        {[
          { label: 'Total Members',    value: '127', icon: Users,    bg: 'bg-primary/10',   color: 'text-primary' },
          { label: 'Active',           value: '118', icon: Users,    bg: 'bg-green-100',    color: 'text-green-600' },
          { label: 'Inactive',         value: '9',   icon: Users,    bg: 'bg-yellow-100',   color: 'text-yellow-600' },
          { label: 'New This Month',   value: '5',   icon: UserPlus, bg: 'bg-blue-100',     color: 'text-blue-600' },
        ].map(({ label, value, icon: Icon, bg, color }) => (
          <div key={label} className="rounded-lg border border-border bg-card p-5 shadow-sm">
            <div className="flex items-center gap-3">
              <div className={`flex h-10 w-10 items-center justify-center rounded-full ${bg}`}>
                <Icon size={20} className={color} />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">{value}</p>
                <p className="text-sm text-muted-foreground">{label}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Search */}
      <div className="mb-6 rounded-lg border border-border bg-card p-4 shadow-sm">
        <div className="flex gap-4">
          <div className="relative flex-1">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <input className={inputClass + ' pl-9'} placeholder="Search by name or email..." value={search} onChange={e => setSearch(e.target.value)} />
          </div>
          <button className="rounded-lg border border-border px-4 py-2 text-sm font-medium text-foreground hover:bg-muted transition-colors">Filter</button>
        </div>
      </div>

      {/* Table */}
      <div className="rounded-lg border border-border bg-card shadow-sm">
        <div className="p-5 border-b border-border">
          <h3 className="font-semibold text-foreground">Members</h3>
        </div>
        <div className="p-5 overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border">
                {['Member','Subscription','Status','Last Active','Sessions','Actions'].map((h, i) => (
                  <th key={h} className={`pb-3 text-sm font-medium text-muted-foreground ${i === 5 ? 'text-right' : 'text-left'}`}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((member, i) => (
                <tr key={member.id} className={i < filtered.length - 1 ? 'border-b border-border' : ''}>
                  <td className="py-4">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 shrink-0">
                        <span className="text-sm font-medium text-primary">
                          {member.name.split(' ').map(n => n[0]).join('')}
                        </span>
                      </div>
                      <div>
                        <p className="font-medium text-foreground">{member.name}</p>
                        <p className="text-sm text-muted-foreground">{member.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="py-4">
                    <span className={`rounded-full px-2.5 py-1 text-xs font-medium ${subColors[member.subscription]}`}>
                      {member.subscription}
                    </span>
                  </td>
                  <td className="py-4">
                    <span className={`rounded-full px-2.5 py-1 text-xs font-medium ${member.status === 'Active' ? 'bg-primary text-primary-foreground' : 'bg-secondary text-secondary-foreground'}`}>
                      {member.status}
                    </span>
                  </td>
                  <td className="py-4 text-sm text-muted-foreground">{member.lastActive}</td>
                  <td className="py-4 text-sm text-foreground">{member.sessionsThisMonth} this month</td>
                  <td className="py-4">
                    <div className="flex justify-end gap-1">
                      {[Eye, Mail, MoreHorizontal].map((Icon, j) => (
                        <button key={j} className="flex h-8 w-8 items-center justify-center rounded-lg hover:bg-muted transition-colors text-muted-foreground hover:text-foreground">
                          <Icon size={16} />
                        </button>
                      ))}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
