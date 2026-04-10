import { createClient } from '@supabase/supabase-js'
import { NextRequest, NextResponse } from 'next/server'
import { nanoid } from 'nanoid'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

// GET all tickets or filter by user
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('userId')
    const status = searchParams.get('status')

    let query = supabase
      .from('tickets')
      .select(`
        *,
        user:user_id(id, email, first_name, last_name),
        assigned_user:assigned_to(id, email, first_name, last_name),
        responses:ticket_responses(*)
      `)

    if (userId) {
      query = query.eq('user_id', userId)
    }

    if (status) {
      query = query.eq('status', status)
    }

    const { data, error } = await query.order('created_at', { ascending: false })

    if (error) {
      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      )
    }

    return NextResponse.json(data)
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch tickets' },
      { status: 500 }
    )
  }
}

// POST create new ticket
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const {
      userId,
      title,
      description,
      category,
      priority = 'medium',
    } = body

    if (!userId || !title || !description || !category) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    const ticketNumber = `TKT-${Date.now()}-${nanoid(6)}`

    const { data, error } = await supabase
      .from('tickets')
      .insert({
        ticket_number: ticketNumber,
        user_id: userId,
        title,
        description,
        category,
        priority,
        status: 'open',
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
      { error: 'Failed to create ticket' },
      { status: 500 }
    )
  }
}
