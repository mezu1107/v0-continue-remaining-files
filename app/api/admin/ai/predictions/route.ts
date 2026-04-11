import { createClient } from "@supabase/supabase-js"
import { NextRequest, NextResponse } from "next/server"

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

// GET: Get predictions
export async function GET(req: NextRequest) {
  try {
    const resourceType = req.nextUrl.searchParams.get("resourceType")
    const resourceId = req.nextUrl.searchParams.get("resourceId")
    const predictionType = req.nextUrl.searchParams.get("predictionType")
    const page = parseInt(req.nextUrl.searchParams.get("page") || "1")
    const limit = parseInt(req.nextUrl.searchParams.get("limit") || "20")

    let query = supabase
      .from("predictions")
      .select("*", { count: "exact" })

    if (resourceType) {
      query = query.eq("resource_type", resourceType)
    }

    if (resourceId) {
      query = query.eq("resource_id", resourceId)
    }

    if (predictionType) {
      query = query.eq("prediction_type", predictionType)
    }

    const { data, count, error } = await query
      .range((page - 1) * limit, page * limit - 1)
      .order("prediction_value", { ascending: false })

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

// POST: Create prediction
export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const {
      predictionType,
      resourceType,
      resourceId,
      predictionValue,
      predictionReason,
      suggestedAction,
      confidenceScore = 0.5,
    } = body

    const { data, error } = await supabase
      .from("predictions")
      .insert([
        {
          prediction_type: predictionType,
          resource_type: resourceType,
          resource_id: resourceId,
          prediction_value: predictionValue,
          prediction_reason: predictionReason,
          suggested_action: suggestedAction,
          confidence_score: confidenceScore,
          validated: false,
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

// PUT: Validate prediction (for model training)
export async function PUT(req: NextRequest) {
  try {
    const body = await req.json()
    const { id, validated, actualOutcome } = body

    const { data, error } = await supabase
      .from("predictions")
      .update({
        validated,
        actual_outcome: actualOutcome,
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

// PATCH: Generate predictions (ML inference)
export async function PATCH(req: NextRequest) {
  try {
    const body = await req.json()
    const { resourceType, resourceId } = body

    // Get resource data
    const { data: resourceData, error: resourceError } = await supabase
      .from(resourceType)
      .select("*")
      .eq("id", resourceId)
      .single()

    if (resourceError) throw resourceError

    // Generate predictions based on resource type
    const predictions = generatePredictions(resourceType, resourceData)

    // Save predictions
    for (const prediction of predictions) {
      await supabase.from("predictions").insert([prediction])
    }

    return NextResponse.json({
      success: true,
      generatedCount: predictions.length,
      predictions,
    })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 400 })
  }
}

// Helper: Generate predictions based on data patterns
function generatePredictions(resourceType: string, resourceData: any): any[] {
  const predictions = []

  if (resourceType === "leads") {
    // Lead conversion prediction
    const conversionProbability = calculateLeadConversion(resourceData)
    predictions.push({
      prediction_type: "lead_conversion",
      resource_type: "leads",
      resource_id: resourceData.id,
      prediction_value: conversionProbability,
      prediction_reason: conversionProbability > 0.7 ? "High fit with past successful leads" : "Needs nurturing",
      suggested_action: conversionProbability > 0.7 ? "Send proposal immediately" : "Schedule follow-up call",
      confidence_score: 0.85,
    })
  }

  if (resourceType === "clients") {
    // Churn risk prediction
    const churnRisk = calculateChurnRisk(resourceData)
    predictions.push({
      prediction_type: "churn_risk",
      resource_type: "clients",
      resource_id: resourceData.id,
      prediction_value: churnRisk,
      prediction_reason: churnRisk > 0.6 ? "Low engagement detected" : "Healthy account",
      suggested_action: churnRisk > 0.6 ? "Schedule check-in call" : "Continue normal engagement",
      confidence_score: 0.8,
    })
  }

  if (resourceType === "invoices") {
    // Payment risk prediction
    const paymentRisk = calculatePaymentRisk(resourceData)
    predictions.push({
      prediction_type: "payment_risk",
      resource_type: "invoices",
      resource_id: resourceData.id,
      prediction_value: paymentRisk,
      prediction_reason: paymentRisk > 0.5 ? "Payment overdue pattern" : "Expected payment on time",
      suggested_action: paymentRisk > 0.5 ? "Send payment reminder" : "Monitor normally",
      confidence_score: 0.75,
    })
  }

  return predictions
}

function calculateLeadConversion(lead: any): number {
  let score = 0.5

  if (lead.company) score += 0.1
  if (lead.budget) score += 0.15
  if (lead.decision_maker) score += 0.15
  if (lead.timeline && lead.timeline !== "no_timeline") score += 0.1

  return Math.min(score, 0.95)
}

function calculateChurnRisk(client: any): number {
  let risk = 0.3

  // Reduce risk for long-term clients
  if (client.tenure_months && client.tenure_months > 12) risk -= 0.15
  if (client.tenure_months && client.tenure_months < 3) risk += 0.2

  // Check engagement
  if (client.last_interaction_days && client.last_interaction_days > 90) risk += 0.3
  if (client.support_tickets && client.support_tickets > 5) risk -= 0.1

  return Math.min(Math.max(risk, 0), 1)
}

function calculatePaymentRisk(invoice: any): number {
  let risk = 0.2

  if (invoice.days_overdue && invoice.days_overdue > 0) {
    risk += Math.min(invoice.days_overdue / 100, 0.5)
  }

  if (invoice.client_payment_history === "late") risk += 0.2
  if (invoice.client_payment_history === "early") risk -= 0.2

  return Math.min(Math.max(risk, 0), 1)
}
