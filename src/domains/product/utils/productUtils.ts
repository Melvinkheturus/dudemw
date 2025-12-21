import { Product } from '../types'

/**
 * Extracts image URLs from product_images array or uses existing images array
 */
function extractImages(rawProduct: any): string[] {
  // If product_images array exists (from DB join), extract URLs
  if (rawProduct.product_images && Array.isArray(rawProduct.product_images)) {
    return rawProduct.product_images
      .sort((a: any, b: any) => (a.is_primary ? -1 : 1) - (b.is_primary ? -1 : 1))
      .map((img: any) => img.image_url)
      .filter(Boolean)
  }
  // Otherwise use existing images array
  if (rawProduct.images && Array.isArray(rawProduct.images)) {
    return rawProduct.images
  }
  return []
}

/**
 * Safely transforms raw Supabase product data to ensure non-null values where needed
 */
export function transformProduct(rawProduct: any): Product {
  const images = extractImages(rawProduct)

  return {
    ...rawProduct,
    description: rawProduct.description || '',
    images: images,
    sizes: rawProduct.sizes || [],
    colors: rawProduct.colors || [],
    category_id: rawProduct.category_id || '',
    original_price: rawProduct.original_price || rawProduct.compare_price || undefined,
    is_featured: rawProduct.is_featured || false,
    is_bestseller: rawProduct.is_bestseller || false,
    is_new_drop: rawProduct.is_new_drop || false,
    is_on_sale: rawProduct.is_on_sale || (rawProduct.compare_price && rawProduct.compare_price > rawProduct.price),
    discount_percentage: rawProduct.discount_percentage || undefined,
    created_at: rawProduct.created_at || new Date().toISOString(),
    updated_at: rawProduct.updated_at || new Date().toISOString(),
  }
}

/**
 * Transforms an array of raw products
 */
export function transformProducts(rawProducts: any[]): Product[] {
  return (rawProducts || []).map(transformProduct)
}