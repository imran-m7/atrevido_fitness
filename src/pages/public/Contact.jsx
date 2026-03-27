import React, { useState } from 'react'
import { MapPin, Phone, Mail, Clock, Send } from 'lucide-react'
 
export default function Contact() {
  const [form, setForm] = useState({ firstName: '', lastName: '', email: '', phone: '', subject: '', message: '' })
 
  const handleChange = (e) => setForm({ ...form, [e.target.id]: e.target.value })
 
  const handleSubmit = (e) => {
    e.preventDefault()
    alert('Message sent! We will get back to you within 24 hours.')
  }
 
  const inputClass = 'w-full rounded-lg border border-input bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring transition-colors'
  const labelClass = 'block mb-1.5 text-sm font-medium text-foreground'
 
  return (
    <div className="min-h-screen bg-background">
 
      {/* Hero */}
      <section className="bg-gradient-to-br from-primary/10 to-accent/10 px-4 py-16 lg:py-24">
        <div className="container mx-auto max-w-4xl text-center">
          <span className="inline-block mb-4 rounded-full bg-secondary px-4 py-1.5 text-sm font-medium text-secondary-foreground">
            Contact Us
          </span>
          <h1 className="mb-4 text-4xl font-bold text-foreground lg:text-5xl">Get in Touch</h1>
          <p className="text-lg text-muted-foreground">
            Have questions about our programs? Want to schedule a tour?
            We'd love to hear from you.
          </p>
        </div>
      </section>
 
      {/* Content */}
      <section className="container mx-auto px-4 py-16">
        <div className="grid gap-8 lg:grid-cols-2">
 
          {/* Form */}
          <div className="rounded-lg border border-border bg-card shadow-sm">
            <div className="border-b border-border p-6">
              <h2 className="text-xl font-bold text-foreground">Send Us a Message</h2>
            </div>
            <div className="p-6">
              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="grid gap-4 md:grid-cols-2">
                  <div>
                    <label htmlFor="firstName" className={labelClass}>First Name</label>
                    <input id="firstName" className={inputClass} placeholder="Enter your first name" value={form.firstName} onChange={handleChange} />
                  </div>
                  <div>
                    <label htmlFor="lastName" className={labelClass}>Last Name</label>
                    <input id="lastName" className={inputClass} placeholder="Enter your last name" value={form.lastName} onChange={handleChange} />
                  </div>
                </div>
                <div>
                  <label htmlFor="email" className={labelClass}>Email</label>
                  <input id="email" type="email" className={inputClass} placeholder="Enter your email address" value={form.email} onChange={handleChange} />
                </div>
                <div>
                  <label htmlFor="phone" className={labelClass}>Phone (Optional)</label>
                  <input id="phone" type="tel" className={inputClass} placeholder="Enter your phone number" value={form.phone} onChange={handleChange} />
                </div>
                <div>
                  <label htmlFor="subject" className={labelClass}>Subject</label>
                  <input id="subject" className={inputClass} placeholder="What is this about?" value={form.subject} onChange={handleChange} />
                </div>
                <div>
                  <label htmlFor="message" className={labelClass}>Message</label>
                  <textarea id="message" rows={5} className={inputClass} placeholder="Tell us more about your inquiry..." value={form.message} onChange={handleChange} />
                </div>
                <button type="submit" className="flex w-full items-center justify-center gap-2 rounded-lg bg-primary px-4 py-3 text-sm font-semibold text-primary-foreground hover:opacity-90 transition-opacity">
                  <Send size={16} /> Send Message
                </button>
              </form>
            </div>
          </div>
 
          {/* Info Cards */}
          <div className="space-y-4">
            {[
              { Icon: MapPin, title: 'Location', lines: ['123 Fitness Street', 'Downtown, City 12345'], extra: <button className="mt-2 text-sm text-primary hover:underline">Get Directions</button> },
              { Icon: Phone,  title: 'Phone',    lines: ['(555) 123-4567', 'Available during business hours'] },
              { Icon: Mail,   title: 'Email',    lines: ['hello@atrevidofitness.com', 'We respond within 24 hours'] },
            ].map(({ Icon, title, lines, extra }) => (
              <div key={title} className="rounded-lg border border-border bg-card p-5 shadow-sm">
                <div className="flex items-start gap-4">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-primary/10">
                    <Icon size={22} className="text-primary" />
                  </div>
                  <div>
                    <h3 className="mb-1 font-semibold text-foreground">{title}</h3>
                    {lines.map((l, i) => <p key={i} className="text-sm text-muted-foreground">{l}</p>)}
                    {extra}
                  </div>
                </div>
              </div>
            ))}
 
            {/* Hours */}
            <div className="rounded-lg border border-border bg-card p-5 shadow-sm">
              <div className="flex items-start gap-4">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-primary/10">
                  <Clock size={22} className="text-primary" />
                </div>
                <div className="flex-1">
                  <h3 className="mb-2 font-semibold text-foreground">Business Hours</h3>
                  <div className="space-y-1 text-sm text-muted-foreground">
                    {[
                      ['Monday – Friday', '5:00 AM – 10:00 PM'],
                      ['Saturday',        '6:00 AM – 8:00 PM'],
                      ['Sunday',          '7:00 AM – 6:00 PM'],
                    ].map(([day, time]) => (
                      <div key={day} className="flex justify-between">
                        <span>{day}</span><span>{time}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
 
      {/* Map Placeholder */}
      <section className="bg-muted/50 px-4 py-16">
        <div className="container mx-auto">
          <div className="flex aspect-[21/9] items-center justify-center rounded-lg bg-gradient-to-br from-primary/10 to-accent/10">
            <div className="text-center text-muted-foreground">
              <MapPin size={48} className="mx-auto mb-2" />
              <p>Map Integration Placeholder</p>
              <p className="text-sm">Google Maps or similar would go here</p>
            </div>
          </div>
        </div>
      </section>
 
    </div>
  )
}