import { createClient } from "@supabase/supabase-js"
import { NextRequest, NextResponse } from "next/server"

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
const supabase = createClient(supabaseUrl, supabaseKey)

// GET: Fetch all users with pagination and filters
export async function GET(req: NextRequest) {
  try {
    const searchParams = req.nextUrl.searchParams
    const page = parseInt(searchParams.get("page") || "1")
    const limit = parseInt(searchParams.get("limit") || "20")
    const search = searchParams.get("search") || ""
    const role = searchParams.get("role")

    let query = supabase.from("users").select("*", { count: "exact" })

    if (search) {
      query = query.or(`email.ilike.%${search}%,name.ilike.%${search}%`)
    }

    if (role) {
      query = query.eq("role", role)
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

// POST: Create a new user
export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { email, name, role = "user" } = body

    const { data, error } = await supabase
      .from("users")
      .insert([{ email, name, role, is_admin: role === "admin" }])
      .select()
      .single()

    if (error) throw error

    // Log audit trail
    await supabase.from("audit_logs").insert({
      action: "create_user",
      resource_type: "users",
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

// PUT: Update a user
export async function PUT(req: NextRequest) {
  try {
    const body = await req.json()
    const { id, ...updates } = body

    // Get old value for audit
    const { data: oldData } = await supabase
      .from("users")
      .select("*")
      .eq("id", id)
      .single()

    const { data, error } = await supabase
      .from("users")
      .update(updates)
      .eq("id", id)
      .select()
      .single()

    if (error) throw error

    // Log audit trail
    await supabase.from("audit_logs").insert({
      action: "update_user",
      resource_type: "users",
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

// DELETE: Delete a user
export async function DELETE(req: NextRequest) {
  try {
    const searchParams = req.nextUrl.searchParams
    const id = searchParams.get("id")

    if (!id) throw new Error("User ID required")

    // Get user data before deletion
    const { data: userData } = await supabase
      .from("users")
      .select("*")
      .eq("id", id)
      .single()

    const { error } = await supabase.from("users").delete().eq("id", id)

    if (error) throw error

    // Log audit trail
    await supabase.from("audit_logs").insert({
      action: "delete_user",
      resource_type: "users",
      resource_id: id,
      resource_name: userData?.name,
      old_value: userData,
      status: "success",
    })

    return NextResponse.json({ success: true })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 400 })
  }
}
