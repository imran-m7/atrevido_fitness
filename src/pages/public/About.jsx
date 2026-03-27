import React from 'react'
import { Award, GraduationCap, Heart, Users, Calendar, Star } from 'lucide-react'
 
const certifications = [
  'NASM Certified Personal Trainer',
  'ACE Group Fitness Instructor',
  'Precision Nutrition Level 2',
  'Pre/Postnatal Fitness Specialist',
  'TRX Suspension Training',
  'Functional Movement Specialist',
]
 
const achievements = [
  { icon: Calendar, value: '10+', label: 'Years Experience' },
  { icon: Users,    value: '500+', label: 'Clients Trained' },
  { icon: Star,     value: '4.9',  label: 'Average Rating' },
  { icon: Award,    value: '15+',  label: 'Certifications' },
]
 
const expertise = [
  { icon: Heart,  title: "Women's Health & Fitness",  description: "Specialized training programs designed specifically for women's unique physiological needs, including hormonal considerations and life stage adaptations." },
  { icon: Users,  title: 'Adaptive Training',          description: 'Experience working with clients who have physical challenges or limitations, creating modified programs that are both safe and effective.' },
  { icon: Award,  title: 'Nutrition Coaching',         description: 'Comprehensive nutrition guidance that complements your training, helping you fuel your body for optimal performance and results.' },
  { icon: Star,   title: 'Group Fitness',              description: 'Dynamic group classes that build community while delivering results, from high-intensity workouts to mindful movement sessions.' },
]
 
export default function About() {
  return (
    <div className="min-h-screen bg-background">
 
      {/* Hero */}
      <section className="bg-linear-to-br from-primary/10 to-accent/10 px-4 py-16 lg:py-24">
        <div className="container mx-auto max-w-4xl text-center">
          <span className="inline-block mb-4 rounded-full bg-secondary px-4 py-1.5 text-sm font-medium text-secondary-foreground">
            About Us
          </span>
          <h1 className="mb-4 text-4xl font-bold text-foreground lg:text-5xl">Meet Your Trainer</h1>
          <p className="text-lg text-muted-foreground">
            Dedicated to empowering women through fitness, health, and wellness.
          </p>
        </div>
      </section>
 
      {/* Trainer Profile */}
      <section className="container mx-auto px-4 py-16">
        <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
          {/* Image Placeholder */}
          <div className="relative">
            <div className="aspect-4/5 overflow-hidden rounded-2xl bg-linear-to-br from-primary/20 to-accent/20 flex items-center justify-center">
              <div className="text-center">
                <div className="mx-auto mb-4 flex h-32 w-32 items-center justify-center rounded-full bg-primary/20">
                  <Users size={64} className="text-primary" />
                </div>
                <p className="text-muted-foreground">Trainer Photo</p>
              </div>
            </div>
            <div className="absolute -bottom-6 -right-6 rounded-2xl bg-card border border-border p-4 shadow-lg">
              <p className="text-3xl font-bold text-primary">10+</p>
              <p className="text-sm text-muted-foreground">Years of Experience</p>
            </div>
          </div>
 
          {/* Bio */}
          <div>
            <h2 className="mb-2 text-3xl font-bold text-foreground">Elena Rodriguez</h2>
            <p className="mb-6 text-lg text-primary">Founder & Head Trainer</p>
            <div className="space-y-4 text-muted-foreground">
              <p>
                With over a decade of experience in women's fitness, I founded Atrevido Fitness
                with a simple mission: to create a space where every woman feels empowered to
                pursue her health and fitness goals without judgment.
              </p>
              <p>
                My journey began after my own transformation taught me that fitness is not just
                about physical strength — it's about building confidence, resilience, and a
                positive relationship with your body.
              </p>
              <p>
                I specialize in working with women of all fitness levels, including those with
                physical challenges or limitations. Every body is different, and I believe in
                creating personalized programs that meet you where you are.
              </p>
            </div>
          </div>
        </div>
      </section>
 
      {/* Stats */}
      <section className="bg-muted/50 px-4 py-16">
        <div className="container mx-auto">
          <div className="grid grid-cols-2 gap-6 lg:grid-cols-4">
            {achievements.map((a) => {
              const Icon = a.icon
              return (
                <div key={a.label} className="rounded-lg border border-border bg-card p-6 text-center shadow-sm">
                  <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                    <Icon size={24} className="text-primary" />
                  </div>
                  <p className="text-3xl font-bold text-foreground">{a.value}</p>
                  <p className="text-sm text-muted-foreground">{a.label}</p>
                </div>
              )
            })}
          </div>
        </div>
      </section>
 
      {/* Certifications */}
      <section className="container mx-auto px-4 py-16">
        <div className="mx-auto max-w-3xl">
          <div className="mb-8 text-center">
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-primary/10">
              <GraduationCap size={28} className="text-primary" />
            </div>
            <h2 className="mb-2 text-2xl font-bold text-foreground">Certifications & Qualifications</h2>
            <p className="text-muted-foreground">Continuously learning to provide the best training experience.</p>
          </div>
          <div className="flex flex-wrap justify-center gap-3">
            {certifications.map((cert) => (
              <span
                key={cert}
                className="rounded-full bg-secondary px-4 py-2 text-sm font-medium text-secondary-foreground"
              >
                {cert}
              </span>
            ))}
          </div>
        </div>
      </section>
 
      {/* Expertise */}
      <section className="bg-muted/50 px-4 py-16">
        <div className="container mx-auto max-w-4xl">
          <div className="mb-12 text-center">
            <h2 className="mb-4 text-2xl font-bold text-foreground">Areas of Expertise</h2>
          </div>
          <div className="grid gap-6 md:grid-cols-2">
            {expertise.map((e) => {
              const Icon = e.icon
              return (
                <div key={e.title} className="rounded-lg border border-border bg-card p-6 shadow-sm">
                  <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                    <Icon size={24} className="text-primary" />
                  </div>
                  <h3 className="mb-2 font-semibold text-foreground">{e.title}</h3>
                  <p className="text-sm text-muted-foreground">{e.description}</p>
                </div>
              )
            })}
          </div>
        </div>
      </section>
 
    </div>
  )
}
