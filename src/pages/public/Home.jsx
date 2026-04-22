import React from 'react'
import { Link } from 'react-router-dom'
import {
  Dumbbell, Users, Clock, Star, MapPin, Phone, Mail,
  ChevronRight, Heart, Zap, Target,
} from 'lucide-react'
 
const features = [
  { icon: Dumbbell, title: 'Snaga i Balans',                      description: "Kroz treninge nastojimo pomoći ženama da razviju snagu, izdržljivost i stabilnost, ali i da izgrade zdrav odnos prema vlastitom tijelu i kretanju." },
  { icon: Users,    title: 'Zdravlje Na Prvom Mjestu',            description: "Poseban naglasak stavljamo na zdrav način života, pravilno kretanje, jačanje tijela i dugoročno očuvanje zdravlja, a ne samo na estetske rezultate. " },
  { icon: Heart,    title: 'Krug Podrške',                        description: 'U protekle dvije i po godine Atrevido je postao mjesto zajednice, podrške i motivacije, gdje žene zajedno rade na svom fizičkom i mentalnom stanju.' },
  { icon: Target,   title: 'Treninzi Prilagođeni Svakoj Ženi',    description: 'Naš program obuhvata grupne i individualne treninge, koji su prilagođeni različitim nivoima fizičke spremnosti – od početnica do žena koje već imaju iskustvo u treningu.' },
]
 
 
const testimonials = [
  { name: 'Amina Mehić',  rating: 5, content: 'Treniram već dugo i isprobala sam razne grupne treninge i teretane, ali Atrevido je najbolji! 💪 Atmosfera je motivirajuća i prijateljska, što treninge čini pravim užitkom. 🏋️‍♀️ Dika je izuzetno posvećena, pažljivo prati svakog člana i prilagođava treninge individualnim potrebama. Treninzi su dinamični, izazovni, ali istovremeno zabavni, što ih čini nečim čemu se uvijek radujem. 😊 Njena energija i trud su stvarno inspirativni. Preporučujem svakome ko želi trenirati u podržavajućem i pozitivnom okruženju! 🔥✨' },
  ]
 
const stats = [
  { value: '500+', label: 'Aktivnih Članova' },
  { value: '1',  label: 'Profesionalna Trenerica' },
  { value: '50+',  label: 'Sedmičnih Treninga' },
]
 
