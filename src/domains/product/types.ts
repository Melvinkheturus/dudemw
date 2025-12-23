import type { Product } from './types/index'

export interface ProductCardProps {
  product: Product
  // Badge is determined from product properties, not hardcoded
  showBadge?: boolean
}

export interface ProductGridProps {
  products: Product[]
}

export interface RelatedProductsProps {
  products?: Product[]
}

// Re-export types for convenience
export type { Product, Category, ProductVariant } from './types/index'
