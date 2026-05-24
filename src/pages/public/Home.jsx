import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import {
  Dumbbell, Users, Clock, Star, MapPin, Phone, Mail,
  ChevronRight, Heart, Zap, Target, ChevronLeft,
} from 'lucide-react'

import trcanje3 from '../../assets/trcanje3.jpeg'

import clanice from '../../assets/clanice2.jpeg'
import grtrening1 from '../../assets/grupni_treninzi7.jpeg'
import grtrening2 from '../../assets/grupnitreninzi4.jpeg'
import indtrening1 from '../../assets/individualni_trening.jpeg'
import planinarenje1 from '../../assets/planinarenje.jpeg'
import RFTC4 from '../../assets/RFTC4.jpeg'
import slavlje1 from '../../assets/slavlje.jpeg'

const galleryImages = [
  { src: clanice,      caption: 'Naše članice' },
  { src: grtrening1,   caption: 'Grupni treninzi' },
  { src: grtrening2,   caption: 'Grupni treninzi' },
  { src: indtrening1,  caption: 'Individualni trening' },
  { src: planinarenje1,caption: 'Planinarenje' },
  { src: RFTC4,        caption: 'Atrevido Fitness' },
  { src: slavlje1,     caption: 'Slavlje' },
]

const features = [
  { icon: Dumbbell, title: 'Snaga i balans',                      description: "Kroz treninge nastojimo pomoći ženama da razviju snagu, izdržljivost i stabilnost, ali i da izgrade zdrav odnos prema vlastitom tijelu i kretanju." },
  { icon: Users,    title: 'Zdravlje na prvom mjestu',            description: "Poseban naglasak stavljamo na zdrav način života, pravilno kretanje, jačanje tijela i dugoročno očuvanje zdravlja, a ne samo na estetske rezultate. " },
  { icon: Heart,    title: 'Krug podrške',                        description: 'U protekle dvije i po godine Atrevido je postao mjesto zajednice, podrške i motivacije, gdje žene zajedno rade na svom fizičkom i mentalnom stanju.' },
  { icon: Target,   title: 'Treninzi prilagođeni svakoj ženi',    description: 'Naš program obuhvata grupne i individualne treninge, koji su prilagođeni različitim nivoima fizičke spremnosti – od početnica do žena koje već imaju iskustvo u treningu.' },
]

const testimonials = [
  { name: 'Amina Mehić',  rating: 5, content: 'Treniram već dugo i isprobala sam razne grupne treninge i teretane, ali Atrevido je najbolji! 💪 Atmosfera je motivirajuća i prijateljska, što treninge čini pravim užitkom. 🏋️‍♀️ Dika je izuzetno posvećena, pažljivo prati svakog člana i prilagođava treninge individualnim potrebama. Treninzi su dinamični, izazovni, ali istovremeno zabavni, što ih čini nečim čemu se uvijek radujem. 😊 Njena energija i trud su stvarno inspirativni. Preporučujem svakome ko želi trenirati u podržavajućem i pozitivnom okruženju! 🔥✨' },
]

const stats = [
  { value: '30+', label: 'Aktivnih članova' },
  { value: '1',  label: 'Profesionalna trenerica' },
  { value: '10+',  label: 'Sedmičnih treninga' },
]

