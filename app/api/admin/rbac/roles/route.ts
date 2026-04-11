import { createClient } from "@supabase/supabase-js"
import { NextRequest, NextResponse } from "next/server"

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

// GET all roles
export async function GET(req: NextRequest) {
  try {
    const { data, error } = await supabase
      .from("admin_roles")
      .select("*, role_permissions(*), field_access_control(*)")
      .order("rank")

    if (error) throw error
    return NextResponse.json(data)
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 400 })
  }
}

// POST: Create role
export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { name, description, rank } = body

    const { data, error } = await supabase
      .from("admin_roles")
      .insert([{ name, description, rank }])
      .select()
      .single()

    if (error) throw error

    await supabase.from("audit_logs").insert({
      action: "create_role",
      resource_type: "admin_roles",
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

// PUT: Update role
export async function PUT(req: NextRequest) {
  try {
    const body = await req.json()
    const { id, ...updates } = body

    const { data, error } = await supabase
      .from("admin_roles")
      .update(updates)
      .eq("id", id)
      .select()
      .single()

    if (error) throw error

    await supabase.from("audit_logs").insert({
      action: "update_role",
      resource_type: "admin_roles",
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
