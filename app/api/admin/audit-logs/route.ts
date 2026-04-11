import { createClient } from "@supabase/supabase-js"
import { NextRequest, NextResponse } from "next/server"

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

// GET audit logs with advanced filtering
export async function GET(req: NextRequest) {
  try {
    const page = parseInt(req.nextUrl.searchParams.get("page") || "1")
    const limit = parseInt(req.nextUrl.searchParams.get("limit") || "50")
    const action = req.nextUrl.searchParams.get("action")
    const resourceType = req.nextUrl.searchParams.get("resourceType")
    const userId = req.nextUrl.searchParams.get("userId")
    const startDate = req.nextUrl.searchParams.get("startDate")
    const endDate = req.nextUrl.searchParams.get("endDate")

    let query = supabase.from("audit_logs").select("*, users(*)", { count: "exact" })

    if (action) query = query.eq("action", action)
    if (resourceType) query = query.eq("resource_type", resourceType)
    if (userId) query = query.eq("user_id", userId)

    if (startDate) {
      query = query.gte("timestamp", new Date(startDate).toISOString())
    }
    if (endDate) {
      query = query.lte("timestamp", new Date(endDate).toISOString())
    }

    const { data, count, error } = await query
      .range((page - 1) * limit, page * limit - 1)
      .order("timestamp", { ascending: false })

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
}

// POST: Manual audit log entry
export async function POST(req: NextRequest) {
  try {
    const body = await req.json()

    const { data, error } = await supabase
      .from("audit_logs")
      .insert([body])
      .select()
      .single()

    if (error) throw error
    return NextResponse.json(data, { status: 201 })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 400 })
  }
}

// POST /export: Export audit logs as CSV
export async function PATCH(req: NextRequest) {
  try {
    const body = await req.json()
    const { format = "json", filters = {} } = body

    // Fetch all logs matching filters
    let query = supabase.from("audit_logs").select("*")

    if (filters.action) query = query.eq("action", filters.action)
    if (filters.resourceType) query = query.eq("resource_type", filters.resourceType)
    if (filters.startDate) query = query.gte("timestamp", filters.startDate)
    if (filters.endDate) query = query.lte("timestamp", filters.endDate)

    const { data, error } = await query.order("timestamp", { ascending: false })

    if (error) throw error

    if (format === "csv") {
      // Convert to CSV
      const headers = [
        "timestamp",
        "user_id",
        "action",
        "resource_type",
        "resource_name",
        "status",
      ]
      const csv = [
        headers.join(","),
        ...data.map((log: any) =>
          [
            log.timestamp,
            log.user_id,
            log.action,
            log.resource_type,
            log.resource_name,
            log.status,
          ]
            .map((v) => `"${v}"`)
            .join(",")
        ),
      ].join("\n")

      return new NextResponse(csv, {
        headers: {
          "Content-Type": "text/csv",
          "Content-Disposition": `attachment; filename="audit-logs-${new Date().toISOString()}.csv"`,
        },
      })
    }

    return NextResponse.json(data)
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 400 })
  }
}
