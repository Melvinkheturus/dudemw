import { NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

/**
 * Simple debug endpoint - returns plain JSON
 */
export async function GET() {
    try {
        const result = {
            ok: true,
            time: new Date().toISOString(),
            env: {
                NODE_ENV: process.env.NODE_ENV || 'NOT_SET',
                SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL ? 'SET' : 'NOT_SET',
                ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? 'SET' : 'NOT_SET',
                SERVICE_KEY: process.env.SUPABASE_SERVICE_ROLE_KEY ? 'SET' : 'NOT_SET',
                SERVICE_KEY_LENGTH: process.env.SUPABASE_SERVICE_ROLE_KEY?.length || 0,
                KEYS_DIFFERENT: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY !== process.env.SUPABASE_SERVICE_ROLE_KEY
            }
        }

        return new Response(JSON.stringify(result, null, 2), {
            status: 200,
            headers: { 'Content-Type': 'application/json' }
        })
    } catch (e: any) {
        return new Response(JSON.stringify({ error: e.message }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' }
        })
    }
}
