export interface WishlistItem {
  id: string
  name: string
  price: number
  originalPrice?: number
  discount?: number
  image: string
  slug: string
  variantId?: string
  variantName?: string
  size?: string
  color?: string
}

export interface WishlistHookReturn {
  wishlist: WishlistItem[]
  addToWishlist: (item: WishlistItem) => Promise<boolean>
  removeFromWishlist: (id: string, variantId?: string) => Promise<void>
  isInWishlist: (id: string, variantId?: string) => boolean
  toggleWishlist: (item: WishlistItem) => Promise<boolean>
  clearWishlist: () => Promise<void>
  count: number
  isLoading: boolean
  isSyncing: boolean
  isGuest: boolean
}
