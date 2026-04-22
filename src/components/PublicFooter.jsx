import React from 'react'
import { Link } from 'react-router-dom'
import { Dumbbell, MapPin, Phone, Mail, Instagram, Linkedin } from 'lucide-react'
import logo from '../assets/logo2.png'
 
export default function PublicFooter() {
  return (
    <footer className="border-t border-border bg-sidebar text-sidebar-foreground">
      <div className="container mx-auto px-4 py-12">
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
 
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg ">
                <img src={logo} alt="Atrevido Fitness Logo" className="h-9 w-auto"/>
              </div>
              <div>
                <span className="text-lg font-bold">Atrevido</span>
                <span className="ml-1 text-sm text-sidebar-foreground/70">Fitness</span>
              </div>
            </div>
            <p className="mt-4 text-sm text-sidebar-foreground/70">
              Grupni i individualni programi za žene koje jačaju snagu, zdravlje i samopouzdanje.
            </p>
          </div>
 
          {/* Quick Links */}
          <div>
            <h3 className="mb-4 font-semibold">Brzi Linkovi</h3>
            <ul className="space-y-2 text-sm text-sidebar-foreground/70">
              <li><Link to="/about"    className="hover:text-primary transition-colors">O Nama</Link></li>
              <li><Link to="/programs" className="hover:text-primary transition-colors">Programi</Link></li>
              <li><Link to="/blog"     className="hover:text-primary transition-colors">Blog</Link></li>
              <li><Link to="/contact"  className="hover:text-primary transition-colors">Kontakt</Link></li>
            </ul>
          </div>
 
          {/* Contact */}
          <div>
            <h3 className="mb-4 font-semibold">Kontakt</h3>
            <ul className="space-y-3 text-sm text-sidebar-foreground/70">
              <li className="flex items-center gap-2">
                <MapPin size={16} />
                <span>Azize Šaćirbegović 80c, Sarajevo 71000</span>
              </li>
              <li className="flex items-center gap-2">
                <Phone size={16} />
                <span>061 618 259</span>
              </li>
              <li className="flex items-center gap-2">
                <Mail size={16} />
                <span>dika181001@gmail.com</span>
              </li>
            </ul>
          </div>
 
          {/* Hours & Social */}
          <div>
            <h3 className="mb-4 font-semibold">Radno Vrijeme</h3>
            <ul className="space-y-1 text-sm text-sidebar-foreground/70">
              <li>Ponedjeljak, Srijeda i Petak: <br /> 07:00 – 09:00 <br /> 16:30 – 20:15</li> <br />
              <li>Utorak i Četvrtak: <br /> 08:00 – 09:00 <br /> 17:00 – 19:00</li> <br />
              <li>Subota i Nedjelja: <strong>Zatvoreno</strong></li> <br />
            </ul>
            <div className="mt-4 flex gap-3 ">
              <a href="https://www.instagram.com/atrevido.fitness/" 
                 target="_blank"
                 rel="noopener noreferrer"
                 className="text-sidebar-foreground/70 hover:text-primary transition-colors" aria-label="Instagram">
                <Instagram size={20} />
              </a>
              <a href="https://ba.linkedin.com/in/dika-hod%C5%BEi%C4%87-66b25a2b0" 
                 target="_blank"
                 rel="noopener noreferrer"
                 className="text-sidebar-foreground/70 hover:text-primary transition-colors" aria-label="Linkedin">
                <Linkedin size={20} />
              </a>
            </div>
          </div>
        </div>
 
        <div className="mt-8 border-t border-sidebar-border pt-8 text-center text-sm text-sidebar-foreground/50">
          <p>&copy; {new Date().getFullYear()} Atrevido Fitness. Sva prava zadržana.</p>
        </div>
      </div>
    </footer>
  )
}