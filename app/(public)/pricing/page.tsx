"use client"

/* ================================
   React Hooks
================================ */
import { useEffect, useState } from "react"

/* ================================
   Animation
================================ */
import { motion } from "framer-motion"

/* ================================
   Icons (Lucide)
================================ */
import {
  Check,
  X,
  Sparkles,
  ArrowRight,
  HelpCircle,
  ShieldCheck,
  Clock,
  Users,
  Globe,
  Loader2,
} from "lucide-react"

/* ================================
   UI Components (shadcn)
================================ */
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Badge } from "@/components/ui/badge"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"

import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog"

import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select"

/* ================================
   Custom Components
================================ */
import { EmblaCarousel } from "@/components/EmblaCarousel"
import { ParticlesBackground } from "@/components/public/particles-background"

/* ================================
   Utils & Services
================================ */
import { cn } from "@/lib/utils"
import { createClient } from "@/lib/supabase/client"
import { toast } from "sonner"

// ─────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────

type PricingPlan = {
  id: string
  name: string
  description: string
  monthly_price: number
  yearly_price: number
  currency: string
  is_popular: boolean
  features: string[]
  cta_text: string
  order_index: number
  active: boolean
}

type PortfolioProject = {
  id: string
  title: string
  slug: string
  short_description: string
  thumbnail_url?: string
  tags?: string[]
  featured: boolean
  active: boolean
  order_index: number
}

// ─────────────────────────────────────────────
// Static FAQs
// ─────────────────────────────────────────────

const faqs = [
  {
    question: "What is included in each package?",
    answer:
      "Full custom design, development, testing, deployment, and source code handover. Higher tiers add more pages, integrations, support, and priority features.",
  },
  {
    question: "Can I upgrade my package later?",
    answer:
      "Yes — upgrades are seamless with prorated difference applied immediately.",
  },
  {
    question: "Do you offer custom development?",
    answer:
      "Yes, for unique features we provide free consultation and tailored quotes.",
  },
  {
    question: "What payment methods do you accept?",
    answer:
      "EasyPaisa, JazzCash, bank transfer, credit/debit cards (Stripe), PayPal.",
  },
  {
    question: "What is your revision and refund policy?",
    answer:
      "1–unlimited revisions (scope-based). Full refund possible in first 14 days if not satisfied.",
  },
  {
    question: "How long does a project take?",
    answer:
      "Starter: 2–4 weeks | Professional: 4–10 weeks | Custom: 10–20+ weeks.",
  },
]

// ─────────────────────────────────────────────
// Animation variants
// ─────────────────────────────────────────────

const container = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.1 } },
}

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
}

// ─────────────────────────────────────────────
// MAIN COMPONENT
// ─────────────────────────────────────────────

