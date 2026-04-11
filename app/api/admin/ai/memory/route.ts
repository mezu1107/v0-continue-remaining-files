import { createClient } from "@supabase/supabase-js"
import { NextRequest, NextResponse } from "next/server"

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

// GET: Retrieve AI memory items
export async function GET(req: NextRequest) {
  try {
    const memoryType = req.nextUrl.searchParams.get("type")
    const category = req.nextUrl.searchParams.get("category")
    const page = parseInt(req.nextUrl.searchParams.get("page") || "1")
    const limit = parseInt(req.nextUrl.searchParams.get("limit") || "20")

    let query = supabase
      .from("ai_memory")
      .select("*", { count: "exact" })

    if (memoryType) {
      query = query.eq("memory_type", memoryType)
    }

    if (category) {
      query = query.eq("category", category)
    }

    const { data, count, error } = await query
      .range((page - 1) * limit, page * limit - 1)
      .order("success_score", { ascending: false })

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

// POST: Add memory item
export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { memoryType, category, content, metadata, successScore = 0.5 } = body

    const { data, error } = await supabase
      .from("ai_memory")
      .insert([
        {
          memory_type: memoryType,
          category,
          content,
          metadata,
          success_score: successScore,
          usage_count: 0,
        },
      ])
      .select()
      .single()

    if (error) throw error

    return NextResponse.json(data, { status: 201 })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 400 })
  }
}

// PUT: Update memory item
export async function PUT(req: NextRequest) {
  try {
    const body = await req.json()
    const { id, ...updates } = body

    const { data, error } = await supabase
      .from("ai_memory")
      .update({
        ...updates,
        updated_at: new Date().toISOString(),
      })
      .eq("id", id)
      .select()
      .single()

    if (error) throw error

    return NextResponse.json(data)
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 400 })
  }
}

// DELETE: Delete memory item
export async function DELETE(req: NextRequest) {
  try {
    const id = req.nextUrl.searchParams.get("id")
    if (!id) throw new Error("Memory ID required")

    const { error } = await supabase.from("ai_memory").delete().eq("id", id)
    if (error) throw error

    return NextResponse.json({ success: true })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 400 })
  }
}
