import React from 'react'
import { Link } from 'react-router-dom'
import {
  Dumbbell, Users, Clock, Star, MapPin, Phone, Mail,
  ChevronRight, Heart, Zap, Target,
} from 'lucide-react'
 
const features = [
  { icon: Dumbbell, title: 'State-of-the-Art Equipment',  description: "Premium fitness equipment designed specifically for women's training needs and goals." },
  { icon: Users,   title: 'Expert Female Trainers',       description: "Our certified trainers understand the unique needs of women's fitness journeys." },
  { icon: Heart,   title: 'Supportive Community',         description: 'Join a welcoming community of women who motivate and inspire each other.' },
  { icon: Target,  title: 'Personalized Programs',        description: 'Custom workout and nutrition plans tailored to your specific goals.' },
]
 
const classes = [
  { name: 'HIIT Training',           time: 'Mon, Wed, Fri – 6:00 AM',  spots: 8 },
  { name: 'Yoga Flow',               time: 'Tue, Thu – 7:00 AM',       spots: 12 },
  { name: 'Strength & Conditioning', time: 'Mon, Wed – 5:30 PM',       spots: 6 },
  { name: 'Spin Class',              time: 'Tue, Thu, Sat – 6:30 PM',  spots: 15 },
  { name: 'Pilates',                 time: 'Wed, Fri – 12:00 PM',      spots: 10 },
]
 
const testimonials = [
  { name: 'Maria Santos',    role: 'Member for 2 years',  rating: 5, content: 'Atrevido Fitness changed my life. The trainers genuinely care about your progress, and the community feels like family.' },
  { name: 'Jessica Rodriguez', role: 'Member for 1 year', rating: 5, content: "I've tried many gyms, but none compare to the welcoming atmosphere and expert guidance here. Highly recommend!" },
  { name: 'Ana Martinez',    role: 'Member for 6 months', rating: 5, content: 'The personalized nutrition plans and workout programs helped me achieve results I never thought possible.' },
]
 
const stats = [
  { value: '500+', label: 'Active Members' },
  { value: '15+',  label: 'Expert Trainers' },
  { value: '50+',  label: 'Weekly Classes' },
  { value: '98%',  label: 'Satisfaction Rate' },
]
 
