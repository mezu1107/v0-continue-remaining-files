import { createClient } from '@supabase/supabase-js'
import { NextRequest, NextResponse } from 'next/server'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

// GET campaign performance metrics
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const campaignId = searchParams.get('campaignId')
    const days = searchParams.get('days') || '30'

    if (!campaignId) {
      return NextResponse.json(
        { error: 'Campaign ID required' },
        { status: 400 }
      )
    }

    const since = new Date()
    since.setDate(since.getDate() - parseInt(days))

    const { data, error } = await supabase
      .from('google_ads_performance')
      .select('*')
      .eq('campaign_id', campaignId)
      .gte('date', since.toISOString().split('T')[0])
      .order('date', { ascending: true })

    if (error) {
      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      )
    }

    // Calculate aggregated metrics
    const totalImpressions = data.reduce((sum, d) => sum + (d.impressions || 0), 0)
    const totalClicks = data.reduce((sum, d) => sum + (d.clicks || 0), 0)
    const totalConversions = data.reduce((sum, d) => sum + (d.conversions || 0), 0)
    const totalCost = data.reduce((sum, d) => sum + (d.cost || 0), 0)

    const stats = {
      totalImpressions,
      totalClicks,
      totalConversions,
      totalCost,
      avgCTR: totalImpressions > 0 ? ((totalClicks / totalImpressions) * 100).toFixed(2) : 0,
      avgCPC: totalClicks > 0 ? (totalCost / totalClicks).toFixed(2) : 0,
      conversionRate: totalClicks > 0 ? ((totalConversions / totalClicks) * 100).toFixed(2) : 0,
      roas: totalCost > 0 ? ((totalConversions * 50) / totalCost).toFixed(2) : 0, // Assuming 50 per conversion
    }

    return NextResponse.json({
      performance: data,
      stats,
    })
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch performance data' },
      { status: 500 }
    )
  }
}

// POST update performance metrics
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const {
      campaignId,
      date,
      impressions,
      clicks,
      conversions,
      cost,
      ctr,
      cpc,
      conversionRate,
      roas,
    } = body

    if (!campaignId || !date) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Check if record exists
    const { data: existing } = await supabase
      .from('google_ads_performance')
      .select('id')
      .eq('campaign_id', campaignId)
      .eq('date', date)
      .single()

    let result

    if (existing) {
      // Update existing
      result = await supabase
        .from('google_ads_performance')
        .update({
          impressions,
          clicks,
          conversions,
          cost,
          ctr,
          cpc,
          conversion_rate: conversionRate,
          roas,
        })
        .eq('id', existing.id)
        .select()
        .single()
    } else {
      // Insert new
      result = await supabase
        .from('google_ads_performance')
        .insert({
          campaign_id: campaignId,
          date,
          impressions,
          clicks,
          conversions,
          cost,
          ctr,
          cpc,
          conversion_rate: conversionRate,
          roas,
        })
        .select()
        .single()
    }

    if (result.error) {
      return NextResponse.json(
        { error: result.error.message },
        { status: 500 }
      )
    }

    return NextResponse.json(result.data, { status: 201 })
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to update performance data' },
      { status: 500 }
    )
  }
}
