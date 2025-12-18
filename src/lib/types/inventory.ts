import { Tables } from '@/types/database.types'

export type InventoryItem = {
  id: string
  variant_id: string
  sku: string | null
  quantity: number | null
  available_quantity: number | null
  reserved_quantity: number | null
  low_stock_threshold: number | null
  allow_backorders: boolean | null
  track_quantity: boolean | null
  product_name: string
  variant_name: string | null
  product_id: string
}

export type InventoryLog = {
  id: string
  variant_id: string
  change_amount: number
  reason: string
  created_at: string
  created_by?: string
  previous_quantity?: number
  new_quantity?: number
}

export type InventoryAdjustment = {
  variant_id: string
  quantity: number
  reason: string
  adjust_type: 'add' | 'subtract' | 'set'
}

export type BulkInventoryAdjustment = {
  adjustments: InventoryAdjustment[]
}

export type InventoryFilters = {
  search?: string
  stockStatus?: 'all' | 'in_stock' | 'low_stock' | 'out_of_stock'
  productId?: string
}

export type InventoryStats = {
  totalItems: number
  inStock: number
  lowStock: number
  outOfStock: number
  totalValue: number
}

export type ReorderPoint = {
  id: string
  variant_id: string
  threshold: number
  reorder_quantity: number
  created_at: string
  updated_at: string
}

export type LowStockAlert = {
  id: string
  variant_id: string
  product_name: string
  variant_name: string | null
  current_stock: number
  threshold: number
  sku: string | null
}

export type StockForecast = {
  variant_id: string
  product_name: string
  current_stock: number
  average_daily_sales: number
  days_until_stockout: number
  suggested_reorder_date: string
  suggested_reorder_quantity: number
}
