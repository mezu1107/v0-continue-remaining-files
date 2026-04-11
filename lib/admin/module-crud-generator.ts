import { createClient } from "@supabase/supabase-js"
import { NextRequest, NextResponse } from "next/server"

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

interface ModuleConfig {
  tableName: string
  displayName: string
  searchFields: string[]
  auditAction: string
}

/**
 * Generic CRUD handler factory for all admin modules
 * Usage: Just pass a config, get full CRUD endpoints
 */
export function createCRUDHandler(config: ModuleConfig) {
  return {
    GET: async (req: NextRequest) => {
      try {
        const page = parseInt(req.nextUrl.searchParams.get("page") || "1")
        const limit = parseInt(req.nextUrl.searchParams.get("limit") || "20")
        const search = req.nextUrl.searchParams.get("search") || ""
        const filter = req.nextUrl.searchParams.get("filter")

        let query = supabase.from(config.tableName).select("*", { count: "exact" })

        if (search && config.searchFields.length > 0) {
          const searchConditions = config.searchFields.map(
            (field) => `${field}.ilike.%${search}%`
          )
          query = query.or(searchConditions.join(","))
        }

        if (filter) {
          const [field, value] = filter.split(":")
          query = query.eq(field, value)
        }

        const { data, count, error } = await query
          .range((page - 1) * limit, page * limit - 1)
          .order("created_at", { ascending: false })

        if (error) throw error

        return NextResponse.json({
          data,
          pagination: {
            page,
            limit,
            total: count || 0,
            pages: Math.ceil((count || 0) / limit),
          },
        })
      } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 400 })
      }
    },

    POST: async (req: NextRequest) => {
      try {
        const body = await req.json()

        const { data, error } = await supabase
          .from(config.tableName)
          .insert([body])
          .select()
          .single()

        if (error) throw error

        await supabase.from("audit_logs").insert({
          action: `create_${config.auditAction}`,
          resource_type: config.tableName,
          resource_id: data.id,
          resource_name: data.name || data.title || JSON.stringify(data).substring(0, 50),
          new_value: data,
          status: "success",
        })

        return NextResponse.json(data, { status: 201 })
      } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 400 })
      }
    },

    PUT: async (req: NextRequest) => {
      try {
        const body = await req.json()
        const { id, ...updates } = body

        const { data: oldData } = await supabase
          .from(config.tableName)
          .select("*")
          .eq("id", id)
          .single()

        const { data, error } = await supabase
          .from(config.tableName)
          .update(updates)
          .eq("id", id)
          .select()
          .single()

        if (error) throw error

        await supabase.from("audit_logs").insert({
          action: `update_${config.auditAction}`,
          resource_type: config.tableName,
          resource_id: id,
          resource_name: data.name || data.title || JSON.stringify(data).substring(0, 50),
          old_value: oldData,
          new_value: data,
          status: "success",
        })

        return NextResponse.json(data)
      } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 400 })
      }
    },

    DELETE: async (req: NextRequest) => {
      try {
        const id = req.nextUrl.searchParams.get("id")
        if (!id) throw new Error(`${config.displayName} ID required`)

        const { data: oldData } = await supabase
          .from(config.tableName)
          .select("*")
          .eq("id", id)
          .single()

        const { error } = await supabase.from(config.tableName).delete().eq("id", id)
        if (error) throw error

        await supabase.from("audit_logs").insert({
          action: `delete_${config.auditAction}`,
          resource_type: config.tableName,
          resource_id: id,
          resource_name: oldData?.name || oldData?.title || "deleted_record",
          old_value: oldData,
          status: "success",
        })

        return NextResponse.json({ success: true })
      } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 400 })
      }
    },
  }
}

/**
 * List of all 28 modules with their configurations
 */
