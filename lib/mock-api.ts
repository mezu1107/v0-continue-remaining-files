import usersData from "@/mock-data/users.json"
import clientsData from "@/mock-data/clients.json"
import projectsData from "@/mock-data/projects.json"
import invoicesData from "@/mock-data/invoices.json"
import leadsData from "@/mock-data/leads.json"
import ticketsData from "@/mock-data/tickets.json"
import servicesData from "@/mock-data/services.json"
import blogPostsData from "@/mock-data/blog-posts.json"
import activityData from "@/mock-data/activity.json"
import companiesData from "@/mock-data/companies.json"
import contractsData from "@/mock-data/contracts.json"
import knowledgeBaseData from "@/mock-data/knowledge-base.json"
import type { User, Client, Project, Invoice, Lead, Ticket, Service, BlogPost, Activity, Company, Contract, KnowledgeArticle } from "./types"

function delay(ms = 300): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

// TODO: Replace with real API fetch
export async function fetchUsers(): Promise<User[]> {
  await delay()
  return usersData as User[]
}

// TODO: Replace with real API fetch
export async function fetchCompanies(): Promise<Company[]> {
  await delay()
  return companiesData as Company[]
}

// TODO: Replace with real API fetch
export async function fetchClients(companyId?: number): Promise<Client[]> {
  await delay()
  const data = clientsData as Client[]
  return companyId ? data.filter((c) => c.companyId === companyId) : data
}

// TODO: Replace with real API fetch
export async function fetchProjects(companyId?: number): Promise<Project[]> {
  await delay()
  const data = projectsData as Project[]
  return companyId ? data.filter((p) => p.companyId === companyId) : data
}

// TODO: Replace with real API fetch
export async function fetchInvoices(companyId?: number): Promise<Invoice[]> {
  await delay()
  const data = invoicesData as Invoice[]
  return companyId ? data.filter((i) => i.companyId === companyId) : data
}

// TODO: Replace with real API fetch
export async function fetchLeads(companyId?: number): Promise<Lead[]> {
  await delay()
  const data = leadsData as Lead[]
  return companyId ? data.filter((l) => l.companyId === companyId) : data
}

// TODO: Replace with real API fetch
export async function fetchTickets(companyId?: number): Promise<Ticket[]> {
  await delay()
  const data = ticketsData as Ticket[]
  return companyId ? data.filter((t) => t.companyId === companyId) : data
}

// TODO: Replace with real API fetch
export async function fetchServices(companyId?: number): Promise<Service[]> {
  await delay()
  const data = servicesData as Service[]
  return companyId ? data.filter((s) => s.companyId === companyId) : data
}

// TODO: Replace with real API fetch
export async function fetchBlogPosts(companyId?: number): Promise<BlogPost[]> {
  await delay()
  const data = blogPostsData as BlogPost[]
  return companyId ? data.filter((b) => b.companyId === companyId) : data
}

// TODO: Replace with real API fetch
export async function fetchActivity(): Promise<Activity[]> {
  await delay()
  return activityData as Activity[]
}

// TODO: Replace with real API fetch
export async function fetchContracts(companyId?: number): Promise<Contract[]> {
  await delay()
  const data = contractsData as Contract[]
  return companyId ? data.filter((c) => c.companyId === companyId) : data
}

// TODO: Replace with real API fetch
export async function fetchKnowledgeBase(companyId?: number): Promise<KnowledgeArticle[]> {
  await delay()
  const data = knowledgeBaseData as KnowledgeArticle[]
  return companyId ? data.filter((k) => k.companyId === companyId) : data
}

export function formatCurrency(amount: number, currency = "USD"): string {
  return new Intl.NumberFormat("en-US", { style: "currency", currency }).format(amount)
}

export function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  })
}

export function formatDateTime(dateStr: string): string {
  return new Date(dateStr).toLocaleString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  })
}

export function getRelativeTime(dateStr: string): string {
  const now = new Date()
  const date = new Date(dateStr)
  const diff = now.getTime() - date.getTime()
  const minutes = Math.floor(diff / 60000)
  if (minutes < 1) return "Just now"
  if (minutes < 60) return `${minutes}m ago`
  const hours = Math.floor(minutes / 60)
  if (hours < 24) return `${hours}h ago`
  const days = Math.floor(hours / 24)
  return `${days}d ago`
}
