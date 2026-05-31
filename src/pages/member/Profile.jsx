import React, { useEffect, useState } from 'react'
import { User, Phone, Edit, CreditCard, X, AtSign, Camera } from 'lucide-react'
import { profileApi } from '../../services/api'
import PhoneInput, { isValidBAPhone } from '../../components/PhoneInput'
import { useAuth } from '../../context/AuthContext'

const inputClass = 'w-full rounded-lg border border-input bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring transition-colors'
const labelClass = 'block mb-1.5 text-sm font-medium text-foreground'

function membershipLabel(type) {
  if (type === 'Individual') return 'Individualni trening'
  if (type === 'Group') return 'Grupni trening'
  if (type === 'Both') return 'Individualni + Grupni'
  return 'Nema članstva'
}

function membershipStatusLabel(status) {
  if (status === 'Active') return 'Aktivno'
  if (status === 'Pending') return 'Na čekanju'
  if (status === 'Inactive') return 'Neaktivno'
  return status ?? '-'
}

const emptyForm = {
  firstName: '',
  lastName: '',
  phoneNumber: '',
  username: '',
  newPassword: '',
  confirmPassword: '',
  profileImageBase64: null,
}

export default function MemberProfile() {
  const { updateProfile } = useAuth()
  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [saving, setSaving] = useState(false)
  const [form, setForm] = useState(emptyForm)

  const fetchProfile = async () => {
    setLoading(true)
    setError('')
    try {
      const data = await profileApi.get()
      setProfile(data)
      setForm(prev => ({
        ...prev,
        firstName: data.firstName ?? '',
        lastName: data.lastName ?? '',
        phoneNumber: data.phoneNumber ?? '',
        username: data.username ?? '',
      }))
    } catch (err) {
      setError(err.message || 'Nije moguće učitati profil.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchProfile() }, [])

  const handleChange = (e) => {
    const { id, value } = e.target
    setForm(prev => ({ ...prev, [id]: value }))
  }

  const handleOpenModal = () => {
    setError('')
    setSuccess('')
    setForm(prev => ({
      ...prev,
      newPassword: '',
      confirmPassword: '',
    }))
    setIsEditModalOpen(true)
  }

  const handleSave = async (e) => {
    e.preventDefault()
    setError('')

    if (form.newPassword && form.newPassword !== form.confirmPassword) {
      setError('Šifre se ne poklapaju.')
      return
    }
    if (form.phoneNumber && !isValidBAPhone(form.phoneNumber)) {
      setError('Unesite ispravan bosanski broj telefona.')
      return
    }

    setSaving(true)
    try {
      const result = await profileApi.update({
        firstName: form.firstName,
        lastName: form.lastName,
        phoneNumber: form.phoneNumber || null,
        username: form.username || null,
        newPassword: form.newPassword || null,
        profileImageBase64: form.profileImageBase64 || null,
      })

      updateProfile(form.firstName, result?.newUsername, form.profileImageBase64 || profile?.profileImageBase64 || null)
      setSuccess('Profil uspješno ažuriran.')
      setIsEditModalOpen(false)
      await fetchProfile()
    } catch (err) {
      setError(err.message || 'Greška pri ažuriranju profila.')
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="p-4 lg:p-8 flex items-center justify-center h-64">
        <p className="text-muted-foreground">Učitavanje profila...</p>
      </div>
    )
  }

  return (
    <div className="p-4 lg:p-8">
      <div className="mb-8 flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground lg:text-3xl">Moj profil</h1>
          <p className="text-muted-foreground">Upravljajte svojim računom</p>
        </div>
        <button onClick={handleOpenModal}
          className="inline-flex items-center gap-2 rounded-lg border border-border px-4 py-2 text-sm font-medium text-foreground hover:bg-muted transition-colors">
          <Edit size={16} /> Uredi profil
        </button>
      </div>

      {error && (
        <div className="mb-4 rounded-lg border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive">{error}</div>
      )}
      {success && (
        <div className="mb-4 rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700">{success}</div>
      )}

      <div className="grid gap-6 lg:grid-cols-2">

        {/* Lične informacije */}
        <div className="rounded-lg border border-border bg-card shadow-sm">
          <div className="p-5 border-b border-border">
            <h3 className="font-semibold text-foreground">Lične informacije</h3>
          </div>
          <div className="p-5">
            <div className="flex items-start gap-6">
              <div className="relative flex h-20 w-20 shrink-0">
                {profile?.profileImageBase64 ? (
                  <img src={profile.profileImageBase64} alt="Profilna slika"
                    className="h-20 w-20 rounded-full object-cover border-2 border-primary/20" />
                ) : (
                  <div className="flex h-20 w-20 items-center justify-center rounded-full bg-primary/10">
                    <User size={40} className="text-primary" />
                  </div>
                )}
              </div>
              <div className="flex-1">
                <h2 className="text-xl font-semibold text-foreground">
                  {profile?.firstName} {profile?.lastName}
                </h2>
                <span className="inline-block mt-1 rounded-full bg-primary px-3 py-1 text-xs font-medium text-primary-foreground">
                  {membershipLabel(profile?.membershipType)}
                </span>
                <div className="mt-4 space-y-3">
                  {[
                    { icon: AtSign, label: 'Korisničko ime', value: profile?.username },
                    { icon: Phone, label: 'Telefon', value: profile?.phoneNumber || '-' },
                  ].map(({ icon: Icon, label, value }) => (
                    <div key={label} className="flex items-center gap-3">
                      <Icon size={16} className="text-muted-foreground shrink-0" />
                      <div>
                        <p className="text-sm text-muted-foreground">{label}</p>
                        <p className="text-foreground">{value}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Članstvo */}
        <div className="rounded-lg border border-border bg-card shadow-sm">
          <div className="flex items-center gap-2 p-5 border-b border-border">
            <CreditCard size={20} />
            <h3 className="font-semibold text-foreground">Članstvo</h3>
          </div>
          <div className="p-5 space-y-4">
            <div>
              <p className="text-sm text-muted-foreground">Trenutni plan</p>
              <p className="text-lg font-semibold text-foreground">{membershipLabel(profile?.membershipType)}</p>
              <span className={`inline-block mt-1 rounded-full px-3 py-1 text-xs font-medium ${profile?.membershipStatus === 'Active' ? 'bg-green-100 text-green-700' :
                  profile?.membershipStatus === 'Pending' ? 'bg-yellow-100 text-yellow-700' :
                    'bg-gray-100 text-gray-700'
                }`}>
                {membershipStatusLabel(profile?.membershipStatus)}
              </span>
            </div>
            <div className="border-t border-border pt-4">
              <p className="mb-2 text-sm text-muted-foreground">Plan uključuje:</p>
              <ul className="space-y-1 text-sm text-foreground">
                {(profile?.membershipType === 'Individual' || profile?.membershipType === 'Both'
                  ? ['Individualni treninzi', 'Praćenje napretka', 'Učešće u izazovima']
                  : ['Grupni treninzi', 'Praćenje napretka', 'Učešće u izazovima']
                ).map(item => (
                  <li key={item}>— {item}</li>
                ))}
                {profile?.nutritionEnabled && (
                  <li>— Personalizovani plan ishrane</li>
                )}
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Edit Modal */}
      {isEditModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="mx-4 w-full max-w-md max-h-[90vh] overflow-y-auto rounded-lg border border-border bg-card shadow-lg">
            <div className="flex items-center justify-between p-5 border-b border-border sticky top-0 bg-card">
              <h2 className="text-lg font-semibold text-foreground">Uredi profil</h2>
              <button onClick={() => setIsEditModalOpen(false)} className="rounded-lg p-1 hover:bg-muted transition-colors">
                <X size={20} className="text-muted-foreground" />
              </button>
            </div>
            <form onSubmit={handleSave} className="p-5 space-y-4">
              {error && (
                <div className="rounded-lg border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive">{error}</div>
              )}

              {/* Ime i prezime */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label htmlFor="firstName" className={labelClass}>Ime</label>
                  <input id="firstName" type="text" className={inputClass}
                    value={form.firstName} onChange={handleChange} required />
                </div>
                <div>
                  <label htmlFor="lastName" className={labelClass}>Prezime</label>
                  <input id="lastName" type="text" className={inputClass}
                    value={form.lastName} onChange={handleChange} required />
                </div>
              </div>

              {/* Telefon */}
              <div>
                <label htmlFor="phoneNumber" className={labelClass}>Telefon</label>
                <PhoneInput id="phoneNumber" value={form.phoneNumber} onChange={(val) => setForm(prev => ({ ...prev, phoneNumber: val }))} />
              </div>

              {/* Profilna slika */}
              <div>
                <label className={labelClass}>Profilna slika</label>
                <div className="flex items-center gap-4">
                  <div className="relative h-16 w-16 shrink-0">
                    {form.profileImageBase64 || profile?.profileImageBase64 ? (
                      <img src={form.profileImageBase64 || profile?.profileImageBase64} alt="Preview"
                        className="h-16 w-16 rounded-full object-cover border-2 border-primary/20" />
                    ) : (
                      <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
                        <User size={28} className="text-primary" />
                      </div>
                    )}
                  </div>
                  <div className="flex-1">
                    <label htmlFor="imageUpload"
                      className="inline-flex cursor-pointer items-center gap-2 rounded-lg border border-border px-3 py-2 text-sm font-medium text-foreground hover:bg-muted transition-colors">
                      <Camera size={15} /> Odaberi sliku
                    </label>
                    <input id="imageUpload" type="file" accept="image/*" className="hidden"
                      onChange={(e) => {
                        const file = e.target.files[0]
                        if (!file) return
                        if (file.size > 2 * 1024 * 1024) { setError('Slika mora biti manja od 2MB.'); return }
                        const reader = new FileReader()
                        reader.onload = (ev) => setForm(prev => ({ ...prev, profileImageBase64: ev.target.result }))
                        reader.readAsDataURL(file)
                      }} />
                    <p className="mt-1 text-xs text-muted-foreground">JPG, PNG — max 2MB</p>
                  </div>
                </div>
              </div>

              {/* Username */}
              <div>
                <label htmlFor="username" className={labelClass}>Korisničko ime</label>
                <input id="username" type="text" className={inputClass}
                  placeholder="npr. ana.kovac"
                  value={form.username} onChange={handleChange} />
              </div>

              <div className="border-t border-border pt-3">
                <p className="mb-3 text-xs font-medium text-muted-foreground uppercase tracking-wide">Promjena šifre (opcionalno)</p>
                <div className="space-y-3">
                  <div>
                    <label htmlFor="newPassword" className={labelClass}>Nova šifra</label>
                    <input id="newPassword" type="password" className={inputClass}
                      placeholder="Min 6 znakova, 1 veliko, 1 specijalni"
                      value={form.newPassword} onChange={handleChange} />
                  </div>
                  <div>
                    <label htmlFor="confirmPassword" className={labelClass}>Potvrdi novu šifru</label>
                    <input id="confirmPassword" type="password" className={inputClass}
                      placeholder="Ponovi novu šifru"
                      value={form.confirmPassword} onChange={handleChange} />
                  </div>
                </div>
              </div>

              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => setIsEditModalOpen(false)}
                  className="flex-1 rounded-lg border border-border px-4 py-2.5 text-sm font-medium text-foreground hover:bg-muted transition-colors">
                  Otkaži
                </button>
                <button type="submit" disabled={saving}
                  className="flex-1 rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground hover:opacity-90 transition-opacity disabled:opacity-50">
                  {saving ? 'Čuvanje...' : 'Sačuvaj promjene'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}