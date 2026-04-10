"use client"

import { useEffect, useState, useRef } from "react"
import Link from "next/link"
import Image from "next/image"
import dynamic from "next/dynamic"
import { motion, Variants } from "framer-motion"
import { ArrowRight, Play, Sparkles, Zap, Cpu, Code, Globe, Ticket, MessageSquare, TrendingUp } from "lucide-react"
import heroBg from "@/app/assets/hero-bg.jpg"
import { Button } from "@/components/ui/button"
import { ParticlesBackground } from "@/components/public/particles-background"
import Head from "next/head"

// Dynamically import 3D scene to avoid SSR issues
const Hero3DScene = dynamic(() => import("./hero-3d-scene").then((m) => ({ default: m.Hero3DScene })), {
  ssr: false,
  loading: () => <div className="w-full h-full bg-gradient-to-br from-indigo-500/10 to-pink-500/10" />,
})

// Stats data
const stats = [
  { value: 150, suffix: "+", label: "Professional Websites Delivered" },
  { value: 50, suffix: "+", label: "Satisfied Clients Worldwide" },
  { value: 8, suffix: "+", label: "Years of Digital Experience" },
  { value: 99, suffix: "%", label: "Client Satisfaction Rate" },
]

// Animated Counter Component
function AnimatedCounter({ value, suffix }: { value: number; suffix: string }) {
  const [count, setCount] = useState(0)
  const ref = useRef<HTMLSpanElement>(null)
  const [hasAnimated, setHasAnimated] = useState(false)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasAnimated) {
          setHasAnimated(true)
          let start = 0
          const duration = 2000
          const increment = value / (duration / 16)
          const timer = setInterval(() => {
            start += increment
            if (start >= value) {
              setCount(value)
              clearInterval(timer)
            } else {
              setCount(Math.floor(start))
            }
          }, 16)
          return () => clearInterval(timer)
        }
      },
      { threshold: 0.5 }
    )
    if (ref.current) observer.observe(ref.current)
    return () => observer.disconnect()
  }, [value, hasAnimated])

  return (
    <span ref={ref} className="tabular-nums">
      {count}
      {suffix}
    </span>
  )
}

// Floating Icons data with improved positioning and animations
const floatingIcons: {
  Icon: React.ComponentType<{ className?: string }>
  delay: number
  position: string
  label: string
  color: string
}[] = [
  { Icon: Zap, delay: 0, position: "top-20 left-5 md:left-20", label: "Fast", color: "text-yellow-500" },
  { Icon: MessageSquare, delay: 0.3, position: "top-1/4 right-5 md:right-32", label: "Chat", color: "text-blue-500" },
  { Icon: Code, delay: 0.6, position: "bottom-1/3 left-8 md:left-16", label: "Dev", color: "text-purple-500" },
  { Icon: Ticket, delay: 0.9, position: "bottom-20 right-5 md:right-20", label: "Support", color: "text-green-500" },
  { Icon: TrendingUp, delay: 1.2, position: "top-1/2 left-2 md:left-10", label: "Growth", color: "text-emerald-500" },
  { Icon: Globe, delay: 1.5, position: "bottom-10 right-10 md:right-40", label: "Global", color: "text-cyan-500" },
]

// Animation Variants
const fadeInUp: Variants = {
  initial: { opacity: 0, y: 40 },
  animate: { opacity: 1, y: 0 },
}

