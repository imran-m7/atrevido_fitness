import React, { useState } from 'react'
import { Building2, Bell, Shield, Palette, Mail, Globe, CreditCard } from 'lucide-react'

const inputClass = 'w-full rounded-lg border border-input bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring'
const labelClass = 'block mb-1.5 text-sm font-medium text-foreground'

function Toggle({ id, defaultChecked = false }) {
  const [on, setOn] = useState(defaultChecked)
  return (
    <button
      onClick={() => setOn(!on)}
      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${on ? 'bg-primary' : 'bg-muted'}`}
    >
      <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${on ? 'translate-x-6' : 'translate-x-1'}`} />
    </button>
  )
}

const tabs = ['General', 'Notifications', 'Security', 'Billing']

export default function AdminSettings() {
  const [activeTab, setActiveTab] = useState('General')

  return (
    <div className="p-4 lg:p-8 space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Settings</h1>
        <p className="text-muted-foreground">Manage your gym's configuration and preferences</p>
      </div>

      {/* Tab Bar */}
      <div className="flex gap-1 rounded-lg bg-muted p-1 w-fit">
        {tabs.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={[
              'rounded-md px-4 py-2 text-sm font-medium transition-colors',
              activeTab === tab ? 'bg-background text-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground',
            ].join(' ')}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* General */}
      {activeTab === 'General' && (
        <div className="space-y-6">
          {/* Gym Info */}
          <div className="rounded-lg border border-border bg-card shadow-sm">
            <div className="flex items-center gap-2 p-5 border-b border-border">
              <Building2 size={20} className="text-primary" />
              <div>
                <h3 className="font-semibold text-foreground">Gym Information</h3>
                <p className="text-sm text-muted-foreground">Basic information about your fitness center</p>
              </div>
            </div>
            <div className="p-5 space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div><label className={labelClass}>Gym Name</label><input className={inputClass} defaultValue="Atrevido Fitness" /></div>
                <div><label className={labelClass}>Tagline</label><input className={inputClass} defaultValue="Empowering Women Through Fitness" /></div>
              </div>
              <div>
                <label className={labelClass}>Description</label>
                <textarea rows={3} className={inputClass} defaultValue="Atrevido Fitness is a women-only fitness center dedicated to helping you achieve your health and wellness goals." />
              </div>
              <div className="grid gap-4 md:grid-cols-2">
                <div><label className={labelClass}>Phone Number</label><input className={inputClass} defaultValue="+1 (555) 123-4567" /></div>
                <div><label className={labelClass}>Contact Email</label><input type="email" className={inputClass} defaultValue="info@atrevidofitness.com" /></div>
              </div>
              <div><label className={labelClass}>Address</label><input className={inputClass} defaultValue="123 Fitness Street, Suite 100, Wellness City, WC 12345" /></div>
              <button className="rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground hover:opacity-90 transition-opacity">Save Changes</button>
            </div>
          </div>

          {/* Hours */}
          <div className="rounded-lg border border-border bg-card shadow-sm">
            <div className="flex items-center gap-2 p-5 border-b border-border">
              <Globe size={20} className="text-primary" />
              <div>
                <h3 className="font-semibold text-foreground">Operating Hours</h3>
                <p className="text-sm text-muted-foreground">Set your gym's operating schedule</p>
              </div>
            </div>
            <div className="p-5 space-y-3">
              {[
                { day: 'Monday – Friday', hours: '5:00 AM – 10:00 PM' },
                { day: 'Saturday',        hours: '6:00 AM – 8:00 PM' },
                { day: 'Sunday',          hours: '7:00 AM – 6:00 PM' },
              ].map((s) => (
                <div key={s.day} className="flex items-center justify-between rounded-lg bg-muted/50 p-3">
                  <span className="font-medium text-foreground">{s.day}</span>
                  <input className="w-48 rounded-lg border border-input bg-background px-3 py-1.5 text-center text-sm focus:outline-none focus:ring-2 focus:ring-ring" defaultValue={s.hours} />
                </div>
              ))}
              <button className="rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground hover:opacity-90 transition-opacity">Update Hours</button>
            </div>
          </div>

          {/* Branding */}
          <div className="rounded-lg border border-border bg-card shadow-sm">
            <div className="flex items-center gap-2 p-5 border-b border-border">
              <Palette size={20} className="text-primary" />
              <div>
                <h3 className="font-semibold text-foreground">Branding</h3>
                <p className="text-sm text-muted-foreground">Customize your brand appearance</p>
              </div>
            </div>
            <div className="p-5 space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <label className={labelClass}>Primary Color</label>
                  <div className="flex items-center gap-2">
                    <div className="w-10 h-10 rounded-lg bg-primary shrink-0" />
                    <input className={inputClass} defaultValue="#e91e63" />
                  </div>
                </div>
                <div>
                  <label className={labelClass}>Logo</label>
                  <div className="flex items-center gap-2">
                    <button className="rounded-lg border border-border px-4 py-2 text-sm font-medium text-foreground hover:bg-muted transition-colors">Upload Logo</button>
                    <span className="text-sm text-muted-foreground">PNG or SVG, max 2MB</span>
                  </div>
                </div>
              </div>
              <button className="rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground hover:opacity-90 transition-opacity">Save Branding</button>
            </div>
          </div>
        </div>
      )}

      {/* Notifications */}
      {activeTab === 'Notifications' && (
        <div className="space-y-6">
          <div className="rounded-lg border border-border bg-card shadow-sm">
            <div className="flex items-center gap-2 p-5 border-b border-border">
              <Bell size={20} className="text-primary" />
              <div>
                <h3 className="font-semibold text-foreground">Notification Preferences</h3>
                <p className="text-sm text-muted-foreground">Configure how and when notifications are sent</p>
              </div>
            </div>
            <div className="p-5 space-y-5">
              {[
                { id: 'new-member',   label: 'New Member Signup',    desc: 'Get notified when a new member registers' },
                { id: 'booking',      label: 'Session Bookings',      desc: 'Notifications for new training session bookings' },
                { id: 'cancellation', label: 'Cancellations',         desc: 'Alert when members cancel their bookings' },
                { id: 'challenge',    label: 'Challenge Completion',  desc: 'Notify when members complete challenges' },
                { id: 'payment',      label: 'Payment Alerts',        desc: 'Notifications for successful and failed payments' },
                { id: 'feedback',     label: 'Member Feedback',       desc: 'Get notified when members submit feedback' },
              ].map((s) => (
                <div key={s.id} className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-foreground">{s.label}</p>
                    <p className="text-sm text-muted-foreground">{s.desc}</p>
                  </div>
                  <Toggle id={s.id} defaultChecked />
                </div>
              ))}
              <button className="rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground hover:opacity-90 transition-opacity">Save Preferences</button>
            </div>
          </div>

          <div className="rounded-lg border border-border bg-card shadow-sm">
            <div className="flex items-center gap-2 p-5 border-b border-border">
              <Mail size={20} className="text-primary" />
              <div>
                <h3 className="font-semibold text-foreground">Email Templates</h3>
                <p className="text-sm text-muted-foreground">Customize automated email messages</p>
              </div>
            </div>
            <div className="p-5 space-y-3">
              {[
                { name: 'Welcome Email',                  status: 'Active' },
                { name: 'Booking Confirmation',           status: 'Active' },
                { name: 'Password Reset',                 status: 'Active' },
                { name: 'Membership Renewal Reminder',    status: 'Active' },
                { name: 'Challenge Invitation',           status: 'Draft' },
              ].map((t) => (
                <div key={t.name} className="flex items-center justify-between rounded-lg bg-muted/50 p-3">
                  <div className="flex items-center gap-3">
                    <Mail size={16} className="text-muted-foreground" />
                    <span className="font-medium text-foreground">{t.name}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className={`rounded-full px-2.5 py-1 text-xs font-medium ${t.status === 'Active' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                      {t.status}
                    </span>
                    <button className="rounded-lg border border-border px-3 py-1.5 text-sm font-medium text-foreground hover:bg-muted transition-colors">Edit</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Security */}
      {activeTab === 'Security' && (
        <div className="space-y-6">
          <div className="rounded-lg border border-border bg-card shadow-sm">
            <div className="flex items-center gap-2 p-5 border-b border-border">
              <Shield size={20} className="text-primary" />
              <div>
                <h3 className="font-semibold text-foreground">Security Settings</h3>
                <p className="text-sm text-muted-foreground">Manage security and access controls</p>
              </div>
            </div>
            <div className="p-5 space-y-5">
              {[
                { id: '2fa',       label: 'Two-Factor Authentication', desc: 'Require 2FA for admin accounts',                      on: true },
                { id: 'session',   label: 'Session Timeout',           desc: 'Auto logout after 30 minutes of inactivity',          on: true },
                { id: 'ip',        label: 'IP Restriction',            desc: 'Limit admin access to specific IP addresses',         on: false },
                { id: 'audit-log', label: 'Audit Logging',             desc: 'Track all admin actions and changes',                 on: true },
              ].map((s) => (
                <div key={s.id} className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-foreground">{s.label}</p>
                    <p className="text-sm text-muted-foreground">{s.desc}</p>
                  </div>
                  <Toggle id={s.id} defaultChecked={s.on} />
                </div>
              ))}
              <button className="rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground hover:opacity-90 transition-opacity">Update Security Settings</button>
            </div>
          </div>

          <div className="rounded-lg border border-border bg-card shadow-sm">
            <div className="p-5 border-b border-border">
              <h3 className="font-semibold text-foreground">Password Policy</h3>
              <p className="text-sm text-muted-foreground">Set password requirements for all users</p>
            </div>
            <div className="p-5 space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div><label className={labelClass}>Minimum Length</label><input type="number" className={inputClass} defaultValue="8" /></div>
                <div><label className={labelClass}>Password Expiry (days)</label><input type="number" className={inputClass} defaultValue="90" /></div>
              </div>
              <div className="space-y-3">
                {['Require uppercase letters','Require lowercase letters','Require numbers','Require special characters'].map((req) => (
                  <div key={req} className="flex items-center gap-2">
                    <Toggle id={req} defaultChecked />
                    <label className="text-sm text-foreground">{req}</label>
                  </div>
                ))}
              </div>
              <button className="rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground hover:opacity-90 transition-opacity">Save Policy</button>
            </div>
          </div>
        </div>
      )}

      {/* Billing */}
      {activeTab === 'Billing' && (
        <div className="space-y-6">
          <div className="rounded-lg border border-border bg-card shadow-sm">
            <div className="flex items-center gap-2 p-5 border-b border-border">
              <CreditCard size={20} className="text-primary" />
              <div>
                <h3 className="font-semibold text-foreground">Payment Settings</h3>
                <p className="text-sm text-muted-foreground">Configure payment processing and billing</p>
              </div>
            </div>
            <div className="p-5 space-y-4">
              <div className="flex items-center justify-between rounded-lg bg-muted/50 p-4">
                <div className="flex items-center gap-3">
                  <div className="rounded bg-background p-2">
                    <CreditCard size={20} className="text-primary" />
                  </div>
                  <div>
                    <p className="font-medium text-foreground">Stripe Integration</p>
                    <p className="text-sm text-muted-foreground">Connected – Live Mode</p>
                  </div>
                </div>
                <button className="rounded-lg border border-border px-4 py-2 text-sm font-medium text-foreground hover:bg-muted transition-colors">Configure</button>
              </div>
              <div className="space-y-4">
                {[
                  { id: 'auto-renewal',  label: 'Auto-renewal',   desc: 'Automatically renew memberships',                   on: true },
                  { id: 'grace-period',  label: 'Grace Period',   desc: 'Allow 3-day grace period for failed payments',      on: true },
                  { id: 'receipts',      label: 'Email Receipts', desc: 'Send payment receipts via email',                   on: true },
                ].map((s) => (
                  <div key={s.id} className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-foreground">{s.label}</p>
                      <p className="text-sm text-muted-foreground">{s.desc}</p>
                    </div>
                    <Toggle id={s.id} defaultChecked={s.on} />
                  </div>
                ))}
              </div>
              <button className="rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground hover:opacity-90 transition-opacity">Save Payment Settings</button>
            </div>
          </div>

          <div className="rounded-lg border border-border bg-card shadow-sm">
            <div className="p-5 border-b border-border">
              <h3 className="font-semibold text-foreground">Membership Pricing</h3>
              <p className="text-sm text-muted-foreground">Configure subscription tiers and pricing</p>
            </div>
            <div className="p-5 space-y-3">
              {[
                { tier: 'Basic',    price: 29, features: 'Gym access, basic classes' },
                { tier: 'Standard', price: 59, features: 'Full classes, challenges, basic nutrition' },
                { tier: 'Premium',  price: 99, features: 'All features, personal training, priority booking' },
              ].map((plan) => (
                <div key={plan.tier} className="flex items-center justify-between rounded-lg bg-muted/50 p-4">
                  <div>
                    <p className="font-medium text-foreground">{plan.tier}</p>
                    <p className="text-sm text-muted-foreground">{plan.features}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="flex items-baseline gap-1">
                      <span className="text-lg font-bold text-foreground">${plan.price}</span>
                      <span className="text-sm text-muted-foreground">/month</span>
                    </div>
                    <button className="rounded-lg border border-border px-3 py-1.5 text-sm font-medium text-foreground hover:bg-muted transition-colors">Edit</button>
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
