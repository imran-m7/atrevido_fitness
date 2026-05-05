import React, { useState, useEffect } from 'react'
import { Search, Users, UserPlus, X, CheckCircle, XCircle } from 'lucide-react'
import { adminApi, authApi } from '../../services/api'

const inputClass = 'w-full rounded-lg border border-input bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring'
const labelClass = 'block mb-1.5 text-sm font-medium text-foreground'

const programs = [
  { id: 'group', title: 'Grupni Treninzi' },
  { id: 'individual', title: 'Individualni Treninzi' },
  { id: 'individual-nutrition', title: 'Individualni Trening + Ishrana' },
]

const getMembershipLabel = (membership) => {
  if (!membership) return 'Bez plana'
  if (membership.trainingType === 'Individual' && membership.nutritionEnabled)
    return 'Individualni + Ishrana'
  if (membership.trainingType === 'Individual') return 'Individualni'
  return 'Grupni'
}

const subColors = {
  'Individualni + Ishrana': 'bg-purple-100 text-purple-700',
  'Individualni': 'bg-blue-100 text-blue-700',
  'Grupni': 'bg-green-100 text-green-700',
  'Bez plana': 'bg-gray-100 text-gray-600',
}

export default function AdminMembers() {
  const [membersList, setMembersList] = useState([])
  const [search, setSearch] = useState('')
  const [filter, setFilter] = useState('all')
  const [showModal, setShowModal] = useState(false)
  const [loading, setLoading] = useState(true)
  const [form, setForm] = useState({
    firstName: '', lastName: '', username: '', email: '', phone: '',
    password: '', confirmPassword: '', trainingProgram: ''
  })

  const fetchMembers = async () => {
    try {
      const data = await adminApi.getMembers()
      setMembersList(data)
    } catch (err) {
      console.error('Greška pri učitavanju članova.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchMembers() }, [])

  const handleChange = (e) => setForm({ ...form, [e.target.id]: e.target.value })

  const handleAddMember = async (e) => {
    e.preventDefault()
    if (form.password !== form.confirmPassword) {
      alert('Šifre se ne poklapaju')
      return
    }
    try {
      const registerData = await authApi.register({
        firstName: form.firstName,
        lastName: form.lastName,
        username: form.username,
        email: form.email || null,
        phoneNumber: form.phone || null,
        password: form.password
      })

      await adminApi.updateMembership(registerData.id, {
        trainingType: form.trainingProgram === 'group' ? 'Group' : 'Individual',
        status: 'Active',
        paymentStatus: 'Paid',
        nutritionEnabled: form.trainingProgram === 'individual-nutrition',
        adminNotes: 'Dodano od strane admina'
      })

      await fetchMembers()
      setShowModal(false)
      setForm({ firstName: '', lastName: '', username: '', email: '', phone: '', password: '', confirmPassword: '', trainingProgram: '' })
    } catch (err) {
      alert(err.message || 'Greška pri dodavanju člana.')
    }
  }

  // Approve membership — postavi na Active
  const handleApprove = async (member) => {
    try {
      // Aktiviraj membership
      await adminApi.updateMembership(member.id, {
        status: 'Active',
        paymentStatus: 'Paid',
        activatedAt: new Date().toISOString()
      })
      // Aktiviraj i korisnički račun (IsActive = true u bazi)
      await adminApi.updateUserStatus(member.id, true)
      await fetchMembers()
    } catch (err) {
      alert('Greška pri odobravanju.')
    }
  }

  // Aktivacija/deaktivacija — mijenja I membership I IsActive u bazi
  const toggleStatus = async (member) => {
    const isCurrentlyActive = member.membership?.status === 'Active'
    const newMembershipStatus = isCurrentlyActive ? 'Inactive' : 'Active'
    const newIsActive = !isCurrentlyActive

    try {
      // 1. Promijeni membership status
      await adminApi.updateMembership(member.id, {
        status: newMembershipStatus,
        paymentStatus: newMembershipStatus === 'Active' ? 'Paid' : 'Pending'
      })

      // 2. Promijeni IsActive na User tabeli u bazi
      await adminApi.updateUserStatus(member.id, newIsActive)

      await fetchMembers()
    } catch (err) {
      alert('Greška pri promjeni statusa: ' + err.message)
    }
  }

  const filtered = membersList
    .filter(m => {
      if (filter === 'pending') return !m.membership || m.membership?.status === 'Pending'
      if (filter === 'active') return m.membership?.status === 'Active'
      if (filter === 'inactive') return m.membership?.status === 'Inactive'
      return true
    })
    .filter(m =>
      `${m.firstName} ${m.lastName}`.toLowerCase().includes(search.toLowerCase()) ||
      m.email.toLowerCase().includes(search.toLowerCase())
    )

  const counts = {
    all: membersList.length,
    pending: membersList.filter(m => !m.membership || m.membership?.status === 'Pending').length,
    active: membersList.filter(m => m.membership?.status === 'Active').length,
    inactive: membersList.filter(m => m.membership?.status === 'Inactive').length,
  }

  if (loading) return <div className="p-8 text-center">Učitavanje...</div>

  return (
    <div className="p-4 lg:p-8">
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground lg:text-3xl">Upravljaj Članovima</h1>
          <p className="text-muted-foreground">Pregled i upravljanje članovima</p>
        </div>
        <button onClick={() => setShowModal(true)}
          className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground hover:opacity-90 transition-opacity">
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
                <label htmlFor="username" className={labelClass}>Korisničko ime *</label>
                <input id="username" type="text" className={inputClass} placeholder="npr. marija_fitness" value={form.username} onChange={handleChange} required />
              </div>
              <div>
                <label htmlFor="email" className={labelClass}>Email (opciono)</label>
                <input id="email" type="email" className={inputClass} placeholder="Unesite email" value={form.email} onChange={handleChange} />
              </div>
              <div>
                <label htmlFor="phone" className={labelClass}>Broj Telefona</label>
                <input id="phone" type="tel" className={inputClass} placeholder="Unesite broj telefona" value={form.phone} onChange={handleChange} />
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
                <label htmlFor="trainingProgram" className={labelClass}>Trening Program</label>
                <select id="trainingProgram" value={form.trainingProgram}
                  onChange={(e) => setForm({ ...form, trainingProgram: e.target.value })}
                  className={`${inputClass} ${!form.trainingProgram ? 'text-muted-foreground' : 'text-foreground'}`} required>
                  <option value="" disabled>-- Odaberite program --</option>
                  {programs.map(p => <option key={p.id} value={p.id}>{p.title}</option>)}
                </select>
              </div>
              <div className="flex gap-3 pt-6">
                <button type="button" onClick={() => setShowModal(false)}
                  className="flex-1 rounded-lg border border-border px-4 py-2.5 text-sm font-medium text-foreground hover:bg-muted transition-colors">
                  Otkaži
                </button>
                <button type="submit"
                  className="flex-1 rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground hover:opacity-90 transition-opacity">
                  Dodaj Člana
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Filter stats */}
      <div className="mb-6 grid gap-4 grid-cols-2 lg:grid-cols-4">
        {[
          { key: 'all', label: 'Ukupno', color: 'text-primary' },
          { key: 'active', label: 'Aktivni', color: 'text-green-600' },
          { key: 'pending', label: 'Na čekanju', color: 'text-yellow-600' },
          { key: 'inactive', label: 'Neaktivni', color: 'text-gray-600' },
        ].map(({ key, label, color }) => (
          <button key={key} onClick={() => setFilter(key)}
            className={`rounded-lg border p-4 text-left transition-colors ${filter === key ? 'border-primary bg-primary/5' : 'border-border bg-card'}`}>
            <p className={`text-2xl font-bold ${color}`}>{counts[key]}</p>
            <p className="text-sm text-muted-foreground">{label}</p>
          </button>
        ))}
      </div>

      {/* Pending banner */}
      {counts.pending > 0 && (
        <div className="mb-6 rounded-lg border border-yellow-200 bg-yellow-50 p-4 flex items-center gap-3">
          <Users size={20} className="text-yellow-600 shrink-0" />
          <p className="text-sm text-yellow-800">
            <strong>{counts.pending}</strong> {counts.pending === 1 ? 'član čeka' : 'članova čeka'} odobrenje.
            {filter !== 'pending' && (
              <button onClick={() => setFilter('pending')} className="ml-2 text-yellow-700 underline font-medium">
                Prikaži
              </button>
            )}
          </p>
        </div>
      )}

      {/* Search */}
      <div className="mb-6 rounded-lg border border-border bg-card p-4 shadow-sm">
        <div className="relative">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <input className={inputClass + ' pl-9'} placeholder="Traži člana..."
            value={search} onChange={e => setSearch(e.target.value)} />
        </div>
      </div>

      {/* Tabela */}
      <div className="rounded-lg border border-border bg-card shadow-sm">
        <div className="p-5 border-b border-border">
          <h3 className="font-semibold text-foreground">Članovi ({filtered.length})</h3>
        </div>
        <div className="p-5 overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border">
                {['Član', 'Telefon', 'Plan', 'Membership', 'Račun', 'Datum reg.', 'Radnje'].map((h, i) => (
                  <th key={h} className={`pb-3 text-sm font-medium text-muted-foreground ${i === 6 ? 'text-right' : 'text-left'}`}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((member, i) => (
                <tr key={member.id} className={i < filtered.length - 1 ? 'border-b border-border' : ''}>
                  <td className="py-4">
                    <div className="flex items-center gap-3">
                      <div className={`flex h-10 w-10 items-center justify-center rounded-full shrink-0 ${member.isActive ? 'bg-primary/10' : 'bg-gray-100'
                        }`}>
                        <span className={`text-sm font-medium ${member.isActive ? 'text-primary' : 'text-gray-400'}`}>
                          {member.firstName[0]}{member.lastName[0]}
                        </span>
                      </div>
                      <div>
                        <p className="font-medium text-foreground">{member.firstName} {member.lastName}</p>
                        <p className="text-xs text-muted-foreground">{member.username || member.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="py-4 text-sm text-foreground">{member.phoneNumber || '—'}</td>
                  <td className="py-4">
                    <span className={`rounded-full px-2.5 py-1 text-xs font-medium ${subColors[getMembershipLabel(member.membership)] || 'bg-gray-100 text-gray-600'}`}>
                      {getMembershipLabel(member.membership)}
                    </span>
                  </td>
                  {/* Membership status */}
                  <td className="py-4">
                    <span className={`rounded-full px-2.5 py-1 text-xs font-medium ${member.membership?.status === 'Active' ? 'bg-green-100 text-green-700' :
                        member.membership?.status === 'Pending' ? 'bg-yellow-100 text-yellow-700' :
                          'bg-gray-100 text-gray-600'
                      }`}>
                      {member.membership?.status === 'Active' ? 'Aktivan' :
                        member.membership?.status === 'Pending' ? 'Na čekanju' :
                          member.membership ? 'Neaktivan' : 'Bez plana'}
                    </span>
                  </td>
                  {/* IsActive status */}
                  <td className="py-4">
                    <span className={`rounded-full px-2.5 py-1 text-xs font-medium ${member.isActive ? 'bg-blue-100 text-blue-700' : 'bg-red-100 text-red-600'
                      }`}>
                      {member.isActive ? 'Aktivan' : 'Deaktiviran'}
                    </span>
                  </td>
                  <td className="py-4 text-sm text-muted-foreground">
                    {new Date(member.createdAt).toLocaleDateString('bs-BA')}
                  </td>
                  <td className="py-4">
                    <div className="flex justify-end gap-2">
                      {/* Pending → Approve */}
                      {member.membership?.status === 'Pending' && (
                        <button onClick={() => handleApprove(member)}
                          className="inline-flex items-center gap-1 rounded-lg bg-green-100 px-3 py-1.5 text-xs font-medium text-green-700 hover:bg-green-200 transition-colors">
                          <CheckCircle size={12} /> Odobri
                        </button>
                      )}
                      {/* Active → Deactivate / Inactive → Activate */}
                      {member.membership && member.membership.status !== 'Pending' && (
                        <button onClick={() => toggleStatus(member)}
                          className={`inline-flex items-center gap-1 rounded-lg px-3 py-1.5 text-xs font-medium transition-colors ${member.membership.status === 'Active'
                              ? 'bg-red-100 text-red-600 hover:bg-red-200'
                              : 'bg-green-100 text-green-700 hover:bg-green-200'
                            }`}>
                          {member.membership.status === 'Active'
                            ? <><XCircle size={12} /> Deaktiviraj</>
                            : <><CheckCircle size={12} /> Aktiviraj</>
                          }
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-muted-foreground">Nema članova</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}