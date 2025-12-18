import { NextRequest, NextResponse } from 'next/server'
import { BannerService } from '@/lib/services/banners'
import { BannerUpdate } from '@/lib/types/banners'

type RouteContext = {
  params: Promise<{ id: string }>
}

/**
 * GET /api/admin/banners/[id]
 * Get a single banner by ID
 */
export async function GET(
  request: NextRequest,
  context: RouteContext
) {
  try {
    const { id } = await context.params
    const result = await BannerService.getBanner(id)

    if (!result.success) {
      return NextResponse.json(
        { error: result.error },
        { status: 404 }
      )
    }

    return NextResponse.json(result.data)
  } catch (error) {
    console.error('Error in GET /api/admin/banners/[id]:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

/**
 * PATCH /api/admin/banners/[id]
 * Update a banner
 */
export async function PATCH(
  request: NextRequest,
  context: RouteContext
) {
  try {
    const { id } = await context.params
    const body = await request.json()

    const updateData: BannerUpdate = {
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

    // Remove undefined values
    Object.keys(updateData).forEach(key => {
      if (updateData[key as keyof BannerUpdate] === undefined) {
        delete updateData[key as keyof BannerUpdate]
      }
    })

    const result = await BannerService.updateBanner(id, updateData)

    if (!result.success) {
      return NextResponse.json(
        { error: result.error },
        { status: 500 }
      )
    }

    return NextResponse.json(result.data)
  } catch (error) {
    console.error('Error in PATCH /api/admin/banners/[id]:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

/**
 * DELETE /api/admin/banners/[id]
 * Delete a banner
 */
export async function DELETE(
  request: NextRequest,
  context: RouteContext
) {
  try {
    const { id } = await context.params
    const result = await BannerService.deleteBanner(id)

    if (!result.success) {
      return NextResponse.json(
        { error: result.error },
        { status: 500 }
      )
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error in DELETE /api/admin/banners/[id]:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
