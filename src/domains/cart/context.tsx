'use client'

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { Product } from '@/domains/product'

export interface CartItem {
  id: string
  title: string
  price: number
  image: string
  size?: string
  color?: string
  quantity: number
  variantKey: string // Unique key for variant (e.g., "product-1-M-Black")
  isFBT?: boolean // Flag to identify FBT items
}

export interface ShippingAddress {
  firstName: string
  lastName: string
  address: string
  city: string
  state: string
  pincode: string
  phone: string
}

export interface CartContextType {
  cartItems: CartItem[]
  addToCart: (item: Omit<CartItem, 'quantity'> & { quantity?: number }) => void
  updateQuantity: (variantKey: string, quantity: number) => void
  removeFromCart: (variantKey: string) => void
  clearCart: () => void
  clearFBTItems: () => void
  totalPrice: number
  itemCount: number
  uniqueVariantCount: number
  getItemByVariant: (variantKey: string) => CartItem | undefined
  shippingAddress: ShippingAddress | null
  setShippingAddress: (address: ShippingAddress) => void
  isLoading: boolean
}

const CartContext = createContext<CartContextType | undefined>(undefined)

export function CartProvider({ children }: { children: ReactNode }) {
  const [cartItems, setCartItems] = useState<CartItem[]>([])
  const [shippingAddress, setShippingAddress] = useState<ShippingAddress | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  // Load cart from localStorage on mount
  useEffect(() => {
    const savedCart = localStorage.getItem('cart-items')
    const savedAddress = localStorage.getItem('shipping-address')

    if (savedCart) {
      try {
        const parsedCart = JSON.parse(savedCart)
        setCartItems(parsedCart)
      } catch (error) {
        console.error('Error parsing saved cart:', error)
      }
    }

    if (savedAddress) {
      try {
        const parsedAddress = JSON.parse(savedAddress)
        setShippingAddress(parsedAddress)
      } catch (error) {
        console.error('Error parsing saved address:', error)
      }
    }

    setIsLoading(false)
  }, [])

  // Save cart to localStorage whenever items change
  useEffect(() => {
    localStorage.setItem('cart-items', JSON.stringify(cartItems))
  }, [cartItems])

  // Save address to localStorage whenever it changes
  useEffect(() => {
    if (shippingAddress) {
      localStorage.setItem('shipping-address', JSON.stringify(shippingAddress))
    }
  }, [shippingAddress])

  const addToCart = (item: Omit<CartItem, 'quantity'> & { quantity?: number }) => {
    const quantity = item.quantity || 1
    const existingItem = cartItems.find(cartItem => cartItem.variantKey === item.variantKey)

    if (existingItem) {
      updateQuantity(item.variantKey, existingItem.quantity + quantity)
    } else {
      const newItem: CartItem = {
        ...item,
        quantity,
      }
      setCartItems(prev => [...prev, newItem])
    }
  }

  const removeFromCart = (variantKey: string) => {
    setCartItems(prev => prev.filter(item => item.variantKey !== variantKey))
  }

  const updateQuantity = (variantKey: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(variantKey)
      return
    }

    setCartItems(prev =>
      prev.map(item =>
        item.variantKey === variantKey ? { ...item, quantity } : item
      )
    )
  }

  const clearCart = () => {
    setCartItems([])
    localStorage.removeItem('cart-items')
  }

  const clearFBTItems = () => {
    setCartItems(prev => prev.filter(item => !item.isFBT))
  }

  const getItemByVariant = (variantKey: string) => {
    return cartItems.find(item => item.variantKey === variantKey)
  }

  const totalPrice = cartItems.reduce((total, item) => total + (item.price * item.quantity), 0)
  const itemCount = cartItems.reduce((total, item) => total + item.quantity, 0)
  const uniqueVariantCount = cartItems.length

  const value: CartContextType = {
    cartItems,
    addToCart,
    updateQuantity,
    removeFromCart,
    clearCart,
    clearFBTItems,
    totalPrice,
    itemCount,
    uniqueVariantCount,
    getItemByVariant,
    shippingAddress,
    setShippingAddress,
    isLoading
  }

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const context = useContext(CartContext)
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider')
  }
  return context
}
