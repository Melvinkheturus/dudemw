/**
 * Product Image Utility Functions
 * 
 * Provides centralized logic for getting product images with fallback hierarchy:
 * 1. Variant image (if exists)
 * 2. Main product image (first from images array)
 * 3. Placeholder image
 */

export const PLACEHOLDER_IMAGE = '/images/placeholder-product.jpg'

/**
 * Get the best available image for a product/variant with fallback logic
 * 
 * @param variantImageUrl - The variant-specific image URL
 * @param productImages - Array of product images
 * @param fallback - Fallback image URL (defaults to placeholder)
 * @returns The best available image URL
 */
export function getProductImage(
    variantImageUrl?: string | null,
    productImages?: string[] | null,
    fallback = PLACEHOLDER_IMAGE
): string {
    // Priority 1: Variant-specific image
    if (variantImageUrl && variantImageUrl.trim() !== '') {
        return variantImageUrl
    }

    // Priority 2: First product image
    if (productImages && productImages.length > 0 && productImages[0]) {
        return productImages[0]
    }

    // Priority 3: Fallback placeholder
    return fallback
}

/**
 * Get all images for a product, with variant image prepended if available
 * 
 * @param variantImageUrl - The variant-specific image URL
 * @param productImages - Array of product images
 * @returns Array of image URLs with variant image first (if exists)
 */
export function getProductImages(
    variantImageUrl?: string | null,
    productImages?: string[] | null
): string[] {
    const images: string[] = []

    // Add variant image first if it exists
    if (variantImageUrl && variantImageUrl.trim() !== '') {
        images.push(variantImageUrl)
    }

    // Add product images
    if (productImages && productImages.length > 0) {
        productImages.forEach(img => {
            if (img && !images.includes(img)) {
                images.push(img)
            }
        })
    }

    // Return at least the placeholder if no images
    return images.length > 0 ? images : [PLACEHOLDER_IMAGE]
}

/**
 * Check if a product/variant has any valid images
 */
export function hasProductImage(
    variantImageUrl?: string | null,
    productImages?: string[] | null
): boolean {
    if (variantImageUrl && variantImageUrl.trim() !== '') return true
    if (productImages && productImages.length > 0 && productImages[0]) return true
    return false
}
