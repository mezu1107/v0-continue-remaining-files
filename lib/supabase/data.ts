"use server"

import { createClient } from "./server"

// ============ PUBLIC DATA FETCHING ============

export async function getServices() {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from("services")
    .select("*")
    .eq("is_active", true)
    .order("sort_order")
  
  if (error) {
    console.error("Error fetching services:", error)
    return []
  }
  return data || []
}

export async function getServiceBySlug(slug: string) {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from("services")
    .select("*")
    .eq("slug", slug)
    .eq("is_active", true)
    .single()
  
  if (error) return null
  return data
}

export async function getProjects(featured?: boolean) {
  const supabase = await createClient()
  let query = supabase
    .from("projects")
    .select(`
      *,
      client:clients(name, company_name, logo),
      service:services(name, slug)
    `)
    .eq("is_public", true)
    .order("created_at", { ascending: false })
  
  if (featured) {
    query = query.eq("is_featured", true)
  }
  
  const { data, error } = await query
  if (error) {
    console.error("Error fetching projects:", error)
    return []
  }
  return data || []
}

export async function getProjectBySlug(slug: string) {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from("projects")
    .select(`
      *,
      client:clients(name, company_name, logo),
      service:services(name, slug)
    `)
    .eq("slug", slug)
    .eq("is_public", true)
    .single()
  
  if (error) return null
  return data
}

export async function getBlogPosts(category?: string, limit?: number) {
  const supabase = await createClient()
  let query = supabase
    .from("blog_posts")
    .select(`
      *,
      author:profiles(name, avatar)
    `)
    .eq("status", "published")
    .order("published_at", { ascending: false })
  
  if (category && category !== "all") {
    query = query.eq("category", category)
  }
  
  if (limit) {
    query = query.limit(limit)
  }
  
  const { data, error } = await query
  if (error) {
    console.error("Error fetching blog posts:", error)
    return []
  }
  return data || []
}

export async function getBlogPostBySlug(slug: string) {
  const supabase = await createClient()
  
  // Increment view count
  await supabase.rpc("increment_blog_views", { post_slug: slug })
  
  const { data, error } = await supabase
    .from("blog_posts")
    .select(`
      *,
      author:profiles(name, avatar, role)
    `)
    .eq("slug", slug)
    .eq("status", "published")
    .single()
  
  if (error) return null
  return data
}

export async function getTestimonials(featured?: boolean) {
  const supabase = await createClient()
  let query = supabase
    .from("testimonials")
    .select("*")
    .eq("is_active", true)
    .order("sort_order")
  
  if (featured) {
    query = query.eq("is_featured", true)
  }
  
  const { data, error } = await query
  if (error) {
    console.error("Error fetching testimonials:", error)
    return []
  }
  return data || []
}

export async function getPricingPlans() {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from("pricing_plans")
    .select("*")
    .eq("is_active", true)
    .order("sort_order")
  
  if (error) {
    console.error("Error fetching pricing plans:", error)
    return []
  }
  return data || []
}

export async function getSiteConfig(key: string) {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from("site_config")
    .select("value")
    .eq("key", key)
    .single()
  
  if (error) return null
  return data?.value
}

export async function getCompanyInfo() {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from("companies")
    .select("*")
    .limit(1)
    .single()
  
  if (error) return null
  return data
}

// ============ CONTACT FORM ============

export async function submitContactForm(formData: {
  name: string
  email: string
  phone?: string
  company_name?: string
  service?: string
  budget?: string
  message: string
  source?: string
}) {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from("contact_submissions")
    .insert({
      company_id: "00000000-0000-0000-0000-000000000001",
      ...formData,
      status: "new",
      source: formData.source || "website"
    })
    .select()
    .single()
  
  if (error) {
    console.error("Error submitting contact form:", error)
    return { success: false, error: error.message }
  }
  
  return { success: true, data }
}

// ============ ADMIN DATA FETCHING ============

