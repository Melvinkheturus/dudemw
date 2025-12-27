import { createClient } from '@supabase/supabase-js'
import { Database } from '../../types/database'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
// Support both SUPABASE_SERVICE_KEY and SUPABASE_SERVICE_ROLE_KEY for compatibility
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_SERVICE_KEY

if (!supabaseUrl) {
  throw new Error('Missing NEXT_PUBLIC_SUPABASE_URL environment variable')
}

if (!supabaseAnonKey) {
  throw new Error('Missing NEXT_PUBLIC_SUPABASE_ANON_KEY environment variable')
}

if (!supabaseServiceKey) {
  console.warn('Warning: No service role key found. Admin operations may be restricted by RLS policies.')
}

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey)

// Server-side client with service role key for admin operations
// Service role bypasses RLS policies
export const supabaseAdmin = createClient<Database>(
  supabaseUrl,
  supabaseServiceKey || supabaseAnonKey, // Fallback to anon key if service key is missing
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  }
)
