'use client'

import { useWishlist } from '../hooks/useWishlist'
import EmptyWishlist from './EmptyWishlist'
import Link from 'next/link'
import Image from 'next/image'
import { Heart, ShoppingCart } from 'lucide-react'

export default function WishlistPage() {
  const { wishlist, removeFromWishlist, isLoading } = useWishlist()

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <div className="animate-pulse">
            <div className="h-8 w-48 bg-gray-200 rounded mx-auto mb-4" />
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="aspect-square bg-gray-200 rounded" />
              ))}
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (wishlist.length === 0) {
    return <EmptyWishlist />
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <h1 className="text-3xl font-heading font-bold mb-2">My Wishlist</h1>
        <p className="text-gray-600">{wishlist.length} {wishlist.length === 1 ? 'item' : 'items'} saved</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
        {wishlist.map((item) => (
          <div key={`${item.id}-${item.variantId || 'no-variant'}`} className="border border-gray-200 rounded-lg overflow-hidden hover:border-black transition-colors group relative">
            <Link href={`/products/${item.slug}`} className="block">
              <div className="aspect-square bg-gray-100 relative">
                <Image
                  src={item.image}
                  alt={item.name}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>
            </Link>

            <button
              onClick={() => removeFromWishlist(item.id, item.variantId)}
              className="absolute top-2 right-2 p-2 bg-white rounded-full shadow-md hover:bg-red-50 transition-colors z-10"
              aria-label="Remove from wishlist"
            >
              <Heart className="w-5 h-5 fill-red-600 text-red-600" />
            </button>

            <div className="p-4">
              <Link href={`/products/${item.slug}`}>
                <h3 className="font-medium mb-2 hover:text-red-600 transition-colors line-clamp-2">
                  {item.name}
                  {item.variantName && (
                    <span className="block text-sm text-gray-600 mt-1">
                      {item.variantName}
                    </span>
                  )}
                </h3>
              </Link>

              {/* Price with MRP and Discount */}
              <div className="mb-3">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="font-bold text-lg">₹{item.price.toLocaleString()}</span>
                  {item.originalPrice && (
                    <>
                      <span className="text-sm text-gray-500 line-through">
                        ₹{item.originalPrice.toLocaleString()}
                      </span>
                      {item.discount && (
                        <span className="text-xs font-semibold text-red-600">
                          ({item.discount}% OFF)
                        </span>
                      )}
                    </>
                  )}
                </div>
              </div>

              <button
                onClick={() => {
                  // TODO: Add proper variant selection
                  // For now, we'll need to navigate to product page
                }}
                className="w-full flex items-center justify-center gap-2 bg-black text-white px-3 py-2 rounded-lg hover:bg-gray-800 transition-colors text-sm"
              >
                <ShoppingCart className="w-4 h-4" />
                View Product
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