export default function Home() {
  const [current, setCurrent] = useState(0)

  const prev = () => setCurrent((i) => (i === 0 ? galleryImages.length - 1 : i - 1))
  const next = () => setCurrent((i) => (i === galleryImages.length - 1 ? 0 : i + 1))

  return (
    <div className="min-h-screen bg-background">

      {/* Hero */}
      <section className="relative overflow-hidden bg-cover bg-no-repeat min-h-[500px]" style={{ backgroundImage: `url(${trcanje3})`, backgroundPosition: 'center 20%' }}>
        <div className="absolute inset-0 bg-black/60"/>
        <div className="container relative mx-auto px-4 py-20 lg:py-32">
          <div className="mx-auto max-w-4xl text-center">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-white/20 px-4 py-2 text-sm text-white">
              <Zap size={16} />
              Funkcionalni Fitness Studio za žene
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
                Započni svoju avanturu <ChevronRight size={18} />
              </Link>
              <Link
                to="/programs"
                className="inline-flex items-center gap-2 rounded-lg border border-white/30 bg-white/20 px-6 py-3 text-base font-semibold text-white hover:bg-white/40 transition-colors"
              >
                Pregled programa
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
          <h2 className="mb-4 text-3xl font-bold text-foreground">Zašto birati Atrevido Fitness?</h2>
          <p className="mx-auto max-w-2xl text-muted-foreground">
            U Atrevidu se fokusiramo na funkcionalni način treninga prilagođen svakodnevnim aktivnostima i potrebama ženskog tijela.
            Naš cilj nije samo postizanje estetskih rezultata, već razvoj snage, stabilnosti i zdravih životnih navika.
            Kroz individualan pristup, podržavajuće okruženje i stručno vođene treninge pomažemo ženama da napreduju vlastitim tempom i
            izgrade zdrav odnos prema fizičkoj aktivnosti.
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

      {/* Photo Gallery */}
      <section className="bg-muted/50 px-4 py-16 lg:py-24">
        <div className="container mx-auto max-w-4xl">
          <div className="mb-10 text-center">
            <h2 className="mb-3 text-3xl font-bold text-foreground">Naš studio u slikama</h2>
            <p className="mx-auto max-w-xl text-muted-foreground">
              Zavirite u svakodnevni život Atrevido Fitnessa — treninge, zajednicu i trenutke koji nas čine posebnima.
            </p>
          </div>

          {/* Slider */}
          <div className="relative overflow-hidden rounded-2xl border border-border bg-card shadow-sm mx-auto max-w-sm">
            {/* Image */}
            <div className="flex items-center justify-center p-4">
              <img
                key={current}
                src={galleryImages[current].src}
                alt={galleryImages[current].caption}
                className="w-full h-auto object-contain block rounded-lg"
              />
            </div>

            {/* Caption */}
            <div className="px-6 py-4 text-center border-t border-border">
              <p className="text-sm font-medium text-muted-foreground">{galleryImages[current].caption}</p>
              <p className="text-xs text-muted-foreground/60 mt-1">{current + 1} / {galleryImages.length}</p>
            </div>

            {/* Prev arrow */}
            <button
              onClick={prev}
              className="absolute left-3 top-1/2 -translate-y-1/2 flex h-10 w-10 items-center justify-center rounded-full bg-white/80 border border-border shadow-sm hover:bg-white transition-colors"
              aria-label="Prethodna slika"
            >
              <ChevronLeft size={20} className="text-foreground" />
            </button>

            {/* Next arrow */}
            <button
              onClick={next}
              className="absolute right-3 top-1/2 -translate-y-1/2 flex h-10 w-10 items-center justify-center rounded-full bg-white/80 border border-border shadow-sm hover:bg-white transition-colors"
              aria-label="Sljedeća slika"
            >
              <ChevronRight size={20} className="text-foreground" />
            </button>
          </div>

          {/* Dots */}
          <div className="mt-4 flex justify-center gap-2">
            {galleryImages.map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrent(i)}
                className={[
                  'h-2 rounded-full transition-all',
                  i === current ? 'w-6 bg-primary' : 'w-2 bg-border hover:bg-primary/40',
                ].join(' ')}
                aria-label={`Slika ${i + 1}`}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="container mx-auto px-4 py-16 lg:py-24">
        <div className="mb-12 text-center">
          <h2 className="mb-4 text-3xl font-bold text-foreground">Iskustva naših članova u Atrevido Fitnessu</h2>
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
                Pogledajte više recenzija
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
              <h2 className="text-2xl font-bold text-foreground">Posjetite nas danas</h2>
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
                <h3 className="mb-2 font-semibold text-foreground">Radno vrijeme</h3>
                <p className="text-muted-foreground">Ponedjeljak, Srijeda i Petak: <br /> 07:00 – 09:00 <br /> 16:30 – 20:15</p> <br />
                <p className="text-muted-foreground">Utorak i Četvrtak: <br /> 08:00 – 09:00 <br /> 17:00 – 19:00</p> <br />
                <p className="text-muted-foreground">Subota i Nedjelja: <strong>Zatvoreno</strong></p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-[#C4105C] px-4 py-16 lg:py-24">
        <div className="container mx-auto max-w-3xl text-center">
          <h2 className="mb-4 text-3xl font-bold text-white">Spremni za svoju transformaciju?</h2>
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