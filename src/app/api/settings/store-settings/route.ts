import { NextRequest, NextResponse } from 'next/server'
import { createServerSupabase } from '@/lib/supabase/server'
import { supabaseAdmin } from '@/lib/supabase/supabase'

// GET store settings
export async function GET() {
  try {
    const { data, error } = await supabaseAdmin
      .from('store_settings')
      .select('*')
      .limit(1)
      .single()

    if (error && error.code !== 'PGRST116') {
      console.error('Error fetching store settings:', error)
      return NextResponse.json(
        { success: false, error: 'Failed to fetch store settings' },
        { status: 500 }
      )
    }

    // If no settings exist, create default
    if (!data) {
      const defaultSettings = {
        store_name: "Dude Men's Wears",
        legal_name: "Dude Men's Wears Pvt Ltd",
        description: "Premium men's clothing and accessories",
        invoice_prefix: 'DMW',
        currency: 'INR',
        timezone: 'Asia/Kolkata',
        country: 'India',
      }

      const { data: newData, error: insertError } = await supabaseAdmin
        .from('store_settings')
        .insert(defaultSettings)
        .select()
        .single()

      if (insertError) {
        console.error('Error creating default store settings:', insertError)
        return NextResponse.json(
          { success: false, error: 'Failed to create default settings' },
          { status: 500 }
        )
      }

      return NextResponse.json({ success: true, data: newData })
    }

    return NextResponse.json({ success: true, data })
  } catch (error: any) {
    console.error('Store settings GET error:', error)
    return NextResponse.json(
      { success: false, error: error.message || 'Internal server error' },
      { status: 500 }
    )
  }
}

// PUT update store settings
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
      .from('store_settings')
      .update({
        ...updates,
        updated_at: new Date().toISOString(),
      })
      .eq('id', id)
      .select()
      .single()

    if (error) {
      console.error('Error updating store settings:', error)
      return NextResponse.json(
        { success: false, error: 'Failed to update store settings' },
        { status: 500 }
      )
    }

    return NextResponse.json({ success: true, data })
  } catch (error: any) {
    console.error('Store settings PUT error:', error)
    return NextResponse.json(
      { success: false, error: error.message || 'Internal server error' },
      { status: 500 }
    )
  }
}
