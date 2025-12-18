import { NextRequest, NextResponse } from 'next/server'
import { BannerService } from '@/lib/services/banners'

/**
 * GET /api/admin/banners/stats
 * Get banner statistics
 */
export async function GET(request: NextRequest) {
  try {
    const result = await BannerService.getBannerStats()

    if (!result.success) {
      return NextResponse.json(
        { error: result.error },
        { status: 500 }
      )
    }

    return NextResponse.json(result.data)
  } catch (error) {
    console.error('Error in GET /api/admin/banners/stats:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
