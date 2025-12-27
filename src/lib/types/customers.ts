import { Tables } from '@/types/database'

export type CustomerType = 'guest' | 'registered'

export type Customer = {
  id: string
  email: string
  phone?: string | null
  first_name?: string | null
  last_name?: string | null
  customer_type?: CustomerType
  created_at: string
  last_sign_in_at?: string | null
  metadata?: {
    full_name?: string
    phone?: string
    [key: string]: any
  }
}

export type CustomerWithStats = Customer & {
  totalOrders: number
  totalSpent: number
  averageOrderValue: number
  lastOrderDate?: string | null
  lifetimeValue: number
  status: 'active' | 'inactive'
}

export type CustomerFilters = {
  search?: string
  status?: 'all' | 'active' | 'inactive'
  customerType?: 'all' | 'guest' | 'registered'
  dateFrom?: string
  dateTo?: string
  minOrders?: number
  minSpent?: number
}

export type CustomerStats = {
  total: number
  active: number
  inactive: number
  registered: number
  guests: number
  newThisMonth: number
  totalRevenue: number
}

export type PaginationInfo = {
  page: number
  limit: number
  total: number
  totalPages: number
}

export type CustomerOrder = {
  id: string
  created_at: string
  total_amount: number
  order_status: string | null
  payment_status: string | null
  order_items: Array<{
    id: string
    quantity: number
    price: number
    product_variants: {
      name: string | null
      products: {
        title: string
      } | null
    } | null
  }>
}

export type CustomerDetails = CustomerWithStats & {
  orders: CustomerOrder[]
  addresses: Tables<'addresses'>[]
  notes?: string
}

export type CustomerExportData = {
  Email: string
  'Full Name': string
  'Join Date': string
  'Last Sign In': string
  'Total Orders': number
  'Total Spent': string
  'Average Order Value': string
  Status: string
}
