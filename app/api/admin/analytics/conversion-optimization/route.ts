import { createClient } from "@supabase/supabase-js"
import { NextRequest, NextResponse } from "next/server"

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

// GET: Get conversion analytics for all pages
export async function GET(req: NextRequest) {
  try {
    const { data, error } = await supabase
      .from("page_analytics")
      .select("*")
      .order("conversion_rate", { ascending: false })

    if (error) throw error

    // Calculate insights
    const insights = {
      totalPages: data.length,
      averageConversionRate: (data.reduce((sum, p) => sum + (p.conversion_rate || 0), 0) / data.length).toFixed(2),
      topPerformers: data.slice(0, 5),
      needsImprovement: data.filter((p) => (p.conversion_rate || 0) < 5).slice(0, 5),
    }

    return NextResponse.json({ data, insights })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 400 })
  }
}

// POST: Track conversion event
export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { pageUrl, eventType, eventName, value } = body

    // Get or create page analytics record
    const { data: existingPage } = await supabase
      .from("page_analytics")
      .select("*")
      .eq("page_url", pageUrl)
      .single()

    if (eventType === "conversion") {
      const newConversionCount = (existingPage?.conversion_count || 0) + 1
      const newConversionRate = (
        (newConversionCount / (existingPage?.visitor_count || 1)) *
        100
      ).toFixed(2)

      await supabase
        .from("page_analytics")
        .upsert({
          page_url: pageUrl,
          page_name: eventName,
          conversion_count: newConversionCount,
          conversion_rate: parseFloat(newConversionRate as string),
          last_updated: new Date().toISOString(),
        })
        .eq("page_url", pageUrl)
    }

    // Log the event
    const { data, error } = await supabase
      .from("conversion_events")
      .insert([
        {
          page_url: pageUrl,
          event_type: eventType,
          event_name: eventName,
          value: value || 0,
          timestamp: new Date().toISOString(),
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

// PUT: Update page analytics
export async function PUT(req: NextRequest) {
  try {
    const body = await req.json()
    const { pageUrl, ...updates } = body

    const { data, error } = await supabase
      .from("page_analytics")
      .update(updates)
      .eq("page_url", pageUrl)
      .select()
      .single()

    if (error) throw error

    return NextResponse.json(data)
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 400 })
  }
}
