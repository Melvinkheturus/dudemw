'use client'

import { useWishlist } from '../hooks/useWishlist'
import EmptyWishlist from './EmptyWishlist'
import { ProductCard } from '@/domains/product'

export default function WishlistPage() {
  const { wishlist } = useWishlist()

  if (wishlist.length === 0) {
    return <EmptyWishlist />
  }

  // Convert wishlist items to Product format for ProductCard
  const products = wishlist.map(item => ({
    id: item.id,
    title: item.name,
    description: 'Saved to wishlist',
    price: item.price,
    images: [item.image || '/images/placeholder-product.jpg'],
    category_id: '',
    sizes: ['S', 'M', 'L', 'XL'],
    colors: ['Black', 'White'],
    in_stock: true,
    is_bestseller: false,
    is_new_drop: false,
    slug: item.slug,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  }))

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <h1 className="text-3xl font-heading font-bold mb-2">My Wishlist</h1>
        <p className="text-gray-600">{wishlist.length} {wishlist.length === 1 ? 'item' : 'items'} saved</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  )
}
