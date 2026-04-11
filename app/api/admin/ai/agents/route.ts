import { createClient } from "@supabase/supabase-js"
import { NextRequest, NextResponse } from "next/server"

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

// GET: List all AI agents
export async function GET(req: NextRequest) {
  try {
    const { data, error } = await supabase
      .from("ai_agents")
      .select("*")
      .order("created_at", { ascending: false })

    if (error) throw error

    return NextResponse.json(data)
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 400 })
  }
}

// POST: Create new agent
export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { name, agentType, model, systemPrompt, specialization, enabled = true } = body

    const { data, error } = await supabase
      .from("ai_agents")
      .insert([
        {
          name,
          agent_type: agentType,
          model,
          system_prompt: systemPrompt,
          specialization,
          enabled,
          performance_metrics: {
            totalRequests: 0,
            successRate: 0,
            avgResponseTime: 0,
          },
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

// PUT: Update agent
export async function PUT(req: NextRequest) {
  try {
    const body = await req.json()
    const { id, ...updates } = body

    const { data, error } = await supabase
      .from("ai_agents")
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

// DELETE: Delete agent
export async function DELETE(req: NextRequest) {
  try {
    const id = req.nextUrl.searchParams.get("id")
    if (!id) throw new Error("Agent ID required")

    const { error } = await supabase.from("ai_agents").delete().eq("id", id)
    if (error) throw error

    return NextResponse.json({ success: true })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 400 })
  }
}
