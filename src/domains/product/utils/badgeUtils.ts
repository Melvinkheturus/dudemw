import { Product } from '../types'

export interface ProductBadge {
  text: string
  color: 'red' | 'black' | 'green' | 'blue'
  priority: number // Higher number = higher priority
}

/**
 * Determines the appropriate badge for a product based on database fields
 * Priority order: Custom badge > Sale > New Drop > Bestseller > Featured
 */
export function getProductBadge(product: Product): ProductBadge | null {
  // 1. Custom badge from database (highest priority)
  if (product.badge_text) {
    return {
      text: product.badge_text,
      color: (product.badge_color as any) || 'black',
      priority: 5
    }
  }

  // 2. Sale badge (high priority)
  if (product.is_on_sale && product.original_price && product.price < product.original_price) {
    const discountPercent = product.discount_percentage || 
      Math.round(((product.original_price - product.price) / product.original_price) * 100)
    
    return {
      text: `${discountPercent}% OFF`,
      color: 'red',
      priority: 4
    }
  }

  // 3. New drop badge
  if (product.is_new_drop) {
    return {
      text: 'NEW',
      color: 'green',
      priority: 3
    }
  }

  // 4. Bestseller badge
  if (product.is_bestseller) {
    return {
      text: 'BESTSELLER',
      color: 'black',
      priority: 2
    }
  }

  // 5. Featured badge (lowest priority)
  if (product.is_featured) {
    return {
      text: 'FEATURED',
      color: 'blue',
      priority: 1
    }
  }

  return null
}

/**
 * Gets multiple badges for a product (useful for detailed views)
 */
export function getAllProductBadges(product: Product): ProductBadge[] {
  const badges: ProductBadge[] = []

  // Custom badge
  if (product.badge_text) {
    badges.push({
      text: product.badge_text,
      color: (product.badge_color as any) || 'black',
      priority: 5
    })
  }

  // Sale badge
  if (product.is_on_sale && product.original_price && product.price < product.original_price) {
    const discountPercent = product.discount_percentage || 
      Math.round(((product.original_price - product.price) / product.original_price) * 100)
    
    badges.push({
      text: `${discountPercent}% OFF`,
      color: 'red',
      priority: 4
    })
  }

  // New drop
  if (product.is_new_drop) {
    badges.push({
      text: 'NEW',
      color: 'green',
      priority: 3
    })
  }

  // Bestseller
  if (product.is_bestseller) {
    badges.push({
      text: 'BESTSELLER',
      color: 'black',
      priority: 2
    })
  }

  // Featured
  if (product.is_featured) {
    badges.push({
      text: 'FEATURED',
      color: 'blue',
      priority: 1
    })
  }

  // Sort by priority (highest first)
  return badges.sort((a, b) => b.priority - a.priority)
}