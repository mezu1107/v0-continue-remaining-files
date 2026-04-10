"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { motion } from "framer-motion"
import { Calendar, Clock, Search } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { createClient } from "@/lib/supabase/client"
import { toast } from "sonner"
import { format } from "date-fns"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from "@/components/ui/card"

// ─────────────────────────────────────────────
// Blog Post Type (public safe fields)
// ─────────────────────────────────────────────
type BlogPost = {
  id: string
  title: string
  slug: string
  excerpt: string
  featured_image?: string
  category: string
  author: string
  published_at: string
  featured: boolean
}

// ─────────────────────────────────────────────
// Categories (can be static or dynamic from DB)
const CATEGORIES = ["All", "Technology", "Development", "Design", "Business", "AI/ML"]

export default function BlogPage() {
  const supabase = createClient()

  const [posts, setPosts] = useState<BlogPost[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState("")
  const [category, setCategory] = useState("All")

  // ─────────────────────────────────────────────
  // Fetch + Realtime (fixed useEffect cleanup)
  // ─────────────────────────────────────────────
  useEffect(() => {
    let mounted = true

    const fetchPosts = async () => {
      if (!mounted) return
      setLoading(true)
      try {
        const { data, error } = await supabase
          .from("blog_posts")
          .select("id, title, slug, excerpt, featured_image, category, author, published_at, featured")
          .eq("active", true)
          .order("featured", { ascending: false })
          .order("published_at", { ascending: false })

        if (error) throw error

        if (mounted) setPosts(data || [])
      } catch (err: any) {
        console.error("Blog fetch error:", err.message)
        toast.error("Failed to load blog posts")
      } finally {
        if (mounted) setLoading(false)
      }
    }

    fetchPosts()

    // Realtime new post
    const channel = supabase
      .channel("blog-posts")
      .on("postgres_changes", { event: "INSERT", schema: "public", table: "blog_posts" }, (payload) => {
        if (payload.new.active && mounted) {
          setPosts(prev => [payload.new as BlogPost, ...prev])
          toast.success("New article published!")
        }
      })
      .subscribe()

    // Cleanup (no promise return, proper flag)
    return () => {
      mounted = false
      supabase.removeChannel(channel)
    }
  }, [supabase])

  // ─────────────────────────────────────────────
  // Filtered Posts
  // ─────────────────────────────────────────────
  const filteredPosts = posts.filter(post => {
    const matchesSearch = search === "" ||
      post.title.toLowerCase().includes(search.toLowerCase()) ||
      post.excerpt.toLowerCase().includes(search.toLowerCase())

    const matchesCategory = category === "All" || post.category === category

    return matchesSearch && matchesCategory
  })

  const featuredPost = filteredPosts.find(p => p.featured)
  const regularPosts = filteredPosts.filter(p => !p.featured)

  return (
    <>
      {/* Deep SEO Meta Tags */}
      <head>
        <title>Blog | AM Enterprises – Web, AI, Tech & Business Insights</title>
        <meta name="description" content="Latest articles on web development, AI trends, design systems, business growth, software architecture and technology from AM Enterprises experts." />
        <meta name="keywords" content="web development, AI, React, Next.js, UI/UX design, business strategy, software development, technology trends, Pakistan tech blog" />
        <meta property="og:title" content="Blog | AM Enterprises" />
        <meta property="og:description" content="Expert insights, tutorials and trends in technology, development and business." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://yourdomain.com/news" />
        <meta name="twitter:card" content="summary_large_image" />
        <link rel="canonical" href="https://yourdomain.com/news" />
      </head>

      {/* Hero Section */}
      <section className="relative pt-32 pb-16 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-primary/5 to-transparent pointer-events-none" />
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center max-w-3xl mx-auto"
          >
            <span className="text-sm font-medium text-primary uppercase tracking-wider">Our Blog</span>
            <h1 className="text-4xl md:text-6xl font-bold mt-4 mb-6 tracking-tight">
              Insights & Resources
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground">
              Latest trends, tutorials, case studies and expert opinions to help your business grow online.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Search + Category Filters */}
      <section className="py-8 border-b border-border sticky top-16 lg:top-20 bg-background/80 backdrop-blur-xl z-30">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row items-center gap-4">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search articles..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="pl-10 py-2"
              />
            </div>

            <div className="flex flex-wrap gap-2 justify-center sm:justify-end">
              {CATEGORIES.map(cat => (
                <Button
                  key={cat}
                  variant={category === cat ? "default" : "outline"}
                  size="sm"
                  onClick={() => setCategory(cat)}
                  className="rounded-full"
                >
                  {cat}
                </Button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Featured Post (only on All + no search) */}
      {featuredPost && category === "All" && !search && (
        <section className="py-12">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <Link href={`/news/${featuredPost.slug}`}>
              <motion.article
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="group relative rounded-2xl overflow-hidden border bg-card hover:shadow-2xl transition-all duration-300"
              >
                <div className="grid md:grid-cols-2">
                  <div className="relative aspect-video md:aspect-auto bg-muted overflow-hidden">
                    {featuredPost.featured_image ? (
                      <img
                        src={featuredPost.featured_image}
                        alt={featuredPost.title}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                      />
                    ) : (
                      <div className="flex items-center justify-center h-full text-8xl font-bold text-muted-foreground/20">
                        {featuredPost.title.charAt(0)}
                      </div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                    <Badge className="absolute top-4 left-4 bg-primary text-primary-foreground">Featured</Badge>
                  </div>

                  <div className="p-8 md:p-12 flex flex-col justify-center">
                    <Badge variant="outline" className="mb-4 w-fit">{featuredPost.category}</Badge>
                    <h1 className="text-3xl md:text-4xl font-bold mb-4 group-hover:text-primary transition-colors">
                      {featuredPost.title}
                    </h1>
                    <p className="text-lg text-muted-foreground mb-6 line-clamp-3">
                      {featuredPost.excerpt}
                    </p>
                    <div className="flex items-center gap-6 text-sm text-muted-foreground">
                      <span className="flex items-center gap-2">
                        <Calendar className="h-4 w-4" />
                        {format(new Date(featuredPost.published_at), "MMM dd, yyyy")}
                      </span>
                      <span className="flex items-center gap-2">
                        <Clock className="h-4 w-4" />
                        5 min read
                      </span>
                      <span>{featuredPost.author}</span>
                    </div>
                  </div>
                </div>
              </motion.article>
            </Link>
          </div>
        </section>
      )}

      {/* Regular Posts Grid */}
      <section className="py-12">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={{
              hidden: { opacity: 0 },
              visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
            }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            {regularPosts.map(post => (
              <motion.article
                key={post.id}
                variants={{
                  hidden: { opacity: 0, y: 20 },
                  visible: { opacity: 1, y: 0 }
                }}
                className="group h-full"
              >
                <Link href={`/news/${post.slug}`}>
                  <Card className="h-full overflow-hidden hover:shadow-xl transition-all duration-300 border bg-card">
                    <div className="relative aspect-video bg-muted overflow-hidden">
                      {post.featured_image ? (
                        <img
                          src={post.featured_image}
                          alt={post.title}
                          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                        />
                      ) : (
                        <div className="flex items-center justify-center h-full text-6xl font-bold text-muted-foreground/20">
                          {post.title.charAt(0)}
                        </div>
                      )}
                      <Badge className="absolute top-4 left-4">{post.category}</Badge>
                    </div>

                    <CardContent className="p-6 space-y-4">
                      <h3 className="text-xl font-bold line-clamp-2 group-hover:text-primary transition-colors">
                        {post.title}
                      </h3>
                      <p className="text-sm text-muted-foreground line-clamp-3 min-h-18">
                        {post.excerpt}
                      </p>
                      <div className="flex items-center justify-between text-sm text-muted-foreground pt-4 border-t">
                        <span>{post.author}</span>
                        <span>{format(new Date(post.published_at), "MMM dd, yyyy")}</span>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              </motion.article>
            ))}
          </motion.div>

          {filteredPosts.length === 0 && (
            <div className="text-center py-20">
              <p className="text-muted-foreground">No articles found matching your criteria.</p>
              <Button
                variant="outline"
                className="mt-4"
                onClick={() => { setCategory("All"); setSearch("") }}
              >
                Clear Filters
              </Button>
            </div>
          )}
        </div>
      </section>
    </>
  )
}