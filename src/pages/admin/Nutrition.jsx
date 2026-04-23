import React, { useState } from 'react'
import { Upload, Search, FileText, Trash2, Eye, Download, User, Calendar } from 'lucide-react'

const initialMembers = [
  { id: 1, name: 'Maria Garcia',        email: 'maria@email.com',      subscription: 'Individualni trening + Ishrana', nutritionPlan: { fileName: 'maria_garcia_nutrition_plan.pdf',      uploadedAt: '2024-01-15', fileSize: '2.4 MB' } },
  { id: 2, name: 'Sofia Rodriguez',     email: 'sofia@email.com',      subscription: 'Individualni trening + Ishrana', nutritionPlan: { fileName: 'sofia_rodriguez_plan.pdf',              uploadedAt: '2024-01-10', fileSize: '1.8 MB' } },
  { id: 3, name: 'Isabella Martinez',   email: 'isabella@email.com',   subscription: 'Individualni trening + Ishrana', nutritionPlan: null },
  { id: 4, name: 'Camila Lopez',        email: 'camila@email.com',     subscription: 'Individualni trening',    nutritionPlan: null },
  { id: 5, name: 'Valentina Hernandez', email: 'valentina@email.com',  subscription: 'Individualni trening + Ishrana', nutritionPlan: { fileName: 'valentina_nutrition_jan2024.pdf',        uploadedAt: '2024-01-18', fileSize: '3.1 MB' } },
  { id: 6, name: 'Ana Torres',          email: 'ana@email.com',        subscription: 'Grupni trening',         nutritionPlan: null },
]

const inputClass = 'w-full rounded-lg border border-input bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring'

export default function AdminNutrition() {
  const [search, setSearch] = useState('')
  const [members] = useState(initialMembers)

  const withAccess = members.filter(m => m.subscription.includes('Ishrana'))
  const filtered = withAccess.filter(m =>
    m.name.toLowerCase().includes(search.toLowerCase()) ||
    m.email.toLowerCase().includes(search.toLowerCase())
  )

  const handleUpload = (id) => {
    alert(`File picker would open for member ID ${id}. Wire to your C# API endpoint.`)
  }

  return (
    <div className="p-4 lg:p-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-foreground lg:text-3xl">Upravljaj Planom Ishrane</h1>
        <p className="text-muted-foreground">Postavi personalizovan PDF plan za svakog člana</p>
      </div>

      {/* Stats */}
      <div className="mb-8 grid gap-4 md:grid-cols-2 w-fit mx-auto">
        {[
          { label: 'Članovi Sa Pristupom Ishrani', value: withAccess.length,                                   bg: 'bg-primary/10', color: 'text-primary',    icon: User },
          { label: 'Postavljeni Planovi',                value: withAccess.filter(m => m.nutritionPlan).length,      bg: 'bg-green-100',  color: 'text-green-600',  icon: FileText },
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
          <input
            className={inputClass + ' pl-9'}
            placeholder="Istraži članove po imenu..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>
      </div>

      {/* Members List */}
      <div className="rounded-lg border border-border bg-card shadow-sm">
        <div className="p-5 border-b border-border">
          <h3 className="font-semibold text-foreground">Planovi Ishrane za Članove</h3>
        </div>
        <div className="p-5 space-y-4">
          {filtered.length === 0 ? (
            <p className="py-8 text-center text-muted-foreground">Nema članova sa pristupom ishrani.</p>
          ) : (
            filtered.map((member) => (
              <div
                key={member.id}
                className="flex flex-col gap-4 rounded-lg border border-border p-4 sm:flex-row sm:items-center sm:justify-between"
              >
                <div className="flex items-center gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 shrink-0">
                    <span className="text-lg font-semibold text-primary">
                      {member.name.split(' ').map(n => n[0]).join('')}
                    </span>
                  </div>
                  <div>
                    <h4 className="font-semibold text-foreground">{member.name}</h4>
                    <p className="text-sm text-muted-foreground">{member.email}</p>
                    <span className="inline-block mt-1 rounded-full bg-secondary px-2.5 py-1 text-xs font-medium text-secondary-foreground">
                      {member.subscription}
                    </span>
                  </div>
                </div>

                <div className="flex flex-col gap-2 sm:items-end">
                  {member.nutritionPlan ? (
                    <>
                      <div className="flex items-center gap-2 rounded-lg bg-green-50 px-3 py-2">
                        <FileText size={16} className="text-green-600 shrink-0" />
                        <div className="text-sm">
                          <p className="font-medium text-green-700">{member.nutritionPlan.fileName}</p>
                          <p className="text-green-600">Uploaded: {member.nutritionPlan.uploadedAt} | {member.nutritionPlan.fileSize}</p>
                        </div>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {[
                          { icon: Eye,      label: 'Pregledaj' },
                          { icon: Download, label: 'Preuzmi' },
                          { icon: Upload,   label: 'Zamijeni', onClick: () => handleUpload(member.id) },
                        ].map(({ icon: Icon, label, onClick }) => (
                          <button
                            key={label}
                            onClick={onClick}
                            className="inline-flex items-center gap-1.5 rounded-lg border border-border px-3 py-1.5 text-sm font-medium text-foreground hover:bg-muted transition-colors"
                          >
                            <Icon size={14} /> {label}
                          </button>
                        ))}
                        <button className="inline-flex items-center justify-center h-8 w-8 rounded-lg border border-border text-destructive hover:bg-muted transition-colors">
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </>
                  ) : (
                    <div className="flex flex-col items-end gap-2">
                      <span className="rounded-full border border-amber-300 bg-amber-50 px-3 py-1 text-xs font-medium text-amber-700">
                        Plan nije objavljen
                      </span>
                      <button
                        onClick={() => handleUpload(member.id)}
                        className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground hover:opacity-90 transition-opacity"
                      >
                        <Upload size={16} /> Objavi PDF Plan
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Guidelines */}
      <div className="mt-6 rounded-lg border border-border bg-card shadow-sm">
        <div className="flex items-center gap-2 p-5 border-b border-border">
          <Calendar size={20} />
          <h3 className="font-semibold text-foreground">Smjernice za Objavljivanje</h3>
        </div>
        <div className="p-5">
          <ul className="space-y-2 text-sm text-muted-foreground">
            {[
              'PDF fajlovi samo, maksimalna veličina 10MB',
              'Uključite ime člana i datum u naziv fajla za laku referencu',
              'Članovi sa "Individualni trening + Ishrana" pretplatom mogu vidjeti svoj objavljeni plan',
              'Zamjena plana će trajno obrisati prethodnu verziju',
            ].map((tip) => (
              <li key={tip}>– {tip}</li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  )
}
