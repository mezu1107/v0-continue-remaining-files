"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import { useRouter } from 'next/navigation';
import { motion, useInView, AnimatePresence, useScroll, useTransform, useMotionValue, useSpring } from "framer-motion";
import {
  Globe, Code, Megaphone, Palette, Zap, Users, Star, ChevronDown, ArrowRight,
  Menu, X, MapPin, Sparkles, TrendingUp, BarChart3, Target, Shield, Clock,
  Headphones, CheckCircle2, Play, ArrowUpRight, Rocket, Heart, Award,
  Layers, Monitor, Smartphone, Database, Cloud, Lock, Send, Phone,
  Mail, Linkedin, Twitter, Github, Instagram, ChevronRight, MousePointer,
  Eye, ThumbsUp, MessageCircle, Briefcase
} from "lucide-react";
import { Button } from "@/components/ui/button";

/* ─── Animation Variants ─── */
const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" as const } },
};
const fadeLeft = {
  hidden: { opacity: 0, x: -40 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.6, ease: "easeOut" as const } },
};
const fadeRight = {
  hidden: { opacity: 0, x: 40 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.6, ease: "easeOut" as const } },
};
const scaleIn = {
  hidden: { opacity: 0, scale: 0.85 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.5, ease: "easeOut" as const } },
};
const stagger = { visible: { transition: { staggerChildren: 0.1 } } };

/* ─── Animated Section Wrapper ─── */
function Section({ children, className = "", id }: { children: React.ReactNode; className?: string; id?: string }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  return (
    <motion.section ref={ref} id={id} initial="hidden" animate={inView ? "visible" : "hidden"} variants={stagger} className={className}>
      {children}
    </motion.section>
  );
}

/* ─── Counter Hook ─── */
function useCounter(target: number, inView: boolean) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    if (!inView) return;
    let start = 0;
    const step = Math.ceil(target / 120);
    const timer = setInterval(() => {
      start += step;
      if (start >= target) { setCount(target); clearInterval(timer); }
      else setCount(start);
    }, 16);
    return () => clearInterval(timer);
  }, [inView, target]);
  return count;
}

/* ─── Stat Card ─── */
function StatCard({ label, value, suffix, icon: Icon }: { label: string; value: number; suffix: string; icon: any }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true });
  const count = useCounter(value, inView);
  return (
    <motion.div ref={ref} variants={fadeUp} className="text-center p-6 rounded-2xl bg-card/50 border border-border hover:shadow-elegant transition-all duration-300 group">
      <div className="w-12 h-12 mx-auto mb-4 rounded-xl gradient-bg flex items-center justify-center group-hover:scale-110 transition-transform">
        <Icon size={22} className="text-primary-foreground" />
      </div>
      <p className="text-4xl md:text-5xl font-heading font-bold gradient-text">{count}{suffix}</p>
      <p className="mt-2 text-muted-foreground font-medium text-sm">{label}</p>
    </motion.div>
  );
}

/* ─── FAQ Item ─── */
function FaqItem({ q, a, index }: { q: string; a: string; index: number }) {
  const [open, setOpen] = useState(false);
  return (
    <motion.div variants={fadeUp} className="border border-border rounded-xl overflow-hidden bg-card/50 hover:border-primary/20 transition-colors">
      <button onClick={() => setOpen(!open)} className="w-full flex items-center justify-between p-5 text-left font-heading font-semibold text-foreground hover:bg-muted/30 transition-colors">
        <span className="flex items-center gap-3">
          <span className="text-xs font-mono gradient-text">0{index + 1}</span>
          {q}
        </span>
        <ChevronDown className={`shrink-0 ml-2 transition-transform duration-300 text-muted-foreground ${open ? "rotate-180" : ""}`} size={18} />
      </button>
      <AnimatePresence>
        {open && (
          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.3 }} className="overflow-hidden">
            <p className="px-5 pb-5 text-muted-foreground leading-relaxed">{a}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

/* ─── 3D Tilt Card ─── */
function TiltCard({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const rotateX = useSpring(useTransform(y, [-0.5, 0.5], [8, -8]), { stiffness: 200, damping: 20 });
  const rotateY = useSpring(useTransform(x, [-0.5, 0.5], [-8, 8]), { stiffness: 200, damping: 20 });

  const handleMouse = (e: React.MouseEvent) => {
    const rect = ref.current?.getBoundingClientRect();
    if (!rect) return;
    x.set((e.clientX - rect.left) / rect.width - 0.5);
    y.set((e.clientY - rect.top) / rect.height - 0.5);
  };
  const handleLeave = () => { x.set(0); y.set(0); };

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouse}
      onMouseLeave={handleLeave}
      style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

/* ─── Hero 3D Floating Elements ─── */
function Hero3DElements() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {/* Gradient orbs */}
      <motion.div className="absolute w-[500px] h-[500px] rounded-full opacity-20 blur-3xl" style={{ background: "linear-gradient(135deg, hsl(225 85% 50%), hsl(270 70% 58%))", left: "10%", top: "10%" }}
        animate={{ y: [0, -40, 0], x: [0, 20, 0], scale: [1, 1.1, 1] }} transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }} />
      <motion.div className="absolute w-[400px] h-[400px] rounded-full opacity-15 blur-3xl" style={{ background: "linear-gradient(135deg, hsl(168 70% 45%), hsl(225 85% 50%))", right: "5%", top: "20%" }}
        animate={{ y: [0, 30, 0], x: [0, -25, 0], scale: [1, 1.15, 1] }} transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 1 }} />
      <motion.div className="absolute w-[300px] h-[300px] rounded-full opacity-10 blur-3xl" style={{ background: "linear-gradient(135deg, hsl(330 80% 60%), hsl(270 70% 58%))", left: "50%", bottom: "10%" }}
        animate={{ y: [0, -20, 0], scale: [1, 1.2, 1] }} transition={{ duration: 7, repeat: Infinity, ease: "easeInOut", delay: 2 }} />

      {/* Floating geometric shapes */}
      <motion.div className="absolute w-16 h-16 border-2 border-primary/20 rounded-lg" style={{ left: "15%", top: "30%", transformStyle: "preserve-3d" }}
        animate={{ y: [0, -25, 0], rotate: [0, 90, 180], rotateX: [0, 45, 0] }} transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }} />
      <motion.div className="absolute w-10 h-10 gradient-bg rounded-full opacity-30" style={{ right: "20%", top: "25%" }}
        animate={{ y: [0, -30, 0], x: [0, 15, 0] }} transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }} />
      <motion.div className="absolute w-20 h-20 border border-accent/20 rounded-full" style={{ right: "30%", bottom: "25%" }}
        animate={{ y: [0, 20, 0], rotate: [0, -180, -360] }} transition={{ duration: 15, repeat: Infinity, ease: "linear" }} />
      <motion.div className="absolute w-6 h-6 gradient-bg-accent rounded-sm opacity-40" style={{ left: "25%", bottom: "30%" }}
        animate={{ y: [0, -20, 0], rotate: [0, 45, 0] }} transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }} />

      {/* Grid lines */}
      <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: "linear-gradient(hsl(225 85% 50%) 1px, transparent 1px), linear-gradient(90deg, hsl(225 85% 50%) 1px, transparent 1px)", backgroundSize: "60px 60px" }} />
    </div>
  );
}

