"use client"
import { ParticlesBackground } from "@/components/public/particles-background"
import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { createClient } from "@/lib/supabase/client"
import { toast } from "sonner"
import { Search, ChevronLeft, ChevronRight, ExternalLink } from "lucide-react"
import { format } from "date-fns" // FIXED: import added here

// ─────────────────────────────────────────────
// Public Portfolio Item (safe fields only)
// ─────────────────────────────────────────────
type PortfolioItem = {
  id: string
  title: string
  slug: string
  short_description: string
  thumbnail_url?: string
  project_type?: string
  category?: string
  success_story?: string
  project_url?: string          // External live/demo URL – new tab mein khulega
  featured: boolean
  created_at: string
}

// ─────────────────────────────────────────────
// Config
// ─────────────────────────────────────────────
const ITEMS_PER_PAGE = 9

export default function PortfolioPage() {
  const supabase = createClient()

  const [items, setItems] = useState<PortfolioItem[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState("")
  const [categoryFilter, setCategoryFilter] = useState("All")
  const [page, setPage] = useState(1)
  const [categories, setCategories] = useState<string[]>(["All"])

  // ─────────────────────────────────────────────
  // Fetch active projects + realtime
  // ─────────────────────────────────────────────
  useEffect(() => {
    let isMounted = true

    const fetchPortfolio = async () => {
      if (!isMounted) return
      setLoading(true)
      try {
        const { data, error } = await supabase
          .from("portfolio_projects")
          .select("id, title, slug, short_description, thumbnail_url, project_type, category, success_story, project_url, featured, created_at")
          .eq("active", true)
          .order("featured", { ascending: false })
          .order("order_index", { ascending: true })
          .order("created_at", { ascending: false })

        if (error) throw error

        if (isMounted) {
          setItems(data || [])

          // Dynamic categories from DB
          const unique = ["All", ...new Set(data?.map(item => item.category).filter(Boolean) || [])]
          setCategories(unique)
        }
      } catch (err: any) {
        console.error("Portfolio fetch error:", err.message)
        toast.error("Failed to load portfolio")
      } finally {
        if (isMounted) setLoading(false)
      }
    }

    fetchPortfolio()

    // Realtime new project
    const channel = supabase
      .channel("portfolio-updates")
      .on("postgres_changes", { event: "INSERT", schema: "public", table: "portfolio_projects" }, (payload) => {
        if (payload.new.active && isMounted) {
          setItems(prev => [payload.new as PortfolioItem, ...prev])
          toast.success("New project added!")
        }
      })
      .subscribe()

    // Cleanup (fixed: no promise return, proper mounted check)
    return () => {
      isMounted = false
      supabase.removeChannel(channel)
    }
  }, [supabase])

  // ─────────────────────────────────────────────
  // Filtered & Paginated
  // ─────────────────────────────────────────────
  const filtered = items.filter(item => {
    const term = search.toLowerCase()
    return (
      term === "" ||
      item.title.toLowerCase().includes(term) ||
      item.short_description.toLowerCase().includes(term) ||
      item.project_type?.toLowerCase().includes(term) ||
      item.category?.toLowerCase().includes(term)
    ) && (categoryFilter === "All" || item.category === categoryFilter)
  })

  const totalItems = filtered.length
  const totalPages = Math.ceil(totalItems / ITEMS_PER_PAGE)
  const currentItems = filtered.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE)

  useEffect(() => { setPage(1) }, [search, categoryFilter])

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/10 py-12">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">
            Our Portfolio
          </h1>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
            Real projects we've delivered – explore our work.
          </p>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4 mb-10 items-center justify-center">
          <div className="relative w-full sm:w-80">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input
              placeholder="Search title or description..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="pl-10"
            />
          </div>

          <Select value={categoryFilter} onValueChange={setCategoryFilter}>
            <SelectTrigger className="w-full sm:w-60">
              <SelectValue placeholder="All Categories" />
            </SelectTrigger>
            <SelectContent>
              {categories.map(cat => (
                <SelectItem key={cat} value={cat}>{cat}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Loading / Empty */}
        {loading ? (
          <div className="flex justify-center py-20">
            <div className="animate-spin h-12 w-12 border-4 border-primary border-t-transparent rounded-full" />
          </div>
        ) : currentItems.length === 0 ? (
          <div className="text-center py-20 text-muted-foreground">
            No projects found. Try different search or category.
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
              {currentItems.map((item, i) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.08 }}
                >
                  <Card className="h-full overflow-hidden hover:shadow-xl transition-all duration-300 border group">
                    {item.thumbnail_url ? (
                      <div className="aspect-video bg-muted overflow-hidden">
                        <img
                          src={item.thumbnail_url}
                          alt={item.title}
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                      </div>
                    ) : (
                      <div className="aspect-video bg-gradient-to-br from-primary/10 to-accent/10 flex items-center justify-center">
                        <span className="text-6xl font-bold text-muted-foreground/30">
                          {item.title.charAt(0)}
                        </span>
                      </div>
                    )}

                    <CardContent className="p-6 space-y-4">
                      <h3 className="text-xl font-bold line-clamp-2 group-hover:text-primary transition-colors">
                        {item.title}
                      </h3>

                      <p className="text-sm text-muted-foreground line-clamp-3 min-h-18">
                        {item.short_description}
                      </p>

                      <div className="flex flex-wrap gap-2">
                        {item.project_type && <Badge variant="secondary">{item.project_type}</Badge>}
                        {item.category && <Badge variant="outline">{item.category}</Badge>}
                        <Badge variant="outline" className="text-xs">
                          {format(new Date(item.created_at), "MMM yyyy")}
                        </Badge>
                        {item.featured && (
                          <Badge variant="default" className="bg-yellow-500 text-black">
                            Featured
                          </Badge>
                        )}
                      </div>

                      {/* View Project Button – ONLY if project_url exists */}
                      {item.project_url && (
                        <Button
                          variant="outline"
                          size="sm"
                          className="w-full mt-4 gap-2"
                          asChild
                        >
                          <a
                            href={item.project_url}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            View Project
                            <ExternalLink className="h-4 w-4" />
                          </a>
                        </Button>
                      )}
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-center items-center gap-4 mt-12">
                <Button
                  variant="outline"
                  size="icon"
                  disabled={page === 1}
                  onClick={() => setPage(p => Math.max(1, p - 1))}
                >
                  <ChevronLeft className="h-5 w-5" />
                </Button>
                <span className="text-sm font-medium">Page {page} of {totalPages}</span>
                <Button
                  variant="outline"
                  size="icon"
                  disabled={page === totalPages}
                  onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                >
                  <ChevronRight className="h-5 w-5" />
                </Button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}