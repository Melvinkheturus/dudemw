import { NextRequest, NextResponse } from 'next/server'
import { BannerService } from '@/lib/services/banners'

type RouteContext = {
  params: Promise<{ id: string }>
}

/**
 * POST /api/admin/banners/[id]/toggle
 * Toggle banner status (active/disabled)
 */
export async function POST(
  request: NextRequest,
  context: RouteContext
) {
  try {
    const { id } = await context.params
    const result = await BannerService.toggleBannerStatus(id)

    if (!result.success) {
      return NextResponse.json(
        { error: result.error },
        { status: 500 }
      )
    }

    return NextResponse.json(result.data)
  } catch (error) {
    console.error('Error in POST /api/admin/banners/[id]/toggle:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
