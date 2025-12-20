import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase/supabase'

// GET payment settings
export async function GET() {
  try {
    const { data, error } = await supabaseAdmin
      .from('payment_settings')
      .select('*')
      .limit(1)
      .single()

    if (error && error.code !== 'PGRST116') {
      console.error('Error fetching payment settings:', error)
      return NextResponse.json(
        { success: false, error: 'Failed to fetch payment settings' },
        { status: 500 }
      )
    }

    // If no settings exist, create default
    if (!data) {
      const defaultSettings = {
        razorpay_enabled: false,
        razorpay_test_mode: true,
        cod_enabled: true,
        payment_methods: ['cod', 'razorpay'],
      }

      const { data: newData, error: insertError } = await supabaseAdmin
        .from('payment_settings')
        .insert(defaultSettings)
        .select()
        .single()

      if (insertError) {
        console.error('Error creating default payment settings:', insertError)
        return NextResponse.json(
          { success: false, error: 'Failed to create default settings' },
          { status: 500 }
        )
      }

      return NextResponse.json({ success: true, data: newData })
    }

    return NextResponse.json({ success: true, data })
  } catch (error: any) {
    console.error('Payment settings GET error:', error)
    return NextResponse.json(
      { success: false, error: error.message || 'Internal server error' },
      { status: 500 }
    )
  }
}

// PUT update payment settings
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()
    const { id, ...updates } = body

    if (!id) {
      return NextResponse.json(
        { success: false, error: 'Settings ID is required' },
        { status: 400 }
      )
    }

    const { data, error } = await supabaseAdmin
      .from('payment_settings')
      .update({
        ...updates,
        updated_at: new Date().toISOString(),
      })
      .eq('id', id)
      .select()
      .single()

    if (error) {
      console.error('Error updating payment settings:', error)
      return NextResponse.json(
        { success: false, error: 'Failed to update payment settings' },
        { status: 500 }
      )
    }

    return NextResponse.json({ success: true, data })
  } catch (error: any) {
    console.error('Payment settings PUT error:', error)
    return NextResponse.json(
      { success: false, error: error.message || 'Internal server error' },
      { status: 500 }
    )
  }
}
