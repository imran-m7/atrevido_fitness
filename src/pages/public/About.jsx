import React, { useState } from 'react'
import { Award, GraduationCap, Heart, Users, Calendar, Star, ChevronLeft, ChevronRight } from 'lucide-react'
import trenerica from '../../assets/Dika2.jpeg'
import trcanje3 from '../../assets/trcanje31.jpeg'

import RFTC2 from '../../assets/RFTC2.jpeg'
import RFTC5 from '../../assets/RFTC5.jpeg'
import slavlje2 from '../../assets/slavlje2.jpeg'
import clanice2 from '../../assets/clanice_vjezbaju_zajedno.jpeg'
import tenk from '../../assets/10k.jpeg'
import grtrening3 from '../../assets/grupni_treninzi2.jpeg'
import planinarenje1 from '../../assets/planinarenje2.jpeg'
import planinarenje2 from '../../assets/planinarenje3.jpeg'
import grtrening4 from '../../assets/grupni_treninzi5.jpeg'
import clanica1 from '../../assets/clanica_vjezba.jpeg'

const galleryImages = [
  { src: RFTC2,        caption: 'Race for the Cure' },
  { src: RFTC5,        caption: 'Race for the Cure' },
  { src: slavlje2,     caption: 'Slavlje' },
  { src: clanice2,     caption: 'Članice Vježbaju Zajedno' },
  { src: tenk,         caption: '10K Maraton' },
  { src: grtrening3,   caption: 'Grupni Treninzi' },
  { src: planinarenje1,caption: 'Planinarenje' },
  { src: planinarenje2,caption: 'Planinarenje' },
  { src: grtrening4,   caption: 'Grupni Treninzi' },
  { src: clanica1,     caption: 'Individualni Trening' },
]

const certifications = [
  'Magistrica kineziološke edukacije',
  'Bachelor sporta i psihološke edukacije',
  'Ekonomski tehničar',
  'Certificirana trenerica za rad s osobama s poteškoćama',
  'Sportska trenerica-Atletski klub Vogošća',
  'Trenerica za djecu predškolskog uzrasta-Richmond Park škola',
  'Instruktorica fitnesa',
  'Organizacija sportskih događaja'
]

const achievements = [
  { icon: Calendar, value: '5+', label: 'Godine Iskustva' },
  { icon: Users,    value: '30+', label: 'Klijenti' },
  { icon: Star,     value: '5.0',  label: 'Prosječna Ocjena' },
  { icon: Award,    value: '4',  label: 'Certifikati i Diplome' },
]

const expertise = [
  { icon: Heart,  title: "Trening za žene i zdrav način života",          description: "Specijalizovani grupni i individualni programi za žene, usmjereni na pravilno kretanje, dugoročno zdravlje i izgradnju pozitivnog odnosa prema tijelu." },
  { icon: Users,  title: 'Inkluzivna fizička aktivnost',                  description: 'Rad s osobama s poteškoćama kroz prilagođene programe vježbanja s ciljem poboljšanja motoričkih sposobnosti, funkcionalnosti i kvaliteta života.' },
  { icon: Star,   title: 'Rad s djecom i mladima',                        description: 'Iskustvo u vođenju treninga i sportskih aktivnosti za mlađe uzraste te doprinos razvoju zdravih navika od ranog doba.' },
  { icon: Award,  title: 'Organizacija sportskih programa i izazova',     description: 'Dizajn i realizacija mjesečnih fitness izazova, praćenje napretka klijentica te promocija zdravih navika kroz motivaciju, zajedništvo i nagrađivanje.' },
]

