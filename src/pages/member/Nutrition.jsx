import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { FileText, Download, Eye, Calendar, User, AlertCircle, Lock, X } from 'lucide-react'
import { membershipApi, nutritionApi } from '../../services/api'

const puniMjesec = ['Januar', 'Februar', 'Mart', 'April', 'Maj', 'Juni', 'Juli', 'August', 'Septembar', 'Oktobar', 'Novembar', 'Decembar']

export default function MemberNutrition() {
  const [membership, setMembership] = useState(null)
  const [plan, setPlan] = useState(null)
  const [loading, setLoading] = useState(true)
  const [downloading, setDownloading] = useState(false)
  const [pdfPreviewUrl, setPdfPreviewUrl] = useState(null) // za preview modal

  useEffect(() => {
    const fetchAll = async () => {
      try {
        const mem = await membershipApi.getMine()
        setMembership(mem)
        if (mem?.nutritionEnabled) {
          try {
            const p = await nutritionApi.getMine()
            setPlan(p)
          } catch {
            setPlan(null)
          }
        }
      } catch {
      } finally {
        setLoading(false)
      }
    }
    fetchAll()
  }, [])

  // Konvertuje Base64 u Blob URL za preview/download
  const getPdfBlobUrl = async () => {
    if (!plan?.id) return null
    const data = await nutritionApi.download(plan.id)
    const byteChars = atob(data.pdfBase64)
    const byteArray = new Uint8Array(byteChars.length)
    for (let i = 0; i < byteChars.length; i++) {
      byteArray[i] = byteChars.charCodeAt(i)
    }
    const blob = new Blob([byteArray], { type: 'application/pdf' })
    return { url: URL.createObjectURL(blob), fileName: data.pdfFileName }
  }

  const handleDownload = async () => {
    setDownloading(true)
    try {
      const result = await getPdfBlobUrl()
      if (!result) return
      const a = document.createElement('a')
      a.href = result.url
      a.download = result.fileName
      a.click()
      URL.revokeObjectURL(result.url)
    } catch {
      alert('Greška pri preuzimanju.')
    } finally {
      setDownloading(false)
    }
  }

  const handlePreview = async () => {
    try {
      const result = await getPdfBlobUrl()
      if (!result) return
      setPdfPreviewUrl(result.url)
    } catch {
      alert('Greška pri učitavanju pregleda.')
    }
  }

  const handleClosePreview = () => {
    if (pdfPreviewUrl) URL.revokeObjectURL(pdfPreviewUrl)
    setPdfPreviewUrl(null)
  }

  if (loading) return (
    <div className="flex min-h-[60vh] items-center justify-center">
      <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
    </div>
  )

  // ── Nema pristup ─────────────────────────────────────
  if (!membership?.nutritionEnabled) {
    const isGroup = membership?.trainingType === 'Group'
    const planLabel = isGroup ? 'Grupni treninzi' : 'Individualni treninzi'

    return (
      <div className="p-4 lg:p-8">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-foreground lg:text-3xl">Plan ishrane</h1>
          <p className="text-muted-foreground">Personalizirani plan ishrane</p>
        </div>
        <div className="space-y-6">
          <div className="rounded-lg border border-border bg-card shadow-sm">
            <div className="py-12 px-6 text-center">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-muted">
                <Lock size={32} className="text-muted-foreground" />
              </div>
              <h3 className="mb-2 text-xl font-semibold text-foreground">
                Plan ishrane nije uključen
              </h3>
              <p className="mx-auto mb-2 max-w-md text-muted-foreground">
                Tvoj trenutni plan <strong>{planLabel}</strong> ne uključuje personalizirani plan ishrane.
              </p>
              <p className="mx-auto mb-6 max-w-md text-sm text-muted-foreground">
                Za pristup planu ishrane potreban je plan <strong>Individualni trening + Ishrana</strong>.
                Kontaktiraj admina za više informacija.
              </p>
              <Link to="/member/dashboard"
                className="inline-flex items-center justify-center rounded-lg bg-primary px-6 py-2.5 text-sm font-semibold text-primary-foreground hover:opacity-90 transition-opacity">
                Idi na početnu
              </Link>
            </div>
          </div>

          {/* Benefiti */}
          <div className="rounded-lg border border-border bg-card shadow-sm">
            <div className="p-5 border-b border-border">
              <h3 className="font-semibold text-foreground">Šta dobijaš sa planom ishrane</h3>
            </div>
            <div className="p-5 grid gap-4 sm:grid-cols-2">
              {[
                { icon: FileText, title: 'Personalizirani PDF plan', desc: 'Detaljan plan ishrane kreiran specifično za tvoje tijelo i ciljeve' },
                { icon: User, title: 'Kreiran od trenera', desc: 'Tvoj plan dizajnira certificirani stručnjak za ishranu' },
                { icon: Calendar, title: 'Redovna ažuriranja', desc: 'Plan se razvija s tvojim napretkom i promjenjivim potrebama' },
                { icon: Download, title: 'Preuzmi i koristi', desc: 'Pristupi svom planu bilo kada, bilo gdje — čak i offline' },
              ].map(({ icon: Icon, title, desc }) => (
                <div key={title} className="flex items-start gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                    <Icon size={18} className="text-primary" />
                  </div>
                  <div>
                    <h4 className="font-medium text-foreground">{title}</h4>
                    <p className="text-sm text-muted-foreground">{desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    )
  }

  // ── Ima pristup ───────────────────────────────────────
  return (
    <div className="p-4 lg:p-8">

      {/* PDF Preview Modal */}
      {pdfPreviewUrl && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70">
          <div className="relative w-full max-w-4xl h-[90vh] mx-4 rounded-lg overflow-hidden bg-card flex flex-col">
            <div className="flex items-center justify-between p-4 border-b border-border shrink-0">
              <h3 className="font-semibold text-foreground">{plan?.pdfFileName}</h3>
              <button onClick={handleClosePreview}
                className="flex h-8 w-8 items-center justify-center rounded-lg hover:bg-muted transition-colors text-muted-foreground hover:text-foreground">
                <X size={18} />
              </button>
            </div>
            <iframe
              src={pdfPreviewUrl}
              className="flex-1 w-full"
              title="Plan ishrane"
            />
          </div>
        </div>
      )}

      <div className="mb-8">
        <div className="flex items-center gap-3 flex-wrap">
          <h1 className="text-2xl font-bold text-foreground lg:text-3xl">Moj plan ishrane</h1>
          <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-medium text-green-700">
            Potpuni pristup planu
          </span>
        </div>
        <p className="text-muted-foreground">
          Tvoj personalizirani plan ishrane koji je kreirao tvoj trener
        </p>
      </div>

      {!plan?.pdfFileName ? (
        /* Plan još nije uploadovan */
        <div className="rounded-lg border border-border bg-card shadow-sm">
          <div className="py-12 text-center px-6">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-yellow-100">
              <AlertCircle size={32} className="text-yellow-600" />
            </div>
            <h3 className="mb-2 text-xl font-semibold text-foreground">
              Plan ishrane se priprema
            </h3>
            <p className="mx-auto mb-6 max-w-md text-muted-foreground">
              Tvoja trenerica priprema personalizirani plan ishrane.
            </p>
            <span className="rounded-full border border-yellow-300 bg-yellow-50 px-4 py-1.5 text-sm font-medium text-yellow-700">
              Na čekanju
            </span>
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Plan detalji */}
          <div className="rounded-lg border border-border bg-card shadow-sm">
            <div className="flex items-center gap-2 p-5 border-b border-border">
              <FileText size={20} className="text-primary" />
              <h3 className="font-semibold text-foreground">Tvoj personalizirani plan ishrane</h3>
            </div>
            <div className="p-5">
              <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
                <div className="space-y-4">
                  {/* PDF info */}
                  <div className="flex items-center gap-4 rounded-lg bg-primary/5 p-4">
                    <div className="flex h-16 w-16 items-center justify-center rounded-lg bg-primary/10 shrink-0">
                      <FileText size={32} className="text-primary" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-foreground">{plan.pdfFileName}</h4>
                      <p className="text-sm text-muted-foreground">PDF Dokument | {plan.pdfFileSize}</p>
                    </div>
                  </div>
                  {/* Datum */}
                  {plan.pdfUploadedAt && (
                    <div className="grid gap-4 sm:grid-cols-2">
                      <div className="flex items-center gap-3">
                        <Calendar size={18} className="text-muted-foreground" />
                        <div>
                          <p className="text-sm text-muted-foreground">Postavljeno</p>
                          <p className="font-medium text-foreground">
                            {(() => {
                              const d = new Date(plan.pdfUploadedAt)
                              return `${d.getDate()}. ${puniMjesec[d.getMonth()]} ${d.getFullYear()}.`
                            })()}
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
                {/* Dugmad */}
                <div className="flex flex-col gap-3 sm:flex-row lg:flex-col">
                  <button
                    onClick={handlePreview}
                    className="inline-flex items-center justify-center gap-2 rounded-lg bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground hover:opacity-90 transition-opacity">
                    <Eye size={18} /> Pregledaj plan
                  </button>
                  <button
                    onClick={handleDownload}
                    disabled={downloading}
                    className="inline-flex items-center justify-center gap-2 rounded-lg border border-border px-5 py-3 text-sm font-medium text-foreground hover:bg-muted transition-colors disabled:opacity-50">
                    {downloading
                      ? <><span className="h-4 w-4 animate-spin rounded-full border-2 border-foreground border-t-transparent" /> Preuzimanje...</>
                      : <><Download size={18} /> Preuzmi PDF</>
                    }
                  </button>
                </div>
              </div>
            </div>
          </div>



          {/* Savjeti */}
          <div className="rounded-lg border border-border bg-card shadow-sm">
            <div className="p-5 border-b border-border">
              <h3 className="font-semibold text-foreground">Savjeti za praćenje plana</h3>
            </div>
            <div className="p-5">
              <ul className="space-y-3 text-sm text-muted-foreground">
                {[
                  'Preuzmi plan kako bi ga mogla koristiti offline na telefonu',
                  'Prati preporučeni raspored obroka za najbolje rezultate',
                  'Kontaktiraj svog trenera ako imaš pitanja ili trebaš izmjene',
                  'Tvoj plan može biti ažuriran periodično u skladu sa tvojim napretkom',
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
      )}
    </div>
  )
}