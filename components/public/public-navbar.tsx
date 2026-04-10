"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import { Menu, Moon, Sun } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { cn } from "@/lib/utils"
import logo from "@/app/assets/logo.png"
import Image from "next/image"

const navLinks = [
  { href: "/Home", label: "Home" },
  { href: "/about", label: "About" },
  { href: "/our-services", label: "Services" },
  { href: "/portfolio", label: "Portfolio" },
  { href: "/pricing", label: "Pricing" },
  { href: "/news", label: "Blog" },
  { href: "/contact", label: "Contact" },
  { href: "/faqs", label: "Faqs" },
]

export function PublicNavbar() {
  const pathname = usePathname()
  const [isScrolled, setIsScrolled] = useState(false)
  const [isDark, setIsDark] = useState(true)

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20)
    window.addEventListener("scroll", handleScroll, { passive: true })
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  useEffect(() => {
    const saved = localStorage.getItem("theme")
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches

    if (saved === "light") {
      setIsDark(false)
      document.documentElement.classList.remove("dark")
    } else if (saved === "dark" || (!saved && prefersDark)) {
      setIsDark(true)
      document.documentElement.classList.add("dark")
    } else {
      setIsDark(false)
      document.documentElement.classList.remove("dark")
    }
  }, [])

  const toggleTheme = () => {
    setIsDark((prev) => {
      const next = !prev
      document.documentElement.classList.toggle("dark", next)
      localStorage.setItem("theme", next ? "dark" : "light")
      return next
    })
  }

  const isActive = (href: string) =>
    pathname === href || pathname.startsWith(href + "/")

  return (
    <>
      <motion.header
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ type: "spring", damping: 20, stiffness: 150 }}
        className={cn(
          "fixed inset-x-0 top-0 z-50 transition-all duration-300",
          isScrolled
            ? "bg-background/85 backdrop-blur-lg border-b shadow-sm"
            : "bg-transparent"
        )}
      >
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 lg:h-20 items-center justify-between">

            {/* Logo */}
            <Link href="/" className="flex items-center space-x-3">
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="flex items-center space-x-3"
              >
                <Image
                  src={logo}
                  alt="AM Enterprises Logo"
                  className="h-14 w-14 rounded-full object-cover"
                />
                <div>
                  <h1 className="font-bold text-xl text-foreground">
                    AM Enterprises
                  </h1>
                  <p className="text-xs text-muted-foreground">
                    360° Digital Agency
                  </p>
                </div>
              </motion.div>
            </Link>

            {/* Desktop Nav */}
            <nav className="hidden lg:flex items-center gap-1">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    "relative px-4 py-2 text-sm font-medium transition-colors rounded-md",
                    isActive(link.href)
                      ? "text-primary after:absolute after:inset-x-4 after:bottom-1.5 after:h-0.5 after:bg-primary after:rounded-full"
                      : "text-muted-foreground hover:text-foreground hover:bg-muted/60"
                  )}
                >
                  {link.label}
                </Link>
              ))}
            </nav>

            {/* Right Side */}
            <div className="flex items-center gap-2">

              {/* Theme Toggle */}
              <Button
                variant="ghost"
                size="icon"
                onClick={toggleTheme}
                className="size-9"
              >
                <AnimatePresence mode="wait" initial={false}>
                  {isDark ? (
                    <motion.div
                      key="sun"
                      initial={{ scale: 0.8, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      exit={{ scale: 0.8, opacity: 0 }}
                    >
                      <Sun className="size-5" />
                    </motion.div>
                  ) : (
                    <motion.div
                      key="moon"
                      initial={{ scale: 0.8, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      exit={{ scale: 0.8, opacity: 0 }}
                    >
                      <Moon className="size-5" />
                    </motion.div>
                  )}
                </AnimatePresence>
              </Button>

              {/* CTA */}
              <Button asChild className="hidden sm:flex">
                <Link href="/auth-login">Get Started</Link>
              </Button>

              {/* Mobile Menu */}
              <Sheet>
                <SheetTrigger asChild className="lg:hidden">
                  <Button variant="ghost" size="icon">
                    <Menu className="size-5" />
                  </Button>
                </SheetTrigger>

                <SheetContent side="right" className="w-[85%] sm:w-[400px]">
                  <div className="flex flex-col h-full">

                    <div className="flex-1 py-6 space-y-2">
                      {navLinks.map((link) => (
                        <Link
                          key={link.href}
                          href={link.href}
                          className={cn(
                            "block px-4 py-3 rounded-lg text-base font-medium",
                            isActive(link.href)
                              ? "bg-primary/10 text-primary"
                              : "hover:bg-muted"
                          )}
                        >
                          {link.label}
                        </Link>
                      ))}
                    </div>

                    <div className="border-t p-4">
                      <Button asChild className="w-full">
                        <Link href="/auth-login">Get Started</Link>
                      </Button>
                    </div>

                  </div>
                </SheetContent>
              </Sheet>

            </div>
          </div>
        </div>
      </motion.header>

      <div className="h-16 lg:h-20" />
    </>
  )
}