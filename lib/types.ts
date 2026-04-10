export type Role = "Admin" | "Manager" | "Dev" | "Client"

export interface User {
  id: number
  name: string
  email: string
  password: string
  role: Role
  avatar: string
  status: "active" | "inactive"
  lastLogin: string
  companyId: number
}

export interface Company {
  id: number
  name: string
  logo: string
  industry: string
  address: string
  email: string
  phone: string
  currency: string
  timezone: string
}

export interface Client {
  id: number
  name: string
  email: string
  phone: string
  status: "active" | "inactive" | "overdue"
  ownerId: number
  companyId: number
  industry: string
  totalRevenue: number
  joinDate: string
}

export interface ProjectTask {
  id: number
  title: string
  status: "todo" | "in-progress" | "done"
  assigneeId: number
}

export interface Project {
  id: number
  name: string
  clientId: number
  ownerId: number
  companyId: number
  status: "todo" | "in-progress" | "done"
  priority: "low" | "medium" | "high"
  progress: number
  startDate: string
  deadline: string
  budget: number
  spent: number
  description: string
  tasks: ProjectTask[]
}

export interface InvoiceItem {
  description: string
  quantity: number
  rate: number
  amount: number
}

export interface Invoice {
  id: number
  invoiceNumber: string
  clientId: number
  companyId: number
  amount: number
  tax: number
  discount: number
  total: number
  status: "paid" | "pending" | "overdue" | "draft"
  issueDate: string
  dueDate: string
  items: InvoiceItem[]
}

export interface Lead {
  id: number
  name: string
  email: string
  phone: string
  company: string
  source: string
  status: "new" | "contacted" | "qualified" | "proposal" | "closed-won" | "closed-lost"
  score: number
  ownerId: number
  companyId: number
  notes: string
  createdAt: string
}

export interface TicketMessage {
  sender: string
  text: string
  time: string
}

export interface Ticket {
  id: number
  title: string
  clientId: number
  assigneeId: number
  companyId: number
  priority: "high" | "medium" | "low"
  status: "open" | "in-progress" | "resolved" | "closed"
  createdAt: string
  messages: TicketMessage[]
}

export interface Service {
  id: number
  name: string
  category: string
  description: string
  pricing: { basic: number; pro: number; enterprise: number }
  features: string[]
  active: boolean
  companyId: number
}

export interface BlogPost {
  id: number
  title: string
  slug: string
  author: string
  authorId: number
  status: "published" | "draft"
  category: string
  tags: string[]
  content: string
  excerpt: string
  metaTitle: string
  metaDescription: string
  metaKeywords: string
  createdAt: string
  publishedAt: string | null
  companyId: number
}

export interface Activity {
  id: number
  userId: number
  action: string
  target: string
  time: string
  type: string
}

export interface Contract {
  id: number
  title: string
  clientId: number
  companyId: number
  status: "active" | "expired" | "pending"
  startDate: string
  endDate: string
  value: number
  template: string
  signed: boolean
}

export interface KnowledgeArticle {
  id: number
  title: string
  category: string
  content: string
  author: string
  companyId: number
  updatedAt: string
}
