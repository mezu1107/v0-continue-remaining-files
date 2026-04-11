import { createClient } from "@supabase/supabase-js"
import { NextRequest, NextResponse } from "next/server"

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

// GET: Get lead source intelligence with ROI calculations
export async function GET(req: NextRequest) {
  try {
    const { data, error } = await supabase
      .from("lead_source_analytics")
      .select("*")
      .order("roi", { ascending: false })

    if (error) throw error

    // Calculate overall metrics
    const totalLeads = data.reduce((sum, s) => sum + (s.lead_count || 0), 0)
    const totalConversions = data.reduce((sum, s) => sum + (s.converted_count || 0), 0)
    const totalCost = data.reduce((sum, s) => sum + (s.cost || 0), 0)
    const totalRevenue = data.reduce((sum, s) => sum + (s.revenue || 0), 0)
    const overallROI = totalCost > 0 ? ((totalRevenue - totalCost) / totalCost * 100).toFixed(2) : "0"

    // Generate recommendations
    const recommendations = generateRecommendations(data)

    return NextResponse.json({
      data,
      summary: {
        totalLeads,
        totalConversions,
        overallConversionRate: ((totalConversions / totalLeads) * 100).toFixed(2),
        totalCost: totalCost.toFixed(2),
        totalRevenue: totalRevenue.toFixed(2),
        overallROI,
      },
      recommendations,
    })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 400 })
  }
}

// POST: Track new lead source
export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { source, sourceDetail, leadCount = 1, cost = 0 } = body

    const { data, error } = await supabase
      .from("lead_source_analytics")
      .insert([
        {
          source,
          source_detail: sourceDetail,
          lead_count: leadCount,
          converted_count: 0,
          conversion_rate: 0,
          cost,
          revenue: 0,
          roi: 0,
          last_updated: new Date().toISOString(),
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

// PUT: Update lead source metrics
export async function PUT(req: NextRequest) {
  try {
    const body = await req.json()
    const { source, sourceDetail, ...updates } = body

    // Calculate ROI if revenue and cost are provided
    if (updates.revenue !== undefined && updates.cost !== undefined) {
      updates.roi = updates.cost > 0 ? ((updates.revenue - updates.cost) / updates.cost) * 100 : 0
    }

    // Calculate conversion rate
    if (updates.converted_count !== undefined && updates.lead_count !== undefined) {
      updates.conversion_rate = (updates.converted_count / updates.lead_count) * 100
    }

    const { data, error } = await supabase
      .from("lead_source_analytics")
      .update(updates)
      .match({ source, source_detail: sourceDetail })
      .select()
      .single()

    if (error) throw error

    return NextResponse.json(data)
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 400 })
  }
}

// Helper function to generate recommendations
function generateRecommendations(sources: any[]) {
  const recommendations: string[] = []

  // Sort by ROI
  const sorted = [...sources].sort((a, b) => (b.roi || 0) - (a.roi || 0))

  if (sorted.length > 0) {
    const best = sorted[0]
    const worst = sorted[sorted.length - 1]

    recommendations.push(
      `Increase ${best.source} investment - highest ROI at ${best.roi?.toFixed(2)}%`
    )

    if ((worst.roi || 0) < 0) {
      recommendations.push(`Review ${worst.source} - negative ROI at ${worst.roi?.toFixed(2)}%`)
    }

    if ((worst.conversion_rate || 0) < 5) {
      recommendations.push(`Optimize ${worst.source} conversion funnel - currently at ${worst.conversion_rate?.toFixed(2)}%`)
    }
  }

  return recommendations
}
