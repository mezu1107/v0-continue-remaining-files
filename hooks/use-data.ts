"use client"

import useSWR from "swr"
import { createClient } from "@/lib/supabase/client"

const supabase = createClient()

// Generic fetcher for Supabase
async function fetcher<T>(key: string): Promise<T> {
  const [table, ...params] = key.split(":")
  
  let query = supabase.from(table).select("*")
  
  // Parse additional params
  params.forEach(param => {
    const [op, field, value] = param.split("=")
    if (op === "eq") {
      query = query.eq(field, value)
    } else if (op === "order") {
      query = query.order(field, { ascending: value === "asc" })
    } else if (op === "limit") {
      query = query.limit(parseInt(field))
    }
  })
  
  const { data, error } = await query
  if (error) throw error
  return data as T
}

// Public data hooks
export function useServices() {
  return useSWR("services:eq=is_active=true:order=sort_order=asc", fetcher)
}

export function useProjects(featured?: boolean) {
  const key = featured 
    ? "projects:eq=is_public=true:eq=is_featured=true:order=created_at=desc"
    : "projects:eq=is_public=true:order=created_at=desc"
  return useSWR(key, fetcher)
}

export function useBlogPosts(category?: string) {
  const key = category && category !== "all"
    ? `blog_posts:eq=status=published:eq=category=${category}:order=published_at=desc`
    : "blog_posts:eq=status=published:order=published_at=desc"
  return useSWR(key, fetcher)
}

export function useTestimonials(featured?: boolean) {
  const key = featured
    ? "testimonials:eq=is_active=true:eq=is_featured=true:order=sort_order=asc"
    : "testimonials:eq=is_active=true:order=sort_order=asc"
  return useSWR(key, fetcher)
}

export function usePricingPlans() {
  return useSWR("pricing_plans:eq=is_active=true:order=sort_order=asc", fetcher)
}

// Admin data hooks
export function useAdminServices() {
  return useSWR("services:order=sort_order=asc", fetcher)
}

export function useAdminClients() {
  return useSWR("clients:order=created_at=desc", fetcher)
}

export function useAdminProjects() {
  return useSWR("projects:order=created_at=desc", fetcher)
}

export function useAdminInvoices() {
  return useSWR("invoices:order=created_at=desc", fetcher)
}

export function useAdminLeads() {
  return useSWR("leads:order=created_at=desc", fetcher)
}

export function useAdminTickets() {
  return useSWR("tickets:order=created_at=desc", fetcher)
}

export function useAdminBlogPosts() {
  return useSWR("blog_posts:order=created_at=desc", fetcher)
}

export function useAdminTestimonials() {
  return useSWR("testimonials:order=sort_order=asc", fetcher)
}

export function useAdminContactSubmissions() {
  return useSWR("contact_submissions:order=created_at=desc", fetcher)
}

// Real-time subscription hook
export function useRealtimeTable<T>(
  table: string,
  callback?: (payload: { new: T; old: T; eventType: string }) => void
) {
  const { data, error, mutate } = useSWR<T[]>(`${table}:order=created_at=desc`, fetcher)
  
  // Set up realtime subscription
  if (typeof window !== "undefined") {
    supabase
      .channel(`${table}_changes`)
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table },
        (payload) => {
          mutate() // Refetch data on change
          callback?.({
            new: payload.new as T,
            old: payload.old as T,
            eventType: payload.eventType
          })
        }
      )
      .subscribe()
  }
  
  return { data, error, mutate, isLoading: !data && !error }
}