export default function About() {
  const [current, setCurrent] = useState(0)

  const prev = () => setCurrent((i) => (i === 0 ? galleryImages.length - 1 : i - 1))
  const next = () => setCurrent((i) => (i === galleryImages.length - 1 ? 0 : i + 1))

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
            O Nama
          </span>
          <h1 className="mb-4 text-4xl font-bold text-white lg:text-5xl">Upoznajte Trenericu</h1>
          <p className="text-lg text-white/90 mt-7">
            Kroz znanje, iskustvo i individualan pristup, cilj joj je pomoći ženama da izgrade snagu, samopouzdanje i zdrave životne navike.
            Fokus rada usmjeren je na funkcionalni trening, pravilno kretanje i stvaranje podržavajuće zajednice u kojoj svaka žena može
            napredovati vlastitim tempom.
          </p>
        </div>
      </section>

      {/* Trainer Profile */}
      <section className="container mx-auto px-4 py-16">
        <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
          <div className="relative">
            <img
              src={trenerica} alt="Dika Hodžić-Afaneh" className="h-130 w-auto object-cover rounded-2xl mx-auto"
            />
          </div>
          <div>
            <h2 className="mb-2 text-3xl font-bold text-foreground">Dika Hodžić-Afaneh</h2>
            <p className="mb-6 text-lg text-primary">Vlasnica & Trenerica</p>
            <div className="space-y-4 text-muted-foreground text-justify pr-6">
              <p>
                Ja sam Dika Hodžić-Afaneh, magistrantica Fakulteta sporta i tjelesnog odgoja Univerziteta u Sarajevu,
                s višegodišnjim iskustvom u fitnessu, sportskom treningu i promociji zdravog načina života.
                Kroz svoj rad specijalizirala sam se za planiranje i vođenje funkcionalnih i kondicionih treninga,
                radeći s različitim uzrasnim i rekreativnim grupama.
              </p>
              <p>
                Osnivačica sam i vlasnica studija Atrevido Women's Fitness, gdje vodim grupne i individualne treninge
                za žene, s fokusom na pravilno kretanje, razvoj snage, stabilnosti i dugoročno očuvanje zdravlja.
                Također sam certificirana za rad s osobama s poteškoćama i zalažem se za inkluzivan pristup
                fizičkoj aktivnosti, uz iskustvo rada s djecom, mladima i organizacijom sportskih projekata.
              </p>
              <p>
                U okviru svog centra organizujem mjesečne izazove s ciljem motivacije klijentica da razvijaju zdrave navike,
                unaprijede fizičku spremu i ostanu dosljedne svojim ciljevima. Kroz praćenje napretka i simbolične nagrade
                nastojim potaknuti dugoročne pozitivne promjene i izgradnju snažne, podržavajuće zajednice.
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
            <h2 className="mb-2 text-2xl font-bold text-foreground">Certifikati i Kvalifikacije</h2>
            <p className="text-muted-foreground">Kroz svoj profesionalni angažman nastojim omogućiti inkluzivnu fizičku aktivnost i unaprijediti motoričke sposobnosti, funkcionalnost i kvalitet života kroz prilagođene programe.</p>
          </div>
          <div className="flex flex-wrap justify-center gap-3">
            {certifications.map((cert) => (
              <span key={cert} className="rounded-full bg-secondary px-4 py-2 text-sm font-medium text-secondary-foreground">
                {cert}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* Gallery */}
      <section className="bg-muted/50 px-4 py-16">
        <div className="container mx-auto max-w-4xl">
          <div className="mb-10 text-center">
            <h2 className="mb-3 text-2xl font-bold text-foreground">Aktivnosti Sa Članicama</h2>
            <p className="mx-auto max-w-xl text-muted-foreground">
              Zajedno gradimo više od treninga. Pored redovnih aktivnosti u studiju, organizujemo različite događaje i 
              aktivnosti poput planinarenja, trčanja, učešća na utrkama i zajedničkih druženja. Kroz ovakva iskustva 
              jačamo motivaciju, stvaramo uspomene i gradimo zajednicu podrške i zdravog načina života.
            </p>
          </div>

          {/* Slider — fixed size box */}
          <div className="flex justify-center">
            <div className="relative rounded-2xl border border-border bg-card shadow-sm overflow-hidden w-[640px]">
              <div className="flex items-center justify-center h-[480px] bg-linear-to-br from-primary/10 to-accent/10">
                <img
                  key={current}
                  src={galleryImages[current].src}
                  alt={galleryImages[current].caption}
                  className="max-w-full max-h-full w-auto h-auto object-contain"
                />
              </div>

              {/* Caption */}
              <div className="px-6 py-3 text-center border-t border-border">
                <p className="text-sm font-medium text-muted-foreground">{galleryImages[current].caption}</p>
                <p className="text-xs text-muted-foreground/60 mt-0.5">{current + 1} / {galleryImages.length}</p>
              </div>

              {/* Prev arrow */}
              <button
                onClick={prev}
                className="absolute left-3 top-[45%] -translate-y-1/2 flex h-9 w-9 items-center justify-center rounded-full bg-white/80 border border-border shadow-sm hover:bg-white transition-colors"
                aria-label="Prethodna slika"
              >
                <ChevronLeft size={18} className="text-foreground" />
              </button>

              {/* Next arrow */}
              <button
                onClick={next}
                className="absolute right-3 top-[45%] -translate-y-1/2 flex h-9 w-9 items-center justify-center rounded-full bg-white/80 border border-border shadow-sm hover:bg-white transition-colors"
                aria-label="Sljedeća slika"
              >
                <ChevronRight size={18} className="text-foreground" />
              </button>
            </div>
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

      {/* Expertise */}
      <section className="px-4 py-16">
        <div className="container mx-auto max-w-4xl">
          <div className="mb-12 text-center">
            <h2 className="mb-4 text-2xl font-bold text-foreground">Stručna Područja</h2>
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
