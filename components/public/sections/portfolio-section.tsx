"use client"

import { useEffect, useState, useRef } from "react"
import Link from "next/link"
import { motion, AnimatePresence } from "framer-motion"
import { ArrowUpRight, ExternalLink, ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { createClient } from "@/lib/supabase/client"
import { toast } from "sonner"

// ─────────────────────────────────────────────
// Project Type (same as portfolio/page.tsx)
// ─────────────────────────────────────────────
type Project = {
  id: string
  title: string
  category: string
  short_description: string
  thumbnail_url?: string
  project_type?: string
  project_url?: string
  featured: boolean
  created_at: string
}

// ─────────────────────────────────────────────
// Component – Horizontal Carousel (5-6 projects)
// ─────────────────────────────────────────────
export function PortfolioSection() {
  const supabase = createClient()
  const carouselRef = useRef<HTMLDivElement>(null)

  const [projects, setProjects] = useState<Project[]>([])
  const [loading, setLoading] = useState(true)
  const [activeCategory, setActiveCategory] = useState("All")

  // ─────────────────────────────────────────────
  // Fetch only 6 latest/featured projects
  // ─────────────────────────────────────────────
  useEffect(() => {
    let mounted = true

    const fetchProjects = async () => {
      if (!mounted) return
      setLoading(true)

      try {
        let query = supabase
          .from("portfolio_projects")
          .select("id, title, category, short_description, thumbnail_url, project_type, project_url, featured, created_at")
          .eq("active", true)
          .order("featured", { ascending: false })
          .order("created_at", { ascending: false })
          .limit(6) // Sirf 6 projects

        if (activeCategory !== "All") {
          query = query.eq("category", activeCategory)
        }

        const { data, error } = await query

        if (error) throw error

        if (mounted) setProjects(data || [])
      } catch (err: any) {
        console.error("Portfolio fetch error:", err.message)
        toast.error("Failed to load projects")
      } finally {
        if (mounted) setLoading(false)
      }
    }

    fetchProjects()

    return () => {
      mounted = false
    }
  }, [activeCategory, supabase])

  // ─────────────────────────────────────────────
  // Scroll Functions for Carousel
  // ─────────────────────────────────────────────
  const scrollLeft = () => {
    if (carouselRef.current) {
      carouselRef.current.scrollBy({ left: -300, behavior: "smooth" })
    }
  }

  const scrollRight = () => {
    if (carouselRef.current) {
      carouselRef.current.scrollBy({ left: 300, behavior: "smooth" })
    }
  }

  return (
    <section className="py-24 relative overflow-hidden" id="portfolio">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-muted/30 to-transparent" />
      
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <span className="text-sm font-medium text-primary uppercase tracking-wider">Portfolio</span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mt-4 mb-6 text-balance">
            Our Latest{" "}
            <span className="gradient-text">Projects</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto text-pretty">
            Explore our portfolio of successful projects delivered for clients worldwide.
          </p>
        </motion.div>

        {/* Projects Carousel */}
        {loading ? (
          <div className="flex justify-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          </div>
        ) : projects.length === 0 ? (
          <div className="text-center py-20 text-muted-foreground">
            No projects available at the moment.
          </div>
        ) : (
          <div className="relative">
            {/* Left Arrow */}
            <Button
              variant="ghost"
              size="icon"
              className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-background/80 backdrop-blur-sm rounded-full shadow-md"
              onClick={scrollLeft}
            >
              <ChevronLeft className="h-6 w-6" />
            </Button>

            {/* Carousel Container */}
            <div
              ref={carouselRef}
              className="flex overflow-x-auto gap-6 pb-4 snap-x snap-mandatory scrollbar-hide scroll-smooth"
              style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
            >
              {projects.map((project) => (
                <motion.div
                  key={project.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4 }}
                  className="group relative min-w-[320px] max-w-[360px] rounded-2xl overflow-hidden glass-card border border-border snap-start flex-shrink-0"
                >
                  {/* Image */}
                  <div className="relative aspect-[4/3] bg-muted overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-accent/20" />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="text-6xl font-bold text-muted-foreground/10">
                        {project.title.charAt(0)}
                      </span>
                    </div>
                    
                    {/* Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-background via-background/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    
                    {/* Link Button */}
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      {project.project_url ? (
                        <Button
                          size="sm"
                          className="bg-white text-foreground hover:bg-white/90"
                          asChild
                        >
                          <a href={project.project_url} target="_blank" rel="noopener noreferrer">
                            View Project
                            <ExternalLink className="ml-2 size-4" />
                          </a>
                        </Button>
                      ) : (
                        <Button
                          size="sm"
                          className="bg-white text-foreground hover:bg-white/90"
                        >
                          View Project
                          <ExternalLink className="ml-2 size-4" />
                        </Button>
                      )}
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-6">
                    <span className="text-xs font-medium text-primary">{project.category}</span>
                    <h3 className="text-lg font-semibold mt-1 mb-2 group-hover:text-primary transition-colors">
                      {project.title}
                    </h3>
                    <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                      {project.short_description}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Right Arrow */}
            <Button
              variant="ghost"
              size="icon"
              className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-background/80 backdrop-blur-sm rounded-full shadow-md"
              onClick={scrollRight}
            >
              <ChevronRight className="h-6 w-6" />
            </Button>
          </div>
        )}

        {/* View All Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="text-center mt-12"
        >
          <Link href="/portfolio">
            <Button variant="outline" size="lg" className="group">
              View All Projects
              <ArrowUpRight className="ml-2 size-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
            </Button>
          </Link>
        </motion.div>
      </div>
    </section>
  )
}