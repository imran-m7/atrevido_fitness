import React, { useState, useEffect } from 'react'
import { Search, Users, UserPlus, X, CheckCircle, XCircle, Clock, KeyRound, Trash2, Settings } from 'lucide-react'
import { adminApi, authApi } from '../../services/api'
import PhoneInput, { isValidBAPhone } from '../../components/PhoneInput'

const inputClass = 'w-full rounded-lg border border-input bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring'
const labelClass = 'block mb-1.5 text-sm font-medium text-foreground'

const programs = [
  { id: 'group', title: 'Grupni Treninzi' },
  { id: 'individual', title: 'Individualni Treninzi' },
  { id: 'individual-nutrition', title: 'Individualni Trening + Ishrana' },
]

const getMembershipLabel = (membership) => {
  if (!membership) return 'Bez plana'
  if (membership.trainingType === 'Individual' && membership.nutritionEnabled) return 'Individualni + Ishrana'
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
  const [loading, setLoading] = useState(true)

  // Add member modal
  const [showAddModal, setShowAddModal] = useState(false)
  const [addForm, setAddForm] = useState({
    firstName: '', lastName: '', username: '', email: '', phone: '',
    password: '', confirmPassword: '', trainingProgram: ''
  })

  // Reset password modal
  const [showPasswordModal, setShowPasswordModal] = useState(false)
  const [selectedMember, setSelectedMember] = useState(null)
  const [newPassword, setNewPassword] = useState('')
  const [confirmNewPassword, setConfirmNewPassword] = useState('')
  const [passwordError, setPasswordError] = useState('')
  const [passwordSaving, setPasswordSaving] = useState(false)

  // Change plan modal
  const [showPlanModal, setShowPlanModal] = useState(false)
  const [memberForPlan, setMemberForPlan] = useState(null)
  const [newPlan, setNewPlan] = useState('group')
  const [planSaving, setPlanSaving] = useState(false)

  // Delete modal
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [memberToDelete, setMemberToDelete] = useState(null)
  const [deleting, setDeleting] = useState(false)

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

  const handleAddChange = (e) => setAddForm({ ...addForm, [e.target.id]: e.target.value })

  const handleAddMember = async (e) => {
    e.preventDefault()
    if (addForm.password !== addForm.confirmPassword) { alert('Šifre se ne poklapaju'); return }
    if (addForm.phone && !isValidBAPhone(addForm.phone)) { alert('Unesite ispravan bosanski broj telefona.'); return }
    try {
      const registerData = await authApi.register({
        firstName: addForm.firstName, lastName: addForm.lastName,
        username: addForm.username, email: addForm.email || null,
        phoneNumber: addForm.phone || null, password: addForm.password
      })
      await adminApi.updateMembership(registerData.id, {
        trainingType: addForm.trainingProgram === 'group' ? 'Group' : 'Individual',
        status: 'Active', paymentStatus: 'Paid',
        nutritionEnabled: addForm.trainingProgram === 'individual-nutrition',
        adminNotes: 'Dodano od strane admina'
      })
      await adminApi.updateUserStatus(registerData.id, true)
      await fetchMembers()
      setShowAddModal(false)
      setAddForm({ firstName: '', lastName: '', username: '', email: '', phone: '', password: '', confirmPassword: '', trainingProgram: '' })
    } catch (err) {
      alert(err.message || 'Greška pri dodavanju člana.')
    }
  }

  const handleApprove = async (member) => {
    try {
      await adminApi.updateMembership(member.id, { status: 'Active', paymentStatus: 'Paid', activatedAt: new Date().toISOString() })
      await adminApi.updateUserStatus(member.id, true)
      await fetchMembers()
    } catch (err) { alert('Greška pri odobravanju.') }
  }

  const toggleStatus = async (member) => {
    const isCurrentlyActive = member.membership?.status === 'Active'
    try {
      await adminApi.updateMembership(member.id, {
        status: isCurrentlyActive ? 'Inactive' : 'Active',
        paymentStatus: isCurrentlyActive ? 'Pending' : 'Paid'
      })
      await adminApi.updateUserStatus(member.id, !isCurrentlyActive)
      await fetchMembers()
    } catch (err) { alert('Greška pri promjeni statusa: ' + err.message) }
  }

  // Reset password
  const openPasswordModal = (member) => {
    setSelectedMember(member)
    setNewPassword('')
    setConfirmNewPassword('')
    setPasswordError('')
    setShowPasswordModal(true)
  }

  const handleResetPassword = async (e) => {
    e.preventDefault()
    setPasswordError('')
    if (newPassword !== confirmNewPassword) { setPasswordError('Šifre se ne poklapaju.'); return }
    setPasswordSaving(true)
    try {
      await adminApi.resetMemberPassword(selectedMember.id, newPassword)
      setShowPasswordModal(false)
    } catch (err) {
      setPasswordError(err.message || 'Greška pri promjeni šifre.')
    } finally {
      setPasswordSaving(false)
    }
  }

  // Change plan
  const openPlanModal = (member) => {
    setMemberForPlan(member)
    const current = member.membership?.trainingType
    const hasNutrition = member.membership?.nutritionEnabled
    if (current === 'Individual' && hasNutrition) setNewPlan('individual-nutrition')
    else if (current === 'Individual') setNewPlan('individual')
    else setNewPlan('group')
    setShowPlanModal(true)
  }

  const handleChangePlan = async () => {
    setPlanSaving(true)
    try {
      await adminApi.updateMembership(memberForPlan.id, {
        trainingType: newPlan === 'group' ? 'Group' : 'Individual',
        nutritionEnabled: newPlan === 'individual-nutrition',
        status: 'Active',
        paymentStatus: 'Paid',
      })
      await adminApi.updateUserStatus(memberForPlan.id, true)
      setShowPlanModal(false)
      setMemberForPlan(null)
      await fetchMembers()
    } catch (err) {
      alert(err.message || 'Greška pri promjeni plana.')
    } finally {
      setPlanSaving(false)
    }
  }

  // Delete member
  const openDeleteModal = (member) => {
    setMemberToDelete(member)
    setShowDeleteModal(true)
  }

  const handleDeleteMember = async () => {
    setDeleting(true)
    try {
      await adminApi.deleteMember(memberToDelete.id)
      setShowDeleteModal(false)
      setMemberToDelete(null)
      await fetchMembers()
    } catch (err) {
      alert(err.message || 'Greška pri brisanju.')
    } finally {
      setDeleting(false)
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
      (m.email || '').toLowerCase().includes(search.toLowerCase())
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
        <button onClick={() => setShowAddModal(true)}
          className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground hover:opacity-90 transition-opacity">
          <UserPlus size={16} /> Dodaj Člana
        </button>
      </div>

      {/* ── Add Member Modal ── */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setShowAddModal(false)} />
          <div className="relative z-10 w-full max-w-2xl rounded-lg border border-border bg-card p-8 shadow-lg max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-foreground">Dodaj Člana</h2>
              <button onClick={() => setShowAddModal(false)} className="text-muted-foreground hover:text-foreground"><X size={24} /></button>
            </div>
            <form onSubmit={handleAddMember} className="space-y-5">
              <div className="grid gap-4 md:grid-cols-2">
                <div><label htmlFor="firstName" className={labelClass}>Ime</label>
                  <input id="firstName" className={inputClass} placeholder="Unesite ime" value={addForm.firstName} onChange={handleAddChange} required /></div>
                <div><label htmlFor="lastName" className={labelClass}>Prezime</label>
                  <input id="lastName" className={inputClass} placeholder="Unesite prezime" value={addForm.lastName} onChange={handleAddChange} required /></div>
              </div>
              <div><label htmlFor="username" className={labelClass}>Korisničko ime</label>
                <input id="username" className={inputClass} placeholder="npr. marija_fitness" value={addForm.username} onChange={handleAddChange} required /></div>
              <div><label htmlFor="email" className={labelClass}>Email (opciono)</label>
                <input id="email" type="email" className={inputClass} placeholder="Unesite email" value={addForm.email} onChange={handleAddChange} /></div>
              <div><label htmlFor="phone" className={labelClass}>Broj Telefona</label>
                <PhoneInput id="phone" value={addForm.phone} onChange={(val) => setAddForm({ ...addForm, phone: val })} /></div>
              <div className="grid gap-4 md:grid-cols-2">
                <div><label htmlFor="password" className={labelClass}>Šifra</label>
                  <input id="password" type="password" className={inputClass} placeholder="Unesite šifru" value={addForm.password} onChange={handleAddChange} required /></div>
                <div><label htmlFor="confirmPassword" className={labelClass}>Potvrdite Šifru</label>
                  <input id="confirmPassword" type="password" className={inputClass} placeholder="Potvrdite šifru" value={addForm.confirmPassword} onChange={handleAddChange} required /></div>
              </div>
              <div><label htmlFor="trainingProgram" className={labelClass}>Trening Program</label>
                <select id="trainingProgram" value={addForm.trainingProgram}
                  onChange={(e) => setAddForm({ ...addForm, trainingProgram: e.target.value })}
                  className={`${inputClass} ${!addForm.trainingProgram ? 'text-muted-foreground' : 'text-foreground'}`} required>
                  <option value="" disabled>-- Odaberite program --</option>
                  {programs.map(p => <option key={p.id} value={p.id}>{p.title}</option>)}
                </select>
              </div>
              <div className="flex gap-3 pt-6">
                <button type="button" onClick={() => setShowAddModal(false)}
                  className="flex-1 rounded-lg border border-border px-4 py-2.5 text-sm font-medium text-foreground hover:bg-muted transition-colors">Otkaži</button>
                <button type="submit"
                  className="flex-1 rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground hover:opacity-90 transition-opacity">Dodaj Člana</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── Reset Password Modal ── */}
      {showPasswordModal && selectedMember && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setShowPasswordModal(false)} />
          <div className="relative z-10 w-full max-w-md rounded-lg border border-border bg-card p-6 shadow-lg">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-lg font-bold text-foreground">Promijeni šifru</h2>
                <p className="text-sm text-muted-foreground">{selectedMember.firstName} {selectedMember.lastName}</p>
              </div>
              <button onClick={() => setShowPasswordModal(false)} className="text-muted-foreground hover:text-foreground"><X size={20} /></button>
            </div>
            <form onSubmit={handleResetPassword} className="space-y-4">
              {passwordError && (
                <div className="rounded-lg border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive">{passwordError}</div>
              )}
              <div>
                <label className={labelClass}>Nova šifra</label>
                <input type="password" className={inputClass}
                  placeholder="Min 6 znakova, 1 veliko, 1 specijalni"
                  value={newPassword} onChange={e => setNewPassword(e.target.value)} required />
              </div>
              <div>
                <label className={labelClass}>Potvrdi novu šifru</label>
                <input type="password" className={inputClass}
                  placeholder="Ponovi novu šifru"
                  value={confirmNewPassword} onChange={e => setConfirmNewPassword(e.target.value)} required />
              </div>
              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => setShowPasswordModal(false)}
                  className="flex-1 rounded-lg border border-border px-4 py-2.5 text-sm font-medium text-foreground hover:bg-muted transition-colors">Otkaži</button>
                <button type="submit" disabled={passwordSaving}
                  className="flex-1 rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground hover:opacity-90 transition-opacity disabled:opacity-50">
                  {passwordSaving ? 'Čuvanje...' : 'Sačuvaj šifru'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── Change Plan Modal ── */}
      {showPlanModal && memberForPlan && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setShowPlanModal(false)} />
          <div className="relative z-10 w-full max-w-sm rounded-lg border border-border bg-card p-6 shadow-lg">
            <div className="flex items-center justify-between mb-5">
              <div>
                <h2 className="text-lg font-bold text-foreground">Promijeni plan</h2>
                <p className="text-sm text-muted-foreground">{memberForPlan.firstName} {memberForPlan.lastName}</p>
              </div>
              <button onClick={() => setShowPlanModal(false)} className="text-muted-foreground hover:text-foreground"><X size={20} /></button>
            </div>
            <div className="space-y-3 mb-6">
              {[
                { id: 'group', label: 'Grupni treninzi', desc: 'Pristup grupnim treninzima' },
                { id: 'individual', label: 'Individualni treninzi', desc: 'Pristup individualnim treninzima' },
                { id: 'individual-nutrition', label: 'Individualni + Ishrana', desc: 'Individualni treninzi + nutrition plan' },
              ].map(plan => (
                <button key={plan.id} onClick={() => setNewPlan(plan.id)}
                  className={`w-full rounded-lg border p-3 text-left transition-colors ${newPlan === plan.id ? 'border-primary bg-primary/5' : 'border-border hover:bg-muted'}`}>
                  <div className="flex items-center gap-2">
                    <div className={`h-4 w-4 rounded-full border-2 shrink-0 ${newPlan === plan.id ? 'border-primary bg-primary' : 'border-muted-foreground'}`} />
                    <div>
                      <p className="text-sm font-medium text-foreground">{plan.label}</p>
                      <p className="text-xs text-muted-foreground">{plan.desc}</p>
                    </div>
                  </div>
                </button>
              ))}
            </div>
            <div className="flex gap-3">
              <button onClick={() => setShowPlanModal(false)}
                className="flex-1 rounded-lg border border-border px-4 py-2.5 text-sm font-medium text-foreground hover:bg-muted transition-colors">Otkaži</button>
              <button onClick={handleChangePlan} disabled={planSaving}
                className="flex-1 rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground hover:opacity-90 transition-opacity disabled:opacity-50">
                {planSaving ? 'Čuvanje...' : 'Sačuvaj plan'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Delete Confirm Modal ── */}
      {showDeleteModal && memberToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setShowDeleteModal(false)} />
          <div className="relative z-10 w-full max-w-sm rounded-lg border border-border bg-card p-6 shadow-lg">
            <div className="mb-4 flex justify-center">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-destructive/10">
                <Trash2 size={24} className="text-destructive" />
              </div>
            </div>
            <h3 className="mb-2 text-center text-lg font-semibold text-foreground">Obriši člana</h3>
            <p className="mb-6 text-center text-sm text-muted-foreground">
              Jesi li sigurna da želiš obrisati <strong>{memberToDelete.firstName} {memberToDelete.lastName}</strong>? Ova akcija se ne može poništiti.
            </p>
            <div className="flex gap-3">
              <button onClick={() => setShowDeleteModal(false)}
                className="flex-1 rounded-lg border border-border px-4 py-2.5 text-sm font-medium text-foreground hover:bg-muted transition-colors">Otkaži</button>
              <button onClick={handleDeleteMember} disabled={deleting}
                className="flex-1 rounded-lg bg-destructive px-4 py-2.5 text-sm font-semibold text-white hover:opacity-90 transition-opacity disabled:opacity-50">
                {deleting ? 'Brisanje...' : 'Obriši'}
              </button>
            </div>
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

      {counts.pending > 0 && (
        <div className="mb-6 rounded-lg border border-yellow-200 bg-yellow-50 p-4 flex items-center gap-3">
          <Users size={20} className="text-yellow-600 shrink-0" />
          <p className="text-sm text-yellow-800">
            <strong>{counts.pending}</strong> {counts.pending === 1 ? 'član čeka' : 'članova čeka'} odobrenje.
            {filter !== 'pending' && (
              <button onClick={() => setFilter('pending')} className="ml-2 text-yellow-700 underline font-medium">Prikaži</button>
            )}
          </p>
        </div>
      )}

      <div className="mb-6 rounded-lg border border-border bg-card p-4 shadow-sm">
        <div className="relative">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <input className={inputClass + ' pl-9'} placeholder="Traži člana..."
            value={search} onChange={e => setSearch(e.target.value)} />
        </div>
      </div>

      <div className="rounded-lg border border-border bg-card shadow-sm">
        <div className="p-5 border-b border-border">
          <h3 className="font-semibold text-foreground">Članovi ({filtered.length})</h3>
        </div>
        <div className="p-5 overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border">
                {['Član', 'Telefon', 'Plan', 'Membership', 'Datum reg.', 'Ističe', 'Radnje'].map((h, i) => (
                  <th key={h} className={`pb-3 text-sm font-medium text-muted-foreground ${i === 6 ? 'text-right' : 'text-left'}`}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((member, i) => (
                <tr key={member.id} className={i < filtered.length - 1 ? 'border-b border-border' : ''}>
                  <td className="py-4">
                    <div className="flex items-center gap-3">
                      {member.profileImageBase64 ? (
                        <img src={member.profileImageBase64} alt="Avatar"
                          className={`h-10 w-10 rounded-full object-cover shrink-0 ${member.isActive ? 'border-2 border-primary/30' : 'opacity-60'}`} />
                      ) : (
                        <div className={`flex h-10 w-10 items-center justify-center rounded-full shrink-0 ${member.isActive ? 'bg-primary/10' : 'bg-gray-100'}`}>
                          <span className={`text-sm font-medium ${member.isActive ? 'text-primary' : 'text-gray-400'}`}>
                            {member.firstName[0]}{member.lastName[0]}
                          </span>
                        </div>
                      )}
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
                  <td className="py-4">
                    <span className={`rounded-full px-2.5 py-1 text-xs font-medium ${member.membership?.status === 'Active' ? 'bg-green-100 text-green-700' :
                      member.membership?.status === 'Pending' ? 'bg-yellow-100 text-yellow-700' : 'bg-gray-100 text-gray-600'}`}>
                      {member.membership?.status === 'Active' ? 'Aktivan' :
                        member.membership?.status === 'Pending' ? 'Na čekanju' :
                          member.membership ? 'Neaktivan' : 'Bez plana'}
                    </span>
                  </td>
                  <td className="py-4 text-sm text-muted-foreground">
                    {new Date(member.createdAt).toLocaleDateString('bs-BA')}
                  </td>
                  <td className="py-4 min-w-[110px]">
                    {member.membership?.endDate ? (() => {
                      const end = new Date(member.membership.endDate)
                      const now = new Date()
                      const daysLeft = Math.ceil((end - now) / (1000 * 60 * 60 * 24))
                      const isExpiringSoon = daysLeft <= 7 && daysLeft > 0
                      const isExpired = daysLeft <= 0
                      return (
                        <div className="flex items-center gap-1.5">
                          <Clock size={13} className={isExpired ? 'text-red-500' : isExpiringSoon ? 'text-yellow-500' : 'text-muted-foreground'} />
                          <span className={`text-xs font-medium ${isExpired ? 'text-red-600' : isExpiringSoon ? 'text-yellow-600' : 'text-muted-foreground'}`}>
                            {isExpired ? 'Isteklo' : isExpiringSoon ? `${daysLeft}d preostalo` : end.toLocaleDateString('bs-BA')}
                          </span>
                        </div>
                      )
                    })() : <span className="text-xs text-muted-foreground">—</span>}
                  </td>
                  <td className="py-4 text-right min-w-[160px]">
                    <div className="flex justify-end gap-1.5 flex-wrap">
                      {member.membership?.status === 'Pending' && (
                        <button onClick={() => handleApprove(member)}
                          className="inline-flex items-center gap-1 rounded-lg bg-green-100 px-2.5 py-1.5 text-xs font-medium text-green-700 hover:bg-green-200 transition-colors">
                          <CheckCircle size={12} /> Odobri
                        </button>
                      )}
                      {member.membership && member.membership.status !== 'Pending' && (
                        <button onClick={() => toggleStatus(member)}
                          className={`inline-flex items-center gap-1 rounded-lg px-2.5 py-1.5 text-xs font-medium transition-colors ${member.membership.status === 'Active'
                            ? 'bg-red-100 text-red-600 hover:bg-red-200'
                            : 'bg-green-100 text-green-700 hover:bg-green-200'}`}>
                          {member.membership.status === 'Active'
                            ? <><XCircle size={12} /> Deaktiviraj</>
                            : <><CheckCircle size={12} /> Aktiviraj</>}
                        </button>
                      )}
                      <button onClick={() => openPasswordModal(member)}
                        className="inline-flex items-center gap-1 rounded-lg bg-blue-100 px-2.5 py-1.5 text-xs font-medium text-blue-700 hover:bg-blue-200 transition-colors">
                        <KeyRound size={12} /> Šifra
                      </button>
                      <button onClick={() => openPlanModal(member)}
                        className="inline-flex items-center gap-1 rounded-lg bg-purple-100 px-2.5 py-1.5 text-xs font-medium text-purple-700 hover:bg-purple-200 transition-colors">
                        <Settings size={12} /> Plan
                      </button>
                      <button onClick={() => openDeleteModal(member)}
                        className="inline-flex items-center gap-1 rounded-lg bg-gray-100 px-2.5 py-1.5 text-xs font-medium text-gray-600 hover:bg-red-100 hover:text-red-600 transition-colors">
                        <Trash2 size={12} /> Obriši
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr><td colSpan={7} className="py-8 text-center text-muted-foreground">Nema članova</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}