import React from 'react'
import { Link } from 'react-router-dom'
import { Dumbbell, MapPin, Phone, Mail, Instagram, Facebook } from 'lucide-react'
 
export default function PublicFooter() {
  return (
    <footer className="border-t border-border bg-sidebar text-sidebar-foreground">
      <div className="container mx-auto px-4 py-12">
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
 
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary">
                <Dumbbell size={20} className="text-primary-foreground" />
              </div>
              <div>
                <span className="text-lg font-bold">Atrevido</span>
                <span className="ml-1 text-sm text-sidebar-foreground/70">Fitness</span>
              </div>
            </div>
            <p className="mt-4 text-sm text-sidebar-foreground/70">
              Empowering women to achieve their fitness goals through personalized training,
              nutrition guidance, and a supportive community.
            </p>
          </div>
 
          {/* Quick Links */}
          <div>
            <h3 className="mb-4 font-semibold">Quick Links</h3>
            <ul className="space-y-2 text-sm text-sidebar-foreground/70">
              <li><Link to="/about"    className="hover:text-primary transition-colors">About Us</Link></li>
              <li><Link to="/programs" className="hover:text-primary transition-colors">Training Programs</Link></li>
              <li><Link to="/blog"     className="hover:text-primary transition-colors">Blog</Link></li>
              <li><Link to="/contact"  className="hover:text-primary transition-colors">Contact</Link></li>
            </ul>
          </div>
 
          {/* Contact */}
          <div>
            <h3 className="mb-4 font-semibold">Contact</h3>
            <ul className="space-y-3 text-sm text-sidebar-foreground/70">
              <li className="flex items-center gap-2">
                <MapPin size={16} />
                <span>123 Fitness Street, City</span>
              </li>
              <li className="flex items-center gap-2">
                <Phone size={16} />
                <span>+1 (555) 123-4567</span>
              </li>
              <li className="flex items-center gap-2">
                <Mail size={16} />
                <span>info@atrevidofitness.com</span>
              </li>
            </ul>
          </div>
 
          {/* Hours & Social */}
          <div>
            <h3 className="mb-4 font-semibold">Hours</h3>
            <ul className="space-y-1 text-sm text-sidebar-foreground/70">
              <li>Mon – Fri: 6:00 AM – 9:00 PM</li>
              <li>Saturday: 8:00 AM – 6:00 PM</li>
              <li>Sunday: 9:00 AM – 4:00 PM</li>
            </ul>
            <div className="mt-4 flex gap-3">
              <a href="#" className="text-sidebar-foreground/70 hover:text-primary transition-colors" aria-label="Instagram">
                <Instagram size={20} />
              </a>
              <a href="#" className="text-sidebar-foreground/70 hover:text-primary transition-colors" aria-label="Facebook">
                <Facebook size={20} />
              </a>
            </div>
          </div>
        </div>
 
        <div className="mt-8 border-t border-sidebar-border pt-8 text-center text-sm text-sidebar-foreground/50">
          <p>&copy; {new Date().getFullYear()} Atrevido Fitness. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}