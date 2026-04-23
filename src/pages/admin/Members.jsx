import React, { useState } from 'react'
import { Search, Users, UserPlus, X } from 'lucide-react'

const initialMembers = [
  { id: 1, name: 'Sarah Johnson',  username: 'sarah.johnson', email: 'sarah.johnson@email.com', phone: '+1 555-0101', subscription: 'Individualni trening + Ishrana', status: 'Aktivan',   joinDate: 'Jan 15, 2024', lastActive: 'Danas' },
  { id: 2, name: 'Amanda Wilson',  username: 'amanda.wilson', email: 'amanda@email.com',        phone: '+1 555-0102', subscription: 'Individualni trening + Ishrana', status: 'Aktivan',   joinDate: 'Mar 23, 2024', lastActive: 'Danas' },
  { id: 3, name: 'Michelle Chen',  username: 'michelle.chen', email: 'michelle@email.com',      phone: '+1 555-0103', subscription: 'Grupni trening',         status: 'Aktivan',   joinDate: 'Mar 22, 2024', lastActive: 'Jučer' },
  { id: 4, name: 'Rachel Adams',   username: 'rachel.adams',  email: 'rachel@email.com',        phone: '+1 555-0104', subscription: 'Individualni trening',             status: 'Aktivan',   joinDate: 'Mar 20, 2024', lastActive: 'prije 2 dana' },
  { id: 5, name: 'Jennifer Kim',   username: 'jennifer.kim',  email: 'jennifer.kim@email.com',  phone: '+1 555-0105', subscription: 'Grupni trening',         status: 'Aktivan',   joinDate: 'Feb 10, 2024', lastActive: 'Danas' },
  { id: 6, name: 'Lisa Martinez',  username: 'lisa.martinez', email: 'lisa.m@email.com',        phone: '+1 555-0106', subscription: 'Individualni trening + Ishrana', status: 'Aktivan',   joinDate: 'Jan 5, 2024',  lastActive: 'Danas' },
  { id: 7, name: 'Emily Davis',    username: 'emily.davis',   email: 'emily.d@email.com',       phone: '+1 555-0107', subscription: 'Grupni trening',         status: 'Neaktivan', joinDate: 'Dec 1, 2023',  lastActive: 'prije 2 sedmice' },
  { id: 8, name: 'Nicole Brown',   username: 'nicole.brown',  email: 'nicole.b@email.com',      phone: '+1 555-0108', subscription: 'Individualni trening',             status: 'Aktivan',   joinDate: 'Feb 28, 2024', lastActive: 'prije 3 dana' },
]

const subColors = {
  'Individualni trening + Ishrana': 'bg-purple-100 text-purple-700',
  'Individualni trening':             'bg-blue-100 text-blue-700',
  'Grupni trening':         'bg-green-100 text-green-700',
}

const inputClass = 'w-full rounded-lg border border-input bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring'
const labelClass = 'block mb-1.5 text-sm font-medium text-foreground'

const programs = [
  { id: 'group', title: 'Grupni Treninzi' },
  { id: 'individual', title: 'Individualni Treninzi' },
  { id: 'individual-nutrition', title: 'Individualni Trening + Ishrana' },
]

