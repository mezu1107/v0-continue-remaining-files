"use client"

import { motion } from "framer-motion"
import { format } from "date-fns"
import {
  Calendar,
  Clock,
  ArrowLeft,
  Twitter,
  Linkedin,
  Facebook,
  Bookmark
} from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"

type BlogPost = {
  id: string
  title: string
  slug: string
  content: string
  category: string
  author: string
  published_at: string
  featured_image?: string | null
}

interface Props {
  post: BlogPost
  related: {
    id: string
    title: string
    slug: string
    category: string
    content: string
  }[]
}

function getReadingTime(content?: string) {
  if (!content) return "1 min read"
  const words = content.split(/\s+/).length
  return `${Math.ceil(words / 200)} min read`
}

export default function BlogPostClient({ post, related }: Props) {

  const shareUrl = `https://www.amenterprises.tech/news/${post.slug}`
  const shareText = encodeURIComponent(post.title)

  return (
    <>
      <section className="pt-32 pb-16">
        <div className="container mx-auto px-4 max-w-4xl">

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >

            <Link href="/news" className="flex items-center gap-2 mb-6 text-muted-foreground">
              <ArrowLeft className="size-4" />
              Back to Blog
            </Link>

            <h1 className="text-4xl font-bold mb-4">{post.title}</h1>

            <div className="flex items-center gap-4 text-sm text-muted-foreground mb-6">
              <span>{post.author}</span>
              <span className="flex items-center gap-1">
                <Calendar className="size-4" />
                {format(new Date(post.published_at), "MMM dd, yyyy")}
              </span>
              <span className="flex items-center gap-1">
                <Clock className="size-4" />
                {getReadingTime(post.content)}
              </span>
            </div>

            {post.featured_image && (
              <div className="relative aspect-[21/9] mb-8 rounded-xl overflow-hidden">
                <Image
                  src={post.featured_image}
                  alt={post.title}
                  fill
                  className="object-cover"
                />
              </div>
            )}

            <div
              className="prose dark:prose-invert max-w-none"
              dangerouslySetInnerHTML={{ __html: post.content }}
            />

            <div className="mt-10 flex gap-3">
              <Button variant="outline" size="icon" asChild>
                <a href={`https://twitter.com/intent/tweet?url=${shareUrl}&text=${shareText}`} target="_blank">
                  <Twitter className="size-4" />
                </a>
              </Button>

              <Button variant="outline" size="icon" asChild>
                <a href={`https://www.linkedin.com/shareArticle?mini=true&url=${shareUrl}`} target="_blank">
                  <Linkedin className="size-4" />
                </a>
              </Button>

              <Button variant="outline" size="icon" asChild>
                <a href={`https://www.facebook.com/sharer/sharer.php?u=${shareUrl}`} target="_blank">
                  <Facebook className="size-4" />
                </a>
              </Button>

              <Button variant="outline" size="icon">
                <Bookmark className="size-4" />
              </Button>
            </div>

          </motion.div>

          {related.length > 0 && (
            <div className="mt-16">
              <h3 className="text-2xl font-bold mb-6">Related Articles</h3>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {related.map((rel) => (
                  <Link key={rel.id} href={`/news/${rel.slug}`}>
                    <div className="border rounded-xl p-6 hover:border-primary transition">
                      <span className="text-xs text-primary">{rel.category}</span>
                      <h4 className="font-semibold mt-2 line-clamp-2">{rel.title}</h4>
                      <span className="text-xs text-muted-foreground mt-2 block">
                        {getReadingTime(rel.content)}
                      </span>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}

        </div>
      </section>
    </>
  )
}