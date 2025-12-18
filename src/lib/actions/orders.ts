"use server"

// Import services for server actions
import { OrderService } from '@/lib/services/orders'
import { OrderStatusService } from '@/lib/services/order-status'
import { OrderExportService } from '@/lib/services/order-export'
import type { OrderFilters } from '@/lib/types/orders'

// Re-export types (types can be exported from server action files)
export type { 
  OrderWithDetails, 
  OrderFilters, 
  OrderStats, 
  PaginationInfo,
  Order,
  OrderItem,
  Address
} from '@/lib/types/orders'

// Convenience functions that delegate to services
export async function getOrders(filters?: OrderFilters, page: number = 1, limit: number = 20) {
  return OrderService.getOrders(filters, page, limit)
}

export async function getOrder(id: string) {
  return OrderService.getOrder(id)
}

export async function getOrderStats() {
  return OrderService.getOrderStats()
}

export async function updateOrderStatus(orderId: string, status: string, notes?: string) {
  return OrderStatusService.updateOrderStatus(orderId, status, notes)
}

export async function bulkUpdateOrderStatus(orderIds: string[], status: string, notes?: string) {
  return OrderStatusService.bulkUpdateOrderStatus(orderIds, status, notes)
}

export async function addTrackingInfo(orderId: string, trackingNumber: string, carrier: string) {
  return OrderStatusService.addTrackingInfo(orderId, trackingNumber, carrier)
}

export async function cancelOrder(orderId: string, reason?: string) {
  return OrderStatusService.cancelOrder(orderId, reason)
}

export async function exportOrders(filters?: OrderFilters) {
  return OrderExportService.exportOrders(filters)
}