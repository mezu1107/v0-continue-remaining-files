import { createClient } from '@supabase/supabase-js'
import { NextRequest, NextResponse } from 'next/server'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

// GET user's Google Ads campaigns
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('userId')
    const status = searchParams.get('status')

    if (!userId) {
      return NextResponse.json(
        { error: 'User ID required' },
        { status: 400 }
      )
    }

    let query = supabase
      .from('google_ads_campaigns')
      .select(`
        *,
        performance:google_ads_performance(*)
      `)
      .eq('user_id', userId)
      .order('created_at', { ascending: false })

    if (status) {
      query = query.eq('status', status)
    }

    const { data, error } = await query

    if (error) {
      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      )
    }

    return NextResponse.json(data)
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch campaigns' },
      { status: 500 }
    )
  }
}

// POST create new campaign
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const {
      userId,
      campaignName,
      campaignType,
      budget,
      dailyBudget,
      currency = 'USD',
      targetAudience,
      keywords,
      startDate,
      endDate,
    } = body

    if (!userId || !campaignName) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    const { data, error } = await supabase
      .from('google_ads_campaigns')
      .insert({
        user_id: userId,
        campaign_name: campaignName,
        campaign_type: campaignType,
        budget: budget || null,
        daily_budget: dailyBudget || null,
        currency,
        status: 'enabled',
        target_audience: targetAudience || {},
        keywords: keywords || {},
        start_date: startDate,
        end_date: endDate,
      })
      .select()
      .single()

    if (error) {
      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      )
    }

    return NextResponse.json(data, { status: 201 })
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to create campaign' },
      { status: 500 }
    )
  }
}
