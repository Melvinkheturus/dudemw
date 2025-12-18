import { NextRequest, NextResponse } from 'next/server'
import { CSVImportService } from '@/lib/services/csv-import.service'

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get('file') as File

    if (!file) {
      return NextResponse.json(
        { success: false, error: 'No file provided' },
        { status: 400 }
      )
    }

    if (!file.name.endsWith('.csv')) {
      return NextResponse.json(
        { success: false, error: 'File must be a CSV' },
        { status: 400 }
      )
    }

    const result = await CSVImportService.previewImport(file)

    return NextResponse.json(result)
  } catch (error: any) {
    console.error('Error previewing CSV import:', error)
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to preview import' },
      { status: 500 }
    )
  }
}
