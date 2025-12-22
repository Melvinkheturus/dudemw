import { useQuery, UseQueryOptions } from '@tanstack/react-query'
import { BannerService } from '@/lib/services/banners'

/**
 * Query keys for banners
 */
export const bannerKeys = {
  all: ['banners'] as const,
  lists: () => [...bannerKeys.all, 'list'] as const,
  list: (filters?: any) => [...bannerKeys.lists(), filters] as const,
  details: () => [...bannerKeys.all, 'detail'] as const,
  detail: (id: string) => [...bannerKeys.details(), id] as const,
  stats: (id: string) => [...bannerKeys.all, 'stats', id] as const,
}

/**
 * Hook to fetch banners list and stats
 */
export function useBanners(
  filters?: any,
  options?: Omit<UseQueryOptions<any, Error>, 'queryKey' | 'queryFn'>
) {
  return useQuery({
    queryKey: bannerKeys.list(filters),
    queryFn: async () => {
      // Fetch both banners and stats
      const [bannersResult, statsResult] = await Promise.all([
        BannerService.getBanners(filters),
        BannerService.getBannerStats()
      ])

      if (!bannersResult.success) {
        throw new Error(bannersResult.error || 'Failed to fetch banners')
      }

      return {
        banners: bannersResult.data || [],
        stats: statsResult.success ? statsResult.data : undefined
      }
    },
    ...options,
  })
}

/**
 * Hook to fetch banner details by ID
 */
export function useBanner(
  bannerId: string,
  options?: Omit<UseQueryOptions<any, Error>, 'queryKey' | 'queryFn'>
) {
  return useQuery({
    queryKey: bannerKeys.detail(bannerId),
    queryFn: async () => {
      const result = await BannerService.getBanner(bannerId)
      if (!result.success || !result.data) {
        throw new Error(result.error || 'Failed to fetch banner')
      }
      return result.data
    },
    enabled: !!bannerId,
    ...options,
  })
}

/**
 * Hook to fetch banner statistics
 */
export function useBannerStats(
  bannerId: string,
  options?: Omit<UseQueryOptions<any, Error>, 'queryKey' | 'queryFn'>
) {
  return useQuery({
    queryKey: bannerKeys.stats(bannerId),
    queryFn: async () => {
      const result = await BannerService.getBanner(bannerId)
      if (!result.success || !result.data) {
        throw new Error(result.error || 'Failed to fetch banner stats')
      }
      return {
        total: 1,
        active: result.data.status === 'active' ? 1 : 0,
        scheduled: result.data.status === 'scheduled' ? 1 : 0,
        expired: result.data.status === 'expired' ? 1 : 0,
        disabled: result.data.status === 'disabled' ? 1 : 0,
        totalClicks: result.data.clicks || 0,
        totalImpressions: result.data.impressions || 0,
        averageCTR: parseFloat(String(result.data.ctr || 0))
      }
    },
    enabled: !!bannerId,
    staleTime: 5 * 60 * 1000, // Stats are stale after 5 minutes
    ...options,
  })
}
