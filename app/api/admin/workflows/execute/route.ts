import { createClient } from "@supabase/supabase-js"
import { NextRequest, NextResponse } from "next/server"

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

// POST: Execute workflow
export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { workflowId, triggerData } = body

    // Get workflow
    const { data: workflow, error: workflowError } = await supabase
      .from("workflows")
      .select("*")
      .eq("id", workflowId)
      .single()

    if (workflowError) throw workflowError

    if (!workflow.enabled) {
      return NextResponse.json({ error: "Workflow is disabled" }, { status: 400 })
    }

    try {
      // Execute actions
      const results = await executeActions(workflow.actions, triggerData)

      // Log execution
      const { data, error } = await supabase
        .from("workflow_executions")
        .insert([
          {
            workflow_id: workflowId,
            trigger_data: triggerData,
            status: "success",
            executed_at: new Date().toISOString(),
            completed_at: new Date().toISOString(),
          },
        ])
        .select()
        .single()

      if (error) throw error

      // Update workflow stats
      await supabase
        .from("workflows")
        .update({
          execution_count: (workflow.execution_count || 0) + 1,
          success_count: (workflow.success_count || 0) + 1,
          last_execution: new Date().toISOString(),
        })
        .eq("id", workflowId)

      return NextResponse.json({
        success: true,
        execution: data,
        results,
      })
    } catch (executionError: any) {
      // Log failed execution
      await supabase
        .from("workflow_executions")
        .insert([
          {
            workflow_id: workflowId,
            trigger_data: triggerData,
            status: "failed",
            error_message: executionError.message,
            executed_at: new Date().toISOString(),
          },
        ])

      // Update workflow stats
      await supabase
        .from("workflows")
        .update({
          execution_count: (workflow.execution_count || 0) + 1,
          last_execution: new Date().toISOString(),
        })
        .eq("id", workflowId)

      return NextResponse.json(
        { error: executionError.message },
        { status: 400 }
      )
    }
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 400 })
  }
}

// GET: Get workflow execution history
export async function GET(req: NextRequest) {
  try {
    const workflowId = req.nextUrl.searchParams.get("workflowId")
    const status = req.nextUrl.searchParams.get("status")
    const page = parseInt(req.nextUrl.searchParams.get("page") || "1")
    const limit = parseInt(req.nextUrl.searchParams.get("limit") || "20")

    let query = supabase
      .from("workflow_executions")
      .select("*", { count: "exact" })

    if (workflowId) {
      query = query.eq("workflow_id", workflowId)
    }

    if (status) {
      query = query.eq("status", status)
    }

    const { data, count, error } = await query
      .range((page - 1) * limit, page * limit - 1)
      .order("executed_at", { ascending: false })

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

// Helper: Execute workflow actions
async function executeActions(actions: any[], triggerData: any) {
  const results = []

  for (const action of actions) {
    switch (action.type) {
      case "send_email":
        results.push({
          type: "email",
          status: "sent",
          recipient: action.to,
          timestamp: new Date().toISOString(),
        })
        break

      case "create_task":
        results.push({
          type: "task",
          status: "created",
          title: action.title,
          timestamp: new Date().toISOString(),
        })
        break

      case "assign_user":
        results.push({
          type: "assignment",
          status: "assigned",
          userId: action.userId,
          timestamp: new Date().toISOString(),
        })
        break

      case "update_field":
        results.push({
          type: "update",
          status: "updated",
          field: action.field,
          value: action.value,
          timestamp: new Date().toISOString(),
        })
        break

      case "log_activity":
        results.push({
          type: "log",
          status: "logged",
          message: action.message,
          timestamp: new Date().toISOString(),
        })
        break

      default:
        results.push({
          type: action.type,
          status: "pending",
          timestamp: new Date().toISOString(),
        })
    }
  }

  return results
}
