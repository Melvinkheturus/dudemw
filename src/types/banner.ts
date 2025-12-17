import { Database } from './database.types'

// Base types from database
export type Banner = Database['public']['Tables']['banners']['Row']
export type BannerInsert = Database['public']['Tables']['banners']['Insert']
export type BannerUpdate = Database['public']['Tables']['banners']['Update']

// Extended banner interface for frontend use
export interface BannerWithMetadata extends Banner {
  // Add any computed fields if needed
  isExpired?: boolean
  isActive?: boolean
}

// Banner placement types
export type BannerPlacement = 'homepage' | 'category'

// Banner status
export type BannerStatus = 'active' | 'inactive' | 'scheduled'
