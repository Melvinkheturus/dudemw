import { NextRequest, NextResponse } from 'next/server'
import { BannerService } from '@/lib/services/banners'
import { BannerCreate, BannerFilters } from '@/lib/types/banners'

/**
 * GET /api/admin/banners
 * Get all banners with optional filters
 */
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    
    const filters: BannerFilters = {
      search: searchParams.get('search') || undefined,
      placement: searchParams.get('placement') || undefined,
      status: searchParams.get('status') || undefined,
      category: searchParams.get('category') || undefined,
    }

    const result = await BannerService.getBanners(filters)

    if (!result.success) {
      return NextResponse.json(
        { error: result.error },
        { status: 500 }
      )
    }

    return NextResponse.json(result.data)
  } catch (error) {
    console.error('Error in GET /api/admin/banners:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

/**
 * POST /api/admin/banners
 * Create a new banner
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    // Validate required fields
    if (!body.internal_title || !body.image_url || !body.placement || !body.action_type || !body.action_target || !body.action_name) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    const bannerData: BannerCreate = {
      internal_title: body.internal_title,
      image_url: body.image_url,
      placement: body.placement,
      action_type: body.action_type,
      action_target: body.action_target,
      action_name: body.action_name,
      start_date: body.start_date,
      end_date: body.end_date,
      position: body.position,
      category: body.category,
      cta_text: body.cta_text,
      status: body.status,
    }

    const result = await BannerService.createBanner(bannerData)

    if (!result.success) {
      return NextResponse.json(
        { error: result.error },
        { status: 500 }
      )
    }

    return NextResponse.json(result.data, { status: 201 })
  } catch (error) {
    console.error('Error in POST /api/admin/banners:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
