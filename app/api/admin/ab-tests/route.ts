import { createClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  const supabase = createClient()

  try {
    const { data, error } = await supabase
      .from('ab_tests')
      .select('*')
      .eq('status', 'active')
      .order('created_at', { ascending: false })

    if (error) throw error

    return NextResponse.json({ tests: data || [] })
  } catch (error) {
    console.error('AB Tests fetch error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch tests' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  const supabase = createClient()
  const body = await request.json()

  try {
    const { data, error } = await supabase
      .from('ab_tests')
      .insert([
        {
          name: body.name,
          description: body.description,
          type: body.type,
          variants: body.variants,
          status: 'active',
          start_date: new Date(),
        },
      ])
      .select()
      .single()

    if (error) throw error

    return NextResponse.json(data, { status: 201 })
  } catch (error) {
    console.error('AB Test creation error:', error)
    return NextResponse.json(
      { error: 'Failed to create test' },
      { status: 500 }
    )
  }
}
