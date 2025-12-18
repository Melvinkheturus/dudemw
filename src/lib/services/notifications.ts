import { supabaseAdmin } from '@/lib/supabase/supabase'
import { supabase } from '@/lib/supabase/client'
import { RealtimeChannel } from '@supabase/supabase-js'

export type NotificationType = 'order' | 'stock' | 'customer' | 'system'
export type NotificationPriority = 'low' | 'medium' | 'high'

export interface Notification {
  id: string
  type: NotificationType
  title: string
  message: string
  priority: NotificationPriority
  read: boolean
  created_at: string
  metadata?: any
}

export class NotificationService {
  private static channel: RealtimeChannel | null = null

  /**
   * Subscribe to real-time notifications
   */
  static subscribeToNotifications(userId: string, callback: (notification: Notification) => void) {
    try {
      // Subscribe to new orders
      const orderChannel = supabase
        .channel('orders')
        .on(
          'postgres_changes',
          {
            event: 'INSERT',
            schema: 'public',
            table: 'orders'
          },
          (payload) => {
            callback({
              id: payload.new.id,
              type: 'order',
              title: 'New Order Received',
              message: `Order #${payload.new.id.substring(0, 8)} has been placed`,
              priority: 'high',
              read: false,
              created_at: payload.new.created_at,
              metadata: payload.new
            })
          }
        )
        .subscribe()

      // Subscribe to order status changes
      const orderUpdateChannel = supabase
        .channel('order-updates')
        .on(
          'postgres_changes',
          {
            event: 'UPDATE',
            schema: 'public',
            table: 'orders'
          },
          (payload) => {
            if (payload.old.order_status !== payload.new.order_status) {
              callback({
                id: `${payload.new.id}-status`,
                type: 'order',
                title: 'Order Status Updated',
                message: `Order #${payload.new.id.substring(0, 8)} status changed to ${payload.new.order_status}`,
                priority: 'medium',
                read: false,
                created_at: new Date().toISOString(),
                metadata: payload.new
              })
            }
          }
        )
        .subscribe()

      // Subscribe to new customer signups
      const customerChannel = supabase
        .channel('customers')
        .on(
          'postgres_changes',
          {
            event: 'INSERT',
            schema: 'auth',
            table: 'users'
          },
          (payload) => {
            callback({
              id: payload.new.id,
              type: 'customer',
              title: 'New Customer Signup',
              message: `${payload.new.email} just signed up`,
              priority: 'low',
              read: false,
              created_at: payload.new.created_at,
              metadata: payload.new
            })
          }
        )
        .subscribe()

      this.channel = orderChannel

      return { success: true, channels: [orderChannel, orderUpdateChannel, customerChannel] }
    } catch (error) {
      console.error('Error subscribing to notifications:', error)
      return { success: false, error: 'Failed to subscribe to notifications' }
    }
  }

  /**
   * Unsubscribe from notifications
   */
  static async unsubscribeFromNotifications() {
    try {
      if (this.channel) {
        await supabase.removeChannel(this.channel)
        this.channel = null
      }
      return { success: true }
    } catch (error) {
      console.error('Error unsubscribing:', error)
      return { success: false }
    }
  }

  /**
   * Check for low stock and send notifications
   */
  static async checkLowStock() {
    try {
      const { data: products } = await supabaseAdmin
        .from('products')
        .select('id, title, global_stock')
        .lte('global_stock', 10)
        .gt('global_stock', 0)

      const notifications: Notification[] = products?.map(product => ({
        id: `low-stock-${product.id}`,
        type: 'stock',
        title: 'Low Stock Alert',
        message: `${product.title} is running low (${product.global_stock} units left)`,
        priority: 'medium',
        read: false,
        created_at: new Date().toISOString(),
        metadata: product
      })) || []

      return { success: true, data: notifications }
    } catch (error) {
      console.error('Error checking low stock:', error)
      return { success: false, error: 'Failed to check stock levels' }
    }
  }

  /**
   * Check for out of stock products
   */
  static async checkOutOfStock() {
    try {
      const { data: products } = await supabaseAdmin
        .from('products')
        .select('id, title, global_stock, status')
        .eq('global_stock', 0)
        .eq('status', 'active')

      const notifications: Notification[] = products?.map(product => ({
        id: `out-of-stock-${product.id}`,
        type: 'stock',
        title: 'Out of Stock',
        message: `${product.title} is out of stock`,
        priority: 'high',
        read: false,
        created_at: new Date().toISOString(),
        metadata: product
      })) || []

      return { success: true, data: notifications }
    } catch (error) {
      console.error('Error checking out of stock:', error)
      return { success: false, error: 'Failed to check stock levels' }
    }
  }

  /**
   * Get pending orders count
   */
  static async getPendingOrdersCount() {
    try {
      const { count, error } = await supabaseAdmin
        .from('orders')
        .select('*', { count: 'exact', head: true })
        .eq('order_status', 'pending')

      if (error) throw error

      return { success: true, count: count || 0 }
    } catch (error) {
      console.error('Error fetching pending orders count:', error)
      return { success: false, count: 0 }
    }
  }

  /**
   * Send email notification
   */
  static async sendEmailNotification(to: string, subject: string, html: string) {
    try {
      // Integration with Resend (email service)
      // This would typically call the resend service
      console.log('Sending email notification:', { to, subject })
      return { success: true }
    } catch (error) {
      console.error('Error sending email notification:', error)
      return { success: false, error: 'Failed to send email' }
    }
  }

  /**
   * Mark notification as read
   */
  static async markAsRead(notificationId: string) {
    try {
      // In a real implementation, you'd store notifications in a table
      // For now, this is a placeholder
      return { success: true }
    } catch (error) {
      console.error('Error marking notification as read:', error)
      return { success: false }
    }
  }

  /**
   * Clear all notifications
   */
  static async clearAllNotifications() {
    try {
      // In a real implementation, you'd update all notifications
      return { success: true }
    } catch (error) {
      console.error('Error clearing notifications:', error)
      return { success: false }
    }
  }
}
