"use client"

import Link from "next/link"
import { motion } from "framer-motion"
import { ArrowRight, CheckCircle,  Award, Users, Globe, Target, Heart, Lightbulb, BarChart3, TrendingUp, Shield, ChevronDown, Zap,Trophy, Medal, ShieldCheck } from "lucide-react"
import { Mail } from "lucide-react"
import { Quote, Star } from "lucide-react"
import { Button } from "@/components/ui/button"
import { ParticlesBackground } from "@/components/public/particles-background"

const stats = [
  { value: "150+", label: "Projects Delivered" },
  { value: "85+", label: "Happy Clients Across Pakistan" },
  { value: "4+", label: "Years of Digital Excellence" },
  { value: "12", label: "Dedicated Team Members" },
]

const values = [
  {
    icon: Lightbulb,
    title: "Innovation",
    description: "We never settle for average. From AI-powered ad targeting to cutting-edge Shopify stores and MERN stack applications, we embrace the latest tools and strategies to keep your brand miles ahead of competitors in Pakistan’s fast-growing digital market.",
  },
  {
    icon: Target,
    title: "Results-Driven Excellence",
    description: "Every website, campaign, video, or design we create is built with one single focus  delivering real, measurable outcomes: more leads, higher conversions, increased sales, and stronger brand presence. We track, analyze, and optimize until we hit your goals.",
  },
  {
    icon: Users,
    title: "True Partnership",
    description: "You’re not just a client  you’re family. We sit with you, understand your business challenges, and craft custom strategies that fit your budget and vision. Regular meetings, transparent reporting, and 24/7 support make us your long-term growth partner.",
  },
  {
    icon: Heart,
    title: "Transparency & Trust",
    description: "No hidden costs, no vague timelines, no false promises. We share monthly performance reports, full access to campaigns, and honest feedback. Trust is the foundation of every relationship we build  because your success is our success.",
  },
]

const team = [
  { 
    name: "Moez Rehman", 
    role: "Founder & CEO", 
    imageUrl: "https://picsum.photos/id/64/400/400" 
  },
  { 
    name: "Faizan Ali", 
    role: "Manager & Supervisor | Full Stack Developer", 
    imageUrl: "https://picsum.photos/id/65/400/400" 
  },
  { 
    name: "Sohaib Iqbal", 
    role: "Senior MERN Stack Developer", 
    imageUrl: "https://picsum.photos/id/66/400/400" 
  },
  { 
    name: "Malik Sohaib", 
    role: "Shopify Expert & E-commerce Specialist", 
    imageUrl: "https://picsum.photos/id/67/400/400" 
  },
  { 
    name: "Ayesha Moez", 
    role: "Creative Director & Graphic Designer", 
    imageUrl: "https://picsum.photos/id/1005/400/400" 
  },
  { 
    name: "Atta Ur Rehman", 
    role: "Senior Frontend Developer", 
    imageUrl: "https://picsum.photos/id/1011/400/400" 
  },
  { 
    name: "Anas Latif", 
    role: "Video Editor & YouTube Automation Expert", 
    imageUrl: "https://picsum.photos/id/1012/400/400" 
  },
  { 
    name: "Ahmed Khan", 
    role: "Digital Marketing Strategist & SEO Expert", 
    imageUrl: "https://picsum.photos/id/1015/400/400" 
  },
  { 
    name: "Fatima Zahra", 
    role: "Social Media Manager & Content Creator", 
    imageUrl: "https://picsum.photos/id/102/400/400" 
  },
  { 
    name: "Bilal Ahmed", 
    role: "UI/UX Designer", 
    imageUrl: "https://picsum.photos/id/201/400/400" 
  },
  { 
    name: "Hassan Raza", 
    role: "Content Strategist & Copywriter", 
    imageUrl: "https://picsum.photos/id/29/400/400" 
  },
  { 
    name: "Usman Tariq", 
    role: "Project Manager & Client Success Lead", 
    imageUrl: "https://picsum.photos/id/30/400/400" 
  },
]

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
}

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
}

