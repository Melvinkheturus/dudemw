'use client'

import { useState, useEffect } from 'react'
import { useCart } from '@/domains/cart'
import MobileCartView from './MobileCartView'
import DesktopCartView from './DesktopCartView'
import EmptyCart from './EmptyCart'

export default function CartPage() {
  const { cartItems } = useCart()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  // Show loading state on server-side render to prevent hydration mismatch
  if (!mounted) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-red-600 border-r-transparent"></div>
          <p className="mt-4 text-gray-600">Loading cart...</p>
        </div>
      </div>
    )
  }

  if (cartItems.length === 0) {
    return <EmptyCart />
  }

  return (
    <>
      {/* Mobile Cart - visible on small screens */}
      <div className="lg:hidden">
        <MobileCartView />
      </div>

      {/* Desktop Cart - visible on large screens */}
      <div className="hidden lg:block">
        <DesktopCartView />
      </div>
    </>
  )
}
