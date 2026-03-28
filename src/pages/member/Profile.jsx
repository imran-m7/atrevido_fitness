import React from 'react'
import { User, Mail, Phone, Calendar, Edit, CreditCard, Award, Target } from 'lucide-react'

const userProfile = {
  name: 'Sarah Johnson',
  email: 'sarah.johnson@email.com',
  phone: '(555) 987-6543',
  joinDate: 'January 15, 2024',
  subscription: 'Individual + Nutrition',
  subscriptionStatus: 'Active',
  nextBilling: 'April 15, 2024',
  trainer: 'Elena Rodriguez',
  goal: 'Weight Loss & Toning',
  fitnessLevel: 'Intermediate',
}

const achievements = [
  { title: '30-Day Streak',       description: 'Completed 30 consecutive workout days', date: 'February 2024' },
  { title: 'Challenge Champion',  description: 'Won the New Year Challenge',             date: 'January 2024' },
  { title: 'First Milestone',     description: 'Lost first 5 pounds',                   date: 'January 2024' },
]

export default function MemberProfile() {
  return (
    <div className="p-4 lg:p-8">
      <div className="mb-8 flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground lg:text-3xl">My Profile</h1>
          <p className="text-muted-foreground">Manage your account and subscription</p>
        </div>
        <button className="inline-flex items-center gap-2 rounded-lg border border-border px-4 py-2 text-sm font-medium text-foreground hover:bg-muted transition-colors">
          <Edit size={16} /> Edit Profile
        </button>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">

          {/* Personal Info */}
          <div className="rounded-lg border border-border bg-card shadow-sm">
            <div className="p-5 border-b border-border">
              <h3 className="font-semibold text-foreground">Personal Information</h3>
            </div>
            <div className="p-5">
              <div className="flex items-start gap-6">
                <div className="flex h-20 w-20 items-center justify-center rounded-full bg-primary/10 shrink-0">
                  <User size={40} className="text-primary" />
                </div>
                <div className="flex-1 space-y-4">
                  <div>
                    <h2 className="text-xl font-semibold text-foreground">{userProfile.name}</h2>
                    <span className="inline-block mt-1 rounded-full bg-primary px-3 py-1 text-xs font-medium text-primary-foreground">
                      {userProfile.subscription}
                    </span>
                  </div>
                  <div className="grid gap-4 md:grid-cols-2">
                    {[
                      { icon: Mail,     label: 'Email',           value: userProfile.email },
                      { icon: Phone,    label: 'Phone',           value: userProfile.phone },
                      { icon: Calendar, label: 'Member Since',    value: userProfile.joinDate },
                      { icon: User,     label: 'Personal Trainer',value: userProfile.trainer },
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

          {/* Fitness Profile */}
          <div className="rounded-lg border border-border bg-card shadow-sm">
            <div className="p-5 border-b border-border">
              <h3 className="font-semibold text-foreground">Fitness Profile</h3>
            </div>
            <div className="p-5 grid gap-4 md:grid-cols-2">
              {[
                { icon: Target, label: 'Fitness Goal',  value: userProfile.goal },
                { icon: Award,  label: 'Fitness Level', value: userProfile.fitnessLevel },
              ].map(({ icon: Icon, label, value }) => (
                <div key={label} className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 shrink-0">
                    <Icon size={18} className="text-primary" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">{label}</p>
                    <p className="font-medium text-foreground">{value}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Achievements */}
          <div className="rounded-lg border border-border bg-card shadow-sm">
            <div className="flex items-center gap-2 p-5 border-b border-border">
              <Award size={20} className="text-primary" />
              <h3 className="font-semibold text-foreground">Achievements</h3>
            </div>
            <div className="p-5 space-y-4">
              {achievements.map((a, i) => (
                <div
                  key={a.title}
                  className={`flex items-start gap-4 ${i < achievements.length - 1 ? 'border-b border-border pb-4' : ''}`}
                >
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-yellow-100 shrink-0">
                    <Award size={18} className="text-yellow-600" />
                  </div>
                  <div>
                    <p className="font-medium text-foreground">{a.title}</p>
                    <p className="text-sm text-muted-foreground">{a.description}</p>
                    <p className="mt-1 text-xs text-muted-foreground">{a.date}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Subscription */}
          <div className="rounded-lg border border-border bg-card shadow-sm">
            <div className="flex items-center gap-2 p-5 border-b border-border">
              <CreditCard size={20} />
              <h3 className="font-semibold text-foreground">Subscription</h3>
            </div>
            <div className="p-5 space-y-4">
              <div>
                <p className="text-sm text-muted-foreground">Current Plan</p>
                <p className="text-lg font-semibold text-foreground">{userProfile.subscription}</p>
                <span className="inline-block mt-1 rounded-full bg-green-100 px-3 py-1 text-xs font-medium text-green-700">
                  {userProfile.subscriptionStatus}
                </span>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Next Billing Date</p>
                <p className="text-foreground">{userProfile.nextBilling}</p>
              </div>
              <div className="border-t border-border pt-4">
                <p className="mb-2 text-sm text-muted-foreground">Plan Includes:</p>
                <ul className="space-y-1 text-sm text-foreground">
                  {['Individual training sessions','Personalized nutrition plan','Recipe library access','Progress tracking','Challenge participation'].map(item => (
                    <li key={item}>– {item}</li>
                  ))}
                </ul>
              </div>
              <button className="w-full rounded-lg border border-border px-4 py-2 text-sm font-medium text-foreground hover:bg-muted transition-colors">
                Manage Subscription
              </button>
            </div>
          </div>

          {/* Account Actions */}
          <div className="rounded-lg border border-border bg-card shadow-sm">
            <div className="p-5 border-b border-border">
              <h3 className="font-semibold text-foreground">Account Actions</h3>
            </div>
            <div className="p-5 space-y-2">
              {[
                { label: 'Change Password',        danger: false },
                { label: 'Notification Settings',  danger: false },
                { label: 'Delete Account',         danger: true },
              ].map(({ label, danger }) => (
                <button
                  key={label}
                  className={[
                    'w-full rounded-lg border border-border px-4 py-2 text-left text-sm font-medium transition-colors hover:bg-muted',
                    danger ? 'text-destructive hover:text-destructive' : 'text-foreground',
                  ].join(' ')}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
