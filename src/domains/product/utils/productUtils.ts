import { Product } from '../types'

/**
 * Safely transforms raw Supabase product data to ensure non-null values where needed
 */
export function transformProduct(rawProduct: any): Product {
  return {
    ...rawProduct,
    description: rawProduct.description || '',
    images: rawProduct.images || [],
    sizes: rawProduct.sizes || [],
    colors: rawProduct.colors || [],
    category_id: rawProduct.category_id || '',
    original_price: rawProduct.original_price || undefined,
    is_featured: rawProduct.is_featured || false,
    is_on_sale: rawProduct.is_on_sale || false,
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