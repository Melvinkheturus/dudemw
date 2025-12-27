'use client'

import { Heart } from 'lucide-react'
import Link from 'next/link'
import { motion } from 'framer-motion'

export default function EmptyWishlist() {
  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4 py-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center max-w-md"
      >
        <div className="mb-6 flex justify-center">
          <div className="w-32 h-32 bg-gray-100 rounded-full flex items-center justify-center">
            <Heart className="w-16 h-16 text-gray-400" />
          </div>
        </div>

        <h1 className="text-3xl font-heading font-bold text-gray-900 mb-3">
          Your Wishlist is Empty
        </h1>

        <p className="text-gray-600 mb-8">
          Save your favorite items here and never lose track of what you love!
        </p>

        <Link
          href="/products"
          className="inline-block bg-black text-white px-8 py-4 rounded-lg font-medium hover:bg-gray-800 transition-all"
        >
          Discover Products
        </Link>
      </motion.div>
    </div>
  )
}
