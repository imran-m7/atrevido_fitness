import React from 'react'
import { MapPin, Phone, Mail, Clock } from 'lucide-react'

import trcanje3 from '../../assets/trcanje31.jpeg'
 
export default function Contact() {
 
  return (
    <div className="min-h-screen bg-background">
 
      {/* Hero */}
      <section
        className="relative px-4 py-16 lg:py-24 overflow-hidden bg-cover bg-no-repeat min-h-[400px]"
        style={{
          backgroundImage: `url(${trcanje3})`,
          backgroundPosition: 'center 20%',
        }}
      >
        <div className="absolute inset-0 bg-black/60" />

        <div className="relative z-10 container mx-auto max-w-4xl text-center">
          <span className="inline-block mb-4 rounded-full bg-white/10 px-4 py-1.5 text-2xl font-medium text-white">
            Kontaktirajte nas
          </span>

          <h1 className="mb-4 text-4xl font-bold text-white lg:text-5xl">
            Povežite se sa nama
          </h1>

          <p className="text-lg text-white/90 mt-7">
            Imate pitanja o našim programima? Želite zakazati obilazak ili saznati više o treninzima i članstvima?
            Rado ćemo vas saslušati, odgovoriti na vaša pitanja i pomoći vam da pronađete program koji najbolje odgovara
            vašim ciljevima i potrebama.
          </p>
        </div>
      </section>
 
      {/* Content */}
      <section className="container mx-auto px-4 py-16">
        <div className="grid gap-8 lg:grid-cols-2">
 
          {/* Info Cards */}
          <div className="space-y-4">
            {[
              { Icon: MapPin, title: 'Lokacija', lines: ['Azize Šaćirbegović 80c, Sarajevo 71000'], },
              { Icon: Phone,  title: 'Telefon',    lines: ['061 618 259', 'Dostupni tokom radnog vremena'] },
              { Icon: Mail,   title: 'Email',    lines: ['dika181001@gmail.com', 'Odgovaramo u roku od 24 sata'] },
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
                  <h3 className="mb-2 font-semibold text-foreground">Radno vrijeme</h3>
                  <div className="space-y-1 text-sm text-muted-foreground">
                    <p className="text-muted-foreground">Ponedjeljak, Srijeda i Petak: <br /> 07:00 – 09:00 <br /> 16:30 – 20:15</p> <br />
                    <p className="text-muted-foreground">Utorak i Četvrtak: <br /> 08:00 – 09:00 <br /> 17:00 – 19:00</p> <br />
                    <p className="text-muted-foreground">Subota i Nedjelja: <strong>Zatvoreno</strong></p>
              
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Map */}
          <a
            href="https://www.google.com/maps/place/ATREVIDO+WOMEN%E2%80%99S+FITNESS/@43.848049,18.3760622,17z"
            target="_blank"
            rel="noopener noreferrer"
            className="block rounded-lg overflow-hidden hover:opacity-90 transition-opacity"
          >
            <div className="w-full h-full">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2877.1234567890!2d18.3762553!3d43.8483198!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x4758c914457fefed%3A0x4cd024b2ce707495!2sATREVIDO%20WOMEN%27S%20FITNESS!5e0!3m2!1sen!2sba!4v1713607200000"
                className="w-full h-full border-0 pointer-events-none"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
          </a>
        </div>
      </section>
 
    </div>
  )
}