export default function Home() {
  return (
    <div className="min-h-screen bg-background">
 
      {/* Hero */}
      <section className="relative overflow-hidden bg-linear-to-br from-primary via-primary to-accent">
        <div className="absolute inset-0 opacity-10 pointer-events-none">
          <div className="absolute top-20 right-20 h-64 w-64 rounded-full bg-white blur-3xl" />
          <div className="absolute bottom-20 left-20 h-48 w-48 rounded-full bg-white blur-3xl" />
        </div>
        <div className="container relative mx-auto px-4 py-20 lg:py-32">
          <div className="mx-auto max-w-4xl text-center">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-white/20 px-4 py-2 text-sm text-white">
              <Zap size={16} />
              Funkcionalni Fitness Studio za Žene
            </div>
            <h1 className="mb-6 text-4xl font-bold tracking-tight text-white lg:text-6xl">
              Dobrodošli u Atrevido Fitness
            </h1>
            <p className="mb-8 text-lg text-white/90 lg:text-xl">
              Grupni i individualni programi za žene koje jačaju snagu, zdravlje i samopouzdanje. <br />
              Vaša transformacija počinje ovdje.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link
                to="/register"
                className="inline-flex items-center gap-2 rounded-lg bg-white px-6 py-3 text-base font-semibold text-primary hover:bg-white/90 transition-opacity"
              >
                Započni Svoju Avanturu <ChevronRight size={18} />
              </Link>
              <Link
                to="/programs"
                className="inline-flex items-center gap-2 rounded-lg border border-white/30 bg-white/20 px-6 py-3 text-base font-semibold text-white hover:bg-white/40 transition-colors"
              >
                Pregled Programa
              </Link>
            </div>
          </div>
        </div>
      </section>
 
      {/* Stats Bar */}
      <section className="border-b border-border bg-card">
        <div className="container mx-auto">
          <div className="grid grid-cols-2 lg:grid-cols-3">
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
          <h2 className="mb-4 text-3xl font-bold text-foreground">Zašto Birati Atrevido Fitness?</h2>
          <p className="mx-auto max-w-2xl text-muted-foreground">
            U Atrevidu se fokusiramo na funkcionalni način treninga, koji podrazumijeva pokrete 
            i vježbe prilagođene svakodnevnim aktivnostima i potrebama ženskog tijela.
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

      {/* Testimonials */}
      <section className="container mx-auto px-4 py-16 lg:py-24">
        <div className="mb-12 text-center">
          <h2 className="mb-4 text-3xl font-bold text-foreground">Iskustva Naših Članova u Atrevido Fitnessu</h2>
          <p className="mx-auto max-w-2xl text-muted-foreground">
            Otkrijte iskustva naših članova i njihov put u Atrevido Fitnessu.
          </p>
        </div>
        <div className="flex justify-center">
          <div className="w-full max-w-2xl">
            {testimonials.map((t) => (
              <div key={t.name} className="rounded-lg border border-border bg-card p-6 shadow-sm text-justify">
                <div className="mb-4 flex gap-1 justify-center">
                  {Array.from({ length: t.rating }).map((_, i) => (
                    <Star key={i} size={16} className="text-primary fill-primary" />
                  ))}
                </div>
                <p className="mb-4 text-muted-foreground">"{t.content}"</p>
                <p className="font-semibold text-foreground">{t.name}</p>
                <p className="text-sm text-muted-foreground">{t.role}</p>
              </div>
            ))}
            <div className="mt-8 flex justify-center">
              <a
                href="https://www.google.com/search?sca_esv=6d4ade7bd26771c9&sxsrf=ANbL-n7rNNGGxlophHe5mgwnUpPaPNyc5g:1776873115736&si=AL3DRZEsmMGCryMMFSHJ3StBhOdZ2-6yYkXd_doETEE1OR-qOedzeUsZkiUg7IQ1MVOAtkZIA4FVPXWrkC_fzCCR3p-1aTHtMFM_TBrUc4rpPzlALR0S6ZVCfLLN-TLBmyXAqTSHmUpyNqTRvy4hMpVLW53AQBd9pw%3D%3D&q=ATREVIDO+WOMEN%E2%80%99S+FITNESS+Recenzije&sa=X&ved=2ahUKEwi1if-W6IGUAxWSXvEDHSGpI14Q0bkNegQILxAF&biw=1536&bih=730&dpr=1.25"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-lg bg-primary px-6 py-3 text-base font-semibold text-primary-foreground hover:opacity-90 transition-opacity"
              >
                Pogledajte Više Recenzija
              </a>
            </div>
          </div>
        </div>
      </section>
 
      {/* Contact Info */}
      <section className="bg-muted/50 px-4 py-16 lg:py-24">
        <div className="container mx-auto max-w-4xl">
          <div className="rounded-lg border border-border bg-card shadow-sm">
            <div className="border-b border-border p-6 text-center">
              <h2 className="text-2xl font-bold text-foreground">Posjetite Nas Danas</h2>
            </div>
            <div className="p-6">
              <div className="grid gap-6 md:grid-cols-3 mb-8">
                {[
                  { Icon: MapPin, label: 'Lokacija',  value: 'Azize Šaćirbegović 80c, Sarajevo 71000' },
                  { Icon: Phone,  label: 'Telefon',   value: '061 618 259' },
                  { Icon: Mail,   label: 'Email',     value: 'dika181001@gmail.com' },
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
                <h3 className="mb-2 font-semibold text-foreground">Radno Vrijeme</h3>
                <p className="text-muted-foreground">Ponedjeljak, Srijeda i Petak: <br /> 07:00 – 09:00 <br /> 16:30 – 20:15</p> <br />
                <p className="text-muted-foreground">Utorak i Četvrtak: <br /> 08:00 – 09:00 <br /> 17:00 – 19:00</p> <br />
                <p className="text-muted-foreground">Subota i Nedjelja: <strong>Zatvoreno</strong></p>
              </div>
            </div>
          </div>
        </div>
      </section>
 
      {/* CTA */}
      <section className="bg-linear-to-r from-primary to-accent px-4 py-16 lg:py-24">
        <div className="container mx-auto max-w-3xl text-center">
          <h2 className="mb-4 text-3xl font-bold text-white">Spremni Za Svoju Transformaciju?</h2>
          <p className="mb-8 text-white/90">
            Pridružite se Atrevido Fitnessu i zakoračite u zajednicu podrške i snage.
          </p>
          <Link
            to="/register"
            className="inline-flex items-center gap-2 rounded-lg bg-white px-6 py-3 text-base font-semibold text-primary hover:bg-white/90 transition-opacity"
          >
            Započni <ChevronRight size={18} />
          </Link>
        </div>
      </section>
 
    </div>
  )
}