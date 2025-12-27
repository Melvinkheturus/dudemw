// Collections domain types
export interface Collection {
  id: string
  name: string
  slug: string
  description?: string
  image?: string
  products?: string[]
  isActive: boolean
  createdAt: string
  updatedAt: string
}

export interface CollectionFilters {
  category?: string
  priceRange?: [number, number]
  sortBy?: 'name' | 'price' | 'created_at'
  sortOrder?: 'asc' | 'desc'
}
