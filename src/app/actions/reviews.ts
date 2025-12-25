'use server'

import { createServerSupabase } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export async function submitReview(formData: FormData) {
    try {
        const supabase = await createServerSupabase()

        // Extract data
        const name = formData.get('name') as string
        const rating = parseInt(formData.get('rating') as string)
        const comment = formData.get('comment') as string
        const productId = formData.get('productId') as string
        const imagesString = formData.get('images') as string | null
        const images = imagesString ? JSON.parse(imagesString) : []

        // Validate
        if (!name || !rating || !comment || !productId) {
            return { success: false, message: 'All fields are required' }
        }

        // Insert into database
        const { error } = await supabase
            .from('product_reviews' as any)
            .insert({
                product_id: productId,
                reviewer_name: name,
                rating,
                comment,
                images,
                status: 'approved', // Changed to approved so reviews show immediately
                verified_purchase: false,
                helpful_count: 0
            })

        if (error) {
            console.error('Review submission error:', error)
            return { success: false, message: 'Failed to submit review. Please try again.' }
        }

        // Revalidate the product page
        revalidatePath(`/products/[slug]`)

        return { success: true, message: 'Thank you for your review! It will be visible after moderation.' }
    } catch (error) {
        console.error('Server action error:', error)
        return { success: false, message: 'An unexpected error occurred.' }
    }
}
