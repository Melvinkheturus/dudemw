'use client'

import { useState } from 'react'
import { useToast } from '@/lib/layout/feedback/ToastContext'
import { supabase } from '@/lib/supabase/client'

interface PromoCodeProps {
    onApplied?: (discount: { code: string; amount: number } | null) => void
}

export default function PromoCode({ onApplied }: PromoCodeProps) {
    const [code, setCode] = useState('')
    const [isApplying, setIsApplying] = useState(false)
    const [appliedCode, setAppliedCode] = useState<string | null>(null)
    const { showToast } = useToast()

    const handleApply = async () => {
        if (!code.trim()) {
            showToast('Please enter a promo code', 'error')
            return
        }

        setIsApplying(true)
        
        try {
            // Check if coupon exists and is valid in Supabase
            const { data: coupon, error } = await supabase
                .from('coupons')
                .select('*')
                .eq('code', code.toUpperCase())
                .eq('is_active', true)
                .single()

            if (error || !coupon) {
                throw new Error('Invalid or expired promo code')
            }

            // Check if coupon is still valid (not expired, usage limits, etc.)
            const now = new Date()
            if (coupon.expires_at && new Date(coupon.expires_at) < now) {
                throw new Error('This promo code has expired')
            }

            if (coupon.usage_limit && coupon.usage_count && coupon.usage_count >= coupon.usage_limit) {
                throw new Error('This promo code has reached its usage limit')
            }

            setAppliedCode(code.toUpperCase())
            setCode('')
            showToast('Promo code applied successfully!', 'success')
            onApplied?.({ 
                code: code.toUpperCase(), 
                amount: coupon.discount_type === 'percentage' ? coupon.discount_value : coupon.discount_value 
            })
        } catch (error: any) {
            console.error('Failed to apply promo code:', error)
            showToast(error.message || 'Invalid promo code', 'error')
        } finally {
            setIsApplying(false)
        }
    }

    const handleRemove = async () => {
        if (!appliedCode) return

        setIsApplying(true)
        
        try {
            setAppliedCode(null)
            showToast('Promo code removed', 'info')
            onApplied?.(null)
        } catch (error: any) {
            console.error('Failed to remove promo code:', error)
            showToast('Failed to remove promo code', 'error')
        } finally {
            setIsApplying(false)
        }
    }

    return (
        <div className="border rounded-lg p-4">
            <h3 className="font-semibold mb-3">Promo Code</h3>

            {appliedCode ? (
                <div className="flex items-center justify-between bg-green-50 border border-green-200 rounded-lg px-4 py-3">
                    <div>
                        <span className="font-medium text-green-800">{appliedCode}</span>
                        <span className="text-sm text-green-600 ml-2">Applied</span>
                    </div>
                    <button
                        onClick={handleRemove}
                        disabled={isApplying}
                        className="text-red-600 hover:text-red-800 text-sm font-medium"
                    >
                        Remove
                    </button>
                </div>
            ) : (
                <div className="flex gap-2">
                    <input
                        type="text"
                        value={code}
                        onChange={(e) => setCode(e.target.value.toUpperCase())}
                        placeholder="Enter code"
                        className="flex-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                    />
                    <button
                        onClick={handleApply}
                        disabled={isApplying || !code.trim()}
                        className="px-4 py-2 bg-black text-white rounded-lg font-medium hover:bg-gray-800 disabled:bg-gray-400"
                    >
                        {isApplying ? 'Applying...' : 'Apply'}
                    </button>
                </div>
            )}
        </div>
    )
}
