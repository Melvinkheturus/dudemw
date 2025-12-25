import { NextRequest, NextResponse } from 'next/server'
import { createServerSupabase } from '@/lib/supabase/server'

/**
 * GET /api/search/instant
 * Instant search for header dropdown (fast, top 8 results)
 */
export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url)
        const query = searchParams.get('q')

        if (!query || query.trim().length < 2) {
            return NextResponse.json({ results: [] })
        }

        const supabase = await createServerSupabase()

        // Call the instant search RPC function
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const { data, error } = await (supabase.rpc as any)('search_products_instant', {
            p_query: query.trim(),
            p_limit: 8
        })

        if (error) {
            console.error('Instant search error:', error)
            return NextResponse.json(
                { error: 'Search failed' },
                { status: 500 }
            )
        }

        return NextResponse.json({ results: data || [] })
    } catch (error) {
        console.error('Instant search error:', error)
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        )
    }
}
