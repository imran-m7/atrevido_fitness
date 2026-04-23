import React, { useState } from 'react'
import { User, Phone, Edit, CreditCard, X, Upload, AlertCircle } from 'lucide-react'

const userProfile = {
  name: 'Sarah Johnson',
  username: 'sarahjohnson',
  phone: '(555) 987-6543',
  subscription: 'Individualni trening + Ishrana',
  subscriptionStatus: 'Aktivno',
  nextBilling: '15. april 2024.',
  trainer: 'Dika Hodžić-Afaneh',
}

export default function MemberProfile() {
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false)
  const [avatarPreview, setAvatarPreview] = useState(null)
  const [formData, setFormData] = useState({
    username: userProfile.username,
    phone: userProfile.phone,
    newPassword: '',
    confirmPassword: '',
  })

  const handleFormChange = (e) => {
    const { id, value } = e.target
    setFormData(prev => ({ ...prev, [id]: value }))
  }

  const handlePhotoChange = (e) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setAvatarPreview(reader.result)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleSaveProfile = (e) => {
    e.preventDefault()
    if (formData.newPassword && formData.newPassword !== formData.confirmPassword) {
      alert('Passwords do not match!')
      return
    }
    alert('Profile updated successfully!')
    setIsEditModalOpen(false)
  }

  const handleDeleteClick = () => {
    setIsDeleteConfirmOpen(true)
  }

  const handleConfirmDelete = () => {
    alert('Account deletion simulated. This would delete the account on the backend.')
    setIsDeleteConfirmOpen(false)
    setIsEditModalOpen(false)
  }

  return (
    <div className="p-4 lg:p-8">
      <div className="mb-8 flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground lg:text-3xl">Moj profil</h1>
          <p className="text-muted-foreground">Upravljajte svojim računom i pretplatom</p>
        </div>
        <button 
          onClick={() => setIsEditModalOpen(true)}
          className="inline-flex items-center gap-2 rounded-lg border border-border px-4 py-2 text-sm font-medium text-foreground hover:bg-muted transition-colors"
        >
          <Edit size={16} /> Uredi profil
        </button>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Personal Info */}
        <div className="rounded-lg border border-border bg-card shadow-sm min-h-[350px]">
            <div className="p-5 border-b border-border">
              <h3 className="font-semibold text-foreground">Lične informacije</h3>
            </div>
            <div className="p-5">
              <div className="flex items-start gap-6">
                <div className="flex h-20 w-20 items-center justify-center rounded-full bg-primary/10 shrink-0">
                  <User size={40} className="text-primary" />
                </div>
                <div className="flex-1">
                  <div>
                    <h2 className="text-xl font-semibold text-foreground">{userProfile.name}</h2>
                    <span className="inline-block mt-1 rounded-full bg-primary px-3 py-1 text-xs font-medium text-primary-foreground">
                      {userProfile.subscription}
                    </span>
                  </div>
                  <div className="mt-4 space-y-3">
                    {[
                      { icon: User,     label: 'Korisničko ime',        value: userProfile.username },
                      { icon: Phone,    label: 'Telefon',           value: userProfile.phone },
                      { icon: User,     label: 'Lični trener',value: userProfile.trainer },
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

        {/* Subscription */}
        <div className="rounded-lg border border-border bg-card shadow-sm min-h-[350px]">
            <div className="flex items-center gap-2 p-5 border-b border-border">
              <CreditCard size={20} />
              <h3 className="font-semibold text-foreground">Pretplata</h3>
            </div>
            <div className="p-5 space-y-4">
              <div>
                <p className="text-sm text-muted-foreground">Trenutni plan</p>
                <p className="text-lg font-semibold text-foreground">{userProfile.subscription}</p>
                <span className="inline-block mt-1 rounded-full bg-green-100 px-3 py-1 text-xs font-medium text-green-700">
                  {userProfile.subscriptionStatus}
                </span>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Datum sljedeće naplate</p>
                <p className="text-foreground">{userProfile.nextBilling}</p>
              </div>
              <div className="border-t border-border pt-4">
                <p className="mb-2 text-sm text-muted-foreground">Plan uključuje:</p>
                <ul className="space-y-1 text-sm text-foreground">
                  {['Individualni treninzi','Personalizovani plan ishrane','Pristup bazi recepata','Praćenje napretka','Učešće u izazovima'].map(item => (
                    <li key={item}>– {item}</li>
                  ))}
                </ul>
              </div>
              <button className="w-full rounded-lg border border-border px-4 py-2 text-sm font-medium text-foreground hover:bg-muted transition-colors">
                Upravljanje pretplatom
              </button>
            </div>
          </div>

        {/* Edit Profile Modal */}
        {isEditModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
            <div className="mx-4 w-full max-w-md max-h-[90vh] overflow-y-auto rounded-lg border border-border bg-card shadow-lg">
              {/* Modal Header */}
              <div className="flex items-center justify-between p-5 border-b border-border sticky top-0 bg-card">
                <h2 className="text-lg font-semibold text-foreground">Edit Profile</h2>
                <button
                  onClick={() => setIsEditModalOpen(false)}
                  className="rounded-lg p-1 hover:bg-muted transition-colors"
                >
                  <X size={20} className="text-muted-foreground" />
                </button>
              </div>

              <form onSubmit={handleSaveProfile} className="p-5 space-y-5">
                {/* Profile Picture Section */}
                <div className="text-center">
                  <div className="mb-4 flex justify-center">
                    {avatarPreview ? (
                      <img
                        src={avatarPreview}
                        alt="Profile"
                        className="h-24 w-24 rounded-full object-cover border-2 border-primary"
                      />
                    ) : (
                      <div className="flex h-24 w-24 items-center justify-center rounded-full bg-primary/10">
                        <User size={48} className="text-primary" />
                      </div>
                    )}
                  </div>
                  <label className="inline-flex items-center gap-2 rounded-lg border border-border px-4 py-2 text-sm font-medium text-foreground hover:bg-muted transition-colors cursor-pointer">
                    <Upload size={16} />
                    Change Photo
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handlePhotoChange}
                      className="hidden"
                    />
                  </label>
                </div>

                {/* Form Fields */}
                <div>
                  <label htmlFor="username" className="block mb-1.5 text-sm font-medium text-foreground">
                    Username
                  </label>
                  <input
                    id="username"
                    type="text"
                    value={formData.username}
                    onChange={handleFormChange}
                    className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring transition-colors"
                  />
                </div>

                <div>
                  <label htmlFor="phone" className="block mb-1.5 text-sm font-medium text-foreground">
                    Phone
                  </label>
                  <input
                    id="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={handleFormChange}
                    className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring transition-colors"
                  />
                </div>

                <div>
                  <label htmlFor="newPassword" className="block mb-1.5 text-sm font-medium text-foreground">
                    New Password
                  </label>
                  <input
                    id="newPassword"
                    type="password"
                    value={formData.newPassword}
                    onChange={handleFormChange}
                    className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring transition-colors"
                    placeholder="Leave blank to keep password unchanged"
                  />
                </div>

                <div>
                  <label htmlFor="confirmPassword" className="block mb-1.5 text-sm font-medium text-foreground">
                    Confirm Password
                  </label>
                  <input
                    id="confirmPassword"
                    type="password"
                    value={formData.confirmPassword}
                    onChange={handleFormChange}
                    className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring transition-colors"
                  />
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3 pt-4 border-t border-border">
                  <button
                    type="button"
                    onClick={() => setIsEditModalOpen(false)}
                    className="flex-1 rounded-lg border border-border px-4 py-2 text-sm font-medium text-foreground hover:bg-muted transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground hover:opacity-90 transition-opacity"
                  >
                    Save Changes
                  </button>
                </div>

                {/* Delete Account Button */}
                <button
                  type="button"
                  onClick={handleDeleteClick}
                  className="w-full rounded-lg border border-destructive/50 px-4 py-2 text-sm font-medium text-destructive hover:bg-destructive/10 transition-colors"
                >
                  Delete Account
                </button>
              </form>
            </div>
          </div>
        )}

        {/* Delete Confirmation Modal */}
        {isDeleteConfirmOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 ">
            <div className="mx-4 w-full max-w-sm rounded-lg border border-border bg-card shadow-lg">
              <div className="p-5">
                <div className="mb-4 flex justify-center">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-destructive/10">
                    <AlertCircle size={24} className="text-destructive" />
                  </div>
                </div>
                <h3 className="mb-2 text-center text-lg font-semibold text-foreground">Delete Account</h3>
                <p className="mb-6 text-center text-sm text-muted-foreground">
                  Are you sure you want to delete your account? This action cannot be undone.
                </p>
              </div>
              <div className="flex gap-3 border-t border-border p-5">
                <button
                  onClick={() => setIsDeleteConfirmOpen(false)}
                  className="flex-1 rounded-lg border border-border px-4 py-2 text-sm font-medium text-foreground hover:bg-muted transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleConfirmDelete}
                  className="flex-1 rounded-lg bg-destructive px-4 py-2 text-sm font-semibold text-primary-foreground hover:opacity-90 transition-opacity"
                >
                  Confirm Delete
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