export default function AboutPage() {
  return (
    <>
      {/* Hero Section */}
      <section className="relative pt-32 pb-20 overflow-hidden">
        <ParticlesBackground />
        <div className="absolute inset-0 bg-gradient-to-b from-primary/5 to-transparent" />
        
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center max-w-3xl mx-auto"
          >
            <span className="text-sm font-medium text-primary uppercase tracking-wider">About Us</span>
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold mt-4 mb-6 text-balance">
              Empowering Businesses with{" "}
              <span className="gradient-text">Digital Excellence</span>
            </h1>
            <p className="text-lg text-muted-foreground text-pretty">
              From Rawalpindi & Islamabad to businesses across Pakistan and beyond  AM Enterprises turns your vision into powerful websites, stunning designs, result-driven marketing campaigns, and unstoppable online growth.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-16 border-y border-border">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid grid-cols-2 md:grid-cols-4 gap-8"
          >
            {stats.map((stat) => (
              <motion.div key={stat.label} variants={itemVariants} className="text-center">
                <div className="text-4xl font-bold gradient-text mb-2">{stat.value}</div>
                <div className="text-muted-foreground">{stat.label}</div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Story */}
      <section className="py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              <h2 className="text-3xl sm:text-4xl font-bold mb-6">Our Story</h2>
              <div className="space-y-6 text-muted-foreground">
                <p>
    AM Enterprises was founded in <strong>Rawalpindi</strong> and <strong>Islamabad</strong> with one clear goal: help Pakistani businesses grow online affordably  without expensive or complicated solutions.
  </p>
  <p>
    Starting as a small team of passionate developers and designers, we quickly grew by generating real leads for clients through <strong>targeted Meta ads</strong>, <strong>Google ads</strong>, professional websites, and high-impact social media content. Word spread fast among <strong>real estate agencies</strong>, <strong>e-commerce stores</strong>, service businesses, and startups across Pakistan.
  </p>
  <p>
    Today, with <strong>4+ years</strong> of experience, we have successfully delivered <strong>150+ projects</strong> and earned the trust of <strong>85+ happy clients</strong>. We are now a full-service <strong>digital marketing agency Rawalpindi & Islamabad</strong> offering:
  </p>
  <ul className="list-disc pl-6 space-y-2">
    <li><strong>Shopify store development Pakistan</strong></li>
    <li><strong>MERN stack web applications</strong></li>
    <li><strong>YouTube automation</strong> and professional video editing</li>
    <li><strong>SEO services Pakistan</strong></li>
    <li>High-converting <strong>Meta ads</strong> and <strong>Google ad campaigns</strong></li>
  </ul>
  <p>
    Every project is personal. We understand the real challenges Pakistani businesses face  tight budgets, strong local competition, and the need for fast, measurable results. That’s why we combine <strong>global-standard digital tools</strong> with deep <strong>Pakistan market expertise</strong> to deliver solutions that truly drive growth.
  </p>
  <p>
    Our journey continues, but one thing stays constant: we don’t just build websites or run ads  we create <strong>digital success stories</strong> that help businesses scale, create jobs, and achieve their dreams.
  </p>
              </div>
              <Link href="/contact" className="inline-block mt-8">
                <Button className="bg-gradient-to-r from-primary to-accent text-white">
                  Let's Build Your Success Story
                  <ArrowRight className="ml-2 size-4" />
                </Button>
              </Link>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="relative aspect-square rounded-2xl overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-accent/20" />
              <div className="absolute inset-0 glass-card flex items-center justify-center">
                <span className="text-9xl font-bold text-muted-foreground/10">AM</span>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Mission & Vision - NEW SECTION (Added based on best practices) */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">Our Mission & Vision</h2>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-10">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="glass-card p-8 rounded-2xl"
            >
              <div className="flex items-center gap-3 mb-4">
                <Target className="size-8 text-primary" />
                <h3 className="text-2xl font-semibold">Our Mission</h3>
              </div>
              <p className="text-muted-foreground leading-relaxed">
                To empower every business in Pakistan from small startups in Rawalpindi to established brands across the country with affordable, high-impact digital solutions that generate real leads, boost sales, and create lasting online presence. We believe every business deserves world-class digital marketing without the world-class price tag.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="glass-card p-8 rounded-2xl"
            >
              <div className="flex items-center gap-3 mb-4">
                <Globe className="size-8 text-primary" />
                <h3 className="text-2xl font-semibold">Our Vision</h3>
              </div>
              <p className="text-muted-foreground leading-relaxed">
                To become the most trusted and result-oriented digital marketing agency in South Asia by 2030 known for transforming ordinary businesses into market leaders through innovative technology, creative excellence, and unmatched client success stories.
              </p>
            </motion.div>
          </div>
        </div>
      </section>
{/* Values - Fully Detailed & Expanded */}
<section className="py-20 bg-muted/30">
  <div className="container mx-auto px-4 sm:px-6 lg:px-8">
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="text-center mb-12"
    >
      <h2 className="text-3xl sm:text-4xl font-bold mb-4">Our Core Values</h2>
      <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
        These are the unbreakable principles that shape every decision, every campaign, every website, and every client relationship at AM Enterprises. They define who we are and how we deliver real digital growth for businesses in Pakistan and beyond.
      </p>
    </motion.div>

    <motion.div
      variants={containerVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
      className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8"
    >{[
  {
    icon: Lightbulb,
    title: "Innovation First",
    description: "As a leading digital marketing agency in Pakistan, we stay ahead with AI-driven ads, Meta algorithms, Shopify, and YouTube automation. We adopt the latest trends to give your business a real competitive edge in Islamabad, Lahore, Karachi, and beyond.",
  },
  {
    icon: Target,
    title: "Results-Driven Excellence",
    description: "We focus on measurable growth — more qualified leads, higher conversion rates, increased sales, and maximum ROI. With Google Analytics, Meta Insights, and custom dashboards, we optimize relentlessly for tangible business results.",
  },
  {
    icon: Users,
    title: "True Partnership",
    description: "You're our growth partner, not just a client. We deeply understand your business goals and audience across Pakistan and international markets. Regular strategy calls and shared dashboards make us an extension of your team.",
  },
  {
    icon: Heart,
    title: "Integrity & Transparency",
    description: "Complete honesty with no hidden fees or inflated metrics. Get full access to ad spend reports, performance dashboards, and monthly breakdowns. We build trust by being transparent about every rupee and every result.",
  },
  {
    icon: Zap,
    title: "Agility & Responsiveness",
    description: "Digital marketing changes fast. We respond quickly to algorithm updates, market shifts, and performance data — whether tweaking ads for better ROI or launching campaigns during Eid sales.",
  },
  {
    icon: Award,
    title: "Client-Centric Growth",
    description: "Your success is our priority. From startups in Rawalpindi to established brands, we deliver tailored SEO, social media marketing, and ad strategies that drive sustainable growth, enquiries, and long-term revenue.",
  },
].map((value, index) => (
  <motion.div
    key={value.title}
    variants={itemVariants}
    className="glass-card rounded-2xl p-8 text-center hover:border-primary/40 hover:shadow-xl transition-all duration-300"
  >
    <div className="size-16 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center mx-auto mb-6 shadow-md">
      <value.icon className="size-8 text-white" />
    </div>
    <h3 className="text-xl font-bold mb-4">{value.title}</h3>
    <p className="text-sm leading-relaxed text-muted-foreground">
      {value.description}
    </p>
  </motion.div>
))}
    </motion.div>
  </div>
</section>

      {/* Why Choose Us - NEW SECTION (Added based on best practices) */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">Why Businesses Choose AM Enterprises</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Because we don’t just deliver services  we deliver growth.
            </p>
          </motion.div>

          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid md:grid-cols-3 gap-8"
          >
            {[
              { icon: TrendingUp, title: "Proven Results", desc: "Average 3x–5x ROI on ad campaigns and 40%+ increase in website traffic for most clients." },
              { icon: Shield, title: "Local + Global Expertise", desc: "Deep understanding of Pakistani market + international best practices in SEO, ads, and e-commerce." },
              { icon: Zap, title: "End-to-End Solutions", desc: "Website development, branding, ads, content, video editing, Shopify  everything under one roof." },
            ].map((item, index) => (
              <motion.div
                key={index}
                variants={itemVariants}
                className="glass-card p-8 rounded-2xl text-center"
              >
                <item.icon className="size-12 mx-auto mb-4 text-primary" />
                <h3 className="font-semibold text-xl mb-3">{item.title}</h3>
                <p className="text-muted-foreground">{item.desc}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

    
      {/* Our Process – How We Actually Work */}
<section className="py-20 bg-muted/30">
  <div className="container mx-auto px-4 sm:px-6 lg:px-8">
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="text-center mb-12"
    >
      <h2 className="text-3xl sm:text-4xl font-bold mb-5">How We Really Work – Our Honest 5-Step Process</h2>
      <p className="text-lg text-muted-foreground max-w-3xl mx-auto leading-relaxed">
        We don’t believe in magic formulas or 100-page proposals. This is the same simple, transparent, and result-driven process we’ve used successfully in 150+ projects  and it still works because we keep it real.
      </p>
    </motion.div>
<motion.div
  variants={containerVariants}
  initial="hidden"
  whileInView="visible"
  viewport={{ once: true }}
  className="grid md:grid-cols-3 gap-6"
>
  {[
    {
      icon: Users,
      step: "01",
      title: "Deep Understanding & Strategy",
      desc: "We begin with detailed discovery calls to fully understand your goals, target audience, competitors, and budget. We then create a clear, custom digital marketing strategy tailored for your business in Pakistan."
    },
    {
      icon: Target,
      step: "02",
      title: "Strategic Planning",
      desc: "We carefully plan branding, website structure, ad creatives, Shopify setup, and development. You review every part and give your approval before we move forward. Your feedback is most important."
    },
    {
      icon: Zap,
      step: "03",
      title: "Fast Build & Strong Launch",
      desc: "We develop your website, set up ads, and handle all creatives. Most projects are delivered and launched in 2–4 weeks with regular updates. Fast execution without compromising quality."
    },
    {
      icon: BarChart3,
      step: "04",
      title: "Optimization & Scaling",
      desc: "After launch, we track performance using Meta Insights and Google Analytics. We optimize ads, SEO, and content weekly to improve ROI and continuously scale your leads and sales."
    },
    {
      icon: CheckCircle,
      step: "05",
      title: "Monthly Reports & Long-Term Growth",
      desc: "Every month you get clear reports showing real results, ROI, and leads generated. We also create the next 90-day plan together to ensure sustainable long-term digital growth."
    },
  ].map((item, i) => (
    <motion.div
      key={i}
      variants={itemVariants}
      className="glass-card rounded-2xl p-8 text-center relative hover:border-primary/40 hover:shadow-xl transition-all duration-300"
    >
      {/* Step Number */}
      <div className="text-5xl font-bold text-primary/10 absolute -top-5 right-6">
        {item.step}
      </div>

      {/* Icon */}
      <div className="size-14 mx-auto mb-6 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center shadow-md">
        <item.icon className="size-7 text-white" />
      </div>

      {/* Title */}
      <h3 className="font-bold text-xl mb-4">{item.title}</h3>

      {/* Description */}
      <p className="text-sm leading-relaxed text-muted-foreground">
        {item.desc}
      </p>
    </motion.div>
  ))}
</motion.div>
  </div>
</section>

{/* Testimonials – Real Words from Real Clients */}
<section className="py-20">
  <div className="container mx-auto px-4 sm:px-6 lg:px-8">
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="text-center mb-12"
    >
      <h2 className="text-3xl sm:text-4xl font-bold mb-5">What Our Clients Actually Say</h2>
      <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
        No fake reviews. These are real people running real businesses in Pakistan who trusted us and saw real numbers.
      </p>
    </motion.div>

    <motion.div
      variants={containerVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
      className="grid md:grid-cols-2 lg:grid-cols-3 gap-8"
    >
      {[
        {
          name: "Ali Hassan",
          business: "Hassan Real Estate – Islamabad",
          text: "We got 4.2 times more qualified leads in just 45 days through Facebook & Instagram ads. ROI came out to 380%. Hands down the best digital marketing agency in Rawalpindi for real estate.",
          rating: 5
        },
        {
          name: "Sana Khan",
          business: "SK Boutique – Shopify Store",
          text: "They built our complete Shopify store + set up Google Ads from scratch. First month we did 1.8 lakh in sales. Team is super professional and actually cares about results.",
          rating: 5
        },
        {
          name: "Usman Malik",
          business: "Malik Gym & Fitness – Lahore",
          text: "Thanks to their video editing and YouTube automation, our channel crossed 10,000 subscribers. Monthly walk-in enquiries literally doubled. Worth every rupee.",
          rating: 5
        },
      ].map((t, i) => (
        <motion.div
          key={i}
          variants={itemVariants}
          className="glass-card rounded-2xl p-8 relative"
        >
          <div className="flex mb-4">
            {Array(t.rating).fill(0).map((_, idx) => (
              <Star key={idx} className="size-5 text-yellow-400 fill-current" />
            ))}
          </div>
          <Quote className="size-10 text-primary/20 absolute top-6 left-6 opacity-40" />
          <p className="text-muted-foreground italic mb-6 leading-relaxed pl-10">“{t.text}”</p>
          <div>
            <h4 className="font-semibold text-lg">{t.name}</h4>
            <p className="text-sm text-muted-foreground">{t.business}</p>
          </div>
        </motion.div>
      ))}
    </motion.div>
  </div>
</section>

{/* Trusted By & Mini Success Stories */}
<section className="py-20 bg-muted/30">
  <div className="container mx-auto px-4 sm:px-6 lg:px-8">
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="text-center mb-12"
    >
      <h2 className="text-3xl sm:text-4xl font-bold mb-5">Trusted by Growing Pakistani Businesses</h2>
      <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
        From real estate in Islamabad to boutiques in Lahore and gyms in Karachi  these are the kinds of businesses that keep coming back.
      </p>
    </motion.div>

    {/* Industry tags */}
    <div className="flex flex-wrap justify-center gap-8 opacity-80 mb-16">
      {["Real Estate", "E-commerce & Shopify Stores", "Fitness & Gyms", "Education", "Restaurants & Food"].map((c, i) => (
        <div key={i} className="text-xl font-semibold text-muted-foreground/80 hover:text-primary transition-colors">
          {c}
        </div>
      ))}
    </div>

    {/* Mini case studies */}
    <div className="grid md:grid-cols-3 gap-8">
      {[
        {
          client: "Hassan Real Estate",
          result: "420% ROI in 45 days",
          metric: "187 high-quality property leads"
        },
        {
          client: "SK Boutique",
          result: "PKR 1.8 Lakh sales – Month 1",
          metric: "Shopify store + Meta + Google Ads"
        },
        {
          client: "Malik Gym",
          result: "10,000+ YouTube subscribers",
          metric: "120+ new monthly walk-ins & enquiries"
        },
      ].map((cs, i) => (
        <motion.div
          key={i}
          variants={itemVariants}
          className="glass-card rounded-2xl p-8 text-center hover:shadow-xl transition-shadow"
        >
          <h3 className="font-bold text-xl mb-3">{cs.client}</h3>
          <p className="text-2xl font-bold gradient-text mb-2">{cs.result}</p>
          <p className="text-sm text-muted-foreground font-medium">{cs.metric}</p>
        </motion.div>
      ))}
    </div>
  </div>
</section>

{/* Awards, Certifications & Partnerships */}
<section className="py-20 bg-muted/30">
  <div className="container mx-auto px-4 sm:px-6 lg:px-8">
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="text-center mb-12"
    >
      <h2 className="text-3xl sm:text-4xl font-bold mb-4">Awards, Certifications & Recognitions</h2>
      <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
        As a leading digital marketing agency in Rawalpindi & Islamabad, AM Enterprises is proud of the validations we've earned through consistent results, innovation, and client success. These accolades reflect our commitment to excellence in web development, Meta ads, Shopify stores, lead generation, and full digital strategies across Pakistan.
      </p>
    </motion.div>

    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
      {/* Certification Cards */}
      {[
        {
          icon: ShieldCheck,
          title: "Meta Blueprint Certified Professionals",
          description: "Our core team members, including Meta ads specialists, are officially Meta Blueprint certified. This certification ensures we master advanced targeting, creative optimization, and performance marketing on Facebook & Instagram  delivering average 3x-5x ROI for clients in Pakistan's competitive market. We've managed ad spends exceeding millions of PKR with transparent, results-driven campaigns.",
        },
        {
          icon: Award,
          title: "Google Partner Program Member",
          description: "Recognized as a Google Partner for expertise in Google Ads, Search, Display, and Analytics. This badge confirms our team's proficiency in driving high-quality traffic, conversions, and measurable growth for businesses in Rawalpindi, Islamabad, Lahore, Karachi, and beyond. We use Google-certified strategies to boost organic rankings and paid search performance for e-commerce and service-based clients.",
        },
        {
          icon: Trophy,
          title: "Pakistan Digital Awards Nominee / Winner Category",
          description: "Nominated in categories like Best Digital Marketing Campaign and Best Digital Agency (Emerging) at Pakistan Digital Awards  a premier platform celebrating digital excellence in Pakistan for over 10 years. Our work in lead generation, Shopify development, and YouTube automation has been highlighted for innovation and real business impact.",
        },
        {
          icon: Medal,
          title: "Effie Pakistan Recognition",
          description: "Inspired by Effie Awards Pakistan's focus on marketing effectiveness, our campaigns have been praised for delivering measurable results (e.g., 300%+ ROI in Meta ads for real estate clients). We align with Effie principles  strategy, creativity, and proven outcomes  to help businesses achieve sustainable growth in Pakistan's digital landscape.",
        },
        {
          icon: Award,
          title: "Top-Ranked Agency Listings",
          description: "Featured in top lists on platforms like Clutch.co, DesignRush, and TechBehemoths as a reliable digital marketing agency in Pakistan. Clients consistently rate us highly for Shopify expertise, MERN stack development, professional graphic design, and end-to-end digital solutions solidifying our position as a trusted partner for startups, SMEs, and enterprises.",
        },
        {
          icon: ShieldCheck,
          title: "Internal Excellence Milestones",
          description: "Beyond external awards, we've achieved internal benchmarks: 150+ projects delivered, 85+ long-term clients, 4+ years of consistent growth, and a dedicated 12-member team trained in latest tools (AI marketing, advanced SEO, video automation). These milestones drive us to maintain the highest standards as an award-winning web development and digital marketing agency in Pakistan.",
        },
      ].map((item, index) => (
        <motion.div
          key={index}
          variants={itemVariants}
          className="glass-card rounded-2xl p-8 text-center hover:border-primary/40 hover:shadow-xl transition-all duration-300"
        >
          <div className="size-16 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center mx-auto mb-6 shadow-md">
            <item.icon className="size-8 text-white" />
          </div>
          <h3 className="text-xl font-bold mb-4">{item.title}</h3>
          <p className="text-sm leading-relaxed text-muted-foreground">
            {item.description}
          </p>
        </motion.div>
      ))}
    </div>

    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="text-center mt-12"
    >
      <p className="text-muted-foreground italic">
        These certifications and recognitions aren't just badges  they're proof of our dedication to delivering world-class digital marketing services in Rawalpindi, Islamabad, and across Pakistan. Ready to work with an award-winning team? Let's talk!
      </p>
    </motion.div>
  </div>
</section>

      {/* Team */}
      <section className="py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">Meet Our Team</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              12 passionate experts working together to turn your business dreams into digital reality.
            </p>
          </motion.div>

          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8"
          >
            {team.map((member) => (
              <motion.div
                key={member.name}
                variants={itemVariants}
                className="text-center group"
              >
                <div className="relative mx-auto mb-4">
                  <img 
                    src={member.imageUrl} 
                    alt={member.name}
                    className="size-32 rounded-2xl object-cover mx-auto shadow-lg group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <h3 className="font-semibold text-lg">{member.name}</h3>
                <p className="text-sm text-muted-foreground">{member.role}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* FAQs - Deep & SEO Friendly */}
<section className="py-20 bg-muted/30">
  <div className="container mx-auto px-4 sm:px-6 lg:px-8">
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="text-center mb-12"
    >
      <h2 className="text-3xl sm:text-4xl font-bold mb-4">Frequently Asked Questions</h2>
      <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
        Everything you want to know about working with the best digital marketing agency in Rawalpindi & Islamabad
      </p>
    </motion.div>

    <div className="max-w-3xl mx-auto space-y-6">
      {[
        {
          q: "How long does it take to see results from your digital marketing services in Pakistan?",
          a: "For most clients of our Meta ads agency Islamabad and lead generation agency Pakistan, we start seeing initial results within 15-30 days. Full ROI and consistent leads usually come in 45-90 days depending on the campaign. We have delivered 150+ projects where businesses saw 3x-5x return on ad spend within the first two months."
        },
        {
          q: "What makes AM Enterprises the best web development company Islamabad?",
          a: "Our team includes senior MERN stack developers and Shopify experts Pakistan who build fast, SEO-optimized, conversion-focused websites. Unlike other agencies, we combine development with complete digital marketing  so your site not only looks great but actually ranks on Google and generates real enquiries from day one."
        },
        {
          q: "Do you provide YouTube automation services and video editing in Rawalpindi?",
          a: "Yes! Our dedicated video editor and YouTube automation expert Anas Latif creates fully automated channels that run 24/7. We have helped fitness, education, and e-commerce brands grow from 0 to 10,000+ subscribers with consistent monetized content and lead-generating videos."
        },
        {
          q: "What is your minimum budget for Meta ads and lead generation campaigns?",
          a: "We work with businesses of all sizes. Our smallest successful campaigns start at PKR 30,000–50,000 per month for targeted Meta ads in Rawalpindi, Islamabad, Lahore, and Karachi. We focus on high-quality leads rather than cheap clicks  that’s why we’re known as a results-driven lead generation agency Pakistan."
        },
        {
          q: "Can you handle both Shopify store development and professional graphic design?",
          a: "Absolutely. Our Shopify expert Malik Sohaib builds high-converting online stores while Creative Director Ayesha Moez and her team deliver complete branding and professional graphic design Rawalpindi. Everything under one roof  from logo to full e-commerce website and ads creatives."
        },
        {
          q: "How transparent is your reporting process?",
          a: "Completely transparent. Every client gets a custom dashboard with real-time Meta Insights, Google Analytics, lead reports, and monthly video calls. No hidden fees, no guesswork  this is why we maintain 85+ long-term happy clients across Pakistan."
        },
        {
          q: "Do you work with clients outside Rawalpindi and Islamabad?",
          a: "Yes, we serve businesses all over Pakistan and even international clients (UAE, UK, USA). Our digital marketing strategies are built for both local markets in Rawalpindi/Islamabad and national/global reach."
        }
      ].map((faq, index) => (
        <motion.div
          key={index}
          variants={itemVariants}
          className="glass-card rounded-2xl p-8"
        >
          <details className="group">
            <summary className="flex justify-between items-center cursor-pointer font-semibold text-lg">
              {faq.q}
              <ChevronDown className="size-5 transition-transform group-open:rotate-180" />
            </summary>
            <p className="mt-6 text-muted-foreground leading-relaxed">{faq.a}</p>
          </details>
        </motion.div>
      ))}
    </div>
  </div>
</section>

{/* Newsletter Signup - Lead Capture */}
<section className="py-16 bg-gradient-to-r from-primary/5 via-accent/5 to-primary/5">
  <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
    >
      <h2 className="text-3xl sm:text-4xl font-bold mb-4">Stay Ahead with Digital Insights</h2>
      <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
        Subscribe to our newsletter for free monthly tips on digital marketing in Pakistan, Meta ads strategies, SEO updates for Rawalpindi & Islamabad businesses, Shopify growth hacks, and lead generation tactics that actually work. Join 500+ entrepreneurs getting real results.
      </p>

      <div className="max-w-md mx-auto">
        <form className="flex flex-col sm:flex-row gap-4">
          <input
            type="email"
            placeholder="Enter your email address"
            className="flex-1 px-5 py-3 rounded-xl border border-border bg-background focus:outline-none focus:border-primary"
            required
          />
          <Button size="lg" className="bg-gradient-to-r from-primary to-accent text-white">
            Subscribe Now
            <Mail className="ml-2 size-5" />
          </Button>
        </form>
        <p className="text-sm text-muted-foreground mt-4">
          We respect your privacy. Unsubscribe anytime. Powered by trusted tools for digital marketing agency Rawalpindi subscribers.
        </p>
      </div>
    </motion.div>
  </div>
</section>

      {/* CTA */}
      <section className="py-20 bg-gradient-to-r from-primary/10 via-accent/10 to-primary/10">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">Ready to Take Your Business to the Next Level?</h2>
            <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
              Whether you need a powerful website, targeted ads that actually convert, Shopify store, video content, or full digital growth strategy  our 12-member expert team is ready to deliver results.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link href="/contact">
                <Button size="lg" className="bg-gradient-to-r from-primary to-accent text-white">
                  Start Your Project Today
                </Button>
              </Link>
              <Link href="/services">
                <Button size="lg" variant="outline">
                  Explore Our Services
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </>
  )
}