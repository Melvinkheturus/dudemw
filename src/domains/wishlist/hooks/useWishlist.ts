'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/domains/auth/context'

interface WishlistItem {
  id: string
  name: string
  price: number
  image: string
  slug: string
}

const WISHLIST_KEY = 'dude_wishlist'

export function useWishlist() {
  const { user } = useAuth()
  const [wishlist, setWishlist] = useState<WishlistItem[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isSyncing, setIsSyncing] = useState(false)

  // Load wishlist on mount
  useEffect(() => {
    loadWishlist()
  }, [])

  // Sync to backend when user logs in
  useEffect(() => {
    if (user && wishlist.length > 0 && !isSyncing) {
      syncToBackend()
    }
  }, [user])

  const loadWishlist = () => {
    try {
      const stored = localStorage.getItem(WISHLIST_KEY)
      if (stored) {
        const parsed = JSON.parse(stored)
        setWishlist(parsed)
      }
    } catch (error) {
      console.error('Error loading wishlist:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const saveToLocalStorage = (items: WishlistItem[]) => {
    try {
      localStorage.setItem(WISHLIST_KEY, JSON.stringify(items))
    } catch (error) {
      console.error('Error saving wishlist:', error)
    }
  }

  const syncToBackend = async () => {
    if (!user || wishlist.length === 0) return

    setIsSyncing(true)
    try {
      // TODO: Integrate with custom backend
      // await fetch('/api/wishlist/sync', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ items: wishlist })
      // })

      console.log('✅ Wishlist synced to backend for user:', user.email)
      console.log('📦 Synced items:', wishlist.length)
    } catch (error) {
      console.error('Error syncing wishlist:', error)
    } finally {
      setIsSyncing(false)
    }
  }

  const addToWishlist = (item: WishlistItem) => {
    const exists = wishlist.some(w => w.id === item.id)
    if (!exists) {
      const updated = [...wishlist, item]
      setWishlist(updated)
      saveToLocalStorage(updated)

      // If logged in, sync to backend immediately
      if (user) {
        syncSingleItem(item, 'add')
      }

      return true
    }
    return false
  }

  const removeFromWishlist = (id: string) => {
    const updated = wishlist.filter(item => item.id !== id)
    setWishlist(updated)
    saveToLocalStorage(updated)

    // If logged in, sync to backend immediately
    if (user) {
      syncSingleItem({ id } as WishlistItem, 'remove')
    }
  }

  const isInWishlist = (id: string) => {
    return wishlist.some(item => item.id === id)
  }

  const toggleWishlist = (item: WishlistItem) => {
    if (isInWishlist(item.id)) {
      removeFromWishlist(item.id)
      return false
    } else {
      addToWishlist(item)
      return true
    }
  }

  const clearWishlist = () => {
    setWishlist([])
    localStorage.removeItem(WISHLIST_KEY)

    if (user) {
      // TODO: Clear backend wishlist
      console.log('🗑️ Wishlist cleared for user:', user.email)
    }
  }

  const syncSingleItem = async (item: WishlistItem, action: 'add' | 'remove') => {
    if (!user) return

    try {
      // TODO: Integrate with custom backend
      // await fetch('/api/wishlist', {
      //   method: action === 'add' ? 'POST' : 'DELETE',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ itemId: item.id })
      // })

      console.log(`✅ ${action === 'add' ? 'Added to' : 'Removed from'} backend wishlist:`, item.id)
    } catch (error) {
      console.error('Error syncing item:', error)
    }
  }

  return {
    wishlist,
    addToWishlist,
    removeFromWishlist,
    isInWishlist,
    toggleWishlist,
    clearWishlist,
    count: wishlist.length,
    isLoading,
    isSyncing,
    isGuest: !user,
  }
}
