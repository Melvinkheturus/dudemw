'use client'

import { ShoppingBag } from 'lucide-react'
import Link from 'next/link'
import { motion } from 'framer-motion'

export default function EmptyCart() {
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
            <ShoppingBag className="w-16 h-16 text-gray-400" />
          </div>
        </div>

        <h1 className="text-3xl font-heading font-bold text-gray-900 mb-3">
          Your Cart is Empty
        </h1>

        <p className="text-gray-600 mb-8">
          Looks like you haven't added anything to your cart yet. Start shopping and find something you love!
        </p>

        <Link
          href="/products"
          className="inline-block bg-black text-white px-8 py-4 rounded-lg font-medium hover:bg-gray-800 transition-all"
        >
          Continue Shopping
        </Link>
      </motion.div>
    </div>
  )
}
