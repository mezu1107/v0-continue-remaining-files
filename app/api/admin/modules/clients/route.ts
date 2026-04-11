import { createClient } from "@supabase/supabase-js"
import { NextRequest, NextResponse } from "next/server"

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export async function GET(req: NextRequest) {
  try {
    const page = parseInt(req.nextUrl.searchParams.get("page") || "1")
    const limit = parseInt(req.nextUrl.searchParams.get("limit") || "20")
    const search = req.nextUrl.searchParams.get("search") || ""

    let query = supabase.from("clients").select("*", { count: "exact" })

    if (search) {
      query = query.or(`name.ilike.%${search}%,email.ilike.%${search}%`)
    }

    const { data, count, error } = await query
      .range((page - 1) * limit, page * limit - 1)
      .order("created_at", { ascending: false })

    if (error) throw error

    return NextResponse.json({
      data,
      pagination: { page, limit, total: count || 0, pages: Math.ceil((count || 0) / limit) },
    })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 400 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()

    const { data, error } = await supabase
      .from("clients")
      .insert([body])
      .select()
      .single()

    if (error) throw error

    await supabase.from("audit_logs").insert({
      action: "create_client",
      resource_type: "clients",
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

export async function PUT(req: NextRequest) {
  try {
    const body = await req.json()
    const { id, ...updates } = body

    const { data: oldData } = await supabase
      .from("clients")
      .select("*")
      .eq("id", id)
      .single()

    const { data, error } = await supabase
      .from("clients")
      .update(updates)
      .eq("id", id)
      .select()
      .single()

    if (error) throw error

    await supabase.from("audit_logs").insert({
      action: "update_client",
      resource_type: "clients",
      resource_id: id,
      resource_name: data.name,
      old_value: oldData,
      new_value: data,
      status: "success",
    })

    return NextResponse.json(data)
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 400 })
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const id = req.nextUrl.searchParams.get("id")
    if (!id) throw new Error("Client ID required")

    const { data: oldData } = await supabase
      .from("clients")
      .select("*")
      .eq("id", id)
      .single()

    const { error } = await supabase.from("clients").delete().eq("id", id)
    if (error) throw error

    await supabase.from("audit_logs").insert({
      action: "delete_client",
      resource_type: "clients",
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
