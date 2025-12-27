import { NextRequest, NextResponse } from 'next/server'
import { CSVImportService } from '@/lib/services/csv-import.service'
import type { ProductGroup } from '@/types/csv-import.types'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { productGroups } = body as { productGroups: ProductGroup[] }

    if (!productGroups || !Array.isArray(productGroups)) {
      return NextResponse.json(
        { success: false, error: 'Invalid product groups data' },
        { status: 400 }
      )
    }

    const result = await CSVImportService.executeImport(productGroups)

    return NextResponse.json(result)
  } catch (error: any) {
    console.error('Error executing CSV import:', error)
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to execute import' },
      { status: 500 }
    )
  }
}