export function HeroSection() {
  return (
    <>
      {/* SEO Head */}
      <Head>
        <title>AM Enterprises | Top Web Design & Digital Marketing Agency</title>
        <meta
          name="description"
          content="AM Enterprises offers professional web design, SEO, digital marketing, and branding services. Grow your business online with top-rated digital solutions."
        />
        <meta name="robots" content="index, follow" />
        <link rel="canonical" href="https://www.amenterprises.tech/" />

        {/* Open Graph / Facebook */}
        <meta property="og:title" content="AM Enterprises | Web Design, SEO & Digital Marketing" />
        <meta property="og:description" content="Professional web design, SEO, and digital marketing services to boost your business online." />
        <meta property="og:url" content="https://www.amenterprises.tech/" />
        <meta property="og:type" content="website" />
        <meta property="og:image" content="https://www.amenterprises.tech/hero-bg.jpg" />

        {/* Twitter */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="AM Enterprises | Digital Solutions for Businesses" />
        <meta name="twitter:description" content="Grow your business online with expert web design, SEO, and digital marketing services." />
        <meta name="twitter:image" content="https://www.amenterprises.tech/hero-bg.jpg" />

        {/* Structured Data JSON-LD */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Organization",
              "name": "AM Enterprises",
              "url": "https://www.amenterprises.tech/",
              "logo": "https://www.amenterprises.tech/logo.png",
              "sameAs": [
                "https://www.facebook.com/amenterprises",
                "https://www.linkedin.com/company/amenterprises"
              ],
              "contactPoint": [
                {
                  "@type": "ContactPoint",
                  "telephone": "+923173712950",
                  "contactType": "Customer Service",
                  "areaServed": "PK"
                }
              ]
            })
          }}
        />
      </Head>

      <section
        id="home"
        className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20"
      >
        {/* 3D Background Scene */}
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 w-full h-full">
            <Hero3DScene />
          </div>
          <div className="absolute inset-0 bg-gradient-to-b from-background/30 via-background/50 to-background" />
        </div>

        {/* Fallback Background */}
        <div className="absolute inset-0 z-0 pointer-events-none">
          <div className="absolute inset-0 bg-gradient-hero opacity-50 animate-gradient" />
          <Image
            src={heroBg}
            alt="Professional Web Design and Digital Marketing"
            className="w-full h-full object-cover opacity-10"
            fill
          />
          <ParticlesBackground />
        </div>

        {/* Floating Icons */}
        {floatingIcons.map(({ Icon, delay, position, label, color }, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 0.7, scale: 1 }}
            transition={{
              delay,
              duration: 0.8,
              repeat: Infinity,
              repeatType: "reverse",
              repeatDelay: 3,
            }}
            whileHover={{ scale: 1.15, opacity: 1 }}
            className={`absolute ${position} hidden lg:block z-20 group cursor-pointer`}
          >
            <div className="relative">
              <motion.div
                className={`p-4 bg-gradient-to-br from-card/60 to-card/40 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/10 ${color}`}
                animate={{
                  boxShadow: [
                    "0 0 20px rgba(99, 102, 241, 0.1)",
                    "0 0 40px rgba(99, 102, 241, 0.2)",
                    "0 0 20px rgba(99, 102, 241, 0.1)",
                  ],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              >
                <Icon className="w-6 h-6" />
              </motion.div>
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                whileHover={{ opacity: 1, y: -5 }}
                className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 px-2 py-1 bg-foreground text-background text-xs font-semibold rounded-md whitespace-nowrap pointer-events-none"
              >
                {label}
              </motion.div>
            </div>
          </motion.div>
        ))}

        {/* Hero Content */}
        <div className="container mx-auto px-4 lg:px-8 relative z-10">
          <div className="max-w-4xl mx-auto text-center space-y-8">
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, y: -60 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
            >
              <span className="inline-flex items-center gap-2 px-4 py-2 bg-card/80 backdrop-blur-sm rounded-full text-sm font-medium border border-primary/20 shadow-elegant">
                <motion.div
                  animate={{ rotate: [0, 360] }}
                  transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                >
                  <Sparkles className="w-4 h-4 text-accent" />
                </motion.div>
                <span className="gradient-text">Your 360° Digital Partner for Growth</span>
              </span>
            </motion.div>

            {/* Main Heading */}
            <motion.div
              variants={fadeInUp}
              initial="initial"
              animate="animate"
              transition={{ duration: 0.8, delay: 0.2 }}
              className="space-y-4"
            >
              <motion.h1
                className="text-5xl md:text-6xl lg:text-7xl font-bold leading-tight"
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1, delay: 0.3, ease: "easeOut" }}
              >
                Transform Your
                <br />
                <motion.span
                  className="gradient-text inline-block"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.8, delay: 0.6, ease: "backOut" }}
                >
                  Online Business Presence
                </motion.span>
              </motion.h1>
              <motion.p
                className="text-xl md:text-2xl text-muted-foreground max-w-2xl mx-auto"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.8, delay: 0.8 }}
              >
                Boost your website traffic, increase sales, and enhance your brand visibility with our expert web design, SEO, and digital marketing solutions.
              </motion.p>
            </motion.div>

            {/* CTA Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16"
            >
              <Link href="https://www.amenterprises.tech/contact">
                <Button
                  size="lg"
                  className="bg-gradient-to-r from-primary to-accent text-white hover:opacity-90 transition-all glow-primary group px-8"
                >
                  Start Your Project
                  <ArrowRight className="ml-2 size-4 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
              <Link href="https://www.amenterprises.tech/portfolio">
                <Button size="lg" variant="outline" className="group px-8">
                  <Play className="mr-2 size-4 group-hover:scale-110 transition-transform" />
                  View Our Work
                </Button>
              </Link>
            </motion.div>

            {/* Stats */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="grid grid-cols-2 md:grid-cols-4 gap-8"
            >
              {stats.map((stat, index) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5, delay: 0.5 + index * 0.1 }}
                  className="text-center"
                >
                  <div className="text-3xl sm:text-4xl font-bold gradient-text mb-1">
                    <AnimatedCounter value={stat.value} suffix={stat.suffix} />
                  </div>
                  <div className="text-sm text-muted-foreground">{stat.label}</div>
                </motion.div>
              ))}
            </motion.div>
          </div>

          {/* Scroll Indicator */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
            className="absolute bottom-10 left-1/2 -translate-x-1/2 z-10"
          >
            <motion.div
              animate={{ y: [0, 10, 0] }}
              transition={{ repeat: Infinity, duration: 2 }}
              className="w-6 h-10 rounded-full border-2 border-muted-foreground/30 flex justify-center pt-2"
            >
              <motion.div className="w-1.5 h-1.5 rounded-full bg-primary" />
            </motion.div>
          </motion.div>
        </div>
      </section>
    </>
  )
}
