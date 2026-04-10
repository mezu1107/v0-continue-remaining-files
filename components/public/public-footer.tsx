"use client"

import Link from "next/link"
import { motion } from "framer-motion"
import { Mail, Phone, MapPin, Github, Linkedin, Twitter, Instagram } from "lucide-react"

const footerLinks = {
  company: [
    { label: "About Us", href: "/about" },
    { label: "Services", href: "/our-services" },
    { label: "Portfolio", href: "/portfolio" },
    { label: "Blog", href: "/news" },
    { label: "Careers", href: "/about#careers" },
  ],
  services: [
    { label: "Web Development", href: "/our-services#web" },
    { label: "Mobile Apps", href: "/our-services#mobile" },
    { label: "UI/UX Design", href: "/our-services#design" },
    { label: "Cloud Solutions", href: "/our-services#cloud" },
    { label: "AI & ML", href: "/our-services#ai" },
  ],
  support: [
    { label: "Contact Us", href: "/contact" },
    { label: "FAQ", href: "/faq" },
    { label: "Privacy Policy", href: "/privacy" },
    { label: "Terms of Service", href: "/terms" },
    
  ],
}

const socialLinks = [
  { icon: Github, href: "https://github.com/amenterprises", label: "GitHub" },
  { icon: Linkedin, href: "https://linkedin.com/company/amenterprises", label: "LinkedIn" },
  { icon: Twitter, href: "https://twitter.com/amenterprises", label: "Twitter" },
  { icon: Instagram, href: "https://instagram.com/amenterprises", label: "Instagram" },
]

export function PublicFooter() {
  return (
    <footer className="relative bg-muted/30 border-t border-border">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12">
          {/* Brand Section */}
          <div className="lg:col-span-2">
            <Link href="/" className="flex items-center gap-2 mb-6">
              <div className="size-10 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center">
                <span className="text-lg font-bold text-white">AM</span>
              </div>
              <span className="text-xl font-bold">
                <span className="gradient-text">AM</span>{" "}
                <span className="text-foreground">Enterprises</span>
              </span>
            </Link>
            <p className="text-muted-foreground mb-6 max-w-sm">
              Transforming ideas into powerful digital solutions. We build innovative software that drives business growth worldwide.
            </p>
            <div className="space-y-3">
              <a href="mailto:contact@amenterprises.tech" className="flex items-center gap-3 text-muted-foreground hover:text-foreground transition-colors">
                <Mail className="size-4" />
                <span>contact@amenterprises.tech</span>
              </a>
              <a href="tel:+923173712950" className="flex items-center gap-3 text-muted-foreground hover:text-foreground transition-colors">
                <Phone className="size-4" />
                <span>+92 317 371 2950</span>
              </a>
              <div className="flex items-center gap-3 text-muted-foreground">
                <MapPin className="size-4" />
                <span>Islamabad, Pakistan & London, UK</span>
              </div>
            </div>
          </div>

          {/* Company Links */}
          <div>
            <h4 className="font-semibold text-foreground mb-4">Company</h4>
            <ul className="space-y-3">
              {footerLinks.company.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Services Links */}
          <div>
            <h4 className="font-semibold text-foreground mb-4">Services</h4>
            <ul className="space-y-3">
              {footerLinks.services.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support Links */}
          <div>
            <h4 className="font-semibold text-foreground mb-4">Support</h4>
            <ul className="space-y-3">
              {footerLinks.support.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-border flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} AM Enterprises. All rights reserved.
          </p>
          <div className="flex items-center gap-4">
            {socialLinks.map((social) => (
              <motion.a
                key={social.label}
                href={social.href}
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                className="size-10 rounded-full bg-muted flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted/80 transition-colors"
                aria-label={social.label}
              >
                <social.icon className="size-5" />
              </motion.a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  )
}
