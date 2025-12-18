'use client'

import React, { createContext, useContext, useState, useEffect } from 'react'
import { NotificationService, Notification } from '@/lib/services/notifications'
import { toast } from 'sonner'

interface NotificationContextType {
  notifications: Notification[]
  unreadCount: number
  markAsRead: (id: string) => void
  clearAll: () => void
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined)

export function NotificationProvider({ children }: { children: React.ReactNode }) {
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [unreadCount, setUnreadCount] = useState(0)

  useEffect(() => {
    // Subscribe to real-time notifications
    const result = NotificationService.subscribeToNotifications('admin', (notification) => {
      setNotifications(prev => [notification, ...prev])
      setUnreadCount(prev => prev + 1)
      
      // Show toast notification
      if (notification.priority === 'high') {
        toast.error(notification.title, {
          description: notification.message
        })
      } else if (notification.priority === 'medium') {
        toast.warning(notification.title, {
          description: notification.message
        })
      } else {
        toast.info(notification.title, {
          description: notification.message
        })
      }
    })

    // Check for low stock on mount
    checkLowStock()

    return () => {
      NotificationService.unsubscribeFromNotifications()
    }
  }, [])

  const checkLowStock = async () => {
    const result = await NotificationService.checkLowStock()
    if (result.success && result.data) {
      result.data.forEach(notification => {
        setNotifications(prev => [notification, ...prev])
      })
      setUnreadCount(prev => prev + result.data!.length)
    }
  }

  const markAsRead = (id: string) => {
    setNotifications(prev => 
      prev.map(n => n.id === id ? { ...n, read: true } : n)
    )
    setUnreadCount(prev => Math.max(0, prev - 1))
    NotificationService.markAsRead(id)
  }

  const clearAll = () => {
    setNotifications([])
    setUnreadCount(0)
    NotificationService.clearAllNotifications()
  }

  return (
    <NotificationContext.Provider value={{ notifications, unreadCount, markAsRead, clearAll }}>
      {children}
    </NotificationContext.Provider>
  )
}

export function useNotifications() {
  const context = useContext(NotificationContext)
  if (!context) {
    throw new Error('useNotifications must be used within NotificationProvider')
  }
  return context
}
