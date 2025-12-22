'use client'

/**
 * Guest Session Management
 * 
 * Manages unique guest session IDs for anonymous users.
 * Used to link localStorage cart/wishlist data with database records.
 */

const GUEST_SESSION_KEY = 'dude_guest_session_id'

/**
 * Generate a unique guest session ID
 */
function generateGuestId(): string {
    const timestamp = Date.now().toString(36)
    const randomPart = Math.random().toString(36).substring(2, 15)
    return `guest_${timestamp}_${randomPart}`
}

/**
 * Get the current guest session ID, creating one if it doesn't exist
 */
export function getGuestId(): string {
    if (typeof window === 'undefined') {
        return ''
    }

    let guestId = localStorage.getItem(GUEST_SESSION_KEY)

    if (!guestId) {
        guestId = generateGuestId()
        localStorage.setItem(GUEST_SESSION_KEY, guestId)
    }

    return guestId
}

/**
 * Check if a guest session exists
 */
export function hasGuestSession(): boolean {
    if (typeof window === 'undefined') {
        return false
    }
    return !!localStorage.getItem(GUEST_SESSION_KEY)
}

/**
 * Clear the guest session (typically called after login/registration)
 */
export function clearGuestSession(): void {
    if (typeof window === 'undefined') {
        return
    }
    localStorage.removeItem(GUEST_SESSION_KEY)
}

/**
 * Get guest data stored in localStorage
 * This includes cart items, wishlist, and shipping address
 */
export function getGuestData(): {
    cartItems: any[]
    wishlist: any[]
    shippingAddress: any | null
} {
    if (typeof window === 'undefined') {
        return { cartItems: [], wishlist: [], shippingAddress: null }
    }

    try {
        const cartItems = JSON.parse(localStorage.getItem('cart-items') || '[]')
        const wishlist = JSON.parse(localStorage.getItem('dude_wishlist') || '[]')
        const shippingAddress = JSON.parse(localStorage.getItem('shipping-address') || 'null')

        return { cartItems, wishlist, shippingAddress }
    } catch (error) {
        console.error('Error parsing guest data:', error)
        return { cartItems: [], wishlist: [], shippingAddress: null }
    }
}

/**
 * Clear all guest data from localStorage
 */
export function clearGuestData(): void {
    if (typeof window === 'undefined') {
        return
    }

    localStorage.removeItem('cart-items')
    localStorage.removeItem('dude_wishlist')
    localStorage.removeItem('shipping-address')
    clearGuestSession()
}