/* ─── Marquee / Logo Ticker (Feature: Trust badges) ─── */
function TrustMarquee() {
  const logos = ["Google Partner", "Meta Business", "AWS Certified", "Shopify Expert", "HubSpot", "Stripe Partner", "Vercel", "Cloudflare"];
  return (
    <div className="relative overflow-hidden py-6 border-y border-border bg-muted/30">
      <div className="flex animate-marquee">
        {[...logos, ...logos].map((name, i) => (
          <div key={i} className="flex items-center gap-2 mx-8 text-muted-foreground/50 font-heading font-semibold text-sm whitespace-nowrap">
            <Shield size={16} />
            {name}
          </div>
        ))}
      </div>
    </div>
  );
}

/* ─── Process / How It Works ─── */
const processSteps = [
  { icon: MessageCircle, title: "Discovery Call", desc: "We listen to your vision, goals, and challenges to understand your needs." },
  { icon: Layers, title: "Strategy & Planning", desc: "Our team crafts a detailed roadmap with timelines and milestones." },
  { icon: Code, title: "Design & Develop", desc: "Pixel-perfect designs come to life with clean, scalable code." },
  { icon: Rocket, title: "Launch & Scale", desc: "We deploy, monitor, and optimize for continuous growth." },
];

/* ─── Technologies ─── */
const techStack = [
  { name: "React", icon: Monitor }, { name: "Next.js", icon: Globe }, { name: "Node.js", icon: Database },
  { name: "TypeScript", icon: Code }, { name: "Python", icon: Layers }, { name: "PostgreSQL", icon: Database },
  { name: "AWS", icon: Cloud }, { name: "Docker", icon: Layers }, { name: "Figma", icon: Palette },
  { name: "Tailwind", icon: Palette }, { name: "GraphQL", icon: Code }, { name: "Redis", icon: Zap },
];

/* ─── Portfolio / Case Studies ─── */
const caseStudies = [
  { title: "E-Commerce Platform", category: "SaaS Development", metric: "+240% Revenue", desc: "Built a full-stack marketplace handling 100K+ daily users with real-time inventory.", color: "from-blue-500/20 to-cyan-500/20" },
  { title: "Healthcare Dashboard", category: "UI/UX Design", metric: "50ms Load Time", desc: "Redesigned patient management system used by 200+ hospitals across 5 countries.", color: "from-purple-500/20 to-pink-500/20" },
  { title: "FinTech Lead Engine", category: "Lead Generation", metric: "+580% Leads", desc: "Automated lead capture pipeline generating 15K qualified leads per month.", color: "from-emerald-500/20 to-teal-500/20" },
];

/* ─── Data ─── */
const stats = [
  { label: "Projects Delivered", value: 350, suffix: "+", icon: Briefcase },
  { label: "Countries Served", value: 28, suffix: "+", icon: Globe },
  { label: "Years Experience", value: 7, suffix: "+", icon: Award },
  { label: "Leads Generated", value: 50, suffix: "K+", icon: TrendingUp },
  { label: "Client Retention", value: 97, suffix: "%", icon: Heart },
  { label: "Team Members", value: 45, suffix: "+", icon: Users },
];