export default function PricingPage() {

  /* ================================
     Proposal Form States (FIXED)
  ================================= */

  const [proposalOpen, setProposalOpen] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    project_type: "",
    budget: "",
    timeline: "",
    message: "",
  })

  const [errors, setErrors] = useState<Record<string, string>>({})

  /* ================================
     Pricing & Portfolio States
  ================================= */

  const [plans, setPlans] = useState<PricingPlan[]>([])
  const [loading, setLoading] = useState(true)
  const [isYearly, setIsYearly] = useState(false)

  const [portfolioProjects, setPortfolioProjects] = useState<PortfolioProject[]>([])
  const [portfolioLoading, setPortfolioLoading] = useState(true)

  const supabase = createClient()

  /* ================================
     Validation
  ================================= */

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!form.name.trim()) newErrors.name = "Name is required"
    if (!form.email.trim()) newErrors.email = "Email is required"
    if (!form.phone.trim()) newErrors.phone = "Phone is required"
    if (!form.project_type) newErrors.project_type = "Select project type"
    if (!form.budget) newErrors.budget = "Select budget"
    if (!form.timeline) newErrors.timeline = "Select timeline"
    if (!form.message.trim()) newErrors.message = "Project details required"

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  /* ================================
     Submit Handler
  ================================= */

  const handleProposalSubmit = async () => {
    if (!validateForm()) return

    try {
      setIsSubmitting(true)

      const { error } = await supabase.from("consultation_requests").insert([
        {
          name: form.name,
          email: form.email,
          phone: form.phone,
          project_type: form.project_type,
          budget: form.budget,
          timeline: form.timeline,
          message: form.message,
        },
      ])

      if (error) throw error

      toast.success("Consultation request sent successfully!")

      setForm({
        name: "",
        email: "",
        phone: "",
        project_type: "",
        budget: "",
        timeline: "",
        message: "",
      })

      setProposalOpen(false)
    } catch (err) {
      console.error(err)
      toast.error("Something went wrong. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  /* ================================
     Fetch Pricing & Portfolio
  ================================= */

  useEffect(() => {
    async function fetchAllData() {
      setLoading(true)
      setPortfolioLoading(true)

      try {
        const { data: plansData } = await supabase
          .from("pricing_plans")
          .select("*")
          .eq("active", true)
          .order("order_index", { ascending: true })

        setPlans(plansData || [])

        const { data: portfolioData } = await supabase
          .from("portfolio_projects")
          .select("*")
          .eq("active", true)
          .eq("featured", true)
          .order("order_index", { ascending: true })
          .limit(6)

        setPortfolioProjects(portfolioData || [])
      } catch (err) {
        toast.error("Data fetch failed")
      } finally {
        setLoading(false)
        setPortfolioLoading(false)
      }
    }

    fetchAllData()
  }, [supabase])



  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/10">
      {/* Hero */}
      <section className="relative pt-20 pb-12 md:pt-28 md:pb-20 overflow-hidden">
        <ParticlesBackground />
        <div className="absolute inset-0 bg-gradient-to-b from-primary/5 via-transparent to-transparent pointer-events-none" />

        <div className="container relative z-10 mx-auto px-5 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="text-center max-w-3xl mx-auto"
          >
            <Badge variant="outline" className="mb-4 px-4 py-1 text-xs sm:text-sm">
              Transparent Pricing
            </Badge>

            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight mb-4 leading-tight">
              Choose Your Perfect Plan
            </h1>

            <p className="text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto">
              No hidden fees. Clear pricing. Built for real growth.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Toggle */}
      <section className="py-6">
        <div className="container mx-auto px-5 sm:px-6 lg:px-8">
          <div className="flex items-center justify-center gap-3 bg-muted/40 py-3 px-5 rounded-full max-w-xs mx-auto border border-border/30">
            <span className={cn("text-sm font-medium", !isYearly ? "text-primary" : "text-muted-foreground")}>
              Monthly
            </span>
            <Switch checked={isYearly} onCheckedChange={setIsYearly} />
            <div className="flex items-center gap-2">
              <span className={cn("text-sm font-medium", isYearly ? "text-primary" : "text-muted-foreground")}>
                Yearly
              </span>
              <Badge variant="secondary" className="text-xs px-2 py-0.5">Save ~20%</Badge>
            </div>
          </div>
        </div>
      </section>


    

{/* Pricing Cards – Professional Compact Layout */}
<section className="py-14 md:py-20">
  <div className="container mx-auto px-5 sm:px-6 lg:px-8">
    {loading ? (
      <div className="flex justify-center items-center min-h-[40vh]">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary"></div>
      </div>
    ) : plans.length === 0 ? (
      <div className="text-center py-16 text-muted-foreground">
        No active pricing plans available right now.
      </div>
    ) : (
      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 max-w-6xl mx-auto"
      >
        {plans.map((plan) => (
          <motion.div
            key={plan.id}
            variants={item}
            className={cn(
              "group relative rounded-xl border bg-card transition-all duration-300",
              "hover:shadow-lg hover:-translate-y-1",
              plan.is_popular
                ? "border-primary shadow-md scale-[1.02]"
                : "border-border hover:border-primary/40"
            )}
          >
            {plan.is_popular && (
              <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                <Badge className="px-3 py-1 text-xs font-medium bg-gradient-to-r from-primary to-accent">
                  Most Popular
                </Badge>
              </div>
            )}

            <div className="p-6 md:p-7">
              {/* Title */}
              <h3 className="text-xl md:text-2xl font-semibold mb-2">
                {plan.name}
              </h3>

              {/* Description */}
              <p className="text-sm text-muted-foreground mb-6 leading-relaxed min-h-[48px]">
                {plan.description}
              </p>

              {/* Price */}
              <div className="flex items-end gap-1 mb-7">
                <span className="text-3xl md:text-4xl font-bold tracking-tight">
                  {plan.currency === "PKR" ? "₨" : "$"}
                  {isYearly
                    ? Math.round(plan.yearly_price).toLocaleString("en-PK")
                    : Math.round(plan.monthly_price).toLocaleString("en-PK")}
                </span>
                <span className="text-sm text-muted-foreground mb-1">
                  /{isYearly ? "year" : "month"}
                </span>
              </div>

              {/* Features */}
              <ul className="space-y-2.5 mb-8 text-sm">
                {plan.features.map((feature, idx) => (
                  <li key={idx} className="flex items-start gap-2.5">
                    <ShieldCheck className="h-4 w-4 text-primary mt-0.5 shrink-0" />
                    <span className="text-muted-foreground leading-relaxed">
                      {feature}
                    </span>
                  </li>
                ))}
              </ul>

              {/* Button */}
              <Button
                asChild
                className={cn(
                  "w-full h-10 text-sm font-medium transition-all",
                  plan.is_popular
                    ? "bg-gradient-to-r from-primary to-accent hover:brightness-110"
                    : "border border-primary/60 hover:bg-primary/5 hover:text-primary"
                )}
              >
                <a href="/contact">
                  {plan.cta_text || "Get Started"}
                </a>
              </Button>
            </div>
          </motion.div>
        ))}
      </motion.div>
    )}
  </div>
</section>

  {/* Free Consultation Banner – High Conversion */}
<section className="py-8 md:py-10 bg-gradient-to-r from-primary/10 to-accent/10 border-b">
  <div className="container mx-auto px-5 sm:px-6 lg:px-8">
    <div className="flex flex-col md:flex-row items-center justify-between gap-6 text-center md:text-left">
      <div className="max-w-2xl">
        <h3 className="text-2xl md:text-3xl font-bold mb-3 text-primary">
          First 30-Minute Consultation is <span className="text-green-600">COMPLETELY FREE</span>
        </h3>
        <p className="text-base md:text-lg text-muted-foreground">
          No obligation. No credit card required. Let's discuss your project idea, goals, timeline, and budget – we'll give you a clear roadmap and honest advice.
        </p>
      </div>

      <Dialog>
        <DialogTrigger asChild>
          <Button size="lg" className="gap-2 bg-gradient-to-r from-primary to-accent hover:brightness-110 shadow-lg min-w-[220px]">
            Book Free Consultation Now
            <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
          </Button>
        </DialogTrigger>

        {/* Reusing same detailed proposal form from Floating Menu */}
        <DialogContent className="max-w-lg sm:max-w-xl">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold">Free 30-Min Consultation Request</DialogTitle>
            <DialogDescription className="text-muted-foreground">
              Fill in your details below. We'll schedule a call within 24 hours – completely free, no commitment.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-6 py-6">
            <div className="space-y-2">
              <Label htmlFor="name">Your Full Name *</Label>
              <Input
                id="name"
                value={form.name}
                onChange={e => setForm({ ...form, name: e.target.value })}
                placeholder="e.g. Muhammad Ali"
                className={errors.name ? "border-destructive" : ""}
              />
              {errors.name && <p className="text-sm text-destructive">{errors.name}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email Address *</Label>
              <Input
                id="email"
                type="email"
                value={form.email}
                onChange={e => setForm({ ...form, email: e.target.value })}
                placeholder="e.g. yourname@gmail.com"
                className={errors.email ? "border-destructive" : ""}
              />
              {errors.email && <p className="text-sm text-destructive">{errors.email}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone">Phone Number (WhatsApp preferred) *</Label>
              <Input
                id="phone"
                value={form.phone}
                onChange={e => setForm({ ...form, phone: e.target.value })}
                placeholder="e.g. +923001234567"
                className={errors.phone ? "border-destructive" : ""}
              />
              {errors.phone && <p className="text-sm text-destructive">{errors.phone}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="project_type">Project Type *</Label>
              <Select
                value={form.project_type}
                onValueChange={value => setForm({ ...form, project_type: value })}
              >
                <SelectTrigger className={errors.project_type ? "border-destructive" : ""}>
                  <SelectValue placeholder="Select project type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Website">Website / Web App</SelectItem>
                  <SelectItem value="Mobile App">Mobile App</SelectItem>
                  <SelectItem value="E-commerce">E-commerce Store</SelectItem>
                  <SelectItem value="Custom Software">Custom Software / CRM</SelectItem>
                  <SelectItem value="Other">Other</SelectItem>
                </SelectContent>
              </Select>
              {errors.project_type && <p className="text-sm text-destructive">{errors.project_type}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="budget">Estimated Budget (PKR) *</Label>
              <Select
                value={form.budget}
                onValueChange={value => setForm({ ...form, budget: value })}
              >
                <SelectTrigger className={errors.budget ? "border-destructive" : ""}>
                  <SelectValue placeholder="Select budget range" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Under 50k">Under 50,000 PKR</SelectItem>
                  <SelectItem value="50k-150k">50,000 - 150,000 PKR</SelectItem>
                  <SelectItem value="150k-400k">150,000 - 400,000 PKR</SelectItem>
                  <SelectItem value="400k+">400,000+ PKR</SelectItem>
                  <SelectItem value="Not sure">Not sure yet</SelectItem>
                </SelectContent>
              </Select>
              {errors.budget && <p className="text-sm text-destructive">{errors.budget}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="timeline">Expected Timeline *</Label>
              <Select
                value={form.timeline}
                onValueChange={value => setForm({ ...form, timeline: value })}
              >
                <SelectTrigger className={errors.timeline ? "border-destructive" : ""}>
                  <SelectValue placeholder="Select timeline" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1-4 weeks">1-4 weeks (Urgent)</SelectItem>
                  <SelectItem value="1-3 months">1-3 months</SelectItem>
                  <SelectItem value="3-6 months">3-6 months</SelectItem>
                  <SelectItem value="6+ months">6+ months</SelectItem>
                </SelectContent>
              </Select>
              {errors.timeline && <p className="text-sm text-destructive">{errors.timeline}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="message">Project Details & Goals *</Label>
              <Textarea
                id="message"
                value={form.message}
                onChange={e => setForm({ ...form, message: e.target.value })}
                placeholder="Describe your idea, target audience, main goals, any references or inspiration..."
                rows={5}
                className={errors.message ? "border-destructive" : ""}
              />
              {errors.message && <p className="text-sm text-destructive">{errors.message}</p>}
            </div>
          </div>

          <DialogFooter className="gap-3 sm:gap-0">
            <Button variant="outline" onClick={() => setProposalOpen(false)}>
              Cancel
            </Button>
            <Button
              onClick={handleProposalSubmit}
              disabled={isSubmitting}
              className="min-w-40 bg-gradient-to-r from-primary to-accent hover:brightness-110"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Sending...
                </>
              ) : (
                "Send Request"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  </div>
</section>

{/* Comparison Table Section */}
<section className="py-16 md:py-20 bg-muted/10">
  <div className="container mx-auto px-5 sm:px-6 lg:px-8">
    <div className="text-center mb-10 md:mb-12">
      <h2 className="text-2xl md:text-3xl font-bold mb-3">Compare All Plans</h2>
      <p className="text-base md:text-lg text-muted-foreground max-w-3xl mx-auto">
        See exactly what each package includes — choose what fits your needs.
      </p>
    </div>

    <div className="overflow-x-auto rounded-xl border bg-card shadow-sm">
      <table className="w-full min-w-[900px] text-sm md:text-base">
        <thead className="bg-muted/50">
          <tr>
            <th className="p-4 md:p-6 text-left font-semibold sticky left-0 bg-muted/50 z-10 min-w-[220px]">
              Features
            </th>
            {plans.map((plan) => (
              <th
                key={plan.id}
                className={cn(
                  "p-4 md:p-6 text-center font-semibold",
                  plan.is_popular && "bg-primary/10 text-primary"
                )}
              >
                {plan.name}
                {plan.is_popular && (
                  <Badge className="ml-2 bg-primary text-primary-foreground text-xs">Popular</Badge>
                )}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {/* Dynamically generate rows based on all unique features across plans */}
          {Array.from(
            new Set(plans.flatMap((p) => p.features))
          ).map((feature, idx) => (
            <tr key={idx} className="border-t hover:bg-muted/30 transition-colors">
              <td className="p-4 md:p-6 font-medium sticky left-0 bg-background z-10 border-r">
                {feature}
              </td>
              {plans.map((plan) => (
                <td key={plan.id} className="p-4 md:p-6 text-center">
                  {plan.features.includes(feature) ? (
                    <Check className="h-5 w-5 md:h-6 md:w-6 text-green-600 mx-auto" />
                  ) : (
                    <X className="h-5 w-5 md:h-6 md:w-6 text-red-500/70 mx-auto" />
                  )}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
        <tfoot>
          <tr className="border-t bg-muted/30">
            <td className="p-4 md:p-6 font-semibold sticky left-0 bg-muted/30 z-10">
              Price ({isYearly ? "Yearly" : "Monthly"})
            </td>
            {plans.map((plan) => (
              <td key={plan.id} className="p-4 md:p-6 text-center font-bold">
                {plan.currency === "PKR" ? "₨" : "$"}
                {isYearly
                  ? Math.round(plan.yearly_price).toLocaleString("en-PK")
                  : Math.round(plan.monthly_price).toLocaleString("en-PK")}
                <span className="text-xs md:text-sm font-normal text-muted-foreground block mt-1">
                  /{isYearly ? "year" : "month"}
                </span>
              </td>
            ))}
          </tr>
          <tr>
            <td className="p-4 md:p-6 sticky left-0 bg-muted/30 z-10"></td>
            {plans.map((plan) => (
              <td key={plan.id} className="p-4 md:p-6 text-center">
                <Button
                  asChild
                  size="sm"
                  className={cn(
                    "w-full md:w-auto",
                    plan.is_popular
                      ? "bg-gradient-to-r from-primary to-accent hover:brightness-110"
                      : ""
                  )}
                >
                  <a href="/contact">{plan.cta_text || "Get Started"}</a>
                </Button>
              </td>
            ))}
          </tr>
        </tfoot>
      </table>
    </div>
  </div>
</section>

      {/* Trust Section – Smaller & Cleaner */}
      <section className="py-16 md:py-20 bg-muted/30">
        <div className="container mx-auto px-5 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Why Choose Our Plans?
            </h2>
            <p className="text-lg text-muted-foreground">
              We focus on real value, fast delivery, and long-term success.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {[
              { icon: Clock, title: "Fast Delivery", desc: "Projects delivered 20–30% faster than average" },
              { icon: Users, title: "Happy Clients", desc: "95%+ satisfaction with repeat & referral business" },
              { icon: Globe, title: "Global Quality", desc: "Modern tech stack — built to scale worldwide" },
            ].map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.15 }}
                className="text-center p-6 rounded-xl bg-card border hover:shadow-md transition-all"
              >
                <item.icon className="h-10 w-10 mx-auto mb-5 text-primary" />
                <h3 className="text-xl font-semibold mb-3">{item.title}</h3>
                <p className="text-muted-foreground text-base">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Custom Quote */}
      <section className="py-20">
        <div className="container mx-auto px-5 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="max-w-4xl mx-auto text-center p-10 md:p-14 rounded-3xl bg-gradient-to-br from-primary/5 to-accent/5 border shadow-xl"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-5">
              Need a Custom Solution?
            </h2>
            <p className="text-lg md:text-xl text-muted-foreground mb-8 max-w-3xl mx-auto">
              If your project needs something unique — complex features, integrations, or enterprise scale — let's build it together.
            </p>
            <Button size="lg" className="text-lg px-10 py-7 bg-gradient-to-r from-primary to-accent hover:brightness-110 shadow-lg">
              <a href="/contact" className="flex items-center gap-3">
                Get Free Custom Quote
                <ArrowRight className="h-5 w-5" />
              </a>
            </Button>
          </motion.div>
        </div>
      </section>

      {/* Testimonials Carousel Section */}
<section className="py-16 md:py-20 bg-gradient-to-b from-muted/5 to-background">
  <div className="container mx-auto px-5 sm:px-6 lg:px-8">
    <div className="text-center mb-10 md:mb-12">
      <h2 className="text-3xl md:text-4xl font-bold mb-4">What Our Clients Say</h2>
      <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
        Real stories from businesses we've helped grow online.
      </p>
    </div>

    <EmblaCarousel testimonials={[
      {
        name: "Ahmed Khan",
        company: "TechNova Solutions",
        quote: "AM Enterprises delivered our e-commerce site 2 weeks early. Professional, responsive, and the SEO results are amazing. Highly recommended!",
        rating: 5,
        avatar: "/avatars/avatar1.jpg", // real photo daal dena
      },
      {
        name: "Sara Malik",
        company: "Fashion Hub PK",
        quote: "From design to launch, everything was perfect. They understood our brand vision and exceeded expectations. 5 stars!",
        rating: 5,
        avatar: "/avatars/avatar2.jpg",
      },
      {
        name: "Bilal Ahmed",
        company: "EduLearn Academy",
        quote: "Excellent communication and clean code. Our learning platform is fast and user-friendly. Will work with them again.",
        rating: 5,
        avatar: "/avatars/avatar3.jpg",
      },
      {
        name: "Ayesha Raza",
        company: "HealthCare Clinic",
        quote: "Website redesign was a game-changer for patient bookings. Support team is superb – always available.",
        rating: 5,
        avatar: "/avatars/avatar4.jpg",
      },
      // Add more if you want 5-6
    ]} />
  </div>
</section>

{/* Dynamic Portfolio Showcase */}
<section className="py-16 md:py-20 bg-background">
  <div className="container mx-auto px-5 sm:px-6 lg:px-8">
    <div className="text-center mb-10 md:mb-12">
      <h2 className="text-3xl md:text-4xl font-bold mb-4">Our Recent Work</h2>
      <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
        Real projects we've delivered – from startups to growing businesses.
      </p>
    </div>

    {portfolioLoading ? (
      <div className="flex justify-center py-12">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary"></div>
      </div>
    ) : portfolioProjects.length === 0 ? (
      <p className="text-center text-muted-foreground py-12">No featured projects yet.</p>
    ) : (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-8">
        {portfolioProjects.map((project, i) => (
          <motion.div
            key={project.id}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1 }}
            className="group relative rounded-2xl overflow-hidden border bg-card shadow-sm hover:shadow-xl transition-all duration-300"
          >
            <div className="aspect-video overflow-hidden bg-muted">
              {project.thumbnail_url ? (
                <img
                  src={project.thumbnail_url}
                  alt={project.title}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                  Project Image
                </div>
              )}
            </div>

            <div className="p-5 md:p-6">
              <h3 className="text-lg md:text-xl font-bold mb-2 line-clamp-2">
                {project.title}
              </h3>
              <p className="text-sm md:text-base text-muted-foreground mb-4 line-clamp-3 min-h-[4.5rem]">
                {project.short_description}
              </p>

              <div className="flex flex-wrap gap-2 mb-4">
                {project.tags?.slice(0, 3).map((tag: string) => (
                  <Badge key={tag} variant="secondary" className="text-xs">
                    {tag}
                  </Badge>
                ))}
              </div>

              <Button
                variant="outline"
                size="sm"
                className="w-full md:w-auto border-primary/60 hover:bg-primary/5 hover:text-primary transition-colors"
                asChild
              >
                <a href={`/portfolio/${project.slug}`}>
                  View Project <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                </a>
              </Button>
            </div>
          </motion.div>
        ))}
      </div>
    )}

    <div className="text-center mt-10 md:mt-12">
      <Button variant="default" size="lg" className="gap-2 text-lg" asChild>
        <a href="/portfolio">
          Explore Full Portfolio
          <ArrowRight className="h-5 w-5" />
        </a>
      </Button>
    </div>
  </div>
</section>

      {/* FAQ */}
      <section className="py-20">
        <div className="container mx-auto px-5 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <HelpCircle className="h-14 w-14 text-primary mx-auto mb-5 opacity-80" />
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Frequently Asked Questions</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Got questions? We've got clear, honest answers.
            </p>
          </div>

          <div className="max-w-4xl mx-auto">
            <Accordion type="single" collapsible className="space-y-4">
              {faqs.map((faq, i) => (
                <AccordionItem
                  key={i}
                  value={`faq-${i}`}
                  className="border rounded-xl overflow-hidden bg-card/70 backdrop-blur-sm"
                >
                  <AccordionTrigger className="px-6 py-5 text-left text-lg font-medium hover:no-underline">
                    {faq.question}
                  </AccordionTrigger>
                  <AccordionContent className="px-6 pb-6 pt-2 text-base text-muted-foreground leading-relaxed">
                    {faq.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </div>
      </section>



      {/* Final CTA */}
      <section className="py-16 border-t">
        <div className="container mx-auto px-5 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-5">
            Ready to Get Started?
          </h2>
          <p className="text-lg text-muted-foreground mb-8 max-w-3xl mx-auto">
            Your first consultation is free — let's turn your idea into reality.
          </p>
          <Button size="lg" className="text-lg px-10 py-7 bg-gradient-to-r from-primary to-accent" asChild>
            <a href="/contact">Start Your Project Today</a>
          </Button>
        </div>
      </section>
    </div>
  )
}