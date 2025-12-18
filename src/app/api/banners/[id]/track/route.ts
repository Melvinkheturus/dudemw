import { NextRequest, NextResponse } from 'next/server'
import { BannerService } from '@/lib/services/banners'

type RouteContext = {
  params: Promise<{ id: string }>
}

/**
 * POST /api/banners/[id]/track
 * Track banner impression or click
 */
export async function POST(
  request: NextRequest,
  context: RouteContext
) {
  try {
    const { id } = await context.params
    const body = await request.json()
    const { event } = body // 'impression' or 'click'

    if (!event || !['impression', 'click'].includes(event)) {
      return NextResponse.json(
        { error: 'Invalid event type' },
        { status: 400 }
      )
    }

    let result
    if (event === 'impression') {
      result = await BannerService.trackImpression(id)
    } else {
      result = await BannerService.trackClick(id)
    }

    return NextResponse.json({ success: result.success })
  } catch (error) {
    console.error('Error in POST /api/banners/[id]/track:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
