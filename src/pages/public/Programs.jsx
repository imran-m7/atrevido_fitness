import React from 'react'
import { Link } from 'react-router-dom'
import { Users, User, Clock, CheckCircle2, Dumbbell, Salad, ArrowRight } from 'lucide-react'
 
const programs = [
  {
    id: 'group',
    title: 'Group Training',
    subtitle: 'Train Together, Grow Together',
    description: "Join our energizing group sessions where you'll work out alongside other motivated women. Our group classes are designed to challenge you while keeping things fun and social.",
    icon: Users,
    duration: '1 hour sessions',
    price: '$79',
    period: '/month',
    features: ['Access to all group training sessions', 'Weekly class booking', 'Challenge participation', 'Progress tracking', 'Basic nutrition guidelines', 'Community support'],
    notIncluded: ['Individual training sessions', 'Personalized nutrition plan'],
    popular: false,
    buttonText: 'Join Group Training',
  },
  {
    id: 'individual',
    title: 'Individual Training',
    subtitle: 'Personalized Attention',
    description: 'Get one-on-one attention with customized workout plans tailored to your specific goals, fitness level, and schedule. Perfect for those who want focused, personalized guidance.',
    icon: User,
    duration: '1 hour sessions',
    price: '$149',
    period: '/month',
    features: ['Personal training sessions', 'Flexible scheduling with trainer', 'Customized workout plans', 'Progress tracking', 'Challenge participation', 'Priority booking'],
    notIncluded: ['Personalized nutrition plan'],
    popular: true,
    buttonText: 'Request Individual Training',
  },
  {
    id: 'individual-nutrition',
    title: 'Individual + Nutrition',
    subtitle: 'The Complete Package',
    description: 'Our most comprehensive program combines personalized training with a full nutrition plan. Get the complete fitness experience with meal plans, recipes, and dietary guidance.',
    icon: Salad,
    duration: '1 hour sessions',
    price: '$199',
    period: '/month',
    features: ['Everything in Individual Training', 'Personalized nutrition plan', 'Custom meal suggestions', 'Recipe library access', 'Nutritional guidance', 'Weekly check-ins'],
    notIncluded: [],
    popular: false,
    buttonText: 'Get Complete Package',
  },
]
 
export default function Programs() {
  return (
    <div className="min-h-screen bg-background">
 
      {/* Hero */}
      <section className="bg-gradient-to-br from-primary/10 to-accent/10 px-4 py-16 lg:py-24">
        <div className="container mx-auto max-w-4xl text-center">
          <span className="inline-block mb-4 rounded-full bg-secondary px-4 py-1.5 text-sm font-medium text-secondary-foreground">
            Training Programs
          </span>
          <h1 className="mb-4 text-4xl font-bold text-foreground lg:text-5xl">
            Choose Your Path to Fitness
          </h1>
          <p className="text-lg text-muted-foreground">
            Whether you thrive in a group setting or prefer personalized attention,
            we have a program that fits your needs and goals.
          </p>
        </div>
      </section>
 
      {/* Programs Grid */}
      <section className="container mx-auto px-4 py-16">
        <div className="grid gap-8 lg:grid-cols-3">
          {programs.map((program) => {
            const Icon = program.icon
            return (
              <div
                key={program.id}
                className={[
                  'relative flex flex-col rounded-lg border bg-card shadow-sm',
                  program.popular ? 'border-primary shadow-lg' : 'border-border',
                ].join(' ')}
              >
                {program.popular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <span className="rounded-full bg-primary px-4 py-1 text-sm font-medium text-primary-foreground">
                      Most Popular
                    </span>
                  </div>
                )}
 
                {/* Header */}
                <div className="p-6 text-center border-b border-border">
                  <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
                    <Icon size={32} className="text-primary" />
                  </div>
                  <h2 className="text-xl font-bold text-foreground">{program.title}</h2>
                  <p className="text-sm text-muted-foreground">{program.subtitle}</p>
                </div>
 
                {/* Content */}
                <div className="flex-1 p-6">
                  <p className="mb-6 text-sm text-muted-foreground">{program.description}</p>
 
                  <div className="mb-6 text-center">
                    <span className="text-4xl font-bold text-foreground">{program.price}</span>
                    <span className="text-muted-foreground">{program.period}</span>
                  </div>
 
                  <div className="mb-4 flex items-center justify-center gap-2 text-sm text-muted-foreground">
                    <Clock size={16} />
                    <span>{program.duration}</span>
                  </div>
 
                  <div className="space-y-3">
                    <p className="text-sm font-medium text-foreground">What's included:</p>
                    {program.features.map((f) => (
                      <div key={f} className="flex items-start gap-2">
                        <CheckCircle2 size={16} className="mt-0.5 shrink-0 text-primary" />
                        <span className="text-sm text-muted-foreground">{f}</span>
                      </div>
                    ))}
                    {program.notIncluded.length > 0 && (
                      <>
                        <p className="pt-2 text-sm font-medium text-muted-foreground">Not included:</p>
                        {program.notIncluded.map((item) => (
                          <div key={item} className="flex items-start gap-2 text-muted-foreground/60">
                            <Dumbbell size={16} className="mt-0.5 shrink-0" />
                            <span className="text-sm line-through">{item}</span>
                          </div>
                        ))}
                      </>
                    )}
                  </div>
                </div>
 
                {/* Footer */}
                <div className="p-6 pt-0">
                  <Link
                    to="/login"
                    className={[
                      'flex w-full items-center justify-center gap-2 rounded-lg px-4 py-3 text-sm font-semibold transition-opacity',
                      program.popular
                        ? 'bg-primary text-primary-foreground hover:opacity-90'
                        : 'border border-border text-foreground hover:bg-muted',
                    ].join(' ')}
                  >
                    {program.buttonText}
                    <ArrowRight size={16} />
                  </Link>
                </div>
              </div>
            )
          })}
        </div>
      </section>
 
      {/* CTA */}
      <section className="bg-muted/50 px-4 py-16">
        <div className="container mx-auto max-w-3xl text-center">
          <h2 className="mb-4 text-2xl font-bold text-foreground">Not Sure Which Program Is Right for You?</h2>
          <p className="mb-8 text-muted-foreground">
            Schedule a free consultation and we'll help you find the perfect fit for your
            fitness goals, schedule, and preferences.
          </p>
          <Link
            to="/contact"
            className="inline-flex items-center gap-2 rounded-lg bg-primary px-6 py-3 text-base font-semibold text-primary-foreground hover:opacity-90 transition-opacity"
          >
            Schedule Free Consultation <ArrowRight size={18} />
          </Link>
        </div>
      </section>
 
    </div>
  )
}