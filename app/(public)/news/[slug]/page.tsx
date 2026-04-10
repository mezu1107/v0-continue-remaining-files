// app/(public)/news/[slug]/page.tsx

import { createClient } from "@/lib/supabase/server"
import { notFound } from "next/navigation"
import type { Metadata } from "next"
import BlogPostClient from "./BlogPostClient"

// ─────────────────────────────────────────────
// METADATA (SERVER ONLY)
// ─────────────────────────────────────────────
export async function generateMetadata(
  { params }: { params: Promise<{ slug: string }> }
): Promise<Metadata> {

  const { slug } = await params
  const supabase = await createClient()

  const { data: post } = await supabase
    .from("blog_posts")
    .select("title, excerpt, meta_title, meta_description, featured_image, author, published_at, slug")
    .eq("slug", slug)
    .eq("active", true) // ⚠️ make sure column name is correct
    .single()

  if (!post) {
    return {
      title: "Article Not Found",
      description: "This article does not exist."
    }
  }

  return {
    title: post.meta_title || post.title,
    description: post.meta_description || post.excerpt,
  }
}

// ─────────────────────────────────────────────
// PAGE COMPONENT (SERVER)
// ─────────────────────────────────────────────
export default async function BlogPostPage(
  { params }: { params: Promise<{ slug: string }> }
) {

  const { slug } = await params
  const supabase = await createClient()

  const { data: post, error } = await supabase
    .from("blog_posts")
    .select("*")
    .eq("slug", slug)
    .eq("active", true) // ⚠️ confirm column exists
    .single()

  if (error || !post) notFound()

  const { data: related } = await supabase
    .from("blog_posts")
    .select("id, title, slug, category, content")
    .eq("category", post.category)
    .neq("id", post.id)
    .eq("active", true)
    .limit(3)

  return (
    <BlogPostClient
      post={post}
      related={related || []}
    />
  )
}