import { createClient } from '@supabase/supabase-js'
import { NextRequest, NextResponse } from 'next/server'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

// GET all responses for a ticket
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params

    const { data, error } = await supabase
      .from('ticket_responses')
      .select(`
        *,
        responder:responder_id(id, email, first_name, last_name)
      `)
      .eq('ticket_id', id)
      .order('created_at', { ascending: true })

    if (error) {
      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      )
    }

    return NextResponse.json(data)
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch responses' },
      { status: 500 }
    )
  }
}

// POST create response
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const body = await request.json()
    const { responderId, message, isAdminResponse = true, publishOnSite = false } = body

    if (!responderId || !message) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    const { data, error } = await supabase
      .from('ticket_responses')
      .insert({
        ticket_id: id,
        responder_id: responderId,
        message,
        is_admin_response: isAdminResponse,
        published_on_site: publishOnSite,
      })
      .select()
      .single()

    if (error) {
      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      )
    }

    // If publishing response, update ticket's published status
    if (publishOnSite && isAdminResponse) {
      await supabase
        .from('tickets')
        .update({ is_published: true })
        .eq('id', id)
    }

    return NextResponse.json(data, { status: 201 })
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to create response' },
      { status: 500 }
    )
  }
}
