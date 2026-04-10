import { createClient } from '@supabase/supabase-js'
import { NextRequest, NextResponse } from 'next/server'
import { nanoid } from 'nanoid'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

// GET user's pixels
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('userId')

    if (!userId) {
      return NextResponse.json(
        { error: 'User ID required' },
        { status: 400 }
      )
    }

    const { data, error } = await supabase
      .from('tracking_pixels')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })

    if (error) {
      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      )
    }

    return NextResponse.json(data)
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch pixels' },
      { status: 500 }
    )
  }
}

// POST create new pixel
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const {
      userId,
      pixelName,
      pixelType = 'custom',
      description,
    } = body

    if (!userId || !pixelName) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    const pixelCode = `${pixelType}-${nanoid(32)}`

    const { data, error } = await supabase
      .from('tracking_pixels')
      .insert({
        user_id: userId,
        pixel_name: pixelName,
        pixel_code: pixelCode,
        pixel_type: pixelType,
        description,
        is_active: true,
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
      { error: 'Failed to create pixel' },
      { status: 500 }
    )
  }
}
