import { createServerSupabase } from './supabase/server'
import { cookies } from 'next/headers'

export async function getCurrentUser() {
  try {
    const supabase = await createServerSupabase()
    const { data: { user }, error } = await supabase.auth.getUser()
    
    if (error || !user) {
      return null
    }
    
    return {
      id: user.id,
      email: user.email || '',
      name: user.user_metadata?.full_name || user.user_metadata?.name || 'User',
      phone: user.user_metadata?.phone || user.phone,
    }
  } catch (error) {
    console.error('Error getting current user:', error)
    return null
  }
}

export async function getGuestIdForAuth() {
  try {
    const cookieStore = await cookies()
    const guestId = cookieStore.get('guest_id')?.value
    
    if (!guestId) {
      // Generate a new guest ID
      const newGuestId = crypto.randomUUID()
      cookieStore.set('guest_id', newGuestId, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 60 * 60 * 24 * 30, // 30 days
      })
      return newGuestId
    }
    
    return guestId
  } catch (error) {
    console.error('Error getting guest ID:', error)
    return crypto.randomUUID()
  }
}

export async function isAdmin() {
  try {
    const user = await getCurrentUser()
    if (!user) return false
    
    // For now, check if user email is in admin list
    // You can modify this logic based on your admin setup
    const adminEmails = process.env.ADMIN_EMAILS?.split(',') || []
    return adminEmails.includes(user.email)
  } catch (error) {
    console.error('Error checking admin status:', error)
    return false
  }
}
