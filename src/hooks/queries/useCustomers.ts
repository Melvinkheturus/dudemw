import { useQuery, UseQueryOptions } from '@tanstack/react-query'
import { CustomerService } from '@/lib/services/customers'
import { CustomerFilters, CustomerStats, CustomerDetails } from '@/lib/types/customers'

/**
 * Query keys for customers
 */
export const customerKeys = {
  all: ['customers'] as const,
  lists: () => [...customerKeys.all, 'list'] as const,
  list: (filters: CustomerFilters, page: number) =>
    [...customerKeys.lists(), filters, page] as const,
  details: () => [...customerKeys.all, 'detail'] as const,
  detail: (id: string) => [...customerKeys.details(), id] as const,
  stats: () => [...customerKeys.all, 'stats'] as const,
}

/**
 * Hook to fetch customers list with filters and pagination
 */
export function useCustomers(
  filters: CustomerFilters = { status: 'all' },
  page: number = 1,
  limit: number = 20,
  options?: Omit<UseQueryOptions<any, Error>, 'queryKey' | 'queryFn'>
) {
  return useQuery({
    queryKey: customerKeys.list(filters, page),
    queryFn: async () => {
      const result = await CustomerService.getCustomers(filters, page, limit)
      if (!result.success) {
        throw new Error(result.error || 'Failed to fetch customers')
      }
      return result.data
    },
    ...options,
  })
}

/**
 * Hook to fetch customer details by ID
 */
export function useCustomer(
  customerId: string,
  options?: Omit<UseQueryOptions<CustomerDetails, Error>, 'queryKey' | 'queryFn'>
) {
  return useQuery({
    queryKey: customerKeys.detail(customerId),
    queryFn: async () => {
      const result = await CustomerService.getCustomer(customerId)
      if (!result.success || !result.data) {
        throw new Error(result.error || 'Failed to fetch customer')
      }
      return result.data
    },
    enabled: !!customerId,
    ...options,
  })
}

/**
 * Hook to fetch customer statistics
 */
export function useCustomerStats(
  options?: Omit<UseQueryOptions<CustomerStats, Error>, 'queryKey' | 'queryFn'>
) {
  return useQuery({
    queryKey: customerKeys.stats(),
    queryFn: async () => {
      const result = await CustomerService.getCustomerStats()
      if (!result.success || !result.data) {
        throw new Error(result.error || 'Failed to fetch customer stats')
      }
      return result.data
    },
    staleTime: 2 * 60 * 1000, // Stats are stale after 2 minutes
    ...options,
  })
}
