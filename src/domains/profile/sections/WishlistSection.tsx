'use client'

import { useState, useEffect } from 'react'
import { Heart, ShoppingCart, Trash2 } from 'lucide-react'
import Link from 'next/link'
import { WishlistItem } from '../types'

export default function WishlistSection() {
  const [wishlistItems, setWishlistItems] = useState<WishlistItem[]>([])

  useEffect(() => {
    // Load from localStorage
    const stored = localStorage.getItem('wishlist')
    if (stored) {
      setWishlistItems(JSON.parse(stored))
    }
  }, [])

  const removeFromWishlist = (id: string) => {
    const updated = wishlistItems.filter(item => item.id !== id)
    setWishlistItems(updated)
    localStorage.setItem('wishlist', JSON.stringify(updated))
  }

  if (wishlistItems.length === 0) {
    return (
      <div className="text-center py-12">
        <Heart className="w-16 h-16 mx-auto mb-4 text-gray-400" />
        <h3 className="text-xl font-semibold mb-2">Your Wishlist is Empty</h3>
        <p className="text-gray-600 mb-6">Save your favorite items here</p>
        <Link
          href="/products"
          className="inline-block bg-black text-white px-6 py-3 rounded-lg hover:bg-gray-800 transition-colors"
        >
          Explore Products
        </Link>
      </div>
    )
  }

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">My Wishlist ({wishlistItems.length})</h2>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {wishlistItems.map((item) => (
          <div key={item.id} className="border border-gray-200 rounded-lg overflow-hidden hover:border-black transition-colors group">
            <Link href={`/products/${item.slug}`} className="block">
              <div className="aspect-square bg-gray-100 relative">
                {/* Product image placeholder */}
              </div>
            </Link>

            <div className="p-4">
              <Link href={`/products/${item.slug}`}>
                <h3 className="font-medium mb-2 hover:text-red-600 transition-colors line-clamp-2">
                  {item.name}
                </h3>
              </Link>
              <p className="font-bold text-lg mb-3">₹{item.price}</p>

              <div className="flex gap-2">
                <button className="flex-1 flex items-center justify-center gap-2 bg-black text-white px-3 py-2 rounded-lg hover:bg-gray-800 transition-colors text-sm">
                  <ShoppingCart className="w-4 h-4" />
                  Add
                </button>
                <button
                  onClick={() => removeFromWishlist(item.id)}
                  className="p-2 border border-gray-300 rounded-lg hover:bg-red-50 hover:border-red-300 transition-colors"
                >
                  <Trash2 className="w-4 h-4 text-red-600" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