export async function getAdminServices() {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from("services")
    .select("*")
    .order("sort_order")
  
  if (error) throw error
  return data || []
}

export async function getAdminClients() {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from("clients")
    .select("*")
    .order("created_at", { ascending: false })
  
  if (error) throw error
  return data || []
}

export async function getAdminProjects() {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from("projects")
    .select(`
      *,
      client:clients(name, company_name),
      service:services(name)
    `)
    .order("created_at", { ascending: false })
  
  if (error) throw error
  return data || []
}

export async function getAdminInvoices() {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from("invoices")
    .select(`
      *,
      client:clients(name, company_name, email),
      project:projects(name)
    `)
    .order("created_at", { ascending: false })
  
  if (error) throw error
  return data || []
}

export async function getAdminLeads() {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from("leads")
    .select(`
      *,
      assigned_to:profiles(name, avatar)
    `)
    .order("created_at", { ascending: false })
  
  if (error) throw error
  return data || []
}

export async function getAdminTickets() {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from("tickets")
    .select(`
      *,
      client:clients(name, company_name),
      assigned_to:profiles(name, avatar)
    `)
    .order("created_at", { ascending: false })
  
  if (error) throw error
  return data || []
}

export async function getAdminBlogPosts() {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from("blog_posts")
    .select(`
      *,
      author:profiles(name, avatar)
    `)
    .order("created_at", { ascending: false })
  
  if (error) throw error
  return data || []
}

export async function getAdminTestimonials() {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from("testimonials")
    .select("*")
    .order("sort_order")
  
  if (error) throw error
  return data || []
}

export async function getAdminPricingPlans() {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from("pricing_plans")
    .select("*")
    .order("sort_order")
  
  if (error) throw error
  return data || []
}

export async function getAdminContactSubmissions() {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from("contact_submissions")
    .select("*")
    .order("created_at", { ascending: false })
  
  if (error) throw error
  return data || []
}

// ============ DASHBOARD STATS ============

export async function getDashboardStats() {
  const supabase = await createClient()
  
  const [
    { count: clientsCount },
    { count: projectsCount },
    { count: invoicesCount },
    { count: leadsCount },
    { count: ticketsCount },
    { data: recentInvoices }
  ] = await Promise.all([
    supabase.from("clients").select("*", { count: "exact", head: true }),
    supabase.from("projects").select("*", { count: "exact", head: true }),
    supabase.from("invoices").select("*", { count: "exact", head: true }),
    supabase.from("leads").select("*", { count: "exact", head: true }),
    supabase.from("tickets").select("*", { count: "exact", head: true }).eq("status", "open"),
    supabase.from("invoices").select("total, status").limit(100)
  ])
  
  const totalRevenue = recentInvoices?.reduce((sum, inv) => 
    inv.status === "paid" ? sum + (inv.total || 0) : sum, 0) || 0
  
  return {
    clients: clientsCount || 0,
    projects: projectsCount || 0,
    invoices: invoicesCount || 0,
    leads: leadsCount || 0,
    openTickets: ticketsCount || 0,
    totalRevenue
  }
}

// ============ CRUD OPERATIONS ============

export async function createRecord(table: string, data: Record<string, unknown>) {
  const supabase = await createClient()
  const { data: result, error } = await supabase
    .from(table)
    .insert({
      company_id: "00000000-0000-0000-0000-000000000001",
      ...data
    })
    .select()
    .single()
  
  if (error) throw error
  return result
}

export async function updateRecord(table: string, id: string, data: Record<string, unknown>) {
  const supabase = await createClient()
  const { data: result, error } = await supabase
    .from(table)
    .update({ ...data, updated_at: new Date().toISOString() })
    .eq("id", id)
    .select()
    .single()
  
  if (error) throw error
  return result
}

export async function deleteRecord(table: string, id: string) {
  const supabase = await createClient()
  const { error } = await supabase
    .from(table)
    .delete()
    .eq("id", id)
  
  if (error) throw error
  return true
}
