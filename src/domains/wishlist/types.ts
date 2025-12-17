export interface WishlistItem {
  id: string
  name: string
  price: number
  image: string
  slug: string
}

export interface WishlistHookReturn {
  wishlist: WishlistItem[]
  addToWishlist: (item: WishlistItem) => boolean
  removeFromWishlist: (id: string) => void
  isInWishlist: (id: string) => boolean
  toggleWishlist: (item: WishlistItem) => boolean
  clearWishlist: () => void
  count: number
  isLoading: boolean
  isSyncing: boolean
  isGuest: boolean
}
