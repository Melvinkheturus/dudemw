'use server'

import { supabaseAdmin } from '@/lib/supabase/supabase'

export interface CouponValidationResult {
    isValid: boolean
    error?: string
    coupon?: {
        code: string
        discountType: 'percentage' | 'fixed'
        discountValue: number
        discountAmount: number
    }
}

export async function validateCoupon(
    code: string,
    cartTotal: number,
    userId?: string
): Promise<CouponValidationResult> {
    try {
        if (!code) {
            return { isValid: false, error: 'Promo code is required' }
        }

        // Fetch coupon securely using admin client to bypass RLS
        const { data, error } = await supabaseAdmin
            .from('coupons')
            .select('*')
            .eq('code', code.toUpperCase())
            .single()

        const coupon = data as any // Bypass stale types

        if (error || !coupon) {
            return { isValid: false, error: 'Invalid promo code' }
        }

        // Check active status
        if (!coupon.is_active) {
            return { isValid: false, error: 'This promo code is inactive' }
        }

        // Check expiry
        if (coupon.expires_at) {
            const expiryDate = new Date(coupon.expires_at)
            if (expiryDate < new Date()) {
                return { isValid: false, error: 'This promo code has expired' }
            }
        }

        // Check usage limits
        if (coupon.usage_limit && coupon.usage_count >= coupon.usage_limit) {
            return { isValid: false, error: 'This promo code has reached its usage limit' }
        }

        // Calculate discount amount
        let discountAmount = 0
        if (coupon.discount_type === 'percentage') {
            discountAmount = (cartTotal * coupon.discount_value) / 100
            // Optional: Cap percentage discount if needed (e.g., max ₹500 off)
        } else {
            discountAmount = coupon.discount_value
        }

        // Ensure discount doesn't exceed cart total
        discountAmount = Math.min(discountAmount, cartTotal)

        return {
            isValid: true,
            coupon: {
                code: coupon.code,
                discountType: coupon.discount_type,
                discountValue: coupon.discount_value,
                discountAmount
            }
        }

    } catch (error) {
        console.error('Coupon validation error:', error)
        return { isValid: false, error: 'Failed to validate promo code' }
    }
}

export async function deleteCoupon(couponId: string): Promise<{ success: boolean; error?: string }> {
    try {
        if (!couponId) {
            return { success: false, error: 'Coupon ID is required' }
        }

        const { error } = await supabaseAdmin
            .from('coupons')
            .delete()
            .eq('id', couponId)

        if (error) {
            console.error('Error deleting coupon:', error)
            return { success: false, error: error.message }
        }

        return { success: true }
    } catch (error) {
        console.error('Delete coupon error:', error)
        return { success: false, error: 'Failed to delete coupon' }
    }
}

export async function createCoupon(data: any): Promise<{ success: boolean; error?: string }> {
    try {
        const { error } = await supabaseAdmin
            .from('coupons')
            .insert([data])

        if (error) {
            console.error('Error creating coupon:', error)
            if (error.code === '23505') {
                return { success: false, error: 'A coupon with this code already exists' }
            }
            return { success: false, error: error.message }
        }

        return { success: true }
    } catch (error) {
        console.error('Create coupon error:', error)
        return { success: false, error: 'Failed to create coupon' }
    }
}

export async function updateCoupon(id: string, data: any): Promise<{ success: boolean; error?: string }> {
    try {
        if (!id) {
            return { success: false, error: 'Coupon ID is required' }
        }

        const { error } = await supabaseAdmin
            .from('coupons')
            .update(data)
            .eq('id', id)

        if (error) {
            console.error('Error updating coupon:', error)
            if (error.code === '23505') {
                return { success: false, error: 'A coupon with this code already exists' }
            }
            return { success: false, error: error.message }
        }

        return { success: true }
    } catch (error) {
        console.error('Update coupon error:', error)
        return { success: false, error: 'Failed to update coupon' }
    }
}
