import { NextResponse } from 'next/server'
import { CSVImportService } from '@/lib/services/csv-import.service'

export async function GET() {
  try {
    const csv = CSVImportService.generateTemplate()
    
    return new NextResponse(csv, {
      headers: {
        'Content-Type': 'text/csv',
        'Content-Disposition': 'attachment; filename="product-import-template.csv"',
      },
    })
  } catch (error: any) {
    console.error('Error generating CSV template:', error)
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to generate template' },
      { status: 500 }
    )
  }
}
