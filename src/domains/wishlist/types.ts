export interface WishlistItem {
  id: string           // Product ID
  title: string
  slug: string
  price: number
  comparePrice?: number
  image: string
  addedAt?: string
}

export interface WishlistHookReturn {
  wishlist: WishlistItem[]
  wishlistIds: Set<string>
  addToWishlist: (productId: string) => Promise<boolean>
  removeFromWishlist: (productId: string) => Promise<void>
  isWishlisted: (productId: string) => boolean
  toggleWishlist: (productId: string) => Promise<boolean>
  clearWishlist: () => Promise<void>
  count: number
  isLoading: boolean
  isSyncing: boolean
  isGuest: boolean
}
