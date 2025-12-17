'use client'

import { useCart } from '@/domains/cart'
import DemoCartView from './DemoCartView'
import EmptyCart from './EmptyCart'

export default function CartPage() {
  const { cartItems } = useCart()

  if (cartItems.length === 0) {
    return <EmptyCart />
  }

  return <DemoCartView />
}