const services = [
  { icon: Globe, title: "Website Development", desc: "Custom, responsive websites built with modern frameworks for blazing-fast performance and top SEO rankings.", features: ["React/Next.js", "Responsive Design", "CMS Integration"] },
  { icon: Code, title: "Custom SaaS", desc: "End-to-end SaaS product development — from MVP to enterprise scale with microservices architecture.", features: ["API Development", "Multi-tenant", "Cloud Native"] },
  { icon: Target, title: "Lead Generation", desc: "Data-driven strategies to fill your pipeline with qualified, high-converting leads on autopilot.", features: ["Landing Pages", "Email Funnels", "CRM Setup"] },
  { icon: Megaphone, title: "Digital Marketing", desc: "SEO, PPC, social media campaigns that deliver measurable ROI and brand awareness.", features: ["SEO/SEM", "Social Media", "Content Strategy"] },
  { icon: Palette, title: "UI/UX Design", desc: "Human-centered design that delights users, reduces friction, and drives conversions.", features: ["Wireframing", "Prototyping", "User Testing"] },
  { icon: Zap, title: "Performance Optimization", desc: "Speed audits and optimization to achieve perfect Core Web Vitals and lightning-fast loads.", features: ["Core Web Vitals", "CDN Setup", "Code Splitting"] },
  { icon: Smartphone, title: "Mobile App Development", desc: "Native and cross-platform mobile apps that deliver seamless experiences on every device.", features: ["React Native", "iOS/Android", "App Store"] },
  { icon: Lock, title: "Cybersecurity Solutions", desc: "Protect your digital assets with enterprise-grade security audits and implementations.", features: ["Penetration Testing", "SSL/TLS", "Compliance"] },
];

const pricing = [
  { tier: "Starter", price: "$499", desc: "Perfect for small businesses & startups", features: ["5-page responsive website", "Basic SEO setup", "Contact form integration", "Mobile optimization", "1 month support", "SSL certificate"], popular: false },
  { tier: "Professional", price: "$1,499", desc: "For growing businesses ready to scale", features: ["15-page custom website", "Advanced SEO & analytics", "CMS integration", "Lead generation setup", "3 months support", "Performance optimization", "Custom animations", "A/B testing setup"], popular: true },
  { tier: "Enterprise", price: "Custom", desc: "For large-scale operations & agencies", features: ["Unlimited pages & features", "Custom SaaS development", "Full marketing suite", "Dedicated project manager", "12 months priority support", "24/7 monitoring", "Custom integrations", "White-label solutions"], popular: false },
];

const testimonials = [
  { name: "Sarah Mitchell", role: "CEO, TechFlow", text: "AM Enterprises transformed our online presence. Our leads increased by 340% in just 3 months. The team's dedication is unmatched.", stars: 5, avatar: "SM" },
  { name: "Ahmed Khan", role: "Founder, EduSpark", text: "The SaaS platform they built handles 50K+ users flawlessly. Exceptional quality, communication, and post-launch support.", stars: 5, avatar: "AK" },
  { name: "Lisa Chen", role: "CMO, GreenVista", text: "Their digital marketing strategy cut our cost per acquisition in half. Truly data-driven results with full transparency.", stars: 5, avatar: "LC" },
  { name: "James O'Brien", role: "Director, BuildRight", text: "From design to deployment, the process was seamless. They delivered ahead of schedule and under budget. Best agency ever.", stars: 5, avatar: "JO" },
  { name: "Maria Garcia", role: "VP, NovaTech", text: "The mobile app they built for us has a 4.9 star rating. User engagement increased 200% after launch. Incredible work.", stars: 5, avatar: "MG" },
  { name: "David Park", role: "CTO, CloudScale", text: "Their cybersecurity audit found critical vulnerabilities competitors missed. Professional, thorough, and genuinely caring.", stars: 5, avatar: "DP" },
];

const faqs = [
  { q: "What technologies do you use?", a: "We use modern stacks including React, Next.js, Node.js, Python, PostgreSQL, and cloud platforms like AWS and Vercel. We pick the best tech for each project's unique needs." },
  { q: "How long does a typical project take?", a: "Timelines vary by scope. A standard website takes 2–4 weeks, while custom SaaS projects range from 2–6 months. We provide detailed timelines during our free discovery call." },
  { q: "Do you offer ongoing support?", a: "Yes! All packages include post-launch support. We also offer monthly retainer plans for continuous improvements, monitoring, performance optimization, and scaling." },
  { q: "Can you work with international clients?", a: "Absolutely. We serve clients in 28+ countries with seamless remote collaboration, regular video updates, and timezone-flexible communication via Slack, Teams, or your preferred tool." },
  { q: "What's your pricing model?", a: "We offer fixed-price packages for standard services and custom quotes for larger projects. No hidden fees — everything is transparent from day one. We also offer milestone-based payments." },
  { q: "Do you sign NDAs?", a: "Yes, we take confidentiality seriously. We sign NDAs before any discovery call and all team members are bound by strict confidentiality agreements." },
  { q: "What industries do you specialize in?", a: "We have deep experience in FinTech, HealthTech, EdTech, E-commerce, Real Estate, and SaaS. Our diverse portfolio means we bring cross-industry insights to every project." },
];

/* ─── Scroll-to-top button ─── */
function ScrollToTop() {
  const [show, setShow] = useState(false);
  useEffect(() => {
    const onScroll = () => setShow(window.scrollY > 500);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  return (
    <AnimatePresence>
      {show && (
        <motion.button
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.8 }}
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          className="fixed bottom-8 right-8 z-50 w-12 h-12 rounded-full gradient-bg text-primary-foreground shadow-lg hover:shadow-xl hover:scale-110 transition-all flex items-center justify-center"
        >
          <ChevronDown className="rotate-180" size={20} />
        </motion.button>
      )}
    </AnimatePresence>
  );
}
/* ═══════════════════════════════════════════════════
   MAIN PAGE
   ═══════════════════════════════════════════════════ */
