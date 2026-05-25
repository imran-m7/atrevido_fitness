import React, { useState, useEffect, useRef } from 'react'
import { Upload, Search, FileText, Trash2, Eye, Download, User } from 'lucide-react'
import { nutritionApi } from '../../services/api'

const inputClass = 'w-full rounded-lg border border-input bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring'

export default function AdminNutrition() {
  const [members, setMembers] = useState([])
  const [search, setSearch] = useState('')
  const [loading, setLoading] = useState(true)
  const [uploading, setUploading] = useState(null) // userId koji se uploaduje
  const fileInputRef = useRef(null)
  const [activeUploadUserId, setActiveUploadUserId] = useState(null)

  const fetchMembers = async () => {
    try {
      const data = await nutritionApi.getMembers()
      console.log('MEMBERS:', data)
      console.log('PRVA SLIKA:', data[0]?.profileImageBase64?.substring(0, 50))
      setMembers(Array.isArray(data) ? data : [])
    } catch (err) {
      console.error('Greška pri učitavanju')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchMembers() }, [])

  const handleUploadClick = (userId) => {
    setActiveUploadUserId(userId)
    fileInputRef.current?.click()
  }

  const handleFileChange = async (e) => {
    const file = e.target.files?.[0]
    if (!file || !activeUploadUserId) return

    if (file.type !== 'application/pdf') {
      alert('Molimo odaberite PDF fajl.')
      return
    }
    if (file.size > 10 * 1024 * 1024) {
      alert('Fajl je prevelik. Maksimalna veličina je 10MB.')
      return
    }

    setUploading(activeUploadUserId)

    try {
      // Konvertuj u Base64
      const base64 = await new Promise((resolve, reject) => {
        const reader = new FileReader()
        reader.onload = () => resolve(reader.result.split(',')[1])
        reader.onerror = reject
        reader.readAsDataURL(file)
      })

      // Formatuj veličinu
      const sizeMB = (file.size / (1024 * 1024)).toFixed(1)
      const fileSize = `${sizeMB} MB`

      await nutritionApi.uploadPdf(activeUploadUserId, file.name, base64, fileSize)
      await fetchMembers()
    } catch (err) {
      alert(err.message || 'Greška pri uploadu.')
    } finally {
      setUploading(null)
      setActiveUploadUserId(null)
      e.target.value = '' // reset input
    }
  }

  const handleDelete = async (userId) => {
    if (!confirm('Jeste li sigurni da želite obrisati plan ishrane?')) return
    try {
      await nutritionApi.deletePdf(userId)
      await fetchMembers()
    } catch (err) {
      alert('Greška pri brisanju.')
    }
  }

  const handleDownload = async (planId, fileName) => {
    try {
      const data = await nutritionApi.download(planId)
      // Kreiraj download link iz Base64
      const byteChars = atob(data.pdfBase64)
      const byteArray = new Uint8Array(byteChars.length)
      for (let i = 0; i < byteChars.length; i++) {
        byteArray[i] = byteChars.charCodeAt(i)
      }
      const blob = new Blob([byteArray], { type: 'application/pdf' })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = data.pdfFileName || fileName
      a.click()
      URL.revokeObjectURL(url)
    } catch (err) {
      alert('Greška pri preuzimanju.')
    }
  }

  const filtered = members.filter(m =>
    `${m.firstName} ${m.lastName}`.toLowerCase().includes(search.toLowerCase()) ||
    m.username?.toLowerCase().includes(search.toLowerCase())
  )

  const withPlan = members.filter(m => m.nutritionPlan?.pdfFileName).length

  if (loading) return (
    <div className="flex min-h-[60vh] items-center justify-center">
      <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
    </div>
  )

  return (
    <div className="p-4 lg:p-8">
      {/* Skriveni file input */}
      <input
        ref={fileInputRef}
        type="file"
        accept=".pdf"
        className="hidden"
        onChange={handleFileChange}
      />

      <div className="mb-8">
        <h1 className="text-2xl font-bold text-foreground lg:text-3xl">Upravljaj planom ishrane</h1>
        <p className="text-muted-foreground">Postavi personalizovan PDF plan za svaku članicu</p>
      </div>

      {/* Stats */}
      <div className="mb-8 grid gap-4 md:grid-cols-2 w-fit">
        {[
          { label: 'Članice sa pristupom ishrani', value: members.length, bg: 'bg-primary/10', color: 'text-primary', icon: User },
          { label: 'Postavljeni planovi', value: withPlan, bg: 'bg-green-100', color: 'text-green-600', icon: FileText },
        ].map(({ label, value, bg, color, icon: Icon }) => (
          <div key={label} className="rounded-lg border border-border bg-card p-5 shadow-sm">
            <div className="flex items-center gap-4">
              <div className={`flex h-12 w-12 items-center justify-center rounded-lg ${bg}`}>
                <Icon size={24} className={color} />
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
      <div className="mb-6 max-w-md">
        <div className="relative">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <input className={inputClass + ' pl-9'} placeholder="Istraži članice..."
            value={search} onChange={e => setSearch(e.target.value)} />
        </div>
      </div>

      {/* Members List */}
      <div className="rounded-lg border border-border bg-card shadow-sm">
        <div className="p-5 border-b border-border">
          <h3 className="font-semibold text-foreground">Planovi ishrane ({filtered.length})</h3>
        </div>
        <div className="p-5 space-y-4">
          {filtered.length === 0 ? (
            <p className="py-8 text-center text-muted-foreground">
              Nema članica sa aktivnim Individual+Ishrana planom.
            </p>
          ) : (
            filtered.map((member) => {
              const isUploading = uploading === member.id
              const plan = member.nutritionPlan

              return (
                <div key={member.id}
                  className="flex flex-col gap-4 rounded-lg border border-border p-4 sm:flex-row sm:items-center sm:justify-between">
                  {/* Član info */}
                  <div className="flex items-center gap-4">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-primary/10 overflow-hidden">
                      {member.profileImageBase64 ? (
                        <img src={member.profileImageBase64} alt={member.firstName}
                          className="h-12 w-12 rounded-full object-cover" />
                      ) : (
                        <span className="text-lg font-semibold text-primary">
                          {member.firstName[0]}{member.lastName[0]}
                        </span>
                      )}
                    </div>
                    <div>
                      <h4 className="font-semibold text-foreground">
                        {member.firstName} {member.lastName}
                      </h4>
                      <p className="text-sm text-muted-foreground">@{member.username}</p>
                      <span className="inline-block mt-1 rounded-full bg-purple-100 px-2.5 py-0.5 text-xs font-medium text-purple-700">
                        Individualni + Ishrana
                      </span>
                    </div>
                  </div>

                  {/* Plan akcije */}
                  <div className="flex flex-col gap-2 sm:items-end">
                    {isUploading ? (
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary border-t-transparent" />
                        Uploadovanje...
                      </div>
                    ) : plan?.pdfFileName ? (
                      <>
                        {/* Plan postoji */}
                        <div className="flex items-center gap-2 rounded-lg bg-green-50 border border-green-200 px-3 py-2">
                          <FileText size={16} className="text-green-600 shrink-0" />
                          <div className="text-sm">
                            <p className="font-medium text-green-700">{plan.pdfFileName}</p>
                            <p className="text-green-600 text-xs">
                              {plan.pdfFileSize}
                              {plan.pdfUploadedAt && ` · ${new Date(plan.pdfUploadedAt).toLocaleDateString('bs-BA', { day: 'numeric', month: 'long', year: 'numeric' })}`}
                            </p>
                          </div>
                        </div>
                        <div className="flex flex-wrap gap-2">

                          <button
                            onClick={() => handleUploadClick(member.id)}
                            className="inline-flex items-center gap-1.5 rounded-lg border border-border px-3 py-1.5 text-sm font-medium text-foreground hover:bg-muted transition-colors">
                            <Upload size={14} /> Zamijeni
                          </button>
                          <button
                            onClick={() => handleDelete(member.id)}
                            className="inline-flex items-center justify-center h-8 w-8 rounded-lg border border-border text-destructive hover:bg-muted transition-colors">
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </>
                    ) : (
                      <>
                        {/* Nema plana */}
                        <span className="rounded-full border border-yellow-300 bg-yellow-50 px-3 py-1 text-xs font-medium text-yellow-700">
                          Plan nije objavljen
                        </span>
                        <button
                          onClick={() => handleUploadClick(member.id)}
                          className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground hover:opacity-90 transition-opacity">
                          <Upload size={16} /> Objavi PDF Plan
                        </button>
                      </>
                    )}
                  </div>
                </div>
              )
            })
          )}
        </div>
      </div>

      {/* Smjernice */}
      <div className="mt-6 rounded-lg border border-border bg-card shadow-sm">
        <div className="p-5 border-b border-border">
          <h3 className="font-semibold text-foreground">Smjernice za objavljivanje</h3>
        </div>
        <div className="p-5">
          <ul className="space-y-2 text-sm text-muted-foreground">
            {[
              'Samo PDF fajlovi, maksimalna veličina 10MB',
              'Samo članice sa aktivnim planom "Individualni trening + Ishrana" se prikazuju ovdje',
              'Zamjena plana trajno briše prethodnu verziju',
              'Članica može preuzeti PDF sa svog računa u sekciji "Ishrana"',
            ].map(tip => (
              <li key={tip} className="flex items-start gap-2">
                <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
                {tip}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  )
}