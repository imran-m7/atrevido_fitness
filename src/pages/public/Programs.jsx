import React from 'react'
import { Link } from 'react-router-dom'
import { Users, User, Clock, CheckCircle2, Dumbbell, Salad, ArrowRight } from 'lucide-react'

import trcanje3 from '../../assets/trcanje31.jpeg'

const programs = [
  {
    id: 'group',
    title: 'Grupni Treninzi',
    subtitle: 'Trenirajmo zajedno, rastimo zajedno',
    description: "Pridružite se našim energičnim grupnim treninzima gdje vježbate zajedno s drugim motivisanim ženama. Naši grupni časovi su osmišljeni da vas izazovu, a istovremeno budu zabavni i društveni.",
    icon: Users,
    duration: '1 sat',
    price: '60 KM',
    period: '/mjesec',
    features: ['Pristup svim grupnim treninzima', 'Sedmična prijava na treninge', 'Učešće u izazovima', 'Praćenje napretka', 'Osnovne smjernice za ishranu', 'Podrška zajednice'],
    notIncluded: ['Individualni treninzi', 'Personalizovani plan ishrane'],
    popular: false,
    buttonText: 'Pridruži se Grupnim Treninzima',
  },
  {
    id: 'individual',
    title: 'Individualni Treninzi',
    subtitle: 'Personalizovana pažnja',
    description: 'Dobijte individualnu pažnju uz prilagođene planove treninga koji su usklađeni s vašim specifičnim ciljevima, nivoom fizičke spremnosti i rasporedom. Idealno za one koji žele fokusirano i personalizovano vođenje.',
    icon: User,
    duration: '1 sat',
    price: '300 KM',
    period: '/mjesec',
    features: ['Individualni treninzi', 'Fleksibilno zakazivanje termina sa trenericom', 'Prilagođeni planovi treninga', 'Praćenje napretka', 'Učešće u izazovima', 'Prioritetna rezervacija termina'],
    notIncluded: ['Personalizovani plan ishrane'],
    popular: true,
    buttonText: 'Zatraži Individualni Trening',
  },
  {
    id: 'individual-nutrition',
    title: 'Individualni Trening + Ishrana',
    subtitle: 'Puni Paket',
    description: 'Naš najobuhvatniji program kombinuje personalizovane treninge sa kompletnim planom ishrane. Dobijte potpuno fitness iskustvo uz planove obroka, recepte i smjernice za ishranu.',
    icon: Salad,
    duration: '1 sat',
    price: '480 KM',
    period: '/mjesec',
    features: ['Sve što je uključeno u individualne treninge', 'Personalizovani plan ishrane', 'Prilagođeni prijedlozi obroka', 'Pristup bazi recepata', 'Smjernice za ishranu', 'Sedmične provjere napretka'],
    notIncluded: [],
    popular: false,
    buttonText: 'Uzmi Kompletan Paket',
  },
]
 
export default function Programs() {
  return (
    <div className="min-h-screen bg-background">
 
      {/* Hero */}
      <section
        className="relative px-4 py-16 lg:py-24 overflow-hidden bg-cover bg-no-repeat min-h-[400px]"
        style={{ backgroundImage: `url(${trcanje3})`, backgroundPosition: 'center 20%' }}
      >
        <div className="absolute inset-0 bg-black/60" />
        <div className="relative z-10 container mx-auto max-w-4xl text-center">
          
          <span className="inline-block mb-4 rounded-full bg-white/20 px-4 py-1.5 text-2xl font-medium text-white">
            Trening Programi
          </span>

          <h1 className="mb-4 text-4xl font-bold text-white lg:text-5xl">
            Izaberi Svoj Put
          </h1>

          <p className="text-lg text-white/90 mt-7">
            Bez obzira da li vam više odgovara grupno okruženje ili individualni pristup, imamo program koji je prilagođen 
            vašim potrebama i ciljevima. Kroz funkcionalne treninge, stručno vođenje i podržavajuću atmosferu pomažemo 
            vam da razvijete snagu, poboljšate kondiciju i izgradite zdrave navike koje traju dugoročno.
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
                  'relative flex flex-col rounded-lg border bg-card shadow-sm text-justify',
                  program.popular ? 'border-primary shadow-lg' : 'border-border',
                ].join(' ')}
              >
                {program.popular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <span className="rounded-full bg-primary px-4 py-1 text-sm font-medium text-primary-foreground">
                      Najpopularniji
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
                    <p className="text-sm font-medium text-foreground">Šta je uključeno:</p>
                    {program.features.map((f) => (
                      <div key={f} className="flex items-start gap-2">
                        <CheckCircle2 size={16} className="mt-0.5 shrink-0 text-primary" />
                        <span className="text-sm text-muted-foreground">{f}</span>
                      </div>
                    ))}
                    {program.notIncluded.length > 0 && (
                      <>
                        <p className="pt-2 text-sm font-medium text-foreground">Šta nije uključeno:</p>
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
      
    </div>
  )
}