"use server"

import { supabaseAdmin } from '@/lib/supabase/supabase'

interface MergeGuestDataInput {
    userId: string
    email?: string
    phone?: string
    guestId?: string
}

interface MergeResult {
    success: boolean
    mergedItems?: {
        cartItems: number
        wishlistItems: number
        orders: number
    }
    customerId?: string
    error?: string
}

export async function mergeGuestData(input: MergeGuestDataInput): Promise<MergeResult> {
    const { userId, email, phone, guestId } = input

    try {
        console.log('[MergeGuestData] Starting merge for userId:', userId, 'guestId:', guestId)

        // 1. Find guest customer records
        let guestCustomerQuery = supabaseAdmin
            .from('customers')
            .select('*')
            .eq('customer_type', 'guest')

        if (email) {
            guestCustomerQuery = guestCustomerQuery.eq('email', email)
        } else if (phone) {
            guestCustomerQuery = guestCustomerQuery.eq('phone', phone)
        }

        const { data: guestCustomers, error: guestError } = await guestCustomerQuery

        if (guestError) {
            console.error('[MergeGuestData] Error finding guest customers:', guestError)
            return { success: false, error: 'Failed to find guest data' }
        }

        let guestCustomer = guestCustomers?.[0]
        console.log('[MergeGuestData] Found guest customers:', guestCustomers?.length || 0)

        // 2. Get or create the new customer record
        let { data: newCustomer, error: customerError } = await supabaseAdmin
            .from('customers')
            .select('*')
            .eq('auth_user_id', userId)
            .single()

        if (customerError && customerError.code !== 'PGRST116') {
            console.error('[MergeGuestData] Error fetching new customer:', customerError)
            return { success: false, error: 'Failed to get customer record' }
        }

        if (!newCustomer) {
            const { data: created, error: createError } = await supabaseAdmin
                .from('customers')
                .insert({
                    auth_user_id: userId,
                    email: email || null,
                    phone: phone || null,
                    customer_type: 'registered',
                    status: 'active'
                })
                .select()
                .single()

            if (createError || !created) {
                console.error('[MergeGuestData] Error creating new customer:', createError)
                return { success: false, error: 'Failed to create customer record' }
            }

            newCustomer = created
        }

        let mergedCartItems = 0
        let mergedWishlistItems = 0
        let mergedOrders = 0

        // 3. Merge Cart Items
        if (guestId) {
            // @ts-ignore - cart_items exists
            const { data: guestCartItems } = await (supabaseAdmin as any)
                .from('cart_items')
                .select('*')
                .eq('guest_id', guestId)

            if (guestCartItems && guestCartItems.length > 0) {
                console.log('[MergeGuestData] Found', guestCartItems.length, 'guest cart items')

                // @ts-ignore - cart_items exists
                const { data: userCartItems } = await (supabaseAdmin as any)
                    .from('cart_items')
                    .select('*')
                    .eq('user_id', userId)

                const userCartMap = new Map(
                    userCartItems?.map((item: any) => [item.variant_id, item]) || []
                )

                for (const guestItem of guestCartItems as any[]) {
                    const existingItem = userCartMap.get(guestItem.variant_id) as any

                    if (existingItem) {
                        // @ts-ignore - cart_items exists
                        await (supabaseAdmin as any)
                            .from('cart_items')
                            .update({ quantity: existingItem.quantity + guestItem.quantity })
                            .eq('id', existingItem.id)

                        // @ts-ignore - cart_items exists
                        await (supabaseAdmin as any)
                            .from('cart_items')
                            .delete()
                            .eq('id', guestItem.id)

                        mergedCartItems++
                    } else {
                        // @ts-ignore - cart_items exists
                        await (supabaseAdmin as any)
                            .from('cart_items')
                            .update({ user_id: userId, guest_id: null })
                            .eq('id', guestItem.id)

                        mergedCartItems++
                    }
                }
            }
        }

        // 4. Merge Wishlist Items
        if (guestId) {
            // @ts-ignore - wishlist_items exists
            const { data: guestWishlistItems } = await (supabaseAdmin as any)
                .from('wishlist_items')
                .select('*')
                .eq('guest_id', guestId)

            if (guestWishlistItems && guestWishlistItems.length > 0) {
                console.log('[MergeGuestData] Found', guestWishlistItems.length, 'guest wishlist items')

                // @ts-ignore - wishlist_items exists
                const { data: userWishlistItems } = await (supabaseAdmin as any)
                    .from('wishlist_items')
                    .select('*')
                    .eq('user_id', userId)

                const userWishlistSet = new Set(
                    userWishlistItems?.map((item: any) => item.product_id) || []
                )

                for (const guestItem of guestWishlistItems as any[]) {
                    if (userWishlistSet.has(guestItem.product_id)) {
                        // @ts-ignore - wishlist_items exists
                        await (supabaseAdmin as any)
                            .from('wishlist_items')
                            .delete()
                            .eq('id', guestItem.id)
                    } else {
                        // @ts-ignore - wishlist_items exists
                        await (supabaseAdmin as any)
                            .from('wishlist_items')
                            .update({ user_id: userId, guest_id: null })
                            .eq('id', guestItem.id)

                        mergedWishlistItems++
                    }
                }
            }
        }

        // 5. Reassign Orders
        if (guestId) {
            const { data: guestOrders } = await supabaseAdmin
                .from('orders')
                .update({ user_id: userId, customer_id: newCustomer.id })
                .eq('guest_id', guestId)
                .is('user_id', null)
                .select('id')

            if (guestOrders) {
                mergedOrders += guestOrders.length
                console.log('[MergeGuestData] Reassigned', guestOrders.length, 'orders via guest_id')
            }
        }

        if (email && guestCustomer) {
            const { data: emailOrders } = await supabaseAdmin
                .from('orders')
                .update({ user_id: userId, customer_id: newCustomer.id })
                .eq('guest_email', email)
                .is('user_id', null)
                .select('id')

            if (emailOrders) {
                mergedOrders += emailOrders.length
                console.log('[MergeGuestData] Reassigned', emailOrders.length, 'orders via email')
            }
        }

        // 6. Mark guest customer as merged
        if (guestCustomer) {
            const metadata = typeof guestCustomer.metadata === 'object' && guestCustomer.metadata !== null
                ? guestCustomer.metadata
                : {}

            await supabaseAdmin
                .from('customers')
                .update({
                    status: 'merged',
                    metadata: {
                        ...metadata as any,
                        merged_into_user_id: userId,
                        merged_at: new Date().toISOString()
                    }
                })
                .eq('id', guestCustomer.id)
        }

        console.log('[MergeGuestData] Merge complete:', {
            cartItems: mergedCartItems,
            wishlistItems: mergedWishlistItems,
            orders: mergedOrders
        })

        return {
            success: true,
            customerId: newCustomer.id,
            mergedItems: {
                cartItems: mergedCartItems,
                wishlistItems: mergedWishlistItems,
                orders: mergedOrders
            }
        }
    } catch (error: any) {
        console.error('[MergeGuestData] Unexpected error:', error)
        return {
            success: false,
            error: error.message || 'Unexpected error during merge'
        }
    }
}