export default function Home() {
  return (
    <div className="min-h-screen bg-background">
 
      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-br from-primary via-primary to-accent">
        <div className="absolute inset-0 opacity-10 pointer-events-none">
          <div className="absolute top-20 right-20 h-64 w-64 rounded-full bg-white blur-3xl" />
          <div className="absolute bottom-20 left-20 h-48 w-48 rounded-full bg-white blur-3xl" />
        </div>
        <div className="container relative mx-auto px-4 py-20 lg:py-32">
          <div className="mx-auto max-w-4xl text-center">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-white/20 px-4 py-2 text-sm text-white">
              <Zap size={16} />
              Women-Only Fitness Center
            </div>
            <h1 className="mb-6 text-4xl font-bold tracking-tight text-white lg:text-6xl">
              Welcome to Atrevido Fitness
            </h1>
            <p className="mb-8 text-lg text-white/90 lg:text-xl">
              Empowering women to achieve their fitness goals in a supportive,
              judgment-free environment. Your transformation journey starts here.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link
                to="/register"
                className="inline-flex items-center gap-2 rounded-lg bg-white px-6 py-3 text-base font-semibold text-primary hover:bg-white/90 transition-opacity"
              >
                Start Your Journey <ChevronRight size={18} />
              </Link>
              <Link
                to="/programs"
                className="inline-flex items-center gap-2 rounded-lg border border-white/30 px-6 py-3 text-base font-semibold text-white hover:bg-white/10 transition-colors"
              >
                View Programs
              </Link>
            </div>
          </div>
        </div>
      </section>
 
      {/* Stats Bar */}
      <section className="border-b border-border bg-card">
        <div className="container mx-auto">
          <div className="grid grid-cols-2 lg:grid-cols-4">
            {stats.map((stat, i) => (
              <div
                key={stat.label}
                className={[
                  'p-6 text-center',
                  i < stats.length - 1 ? 'border-r border-border' : '',
                  i < 2 ? 'border-b border-border lg:border-b-0' : '',
                ].join(' ')}
              >
                <p className="text-3xl font-bold text-primary">{stat.value}</p>
                <p className="text-sm text-muted-foreground">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
 
      {/* Features */}
      <section className="container mx-auto px-4 py-16 lg:py-24">
        <div className="mb-12 text-center">
          <h2 className="mb-4 text-3xl font-bold text-foreground">Why Choose Atrevido Fitness?</h2>
          <p className="mx-auto max-w-2xl text-muted-foreground">
            We provide everything you need to succeed in your fitness journey,
            from top-tier equipment to personalized coaching.
          </p>
        </div>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {features.map((f) => {
            const Icon = f.icon
            return (
              <div key={f.title} className="rounded-lg border border-border bg-card p-6 text-center shadow-sm">
                <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-primary/10">
                  <Icon size={28} className="text-primary" />
                </div>
                <h3 className="mb-2 font-semibold text-foreground">{f.title}</h3>
                <p className="text-sm text-muted-foreground">{f.description}</p>
              </div>
            )
          })}
        </div>
      </section>
 
      {/* Classes */}
      <section className="bg-muted/50 px-4 py-16 lg:py-24">
        <div className="container mx-auto">
          <div className="mb-12 text-center">
            <h2 className="mb-4 text-3xl font-bold text-foreground">Popular Classes</h2>
            <p className="mx-auto max-w-2xl text-muted-foreground">
              From high-intensity training to relaxing yoga sessions,
              we offer a variety of classes to fit every fitness level.
            </p>
          </div>
          <div className="mx-auto max-w-3xl rounded-lg border border-border bg-card shadow-sm overflow-hidden">
            {classes.map((cls, i) => (
              <div
                key={cls.name}
                className={[
                  'flex items-center justify-between p-4 flex-wrap gap-4',
                  i < classes.length - 1 ? 'border-b border-border' : '',
                ].join(' ')}
              >
                <div className="flex items-center gap-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 shrink-0">
                    <Dumbbell size={20} className="text-primary" />
                  </div>
                  <div>
                    <p className="font-medium text-foreground">{cls.name}</p>
                    <p className="flex items-center gap-1 text-sm text-muted-foreground">
                      <Clock size={12} /> {cls.time}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm text-muted-foreground mb-1">{cls.spots} spots left</p>
                  <Link
                    to="/login"
                    className="inline-block rounded-lg border border-border px-3 py-1.5 text-sm font-medium text-foreground hover:bg-muted transition-colors"
                  >
                    Book Now
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
 
      {/* Testimonials */}
      <section className="container mx-auto px-4 py-16 lg:py-24">
        <div className="mb-12 text-center">
          <h2 className="mb-4 text-3xl font-bold text-foreground">What Our Members Say</h2>
          <p className="mx-auto max-w-2xl text-muted-foreground">
            Hear from real members about their experience at Atrevido Fitness.
          </p>
        </div>
        <div className="grid gap-6 md:grid-cols-3">
          {testimonials.map((t) => (
            <div key={t.name} className="rounded-lg border border-border bg-card p-6 shadow-sm">
              <div className="mb-4 flex gap-1">
                {Array.from({ length: t.rating }).map((_, i) => (
                  <Star key={i} size={16} className="text-primary fill-primary" />
                ))}
              </div>
              <p className="mb-4 text-muted-foreground">"{t.content}"</p>
              <p className="font-semibold text-foreground">{t.name}</p>
              <p className="text-sm text-muted-foreground">{t.role}</p>
            </div>
          ))}
        </div>
      </section>
 
      {/* Contact Info */}
      <section className="bg-muted/50 px-4 py-16 lg:py-24">
        <div className="container mx-auto max-w-4xl">
          <div className="rounded-lg border border-border bg-card shadow-sm">
            <div className="border-b border-border p-6 text-center">
              <h2 className="text-2xl font-bold text-foreground">Visit Us Today</h2>
            </div>
            <div className="p-6">
              <div className="grid gap-6 md:grid-cols-3 mb-8">
                {[
                  { Icon: MapPin, label: 'Location', value: '123 Fitness Street, Downtown' },
                  { Icon: Phone,  label: 'Phone',    value: '(555) 123-4567' },
                  { Icon: Mail,   label: 'Email',    value: 'hello@atrevidofitness.com' },
                ].map(({ Icon, label, value }) => (
                  <div key={label} className="flex items-center gap-4">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-primary/10">
                      <Icon size={22} className="text-primary" />
                    </div>
                    <div>
                      <p className="font-medium text-foreground">{label}</p>
                      <p className="text-sm text-muted-foreground">{value}</p>
                    </div>
                  </div>
                ))}
              </div>
              <div className="rounded-lg bg-muted p-6 text-center">
                <h3 className="mb-2 font-semibold text-foreground">Operating Hours</h3>
                <p className="text-muted-foreground">Monday – Friday: 5:00 AM – 10:00 PM</p>
                <p className="text-muted-foreground">Saturday: 6:00 AM – 8:00 PM</p>
                <p className="text-muted-foreground">Sunday: 7:00 AM – 6:00 PM</p>
              </div>
            </div>
          </div>
        </div>
      </section>
 
      {/* CTA */}
      <section className="bg-gradient-to-r from-primary to-accent px-4 py-16 lg:py-24">
        <div className="container mx-auto max-w-3xl text-center">
          <h2 className="mb-4 text-3xl font-bold text-white">Ready to Transform Your Life?</h2>
          <p className="mb-8 text-white/90">
            Join Atrevido Fitness today and become part of our empowering community.
            Your first week is on us!
          </p>
          <Link
            to="/register"
            className="inline-flex items-center gap-2 rounded-lg bg-white px-6 py-3 text-base font-semibold text-primary hover:bg-white/90 transition-opacity"
          >
            Claim Your Free Trial <ChevronRight size={18} />
          </Link>
        </div>
      </section>
 
    </div>
  )
}