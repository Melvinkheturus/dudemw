'use client'

import { useState, useEffect } from 'react'
import { useCart } from '@/domains/cart'
import MobileCartView from './MobileCartView'
import DesktopCartView from './DesktopCartView'
import EmptyCart from './EmptyCart'
import { CartSkeleton } from './CartSkeleton'

export default function CartPage() {
  const { cartItems, isLoading } = useCart()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  // Show loading state on server-side render or while fetching initial data
  if (!mounted || isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <CartSkeleton />
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
