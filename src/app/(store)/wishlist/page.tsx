'use client'

import dynamic from 'next/dynamic'

const WishlistPage = dynamic(() => import('@/domains/wishlist').then(mod => ({ default: mod.WishlistPage })), {
  ssr: false,
  loading: () => (
    <div className="container mx-auto px-4 py-8">
      <div className="text-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black mx-auto"></div>
        <p className="mt-4 text-gray-600">Loading wishlist...</p>
      </div>
    </div>
  )
})

export default function Wishlist() {
  return <WishlistPage />
}