export const moduleConfigs: Record<string, ModuleConfig> = {
  // CORE BUSINESS (8)
  users: {
    tableName: "users",
    displayName: "User",
    searchFields: ["email", "name"],
    auditAction: "user",
  },
  clients: {
    tableName: "clients",
    displayName: "Client",
    searchFields: ["name", "email", "company"],
    auditAction: "client",
  },
  projects: {
    tableName: "projects",
    displayName: "Project",
    searchFields: ["name", "description"],
    auditAction: "project",
  },
  services: {
    tableName: "services",
    displayName: "Service",
    searchFields: ["name", "description"],
    auditAction: "service",
  },
  leads: {
    tableName: "leads",
    displayName: "Lead",
    searchFields: ["name", "email", "company"],
    auditAction: "lead",
  },
  portfolio: {
    tableName: "portfolio_items",
    displayName: "Portfolio Item",
    searchFields: ["title", "description"],
    auditAction: "portfolio",
  },
  packages: {
    tableName: "packages",
    displayName: "Package",
    searchFields: ["name", "description"],
    auditAction: "package",
  },
  crm: {
    tableName: "crm_deals",
    displayName: "CRM Deal",
    searchFields: ["name", "client_name"],
    auditAction: "crm_deal",
  },

  // CONTENT (3)
  blog: {
    tableName: "blog_posts",
    displayName: "Blog Post",
    searchFields: ["title", "content"],
    auditAction: "blog",
  },
  knowledge_base: {
    tableName: "kb_articles",
    displayName: "KB Article",
    searchFields: ["title", "content"],
    auditAction: "kb",
  },
  faqs: {
    tableName: "faqs",
    displayName: "FAQ",
    searchFields: ["question", "answer"],
    auditAction: "faq",
  },

  // LEGAL (3)
  terms: {
    tableName: "legal_terms",
    displayName: "Terms",
    searchFields: ["title", "content"],
    auditAction: "terms",
  },
  documents: {
    tableName: "legal_documents",
    displayName: "Document",
    searchFields: ["name", "type"],
    auditAction: "document",
  },
  contracts: {
    tableName: "contracts",
    displayName: "Contract",
    searchFields: ["name", "client_name"],
    auditAction: "contract",
  },

  // SUPPORT (3)
  tickets: {
    tableName: "tickets",
    displayName: "Ticket",
    searchFields: ["title", "description"],
    auditAction: "ticket",
  },
  proposals: {
    tableName: "proposals",
    displayName: "Proposal",
    searchFields: ["title", "client_name"],
    auditAction: "proposal",
  },
  support_portal: {
    tableName: "support_portal_config",
    displayName: "Support Portal",
    searchFields: ["title"],
    auditAction: "portal",
  },

  // FINANCE (4)
  invoices: {
    tableName: "invoices",
    displayName: "Invoice",
    searchFields: ["invoice_number", "client_name"],
    auditAction: "invoice",
  },
  reports: {
    tableName: "financial_reports",
    displayName: "Report",
    searchFields: ["name", "type"],
    auditAction: "report",
  },
  subscriptions: {
    tableName: "subscriptions",
    displayName: "Subscription",
    searchFields: ["client_name", "plan_name"],
    auditAction: "subscription",
  },
  multi_company: {
    tableName: "company_accounts",
    displayName: "Company",
    searchFields: ["name"],
    auditAction: "company",
  },

  // TEAM (4)
  team_members: {
    tableName: "team_members",
    displayName: "Team Member",
    searchFields: ["name", "email"],
    auditAction: "team_member",
  },
  performance: {
    tableName: "team_performance",
    displayName: "Performance",
    searchFields: ["member_name"],
    auditAction: "performance",
  },
  security: {
    tableName: "security_settings",
    displayName: "Security",
    searchFields: ["setting_name"],
    auditAction: "security",
  },
  backups: {
    tableName: "system_backups",
    displayName: "Backup",
    searchFields: ["name"],
    auditAction: "backup",
  },

  // MARKETING (2)
  campaigns: {
    tableName: "marketing_campaigns",
    displayName: "Campaign",
    searchFields: ["name", "description"],
    auditAction: "campaign",
  },
  analytics: {
    tableName: "marketing_analytics",
    displayName: "Analytics",
    searchFields: ["metric_name"],
    auditAction: "analytics",
  },

  // SYSTEM (2)
  settings: {
    tableName: "system_settings",
    displayName: "Setting",
    searchFields: ["setting_name"],
    auditAction: "setting",
  },
  portal_config: {
    tableName: "portal_configuration",
    displayName: "Portal Config",
    searchFields: ["config_name"],
    auditAction: "portal_config",
  },
}
