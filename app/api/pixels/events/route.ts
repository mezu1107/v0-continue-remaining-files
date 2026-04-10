import { createClient } from '@supabase/supabase-js'
import { NextRequest, NextResponse } from 'next/server'
import { headers } from 'next/headers'
import { UAParser } from 'ua-parser-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

// POST track pixel event
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const {
      pixelCode,
      eventType,
      eventData,
      visitorId,
      pageUrl,
      referrer,
    } = body

    if (!pixelCode || !eventType) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Find pixel by code
    const { data: pixel, error: pixelError } = await supabase
      .from('tracking_pixels')
      .select('id, is_active')
      .eq('pixel_code', pixelCode)
      .single()

    if (pixelError || !pixel || !pixel.is_active) {
      return NextResponse.json(
        { error: 'Invalid or inactive pixel' },
        { status: 400 }
      )
    }

    // Get request headers for user agent and IP
    const headersList = await headers()
    const userAgent = headersList.get('user-agent') || ''
    const ipAddress = headersList.get('x-forwarded-for') || headersList.get('x-real-ip') || ''

    // Parse user agent
    const parser = new UAParser(userAgent)
    const ua = parser.getResult()

    // Record event
    const { data, error } = await supabase
      .from('pixel_events')
      .insert({
        pixel_id: pixel.id,
        event_type: eventType,
        event_data: eventData || {},
        visitor_id: visitorId,
        ip_address: ipAddress,
        user_agent: userAgent,
        page_url: pageUrl,
        referrer,
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
    console.error('Pixel tracking error:', error)
    // Return success even if tracking fails to not block page
    return NextResponse.json(
      { success: true },
      { status: 200 }
    )
  }
}

// GET pixel events
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const pixelId = searchParams.get('pixelId')
    const eventType = searchParams.get('eventType')
    const days = searchParams.get('days') || '30'

    if (!pixelId) {
      return NextResponse.json(
        { error: 'Pixel ID required' },
        { status: 400 }
      )
    }

    const since = new Date()
    since.setDate(since.getDate() - parseInt(days))

    let query = supabase
      .from('pixel_events')
      .select('*')
      .eq('pixel_id', pixelId)
      .gte('created_at', since.toISOString())
      .order('created_at', { ascending: false })

    if (eventType) {
      query = query.eq('event_type', eventType)
    }

    const { data, error } = await query

    if (error) {
      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      )
    }

    // Calculate statistics
    const stats = {
      total_events: data.length,
      unique_visitors: new Set(data.map((e) => e.visitor_id)).size,
      event_types: [...new Set(data.map((e) => e.event_type))],
      events_by_type: data.reduce((acc: Record<string, number>, e) => {
        acc[e.event_type] = (acc[e.event_type] || 0) + 1
        return acc
      }, {}),
    }

    return NextResponse.json({
      events: data,
      stats,
    })
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch events' },
      { status: 500 }
    )
  }
}
