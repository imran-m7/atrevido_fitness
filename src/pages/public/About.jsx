import React from 'react'
import { Award, GraduationCap, Heart, Users, Calendar, Star } from 'lucide-react'
import trenerica from '../../assets/trenerica_dika.jpg'
 
const certifications = [
  'NASM Certified Personal Trainer',
  'ACE Group Fitness Instructor',
  'Precision Nutrition Level 2',
  'Pre/Postnatal Fitness Specialist',
  'TRX Suspension Training',
  'Functional Movement Specialist',
]
 
const achievements = [
  { icon: Calendar, value: '10+', label: 'Godine Iskustva' },
  { icon: Users,    value: '500+', label: 'Klijenti' },
  { icon: Star,     value: '5.0',  label: 'Prosječna Ocjena' },
  { icon: Award,    value: '15+',  label: 'Certifikati' },
]
 
const expertise = [
  { icon: Heart,  title: "Trening za žene i zdrav način života",          description: "Specijalizovani grupni i individualni programi za žene, usmjereni na pravilno kretanje, dugoročno zdravlje i izgradnju pozitivnog odnosa prema tijelu." },
  { icon: Users,  title: 'Inkluzivna fizička aktivnost',                  description: 'Rad s osobama s poteškoćama kroz prilagođene programe vježbanja s ciljem poboljšanja motoričkih sposobnosti, funkcionalnosti i kvaliteta života.' },
  { icon: Star,  title: 'Rad s djecom i mladima',                         description: 'Iskustvo u vođenju treninga i sportskih aktivnosti za mlađe uzraste te doprinos razvoju zdravih navika od ranog doba.' },
  { icon: Award,   title: 'Organizacija sportskih programa i izazova',    description: 'Dizajn i realizacija mjesečnih fitness izazova, praćenje napretka klijentica te promocija zdravih navika kroz motivaciju, zajedništvo i nagrađivanje.' },
]
 
export default function About() {
  return (
    <div className="min-h-screen bg-background">
 
      {/* Hero */}
      <section className="bg-linear-to-br from-primary/10 to-accent/10 px-4 py-16 lg:py-24">
        <div className="container mx-auto max-w-4xl text-center">
          <span className="inline-block mb-4 rounded-full bg-secondary px-4 py-1.5 text-sm font-medium text-secondary-foreground">
            O Nama
          </span>
          <h1 className="mb-4 text-4xl font-bold text-foreground lg:text-5xl">Upoznajte Trenericu</h1>
          <p className="text-lg text-muted-foreground">
            Kroz svoj rad nastoji pomoći ženama da razviju snagu, stabilnost i samopouzdanje.
          </p>
        </div>
      </section>
 
      {/* Trainer Profile */}
      <section className="container mx-auto px-4 py-16">
        <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
          {/* Image Placeholder */}
          <div className="relative">
              <img 
                src={trenerica} alt="Dika Hodžić-Afaneh" className="h-110 w-auto object-cover rounded-2xl mx-auto"
              />
          </div>
 
          {/* Bio */}
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
                Osnivačica sam i vlasnica studija Atrevido Women’s Fitness, gdje vodim grupne i individualne treninge 
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
