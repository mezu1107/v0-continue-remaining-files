import { createClient } from "@supabase/supabase-js"
import { NextRequest, NextResponse } from "next/server"

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

// GET: List all workflows
export async function GET(req: NextRequest) {
  try {
    const page = parseInt(req.nextUrl.searchParams.get("page") || "1")
    const limit = parseInt(req.nextUrl.searchParams.get("limit") || "20")
    const enabled = req.nextUrl.searchParams.get("enabled")

    let query = supabase.from("workflows").select("*", { count: "exact" })

    if (enabled !== null) {
      query = query.eq("enabled", enabled === "true")
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
}

// POST: Create workflow
export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const {
      name,
      description,
      triggerType,
      triggerResource,
      triggerCondition,
      actions,
      enabled = true,
    } = body

    const { data, error } = await supabase
      .from("workflows")
      .insert([
        {
          name,
          description,
          trigger_type: triggerType,
          trigger_resource: triggerResource,
          trigger_condition: triggerCondition,
          actions,
          enabled,
          execution_count: 0,
          success_count: 0,
          created_by: req.headers.get("x-user-id"),
        },
      ])
      .select()
      .single()

    if (error) throw error

    await supabase.from("audit_logs").insert({
      action: "create_workflow",
      resource_type: "workflows",
      resource_id: data.id,
      resource_name: data.name,
      new_value: data,
      status: "success",
    })

    return NextResponse.json(data, { status: 201 })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 400 })
  }
}

// PUT: Update workflow
export async function PUT(req: NextRequest) {
  try {
    const body = await req.json()
    const { id, ...updates } = body

    const { data, error } = await supabase
      .from("workflows")
      .update({
        ...updates,
        updated_at: new Date().toISOString(),
      })
      .eq("id", id)
      .select()
      .single()

    if (error) throw error

    await supabase.from("audit_logs").insert({
      action: "update_workflow",
      resource_type: "workflows",
      resource_id: id,
      resource_name: data.name,
      new_value: data,
      status: "success",
    })

    return NextResponse.json(data)
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 400 })
  }
}

// DELETE: Delete workflow
export async function DELETE(req: NextRequest) {
  try {
    const id = req.nextUrl.searchParams.get("id")
    if (!id) throw new Error("Workflow ID required")

    const { data: oldData } = await supabase
      .from("workflows")
      .select("*")
      .eq("id", id)
      .single()

    const { error } = await supabase.from("workflows").delete().eq("id", id)
    if (error) throw error

    await supabase.from("audit_logs").insert({
      action: "delete_workflow",
      resource_type: "workflows",
      resource_id: id,
      resource_name: oldData?.name,
      old_value: oldData,
      status: "success",
    })

    return NextResponse.json({ success: true })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 400 })
  }
}