export default function Index() {
  const router = useRouter();
  const [mobileMenu, setMobileMenu] = useState(false);
  const [loading, setLoading] = useState(true);
  const [scrolled, setScrolled] = useState(false);
  const [activeTab, setActiveTab] = useState(0);
  useEffect(() => {
    const loggedIn = localStorage.getItem("am_logged_in");
    if (loggedIn === "true") { router.push("/Home"); return; }
    const t = setTimeout(() => setLoading(false), 800);
    return () => clearTimeout(t);
  }, [router]);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const goStart = () => router.push("/auth-login");

  // Loading Screen
  if (loading) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-background z-50">
        <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ duration: 0.5 }} className="text-center">
          <motion.div className="w-16 h-16 gradient-bg rounded-2xl mx-auto mb-4" animate={{ rotateY: [0, 360] }} transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }} style={{ transformStyle: "preserve-3d" }}>
            <div className="w-full h-full flex items-center justify-center">
              <Sparkles size={28} className="text-primary-foreground" />
            </div>
          </motion.div>
          <p className="font-heading font-bold text-2xl gradient-text">AM Enterprises</p>
          <div className="mt-4 w-48 h-1 bg-muted rounded-full overflow-hidden mx-auto">
            <motion.div className="h-full gradient-bg rounded-full" initial={{ width: "0%" }} animate={{ width: "100%" }} transition={{ duration: 0.8, ease: "easeOut" }} />
          </div>
        </motion.div>
      </div>
    );
  }

  const navLinks = [
    { href: "#about", label: "About" },
    { href: "#services", label: "Services" },
    { href: "#portfolio", label: "Portfolio" },
    { href: "#pricing", label: "Pricing" },
    { href: "#faq", label: "FAQ" },
    { href: "#contact", label: "Contact" },
  ];

  return (
    <div className="min-h-screen bg-background overflow-x-hidden">
      <ScrollToTop />

      {/* ─── NAVBAR ─── */}
      <nav className={`fixed top-0 inset-x-0 z-50 transition-all duration-500 ${scrolled ? "glass-card shadow-lg backdrop-blur-2xl bg-background/80" : "bg-transparent"}`}>
        <div className="container mx-auto flex items-center justify-between h-16 lg:h-18 px-4">
          <a href="#" className="flex items-center gap-2.5 font-heading font-bold text-xl">
            <motion.div whileHover={{ rotate: 12, scale: 1.1 }} className="w-9 h-9 rounded-xl gradient-bg flex items-center justify-center shadow-lg">
              <Sparkles size={18} className="text-primary-foreground" />
            </motion.div>
            <span className="text-foreground">AM <span className="gradient-text">Enterprises</span></span>
          </a>
          <div className="hidden lg:flex items-center gap-1">
            {navLinks.map(l => (
              <a key={l.href} href={l.href} className="px-3 py-2 text-sm text-muted-foreground hover:text-foreground transition-colors rounded-lg hover:bg-muted/50">{l.label}</a>
            ))}
          </div>
          <div className="hidden lg:flex items-center gap-3">
            <Button variant="ghost" size="sm" onClick={goStart}>Login</Button>
            <Button variant="hero" size="sm" onClick={goStart}>
              Get Started <ArrowRight size={16} />
            </Button>
          </div>
          <button className="lg:hidden text-foreground p-2" onClick={() => setMobileMenu(!mobileMenu)}>
            {mobileMenu ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
        <AnimatePresence>
          {mobileMenu && (
            <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="lg:hidden overflow-hidden bg-background/95 backdrop-blur-2xl border-t border-border">
              <div className="flex flex-col gap-1 p-4">
                {navLinks.map(l => (
                  <a key={l.href} href={l.href} className="px-4 py-3 text-sm text-muted-foreground hover:bg-muted/50 rounded-lg" onClick={() => setMobileMenu(false)}>{l.label}</a>
                ))}
                <div className="flex gap-2 mt-3">
                  <Button variant="ghost" size="sm" onClick={goStart} className="flex-1">Login</Button>
                  <Button variant="hero" size="sm" onClick={goStart} className="flex-1">Get Started</Button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      {/* ─── HERO ─── */}
      <header className="relative min-h-screen flex items-center justify-center overflow-hidden pt-16">
        <div className="absolute inset-0 hero-glow" />
        <Hero3DElements />
        <div className="container relative z-10 px-4">
          <motion.div initial="hidden" animate="visible" variants={stagger} className="text-center max-w-5xl mx-auto">
            <motion.div variants={fadeUp} className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-border bg-card/60 backdrop-blur mb-8">
              <span className="relative flex h-2 w-2"><span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent opacity-75" /><span className="relative inline-flex rounded-full h-2 w-2 bg-accent" /></span>
              <span className="text-xs font-medium text-muted-foreground">🇵🇰 Premium Digital Agency — Now Accepting New Clients</span>
            </motion.div>
            <motion.h1 variants={fadeUp} className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-heading font-extrabold leading-[1.05] tracking-tight">
              Build Your
              <br />
              <span className="gradient-text">Digital Empire</span>
            </motion.h1>
            <motion.p variants={fadeUp} className="mt-6 text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              We craft high-performance websites, SaaS platforms, and marketing strategies that turn visitors into loyal customers. Trusted by 350+ businesses worldwide.
            </motion.p>
            <motion.div variants={fadeUp} className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button variant="hero" size="lg" onClick={goStart} className="text-base px-8 h-13 text-lg">
                Start Your Project <ArrowRight size={20} />
              </Button>
              <Button variant="heroOutline" size="lg" className="text-base px-8 h-13 text-lg gap-2">
                <Play size={18} className="text-primary" /> Watch Demo
              </Button>
            </motion.div>
            <motion.div variants={fadeUp} className="mt-12 flex items-center justify-center gap-6 text-sm text-muted-foreground">
              <span className="flex items-center gap-1.5"><CheckCircle2 size={16} className="text-accent" /> Free Consultation</span>
              <span className="flex items-center gap-1.5"><CheckCircle2 size={16} className="text-accent" /> No Hidden Fees</span>
              <span className="flex items-center gap-1.5"><CheckCircle2 size={16} className="text-accent" /> 24/7 Support</span>
            </motion.div>
          </motion.div>
        </div>
        {/* Scroll indicator */}
        <motion.div className="absolute bottom-8 left-1/2 -translate-x-1/2" animate={{ y: [0, 8, 0] }} transition={{ duration: 2, repeat: Infinity }}>
          <MousePointer size={20} className="text-muted-foreground" />
        </motion.div>
      </header>

      {/* ─── TRUST MARQUEE ─── */}
      <TrustMarquee />

      {/* ─── STATS ─── */}
      <Section className="py-20">
        <div className="container px-4 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {stats.map((s) => <StatCard key={s.label} {...s} />)}
        </div>
      </Section>

      {/* ─── ABOUT ─── */}
      <Section id="about" className="py-24">
        <div className="container px-4">
          <div className="grid lg:grid-cols-2 gap-16 items-center max-w-6xl mx-auto">
            <div>
              <motion.p variants={fadeUp} className="text-sm font-semibold uppercase tracking-widest text-accent mb-3">About AM Enterprises</motion.p>
              <motion.h2 variants={fadeUp} className="text-3xl md:text-5xl font-heading font-bold leading-tight">
                Driven by Innovation,<br />Powered by <span className="gradient-text">Results</span>
              </motion.h2>
              <motion.p variants={fadeUp} className="mt-6 text-muted-foreground leading-relaxed text-lg">
                Founded in Hazro City, Punjab, AM Enterprises has grown into a global digital powerhouse serving clients across 28+ countries. We combine cutting-edge technology with data-driven strategies to deliver measurable business outcomes.
              </motion.p>
              <motion.p variants={fadeUp} className="mt-4 text-muted-foreground leading-relaxed">
                Whether you're a startup looking for an MVP or an enterprise needing a complete digital overhaul, our team of 45+ experts is ready to elevate your brand to new heights.
              </motion.p>
              <motion.div variants={fadeUp} className="mt-8 flex flex-wrap gap-3">
                <Button variant="hero" onClick={goStart}>Learn More <ArrowRight size={16} /></Button>
                <Button variant="heroOutline">Download Portfolio</Button>
              </motion.div>
            </div>
            <motion.div variants={fadeRight} className="grid grid-cols-2 gap-4">
              {[
                { icon: TrendingUp, title: "Growth-First", desc: "Every decision optimized for your growth", color: "gradient-bg" },
                { icon: BarChart3, title: "Data-Driven", desc: "Real-time analytics & insights", color: "gradient-bg-accent" },
                { icon: Users, title: "Dedicated Teams", desc: "Your own committed squad", color: "gradient-bg" },
                { icon: Shield, title: "Enterprise Security", desc: "SOC2 & GDPR compliant", color: "gradient-bg-accent" },
              ].map((item, i) => (
                <TiltCard key={item.title} className={`p-6 rounded-2xl bg-card border border-border hover:shadow-elegant transition-all duration-300 ${i === 1 ? "mt-8" : i === 2 ? "-mt-4" : ""}`}>
                  <div className={`w-11 h-11 rounded-xl ${item.color} flex items-center justify-center mb-3`}>
                    <item.icon size={20} className="text-primary-foreground" />
                  </div>
                  <h3 className="font-heading font-semibold mb-1">{item.title}</h3>
                  <p className="text-xs text-muted-foreground">{item.desc}</p>
                </TiltCard>
              ))}
            </motion.div>
          </div>
        </div>
      </Section>

      {/* ─── HOW IT WORKS / PROCESS ─── */}
      <Section className="py-24 bg-muted/20">
        <div className="container px-4">
          <div className="text-center mb-16">
            <motion.p variants={fadeUp} className="text-sm font-semibold uppercase tracking-widest text-accent mb-3">How It Works</motion.p>
            <motion.h2 variants={fadeUp} className="text-3xl md:text-5xl font-heading font-bold">
              From Idea to <span className="gradient-text">Launch</span>
            </motion.h2>
          </div>
          <div className="grid md:grid-cols-4 gap-6 max-w-5xl mx-auto relative">
            {/* Connecting line */}
            <div className="hidden md:block absolute top-16 left-[12.5%] right-[12.5%] h-0.5 bg-border" />
            {processSteps.map((step, i) => (
              <motion.div key={step.title} variants={fadeUp} className="text-center relative">
                <div className="relative z-10 w-14 h-14 rounded-2xl gradient-bg flex items-center justify-center mx-auto mb-4 shadow-lg">
                  <step.icon size={24} className="text-primary-foreground" />
                </div>
                <span className="text-xs font-mono gradient-text font-bold">Step {i + 1}</span>
                <h3 className="font-heading font-semibold mt-1 mb-2">{step.title}</h3>
                <p className="text-sm text-muted-foreground">{step.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </Section>

      {/* ─── SERVICES ─── */}
      <Section id="services" className="py-24">
        <div className="container px-4">
          <div className="text-center mb-16">
            <motion.p variants={fadeUp} className="text-sm font-semibold uppercase tracking-widest text-accent mb-3">Our Services</motion.p>
            <motion.h2 variants={fadeUp} className="text-3xl md:text-5xl font-heading font-bold">
              What We <span className="gradient-text">Deliver</span>
            </motion.h2>
            <motion.p variants={fadeUp} className="mt-4 text-muted-foreground max-w-2xl mx-auto">
              Comprehensive digital solutions tailored to your business needs. Every service is backed by years of expertise and proven results.
            </motion.p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5 max-w-6xl mx-auto">
            {services.map((s) => (
              <TiltCard key={s.title}>
                <motion.div variants={fadeUp} className="group p-6 rounded-2xl bg-card border border-border hover:border-primary/30 hover:shadow-xl transition-all duration-300 h-full">
                  <div className="w-12 h-12 rounded-xl gradient-bg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform shadow-lg">
                    <s.icon size={22} className="text-primary-foreground" />
                  </div>
                  <h3 className="font-heading font-semibold text-lg mb-2">{s.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed mb-4">{s.desc}</p>
                  <div className="flex flex-wrap gap-1.5">
                    {s.features.map(f => (
                      <span key={f} className="text-[10px] px-2 py-1 rounded-full bg-muted text-muted-foreground font-medium">{f}</span>
                    ))}
                  </div>
                </motion.div>
              </TiltCard>
            ))}
          </div>
        </div>
      </Section>

      {/* ─── TECH STACK ─── */}
      <Section className="py-20 bg-muted/20">
        <div className="container px-4">
          <div className="text-center mb-12">
            <motion.p variants={fadeUp} className="text-sm font-semibold uppercase tracking-widest text-accent mb-3">Tech Stack</motion.p>
            <motion.h2 variants={fadeUp} className="text-3xl md:text-4xl font-heading font-bold">
              Technologies We <span className="gradient-text">Master</span>
            </motion.h2>
          </div>
          <motion.div variants={fadeUp} className="flex flex-wrap justify-center gap-4 max-w-4xl mx-auto">
            {techStack.map((tech) => (
              <motion.div key={tech.name} whileHover={{ scale: 1.08, y: -4 }} className="flex items-center gap-2 px-5 py-3 rounded-xl bg-card border border-border hover:border-primary/30 hover:shadow-lg transition-all cursor-default">
                <tech.icon size={18} className="text-primary" />
                <span className="text-sm font-medium">{tech.name}</span>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </Section>

      {/* ─── PORTFOLIO / CASE STUDIES ─── */}
      <Section id="portfolio" className="py-24">
        <div className="container px-4">
          <div className="text-center mb-16">
            <motion.p variants={fadeUp} className="text-sm font-semibold uppercase tracking-widest text-accent mb-3">Portfolio</motion.p>
            <motion.h2 variants={fadeUp} className="text-3xl md:text-5xl font-heading font-bold">
              Featured <span className="gradient-text">Case Studies</span>
            </motion.h2>
          </div>
          <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {caseStudies.map((cs) => (
              <TiltCard key={cs.title}>
                <motion.div variants={fadeUp} className="group rounded-2xl border border-border overflow-hidden bg-card hover:shadow-xl transition-all duration-300">
                  <div className={`h-48 bg-gradient-to-br ${cs.color} flex items-center justify-center relative overflow-hidden`}>
                    <div className="absolute inset-0 bg-[linear-gradient(45deg,transparent_25%,rgba(255,255,255,0.1)_50%,transparent_75%)] bg-[length:200%_200%] group-hover:animate-gradient" />
                    <Eye size={40} className="text-foreground/20" />
                  </div>
                  <div className="p-6">
                    <span className="text-xs font-semibold text-accent">{cs.category}</span>
                    <h3 className="font-heading font-bold text-xl mt-1 mb-2">{cs.title}</h3>
                    <p className="text-sm text-muted-foreground mb-4">{cs.desc}</p>
                    <div className="flex items-center justify-between">
                      <span className="text-lg font-heading font-bold gradient-text">{cs.metric}</span>
                      <ArrowUpRight size={18} className="text-muted-foreground group-hover:text-primary transition-colors" />
                    </div>
                  </div>
                </motion.div>
              </TiltCard>
            ))}
          </div>
        </div>
      </Section>

      {/* ─── PRICING ─── */}
      <Section id="pricing" className="py-24 bg-muted/20">
        <div className="container px-4">
          <div className="text-center mb-16">
            <motion.p variants={fadeUp} className="text-sm font-semibold uppercase tracking-widest text-accent mb-3">Pricing</motion.p>
            <motion.h2 variants={fadeUp} className="text-3xl md:text-5xl font-heading font-bold">
              Transparent <span className="gradient-text">Pricing</span>
            </motion.h2>
            <motion.p variants={fadeUp} className="mt-4 text-muted-foreground">No hidden fees. No surprises. Just honest, value-driven pricing.</motion.p>
          </div>
          <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto items-start">
            {pricing.map((p) => (
              <TiltCard key={p.tier}>
                <motion.div variants={fadeUp} className={`relative p-8 rounded-2xl border transition-all duration-300 ${p.popular ? "border-primary/50 bg-card shadow-xl glow-primary scale-[1.03]" : "border-border bg-card hover:shadow-lg"}`}>
                  {p.popular && (
                    <span className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 text-xs font-bold gradient-bg text-primary-foreground rounded-full shadow-lg">
                      🔥 Most Popular
                    </span>
                  )}
                  <h3 className="font-heading font-bold text-xl">{p.tier}</h3>
                  <p className="text-sm text-muted-foreground mt-1">{p.desc}</p>
                  <p className="mt-6 text-5xl font-heading font-extrabold gradient-text">{p.price}</p>
                  {p.price !== "Custom" && <span className="text-sm text-muted-foreground">/project</span>}
                  <ul className="mt-8 space-y-3">
                    {p.features.map((f) => (
                      <li key={f} className="flex items-start gap-2.5 text-sm text-muted-foreground">
                        <CheckCircle2 size={16} className="text-accent shrink-0 mt-0.5" />
                        {f}
                      </li>
                    ))}
                  </ul>
                  <Button variant={p.popular ? "hero" : "heroOutline"} className="w-full mt-8" onClick={goStart}>
                    {p.price === "Custom" ? "Contact Us" : "Get Started"} <ArrowRight size={16} />
                  </Button>
                </motion.div>
              </TiltCard>
            ))}
          </div>
        </div>
      </Section>

      {/* ─── TESTIMONIALS ─── */}
      <Section className="py-24">
        <div className="container px-4">
          <div className="text-center mb-16">
            <motion.p variants={fadeUp} className="text-sm font-semibold uppercase tracking-widest text-accent mb-3">Testimonials</motion.p>
            <motion.h2 variants={fadeUp} className="text-3xl md:text-5xl font-heading font-bold">
              Loved by <span className="gradient-text">Clients Worldwide</span>
            </motion.h2>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {testimonials.map((t) => (
              <TiltCard key={t.name}>
                <motion.div variants={fadeUp} className="p-6 rounded-2xl bg-card border border-border hover:shadow-xl transition-all duration-300 h-full flex flex-col">
                  <div className="flex gap-0.5 mb-4">
                    {[...Array(t.stars)].map((_, i) => <Star key={i} size={16} className="fill-warning text-warning" />)}
                  </div>
                  <p className="text-sm text-muted-foreground leading-relaxed mb-6 flex-1">"{t.text}"</p>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full gradient-bg flex items-center justify-center text-primary-foreground text-xs font-bold">{t.avatar}</div>
                    <div>
                      <p className="font-heading font-semibold text-sm">{t.name}</p>
                      <p className="text-xs text-muted-foreground">{t.role}</p>
                    </div>
                  </div>
                </motion.div>
              </TiltCard>
            ))}
          </div>
        </div>
      </Section>

      {/* ─── FAQ ─── */}
      <Section id="faq" className="py-24 bg-muted/20">
        <div className="container px-4 max-w-3xl mx-auto">
          <div className="text-center mb-16">
            <motion.p variants={fadeUp} className="text-sm font-semibold uppercase tracking-widest text-accent mb-3">FAQ</motion.p>
            <motion.h2 variants={fadeUp} className="text-3xl md:text-5xl font-heading font-bold">
              Got <span className="gradient-text">Questions?</span>
            </motion.h2>
          </div>
          <div className="space-y-3">
            {faqs.map((f, i) => <FaqItem key={f.q} {...f} index={i} />)}
          </div>
        </div>
      </Section>

      {/* ─── CONTACT / NEWSLETTER ─── */}
      <Section id="contact" className="py-24">
        <div className="container px-4">
          <div className="grid lg:grid-cols-2 gap-12 max-w-5xl mx-auto">
            <div>
              <motion.p variants={fadeUp} className="text-sm font-semibold uppercase tracking-widest text-accent mb-3">Get In Touch</motion.p>
              <motion.h2 variants={fadeUp} className="text-3xl md:text-4xl font-heading font-bold mb-6">
                Let's Start a <span className="gradient-text">Conversation</span>
              </motion.h2>
              <motion.div variants={fadeUp} className="space-y-4">
                {[
                  { icon: MapPin, label: "Hazro City, Punjab, Pakistan" },
                  { icon: Mail, label: "hello@amenterprises.pk" },
                  { icon: Phone, label: "+92 300 1234567" },
                  { icon: Clock, label: "Mon - Sat: 9:00 AM - 6:00 PM PKT" },
                ].map(item => (
                  <div key={item.label} className="flex items-center gap-3 text-muted-foreground">
                    <div className="w-10 h-10 rounded-xl bg-muted flex items-center justify-center shrink-0">
                      <item.icon size={18} className="text-primary" />
                    </div>
                    <span className="text-sm">{item.label}</span>
                  </div>
                ))}
              </motion.div>
              <motion.div variants={fadeUp} className="mt-8 flex gap-3">
                {[Linkedin, Twitter, Instagram, Github].map((Icon, i) => (
                  <a key={i} href="#" className="w-10 h-10 rounded-xl bg-muted hover:bg-primary hover:text-primary-foreground flex items-center justify-center transition-all duration-300 text-muted-foreground">
                    <Icon size={18} />
                  </a>
                ))}
              </motion.div>
            </div>
            <motion.div variants={fadeRight}>
              <div className="p-8 rounded-2xl bg-card border border-border shadow-elegant">
                <h3 className="font-heading font-bold text-xl mb-6">Send us a message</h3>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <input type="text" placeholder="First Name" className="w-full px-4 py-3 rounded-xl bg-muted/50 border border-border text-sm focus:outline-none focus:border-primary/50 transition-colors" />
                    <input type="text" placeholder="Last Name" className="w-full px-4 py-3 rounded-xl bg-muted/50 border border-border text-sm focus:outline-none focus:border-primary/50 transition-colors" />
                  </div>
                  <input type="email" placeholder="Email Address" className="w-full px-4 py-3 rounded-xl bg-muted/50 border border-border text-sm focus:outline-none focus:border-primary/50 transition-colors" />
                  <select className="w-full px-4 py-3 rounded-xl bg-muted/50 border border-border text-sm focus:outline-none focus:border-primary/50 transition-colors text-muted-foreground">
                    <option>Select a Service</option>
                    {services.map(s => <option key={s.title}>{s.title}</option>)}
                  </select>
                  <textarea placeholder="Tell us about your project..." rows={4} className="w-full px-4 py-3 rounded-xl bg-muted/50 border border-border text-sm focus:outline-none focus:border-primary/50 transition-colors resize-none" />
                  <Button variant="hero" className="w-full" onClick={goStart}>
                    Send Message <Send size={16} />
                  </Button>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </Section>

      {/* ─── FINAL CTA ─── */}
      <Section className="py-24">
        <div className="container px-4">
          <motion.div variants={fadeUp} className="relative overflow-hidden rounded-3xl gradient-bg p-12 md:p-20 text-center">
            <div className="absolute inset-0 overflow-hidden">
              {[...Array(5)].map((_, i) => (
                <motion.div key={i} className="absolute rounded-full bg-primary-foreground/5" style={{ width: 150 + i * 80, height: 150 + i * 80, left: `${i * 20}%`, top: `${-10 + i * 8}%` }}
                  animate={{ y: [0, -15, 0], scale: [1, 1.05, 1] }} transition={{ duration: 5 + i, repeat: Infinity, ease: "easeInOut" }} />
              ))}
            </div>
            <div className="relative z-10">
              <motion.div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gray-100 border border-gray-200 mb-6">
                <Rocket size={14} className="text-gray-700" />
                <span className="text-xs font-medium text-gray-600">
                  Limited Slots Available This Month
                </span>
              </motion.div>

              <h2 className="text-3xl md:text-5xl lg:text-6xl font-heading font-extrabold text-gray-900 mb-4 leading-tight">
                Ready to Build<br />Your Empire?
              </h2>

              <p className="text-gray-600 text-lg max-w-xl mx-auto mb-8">
                Join 350+ businesses that trust AM Enterprises to power their digital growth. Let's turn your vision into reality.
              </p>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Button
                  size="lg"
                  onClick={goStart}
                  className="bg-black text-white hover:bg-black/90 font-semibold text-base px-10 shadow-xl h-13"
                >
                  Start Your Project <ArrowRight size={18} />
                </Button>

                <Button
                  size="lg"
                  variant="ghost"
                  className="text-gray-700 border border-gray-300 hover:bg-gray-100 h-13 px-8"
                >
                  Schedule a Call <Phone size={16} />
                </Button>
              </div>
            </div>
          </motion.div>
        </div>
      </Section>

      {/* ─── FOOTER ─── */}
      <footer className="border-t border-border py-16 bg-card/50">
        <div className="container px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">
            <div className="col-span-2 md:col-span-1">
              <div className="flex items-center gap-2 font-heading font-bold text-lg mb-4">
                <div className="w-8 h-8 rounded-lg gradient-bg flex items-center justify-center">
                  <Sparkles size={16} className="text-primary-foreground" />
                </div>
                AM <span className="gradient-text">Enterprises</span>
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed">Premium digital agency crafting exceptional digital experiences for businesses worldwide.</p>
              <div className="flex gap-2 mt-4">
                {[Linkedin, Twitter, Instagram, Github].map((Icon, i) => (
                  <a key={i} href="#" className="w-8 h-8 rounded-lg bg-muted hover:bg-primary hover:text-primary-foreground flex items-center justify-center transition-all text-muted-foreground">
                    <Icon size={14} />
                  </a>
                ))}
              </div>
            </div>
            {[
              { title: "Services", links: ["Web Development", "Custom SaaS", "Lead Generation", "Digital Marketing", "UI/UX Design"] },
              { title: "Company", links: ["About Us", "Case Studies", "Careers", "Blog", "Contact"] },
              { title: "Resources", links: ["Documentation", "Help Center", "Privacy Policy", "Terms of Service", "Sitemap"] },
            ].map(col => (
              <div key={col.title}>
                <h4 className="font-heading font-semibold mb-4 text-sm">{col.title}</h4>
                <ul className="space-y-2.5">
                  {col.links.map(link => (
                    <li key={link}><a href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">{link}</a></li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          <div className="border-t border-border pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <MapPin size={14} /> Hazro City, Punjab, Pakistan
            </div>
            <p className="text-sm text-muted-foreground">© {new Date().getFullYear()} AM Enterprises. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
