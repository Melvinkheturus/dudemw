export interface CampaignSection {
  id: string
  type: 'hero' | 'product-grid' | 'banner' | 'category-grid' | 'testimonials'
  title?: string
  subtitle?: string
  enabled: boolean
  order: number
  config: {
    // Hero section config
    backgroundImage?: string
    ctaText?: string
    ctaLink?: string
    
    // Product grid config
    productQuery?: 'bestsellers' | 'new-arrivals' | 'trending' | 'sale'
    productLimit?: number
    showBadges?: boolean
    
    // Banner config
    bannerImage?: string
    bannerLink?: string
    bannerAlt?: string
    
    // Category grid config
    categories?: Array<{
      id: string
      name: string
      image: string
      link: string
    }>
    
    // Layout config
    backgroundColor?: string
    textColor?: string
    padding?: 'small' | 'medium' | 'large'
    maxWidth?: 'container' | 'full'
  }
}

export interface Campaign {
  id: string
  name: string
  description?: string
  status: 'active' | 'draft' | 'scheduled' | 'archived'
  startDate?: string
  endDate?: string
  sections: CampaignSection[]
  createdAt: string
  updatedAt: string
}