export default function AdminMembers() {
  // Load pending registrations from localStorage
  const getPendingRegistrations = () => {
    const pending = localStorage.getItem('pendingRegistrations')
    if (!pending) return []
    try {
      const registrations = JSON.parse(pending)
      return registrations.map((reg, idx) => ({
        id: -1 - idx, // Negative IDs for pending members
        name: `${reg.firstName} ${reg.lastName}`,
        username: reg.email, // Using email as username since that's what was in the form
        email: reg.email,
        phone: reg.phone,
        subscription: reg.trainingProgram === 'group' ? 'Grupni trening' : reg.trainingProgram === 'individual' ? 'Individualni trening' : 'Individualni trening + Ishrana',
        status: 'Neaktivan',
        joinDate: new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' }),
        lastActive: 'Nikad'
      }))
    } catch (e) {
      return []
    }
  }

  const [membersList, setMembersList] = useState([...initialMembers, ...getPendingRegistrations()])
  const [search, setSearch] = useState('')
  const [showModal, setShowModal] = useState(false)
  const [form, setForm] = useState({ firstName: '', lastName: '', email: '', phone: '', password: '', confirmPassword: '', trainingProgram: '' })
  
  const handleChange = (e) => setForm({ ...form, [e.target.id]: e.target.value })
  const handleSelectProgram = (e) => setForm({ ...form, trainingProgram: e.target.value })

  const handleAddMember = (e) => {
    e.preventDefault()
    if (!form.firstName || !form.lastName || !form.email || !form.phone || !form.password || !form.confirmPassword || !form.trainingProgram) {
      alert('Molimo popunite sva polja')
      return
    }
    if (form.password !== form.confirmPassword) {
      alert('Šifre se ne poklapaju')
      return
    }
    if (form.password.length < 6) {
      alert('Šifra mora biti najmanje 6 karaktera')
      return
    }

    const newMember = {
      id: Math.max(...membersList.map(m => m.id), 0) + 1,
      name: `${form.firstName} ${form.lastName}`,
      username: form.email,
      email: form.email,
      phone: form.phone,
      password: form.password,
      subscription: form.trainingProgram === 'group' ? 'Grupni trening' : form.trainingProgram === 'individual' ? 'Individualni trening' : 'Individualni trening + Ishrana',
      status: 'Aktivan',
      joinDate: new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' }),
      lastActive: 'Danas'
    }

    setMembersList([newMember, ...membersList])
    setShowModal(false)
    setForm({ firstName: '', lastName: '', email: '', phone: '', password: '', confirmPassword: '', trainingProgram: '' })
  }

  const filtered = membersList.filter(m =>
    m.name.toLowerCase().includes(search.toLowerCase()) ||
    m.email.toLowerCase().includes(search.toLowerCase()) ||
    m.username.toLowerCase().includes(search.toLowerCase())
  )

  const stats = [
    { label: 'Ukupno Članova', value: membersList.length, icon: Users, bg: 'bg-primary/10', color: 'text-primary' },
    { label: 'Aktivni', value: membersList.filter(m => m.status === 'Aktivan').length, icon: Users, bg: 'bg-green-100', color: 'text-green-600' },
    { label: 'Neaktivni', value: membersList.filter(m => m.status === 'Neaktivan').length, icon: Users, bg: 'bg-yellow-100', color: 'text-yellow-600' },
  ]

  const toggleMemberStatus = (id) => {
    setMembersList(prev =>
      prev.map(m =>
        m.id === id
          ? { 
              ...m, 
              status: m.status === 'Aktivan' ? 'Neaktivan' : 'Aktivan',
              lastActive: m.status === 'Neaktivan' ? 'Danas' : m.lastActive
            }
          : m
      )
    )
    
    // If activating a pending member, remove from localStorage
    if (id < 0) {
      const pending = localStorage.getItem('pendingRegistrations')
      if (pending) {
        try {
          const registrations = JSON.parse(pending)
          const updatedRegistrations = registrations.filter((_, idx) => -1 - idx !== id)
          if (updatedRegistrations.length > 0) {
            localStorage.setItem('pendingRegistrations', JSON.stringify(updatedRegistrations))
          } else {
            localStorage.removeItem('pendingRegistrations')
          }
        } catch (e) {
          // Handle error silently
        }
      }
    }
  }

  return (
    <div className="p-4 lg:p-8">
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground lg:text-3xl">Upravljaj Članovima</h1>
          <p className="text-muted-foreground">Pregled i upravljanje članovima</p>
        </div>
        <button onClick={() => setShowModal(true)} className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground hover:opacity-90 transition-opacity">
          <UserPlus size={16} /> Dodaj Člana
        </button>
      </div>

      {/* Add Member Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setShowModal(false)} />
          <div className="relative z-10 w-full max-w-2xl rounded-lg border border-border bg-card p-8 shadow-lg max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-foreground">Dodaj Člana</h2>
              <button onClick={() => setShowModal(false)} className="text-muted-foreground hover:text-foreground">
                <X size={24} />
              </button>
            </div>

            <form onSubmit={handleAddMember} className="space-y-5">
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <label htmlFor="firstName" className={labelClass}>Ime</label>
                  <input id="firstName" className={inputClass} placeholder="Unesite ime" value={form.firstName} onChange={handleChange} required />
                </div>
                <div>
                  <label htmlFor="lastName" className={labelClass}>Prezime</label>
                  <input id="lastName" className={inputClass} placeholder="Unesite prezime" value={form.lastName} onChange={handleChange} required />
                </div>
              </div>

              <div>
                <label htmlFor="email" className={labelClass}>Korisničko Ime</label>
                <input id="email" type="text" className={inputClass} placeholder="Unesite korisničko ime" value={form.email} onChange={handleChange} required />
              </div>

              <div>
                <label htmlFor="phone" className={labelClass}>Broj Telefona</label>
                <input id="phone" type="tel" className={inputClass} placeholder="Unesite broj telefona" value={form.phone} onChange={handleChange} required />
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <label htmlFor="password" className={labelClass}>Šifra</label>
                  <input id="password" type="password" className={inputClass} placeholder="Unesite šifru" value={form.password} onChange={handleChange} required />
                </div>
                <div>
                  <label htmlFor="confirmPassword" className={labelClass}>Potvrdite Šifru</label>
                  <input id="confirmPassword" type="password" className={inputClass} placeholder="Potvrdite šifru" value={form.confirmPassword} onChange={handleChange} required />
                </div>
              </div>

              <div>
                <label htmlFor="trainingProgram" className={labelClass}>Odaberite Trening Program</label>
                <select id="trainingProgram" value={form.trainingProgram} onChange={handleSelectProgram} className={`${inputClass} ${form.trainingProgram === '' ? 'text-muted-foreground' : 'text-foreground'}`} required>
                  <option value="" disabled>
                    -- Odaberite program --
                  </option>
                  {programs.map(program => (
                    <option key={program.id} value={program.id}>
                      {program.title}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex gap-3 pt-6">
                <button type="button" onClick={() => setShowModal(false)} className="flex-1 rounded-lg border border-border px-4 py-2.5 text-sm font-medium text-foreground hover:bg-muted transition-colors">
                  Otkaži
                </button>
                <button type="submit" className="flex-1 rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground hover:opacity-90 transition-opacity">
                  Dodaj Člana
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Stats */}
      <div className="mb-6 grid gap-4 md:grid-cols-3 w-fit mx-auto">
        {stats.map(({ label, value, icon: Icon, bg, color }) => (
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
        <div className="relative flex-1">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <input className={inputClass + ' pl-9'} placeholder="Traži člana..." value={search} onChange={e => setSearch(e.target.value)} />
        </div>
      </div>

      {/* Table */}
      <div className="rounded-lg border border-border bg-card shadow-sm">
        <div className="p-5 border-b border-border">
          <h3 className="font-semibold text-foreground">Članovi</h3>
        </div>
        <div className="p-5 overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border">
                {['Član','Korisničko ime','Telefon','Pretplata','Status','Posljednja Aktivnost','Radnje'].map((h, i) => (
                  <th key={h} className={`pb-3 text-sm font-medium text-muted-foreground ${i === 6 ? 'text-right' : 'text-left'}`}>{h}</th>
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
                  <td className="py-4 text-sm text-foreground">{member.username}</td>
                  <td className="py-4 text-sm text-foreground">{member.phone}</td>
                  <td className="py-4">
                    <span className={`rounded-full px-2.5 py-1 text-xs font-medium ${subColors[member.subscription]}`}>
                      {member.subscription}
                    </span>
                  </td>
                  <td className="py-4">
                    <span className={`rounded-full px-2.5 py-1 text-xs font-medium ${member.status === 'Aktivan' ? 'bg-primary text-primary-foreground' : 'bg-secondary text-secondary-foreground'}`}>
                      {member.status}
                    </span>
                  </td>
                  <td className="py-4 text-sm text-muted-foreground">{member.lastActive}</td>
                  <td className="py-4">
                    <div className="flex justify-end gap-2">
                      <button
                        onClick={() => toggleMemberStatus(member.id)}
                        className={`rounded-lg px-3 py-1.5 text-xs font-medium transition-colors ${
                          member.status === 'Aktivan'
                            ? 'bg-primary/10 text-primary hover:bg-primary/20'
                            : 'bg-yellow-100 text-yellow-600 hover:bg-yellow-200'
                        }`}
                      >
                        {member.status === 'Aktivan' ? 'Napravi Neaktivan' : 'Napravi Aktivan'}
                      </button>
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
