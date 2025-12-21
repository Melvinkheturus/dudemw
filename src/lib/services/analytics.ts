import { supabaseAdmin } from '@/lib/supabase/supabase'
import { createClient } from '@/lib/supabase/client'

// Helper to get appropriate client - use client-side supabase for browser, admin for server
const getSupabaseClient = () => {
  if (typeof window !== 'undefined') {
    return createClient()
  }
  return supabaseAdmin
}

export interface DashboardStats {
  revenue: {
    total: number
    today: number
    thisMonth: number
    change: number
  }
  orders: {
    total: number
    pending: number
    completed: number
    cancelled: number
  }
  customers: {
    total: number
    new: number
    active: number
  }
  products: {
    total: number
    lowStock: number
    outOfStock: number
  }
}

export interface ChartDataPoint {
  date: string
  value: number
  label?: string
}

export interface TopProduct {
  id: string
  title: string
  revenue: number
  orders: number
  image_url?: string
}

export interface CategoryPerformance {
  id: string
  name: string
  revenue: number
  orders: number
  products: number
}

export class AnalyticsService {
  /**
   * Get dashboard statistics
   */
  static async getDashboardStats(): Promise<{ success: boolean; data?: DashboardStats; error?: string }> {
    try {
      const supabase = getSupabaseClient()
      const now = new Date()
      const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate())
      const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1)
      const startOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1)
      const endOfLastMonth = new Date(now.getFullYear(), now.getMonth(), 0)

      // Revenue stats
      const { data: allOrders } = await supabase
        .from('orders')
        .select('total_amount, created_at, order_status')

      const totalRevenue = allOrders?.reduce((sum, o) => sum + (o.total_amount || 0), 0) || 0
      const todayRevenue = allOrders
        ?.filter(o => o.created_at && new Date(o.created_at) >= startOfToday)
        .reduce((sum, o) => sum + (o.total_amount || 0), 0) || 0
      const thisMonthRevenue = allOrders
        ?.filter(o => o.created_at && new Date(o.created_at) >= startOfMonth)
        .reduce((sum, o) => sum + (o.total_amount || 0), 0) || 0
      const lastMonthRevenue = allOrders
        ?.filter(o => {
          if (!o.created_at) return false
          const date = new Date(o.created_at)
          return date >= startOfLastMonth && date <= endOfLastMonth
        })
        .reduce((sum, o) => sum + (o.total_amount || 0), 0) || 0

      const revenueChange = lastMonthRevenue > 0
        ? ((thisMonthRevenue - lastMonthRevenue) / lastMonthRevenue) * 100
        : 0

      // Order stats
      const totalOrders = allOrders?.length || 0
      const pendingOrders = allOrders?.filter(o => o.order_status === 'pending').length || 0
      const completedOrders = allOrders?.filter(o => o.order_status === 'completed').length || 0
      const cancelledOrders = allOrders?.filter(o => o.order_status === 'cancelled').length || 0

      // Customer stats
      const { data: authUsers } = await supabaseAdmin.auth.admin.listUsers()
      const totalCustomers = authUsers?.users.length || 0
      const newCustomers = authUsers?.users.filter(
        u => new Date(u.created_at) >= startOfMonth
      ).length || 0
      const activeCustomers = authUsers?.users.filter(
        u => u.last_sign_in_at && new Date(u.last_sign_in_at) >= startOfMonth
      ).length || 0

      // Product stats
      const { data: products } = await supabaseAdmin
        .from('products')
        .select('id, global_stock')

      const totalProducts = products?.length || 0
      const lowStock = products?.filter(p => (p.global_stock || 0) > 0 && (p.global_stock || 0) < 10).length || 0
      const outOfStock = products?.filter(p => (p.global_stock || 0) === 0).length || 0

      return {
        success: true,
        data: {
          revenue: {
            total: totalRevenue,
            today: todayRevenue,
            thisMonth: thisMonthRevenue,
            change: revenueChange
          },
          orders: {
            total: totalOrders,
            pending: pendingOrders,
            completed: completedOrders,
            cancelled: cancelledOrders
          },
          customers: {
            total: totalCustomers,
            new: newCustomers,
            active: activeCustomers
          },
          products: {
            total: totalProducts,
            lowStock,
            outOfStock
          }
        }
      }
    } catch (error) {
      console.error('Error fetching dashboard stats:', error)
      return { success: false, error: 'Failed to fetch dashboard statistics' }
    }
  }

  /**
   * Get revenue chart data
   */
  static async getRevenueChart(period: 'daily' | 'weekly' | 'monthly' = 'daily', days: number = 30) {
    try {
      const startDate = new Date()
      startDate.setDate(startDate.getDate() - days)

      const { data: orders } = await supabaseAdmin
        .from('orders')
        .select('total_amount, created_at')
        .gte('created_at', startDate.toISOString())
        .order('created_at', { ascending: true })

      // Group by date
      const chartData: { [key: string]: number } = {}

      orders?.forEach(order => {
        if (!order.created_at) return
        const date = new Date(order.created_at)
        let key: string

        if (period === 'daily') {
          key = date.toISOString().split('T')[0]
        } else if (period === 'weekly') {
          const weekStart = new Date(date)
          weekStart.setDate(date.getDate() - date.getDay())
          key = weekStart.toISOString().split('T')[0]
        } else {
          key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`
        }

        chartData[key] = (chartData[key] || 0) + (order.total_amount || 0)
      })

      const data: ChartDataPoint[] = Object.entries(chartData).map(([date, value]) => ({
        date,
        value,
        label: new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
      }))

      return { success: true, data }
    } catch (error) {
      console.error('Error fetching revenue chart:', error)
      return { success: false, error: 'Failed to fetch revenue chart data' }
    }
  }

  /**
   * Get orders chart data
   */
  static async getOrdersChart(days: number = 30) {
    try {
      const startDate = new Date()
      startDate.setDate(startDate.getDate() - days)

      const { data: orders } = await supabaseAdmin
        .from('orders')
        .select('id, created_at')
        .gte('created_at', startDate.toISOString())
        .order('created_at', { ascending: true })

      // Group by date
      const chartData: { [key: string]: number } = {}

      orders?.forEach(order => {
        if (!order.created_at) return
        const date = new Date(order.created_at).toISOString().split('T')[0]
        chartData[date] = (chartData[date] || 0) + 1
      })

      const data: ChartDataPoint[] = Object.entries(chartData).map(([date, value]) => ({
        date,
        value,
        label: new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
      }))

      return { success: true, data }
    } catch (error) {
      console.error('Error fetching orders chart:', error)
      return { success: false, error: 'Failed to fetch orders chart data' }
    }
  }

  /**
   * Get top products
   */
  static async getTopProducts(limit: number = 10) {
    try {
      const { data: orderItems } = await supabaseAdmin
        .from('order_items')
        .select(`
          quantity,
          price,
          product_variants (
            product_id,
            products (
              id,
              title,
              product_images (image_url, is_primary)
            )
          )
        `)

      // Aggregate by product
      const productMap = new Map<string, { title: string; revenue: number; orders: number; image_url?: string }>()

      orderItems?.forEach((item: any) => {
        const product = item.product_variants?.products
        if (!product) return

        const existing = productMap.get(product.id) || {
          title: product.title,
          revenue: 0,
          orders: 0,
          image_url: product.product_images?.find((img: any) => img.is_primary)?.image_url
        }

        existing.revenue += (item.price || 0) * (item.quantity || 0)
        existing.orders += item.quantity || 0
        productMap.set(product.id, existing)
      })

      const topProducts: TopProduct[] = Array.from(productMap.entries())
        .map(([id, data]) => ({ id, ...data }))
        .sort((a, b) => b.revenue - a.revenue)
        .slice(0, limit)

      return { success: true, data: topProducts }
    } catch (error) {
      console.error('Error fetching top products:', error)
      return { success: false, error: 'Failed to fetch top products' }
    }
  }

  /**
   * Get category performance
   */
  static async getCategoryPerformance() {
    try {
      const { data: categories } = await supabaseAdmin
        .from('categories')
        .select(`
          id,
          name,
          product_categories (
            products (
              id,
              order_items (
                quantity,
                price
              )
            )
          )
        `)

      const performance: CategoryPerformance[] = categories?.map((cat: any) => {
        let revenue = 0
        let orders = 0
        const productIds = new Set()

        cat.product_categories?.forEach((pc: any) => {
          if (pc.products) {
            productIds.add(pc.products.id)
            pc.products.order_items?.forEach((item: any) => {
              revenue += (item.price || 0) * (item.quantity || 0)
              orders += item.quantity || 0
            })
          }
        })

        return {
          id: cat.id,
          name: cat.name,
          revenue,
          orders,
          products: productIds.size
        }
      }).sort((a: any, b: any) => b.revenue - a.revenue) || []

      return { success: true, data: performance }
    } catch (error) {
      console.error('Error fetching category performance:', error)
      return { success: false, error: 'Failed to fetch category performance' }
    }
  }

  /**
   * Get customer growth chart
   */
  static async getCustomerGrowthChart(days: number = 30) {
    try {
      const startDate = new Date()
      startDate.setDate(startDate.getDate() - days)

      const { data: authUsers } = await supabaseAdmin.auth.admin.listUsers()

      // Group by date
      const chartData: { [key: string]: number } = {}

      authUsers?.users
        .filter(user => new Date(user.created_at) >= startDate)
        .forEach(user => {
          const date = new Date(user.created_at).toISOString().split('T')[0]
          chartData[date] = (chartData[date] || 0) + 1
        })

      // Calculate cumulative growth
      let cumulative = 0
      const data: ChartDataPoint[] = Object.entries(chartData)
        .sort(([a], [b]) => a.localeCompare(b))
        .map(([date, value]) => {
          cumulative += value
          return {
            date,
            value: cumulative,
            label: new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
          }
        })

      return { success: true, data }
    } catch (error) {
      console.error('Error fetching customer growth chart:', error)
      return { success: false, error: 'Failed to fetch customer growth data' }
    }
  }

  /**
   * Export analytics data to CSV
   */
  static async exportAnalytics(startDate: Date, endDate: Date) {
    try {
      const { data: orders } = await supabaseAdmin
        .from('orders')
        .select(`
          *,
          order_items (
            quantity,
            price,
            product_variants (
              name,
              sku,
              products (title)
            )
          )
        `)
        .gte('created_at', startDate.toISOString())
        .lte('created_at', endDate.toISOString())

      const csvData = orders?.map(order => ({
        'Order ID': order.id,
        'Date': order.created_at ? new Date(order.created_at).toLocaleDateString() : 'N/A',
        'Customer Email': order.user_id || 'Guest',
        'Total Amount': `₹${order.total_amount}`,
        'Status': order.order_status,
        'Payment Status': order.payment_status,
        'Items': order.order_items?.length || 0
      })) || []

      return { success: true, data: csvData }
    } catch (error) {
      console.error('Error exporting analytics:', error)
      return { success: false, error: 'Failed to export analytics' }
    }
  }
}
