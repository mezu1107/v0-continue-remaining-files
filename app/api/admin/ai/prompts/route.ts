import { createClient } from "@supabase/supabase-js"
import { NextRequest, NextResponse } from "next/server"

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

// GET: List prompts
export async function GET(req: NextRequest) {
  try {
    const category = req.nextUrl.searchParams.get("category")
    const page = parseInt(req.nextUrl.searchParams.get("page") || "1")
    const limit = parseInt(req.nextUrl.searchParams.get("limit") || "20")

    let query = supabase
      .from("ai_prompts")
      .select("*", { count: "exact" })
      .eq("is_latest", true)

    if (category) {
      query = query.eq("category", category)
    }

    const { data, count, error } = await query
      .range((page - 1) * limit, page * limit - 1)
      .order("performance_score", { ascending: false })

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

// POST: Create new prompt
export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { name, category, promptText, variables } = body

    const { data, error } = await supabase
      .from("ai_prompts")
      .insert([
        {
          name,
          category,
          prompt_text: promptText,
          variables,
          version: 1,
          is_latest: true,
          performance_score: 0.5,
          usage_count: 0,
          created_by: req.headers.get("x-user-id"),
        },
      ])
      .select()
      .single()

    if (error) throw error

    // Create version entry
    await supabase.from("prompt_versions").insert([
      {
        prompt_id: data.id,
        version_number: 1,
        prompt_text: promptText,
        performance_data: { created: true },
      },
    ])

    return NextResponse.json(data, { status: 201 })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 400 })
  }
}

// PUT: Update prompt (creates new version)
export async function PUT(req: NextRequest) {
  try {
    const body = await req.json()
    const { id, promptText, ...updates } = body

    // Get current prompt
    const { data: currentPrompt } = await supabase
      .from("ai_prompts")
      .select("*")
      .eq("id", id)
      .single()

    const newVersion = (currentPrompt?.version || 1) + 1

    // Update prompt
    const { data, error } = await supabase
      .from("ai_prompts")
      .update({
        ...updates,
        prompt_text: promptText,
        version: newVersion,
        updated_at: new Date().toISOString(),
      })
      .eq("id", id)
      .select()
      .single()

    if (error) throw error

    // Create version entry
    await supabase.from("prompt_versions").insert([
      {
        prompt_id: id,
        version_number: newVersion,
        prompt_text: promptText,
        performance_data: updates,
      },
    ])

    return NextResponse.json(data)
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 400 })
  }
}

// DELETE: Delete prompt
export async function DELETE(req: NextRequest) {
  try {
    const id = req.nextUrl.searchParams.get("id")
    if (!id) throw new Error("Prompt ID required")

    const { error } = await supabase.from("ai_prompts").delete().eq("id", id)
    if (error) throw error

    await supabase.from("prompt_versions").delete().eq("prompt_id", id)

    return NextResponse.json({ success: true })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 400 })
  }
}
