// Quick test script to verify Supabase connection
const { createClient } = require('@supabase/supabase-js')

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY

console.log('Testing Supabase connection...')
console.log('URL:', supabaseUrl)
console.log('Service Key exists:', !!supabaseServiceKey)

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('Missing environment variables')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
})

async function testConnection() {
  try {
    // Test basic connection
    const { data, error } = await supabase
      .from('products')
      .select('id, name')
      .limit(1)

    if (error) {
      console.error('Supabase error:', error)
      return
    }

    console.log('Connection successful!')
    console.log('Sample data:', data)
  } catch (error) {
    console.error('Connection failed:', error)
  }
}

testConnection()