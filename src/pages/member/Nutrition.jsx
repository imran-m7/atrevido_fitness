import React from 'react'
import { Link } from 'react-router-dom'
import { FileText, Download, Eye, Calendar, User, AlertCircle } from 'lucide-react'

// Simulated current user — in production this comes from your backend/auth
const currentUser = {
  name: 'Dika Hodžić-Afaneh',
  subscription: 'Individual + Nutrition', // 'Group Training' | 'Individual Training' | 'Individual + Nutrition'
}

// Simulated PDF uploaded by admin — in production fetched from your C# API
const userNutritionPlan = {
  fileName: 'sarah_johnson_nutrition_plan.pdf',
  uploadedAt: '2024-01-15',
  fileSize: '2.4 MB',
  uploadedBy: 'Coach Elena',
  fileUrl: '/api/nutrition-plans/sarah_johnson_nutrition_plan.pdf',
}

// Set to null to test the "pending" state:
// const userNutritionPlan = null

const hasNutritionAccess = currentUser.subscription.includes('Nutrition')

// Simple boolean for nutrition plan access (frontend prototype)
const hasNutritionPlan = true // Set to false to test the modal

export default function MemberNutrition() {
  if (!hasNutritionPlan) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
        <div className="mx-4 w-full max-w-md rounded-lg border border-border bg-card p-6 shadow-lg">
          <div className="text-center">
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-destructive/10">
              <AlertCircle size={24} className="text-destructive" />
            </div>
            <h3 className="mb-2 text-lg font-semibold text-foreground">Plan ishrane nije dostupan</h3>
            <p className="text-muted-foreground">Plan ishrane nije uključen u vašu članarinu.</p>
            <Link
              to="/member/dashboard"
              className="mt-4 inline-flex items-center justify-center rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground hover:opacity-90 transition-opacity"
            >
              Idi na početnu
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="p-4 lg:p-8">
      <div className="mb-8">
        <div className="flex items-center gap-3 flex-wrap">
          <h1 className="text-2xl font-bold text-foreground lg:text-3xl">Moj plan ishrane</h1>
          {hasNutritionAccess && (
            <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-medium text-green-700">
              Potpuni pristup planu
            </span>
          )}
        </div>
        <p className="text-muted-foreground">
          {hasNutritionAccess
            ? 'Vaš personalizirani plan ishrane koji je kreirao vaš trener'
            : 'Upgrade to access personalized nutrition plans'}
        </p>
      </div>

      {hasNutritionAccess ? (
        <div className="space-y-6">
          {userNutritionPlan ? (
            <>
              {/* Plan Details */}
              <div className="rounded-lg border border-border bg-card shadow-sm">
                <div className="flex items-center gap-2 p-5 border-b border-border">
                  <FileText size={20} className="text-primary" />
                  <h3 className="font-semibold text-foreground">Vaš personalizirani plan ishrane</h3>
                </div>
                <div className="p-5">
                  <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
                    <div className="space-y-4">
                      <div className="flex items-center gap-4 rounded-lg bg-primary/5 p-4">
                        <div className="flex h-16 w-16 items-center justify-center rounded-lg bg-primary/10 shrink-0">
                          <FileText size={32} className="text-primary" />
                        </div>
                        <div>
                          <h4 className="font-semibold text-foreground">{userNutritionPlan.fileName}</h4>
                          <p className="text-sm text-muted-foreground">PDF Dokument | {userNutritionPlan.fileSize}</p>
                        </div>
                      </div>
                      <div className="grid gap-4 sm:grid-cols-2">
                        <div className="flex items-center gap-3">
                          <Calendar size={18} className="text-muted-foreground" />
                          <div>
                            <p className="text-sm text-muted-foreground">Postavljeno</p>
                            <p className="font-medium text-foreground">{userNutritionPlan.uploadedAt}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <User size={18} className="text-muted-foreground" />
                          <div>
                            <p className="text-sm text-muted-foreground">Kreirala</p>
                            <p className="font-medium text-foreground">{userNutritionPlan.uploadedBy}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="flex flex-col gap-3 sm:flex-row lg:flex-col">
                      <button className="inline-flex items-center justify-center gap-2 rounded-lg bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground hover:opacity-90 transition-opacity">
                        <Eye size={18} /> Pregledaj plan
                      </button>
                      <button className="inline-flex items-center justify-center gap-2 rounded-lg border border-border px-5 py-3 text-sm font-medium text-foreground hover:bg-muted transition-colors">
                        <Download size={18} /> Preuzmi PDF
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Preview Placeholder */}
              <div className="rounded-lg border border-border bg-card shadow-sm">
                <div className="p-5 border-b border-border">
                  <h3 className="font-semibold text-foreground">Pregled plana</h3>
                </div>
                <div className="p-5">
                  <div className="flex aspect-[3/4] max-h-[600px] items-center justify-center rounded-lg border-2 border-dashed border-border bg-muted/30">
                    <div className="text-center">
                      <FileText size={64} className="mx-auto mb-4 text-muted-foreground/50" />
                      <p className="text-lg font-medium text-muted-foreground">Pregled PDF-a</p>
                      <p className="mt-1 text-sm text-muted-foreground">Kliknite „Pregledaj plan“ da otvorite cijeli plan ishrane</p>
                      <button className="mt-4 inline-flex items-center gap-2 rounded-lg border border-border px-4 py-2 text-sm font-medium text-foreground hover:bg-muted transition-colors">
                        <Eye size={16} /> Otvori cijeli prikaz
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Tips */}
              <div className="rounded-lg border border-border bg-card shadow-sm">
                <div className="p-5 border-b border-border">
                  <h3 className="font-semibold text-foreground">Savjeti za praćenje plana</h3>
                </div>
                <div className="p-5">
                  <ul className="space-y-3 text-sm text-muted-foreground">
                    {[
                      'Preuzmite plan kako biste ga mogli koristiti offline na telefonu',
                      'Pratite preporučeni raspored obroka za najbolje rezultate',
                      'Kontaktirajte svog trenera ako imate pitanja ili trebate izmjene',
                      'Vaš plan može biti ažuriran periodično u skladu sa vašim napretkom',
                    ].map((tip) => (
                      <li key={tip} className="flex items-start gap-2">
                        <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
                        {tip}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </>
          ) : (
            /* No plan yet */
            <div className="rounded-lg border border-border bg-card shadow-sm">
              <div className="py-12 text-center">
                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-amber-100">
                  <AlertCircle size={32} className="text-amber-600" />
                </div>
                <h3 className="mb-2 text-xl font-semibold text-foreground">Your Nutrition Plan is Being Prepared</h3>
                <p className="mx-auto mb-6 max-w-md text-muted-foreground">
                  Your trainer is creating a personalized nutrition plan just for you.
                  You'll be notified as soon as it's ready to view.
                </p>
                <span className="rounded-full border border-amber-300 bg-amber-50 px-4 py-1.5 text-sm font-medium text-amber-700">
                  Pending Upload
                </span>
              </div>
            </div>
          )}
        </div>
      ) : (
        /* No access — upgrade CTA */
        <div className="space-y-6">
          <div className="rounded-lg border border-amber-200 bg-amber-50 shadow-sm">
            <div className="py-10 text-center px-6">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-amber-100">
                <FileText size={32} className="text-amber-600" />
              </div>
              <h3 className="mb-2 text-xl font-semibold text-amber-900">Personalized Nutrition Plans</h3>
              <p className="mx-auto mb-6 max-w-md text-amber-800">
                Your current subscription does not include personalized nutrition plans.
                Upgrade to "Individual Training + Nutrition" to get a custom meal plan
                created specifically for your goals.
              </p>
              <button className="rounded-lg bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground hover:opacity-90 transition-opacity">
                Upgrade Subscription
              </button>
            </div>
          </div>

          {/* Benefits */}
          <div className="rounded-lg border border-border bg-card shadow-sm">
            <div className="p-5 border-b border-border">
              <h3 className="font-semibold text-foreground">What You Get with Nutrition Plans</h3>
            </div>
            <div className="p-5 grid gap-4 sm:grid-cols-2">
              {[
                { icon: FileText,  title: 'Custom PDF Plan',    desc: 'A detailed nutrition plan created specifically for your body and goals' },
                { icon: User,      title: 'Trainer Created',    desc: 'Your plan is designed by certified nutrition experts' },
                { icon: Calendar,  title: 'Regular Updates',    desc: 'Your plan evolves with your progress and changing needs' },
                { icon: Download,  title: 'Download & Go',      desc: 'Access your plan anytime, anywhere — even offline' },
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
      )}
    </div>
  )
}
