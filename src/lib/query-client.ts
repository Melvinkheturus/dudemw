import { QueryClient, DefaultOptions } from '@tanstack/react-query'

/**
 * Default options for React Query
 * Optimized for admin dashboard with intelligent cache management
 * 
 * Cache Invalidation Strategy:
 * 1. Mutations automatically invalidate related queries
 * 2. Stats queries: 2 min stale time, refetch on focus
 * 3. List queries: 5 min stale time, no auto-refetch
 * 4. Detail queries: 5 min stale time, refetch on mount
 */
const defaultOptions: DefaultOptions = {
  queries: {
    // Queries will be considered stale after 5 minutes
    staleTime: 5 * 60 * 1000,
    // Cache data for 10 minutes (garbage collection)
    gcTime: 10 * 60 * 1000,
    // Retry failed requests once
    retry: 1,
    // Refetch on window focus for real-time updates
    refetchOnWindowFocus: true,
    // Refetch on mount if data is stale
    refetchOnMount: true,
    // Refetch on reconnect for data consistency
    refetchOnReconnect: true,
  },
  mutations: {
    // Retry failed mutations once
    retry: 1,
  },
}

/**
 * Create a new QueryClient instance
 * Used for server-side rendering and client-side hydration
 */
export function makeQueryClient() {
  return new QueryClient({
    defaultOptions,
  })
}

/**
 * Singleton QueryClient for client-side
 */
let browserQueryClient: QueryClient | undefined = undefined

export function getQueryClient() {
  if (typeof window === 'undefined') {
    // Server: always make a new query client
    return makeQueryClient()
  } else {
    // Browser: make a new query client if we don't already have one
    if (!browserQueryClient) browserQueryClient = makeQueryClient()
    return browserQueryClient
  }
}
