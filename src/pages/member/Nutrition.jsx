import React from 'react'
import { FileText, Download, Eye, Calendar, User, AlertCircle } from 'lucide-react'

// Simulated current user — in production this comes from your backend/auth
const currentUser = {
  name: 'Maria Garcia',
  subscription: 'Individual + Nutrition', // 'Group Training' | 'Individual Training' | 'Individual + Nutrition'
}

// Simulated PDF uploaded by admin — in production fetched from your C# API
const userNutritionPlan = {
  fileName: 'maria_garcia_nutrition_plan.pdf',
  uploadedAt: '2024-01-15',
  fileSize: '2.4 MB',
  uploadedBy: 'Coach Elena',
  fileUrl: '/api/nutrition-plans/maria_garcia_nutrition_plan.pdf',
}

// Set to null to test the "pending" state:
// const userNutritionPlan = null

const hasNutritionAccess = currentUser.subscription.includes('Nutrition')

export default function MemberNutrition() {
  return (
    <div className="p-4 lg:p-8">
      <div className="mb-8">
        <div className="flex items-center gap-3 flex-wrap">
          <h1 className="text-2xl font-bold text-foreground lg:text-3xl">My Nutrition Plan</h1>
          {hasNutritionAccess && (
            <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-medium text-green-700">
              Full Plan Access
            </span>
          )}
        </div>
        <p className="text-muted-foreground">
          {hasNutritionAccess
            ? 'Your personalized nutrition plan created by your trainer'
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
                  <h3 className="font-semibold text-foreground">Your Personalized Nutrition Plan</h3>
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
                          <p className="text-sm text-muted-foreground">PDF Document | {userNutritionPlan.fileSize}</p>
                        </div>
                      </div>
                      <div className="grid gap-4 sm:grid-cols-2">
                        <div className="flex items-center gap-3">
                          <Calendar size={18} className="text-muted-foreground" />
                          <div>
                            <p className="text-sm text-muted-foreground">Uploaded On</p>
                            <p className="font-medium text-foreground">{userNutritionPlan.uploadedAt}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <User size={18} className="text-muted-foreground" />
                          <div>
                            <p className="text-sm text-muted-foreground">Created By</p>
                            <p className="font-medium text-foreground">{userNutritionPlan.uploadedBy}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="flex flex-col gap-3 sm:flex-row lg:flex-col">
                      <button className="inline-flex items-center justify-center gap-2 rounded-lg bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground hover:opacity-90 transition-opacity">
                        <Eye size={18} /> View Plan
                      </button>
                      <button className="inline-flex items-center justify-center gap-2 rounded-lg border border-border px-5 py-3 text-sm font-medium text-foreground hover:bg-muted transition-colors">
                        <Download size={18} /> Download PDF
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Preview Placeholder */}
              <div className="rounded-lg border border-border bg-card shadow-sm">
                <div className="p-5 border-b border-border">
                  <h3 className="font-semibold text-foreground">Plan Preview</h3>
                </div>
                <div className="p-5">
                  <div className="flex aspect-[3/4] max-h-[600px] items-center justify-center rounded-lg border-2 border-dashed border-border bg-muted/30">
                    <div className="text-center">
                      <FileText size={64} className="mx-auto mb-4 text-muted-foreground/50" />
                      <p className="text-lg font-medium text-muted-foreground">PDF Preview</p>
                      <p className="mt-1 text-sm text-muted-foreground">Click "View Plan" to open your full nutrition plan</p>
                      <button className="mt-4 inline-flex items-center gap-2 rounded-lg border border-border px-4 py-2 text-sm font-medium text-foreground hover:bg-muted transition-colors">
                        <Eye size={16} /> Open Full View
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Tips */}
              <div className="rounded-lg border border-border bg-card shadow-sm">
                <div className="p-5 border-b border-border">
                  <h3 className="font-semibold text-foreground">Tips for Following Your Plan</h3>
                </div>
                <div className="p-5">
                  <ul className="space-y-3 text-sm text-muted-foreground">
                    {[
                      'Download your plan to have it available offline on your phone',
                      'Follow the meal timing recommendations for best results',
                      'Contact your trainer if you have questions or need modifications',
                      'Your plan may be updated periodically based on your progress',
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
