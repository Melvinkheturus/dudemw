import { InventoryItem } from '@/lib/types/inventory'
import { Supplier } from '@/lib/types/supplier'

export class CSVService {
  /**
   * Generate CSV template for inventory bulk import
   */
  static generateInventoryTemplate(): string {
    const headers = [
      'variant_id',
      'sku',
      'adjustment_type',
      'quantity',
      'reason',
      'low_stock_threshold'
    ]

    const exampleRow = [
      'example-variant-id',
      'EXAMPLE-SKU',
      'add',
      '10',
      'Received shipment',
      '5'
    ]

    return [headers.join(','), exampleRow.join(',')].join('\n')
  }

  /**
   * Parse CSV for inventory bulk import
   */
  static parseInventoryCSV(csvContent: string): {
    success: boolean
    data?: any[]
    errors?: string[]
  } {
    try {
      const lines = csvContent.trim().split('\n')
      if (lines.length < 2) {
        return {
          success: false,
          errors: ['CSV file is empty or only contains headers']
        }
      }

      const headers = lines[0].split(',')
      const errors: string[] = []
      const data: any[] = []

      for (let i = 1; i < lines.length; i++) {
        const values = lines[i].split(',')
        if (values.length !== headers.length) {
          errors.push(`Line ${i + 1}: Column count mismatch`)
          continue
        }

        const row: any = {}
        headers.forEach((header, index) => {
          row[header.trim()] = values[index].trim()
        })

        // Validate required fields
        if (!row.variant_id) {
          errors.push(`Line ${i + 1}: Missing variant_id`)
          continue
        }

        if (!row.adjustment_type || !['add', 'subtract', 'set'].includes(row.adjustment_type)) {
          errors.push(`Line ${i + 1}: Invalid adjustment_type (must be: add, subtract, or set)`)
          continue
        }

        if (!row.quantity || isNaN(parseInt(row.quantity))) {
          errors.push(`Line ${i + 1}: Invalid quantity`)
          continue
        }

        if (!row.reason) {
          errors.push(`Line ${i + 1}: Missing reason`)
          continue
        }

        // Convert types
        row.quantity = parseInt(row.quantity)
        if (row.low_stock_threshold) {
          row.low_stock_threshold = parseInt(row.low_stock_threshold)
        }

        data.push(row)
      }

      if (errors.length > 0 && data.length === 0) {
        return { success: false, errors }
      }

      return { success: true, data, errors: errors.length > 0 ? errors : undefined }
    } catch (error) {
      console.error('Error parsing CSV:', error)
      return {
        success: false,
        errors: ['Failed to parse CSV file. Please check the format.']
      }
    }
  }

  /**
   * Export inventory items to CSV
   */
  static exportInventoryToCSV(items: InventoryItem[]): string {
    const headers = [
      'Product Name',
      'Variant Name',
      'SKU',
      'Current Stock',
      'Available Quantity',
      'Reserved Quantity',
      'Low Stock Threshold',
      'Allow Backorders',
      'Track Quantity'
    ]

    const rows = items.map(item => [
      item.product_name,
      item.variant_name || '',
      item.sku || '',
      item.quantity || 0,
      item.available_quantity || 0,
      item.reserved_quantity || 0,
      item.low_stock_threshold || 0,
      item.allow_backorders ? 'Yes' : 'No',
      item.track_quantity ? 'Yes' : 'No'
    ])

    const csv = [headers, ...rows]
      .map(row => row.map(cell => `"${cell}"`).join(','))
      .join('\n')

    return csv
  }

  /**
   * Export suppliers to CSV
   */
  static exportSuppliersToCSV(suppliers: Supplier[]): string {
    const headers = [
      'Name',
      'Contact Person',
      'Email',
      'Phone',
      'Address',
      'Website',
      'Status',
      'Notes'
    ]

    const rows = suppliers.map(supplier => [
      supplier.name,
      supplier.contact_person || '',
      supplier.email || '',
      supplier.phone || '',
      supplier.address || '',
      supplier.website || '',
      supplier.is_active ? 'Active' : 'Inactive',
      supplier.notes || ''
    ])

    const csv = [headers, ...rows]
      .map(row => row.map(cell => `"${cell}"`).join(','))
      .join('\n')

    return csv
  }

  /**
   * Download CSV file
   */
  static downloadCSV(content: string, filename: string) {
    const blob = new Blob([content], { type: 'text/csv;charset=utf-8;' })
    const link = document.createElement('a')
    const url = URL.createObjectURL(blob)
    
    link.setAttribute('href', url)
    link.setAttribute('download', filename)
    link.style.visibility = 'hidden'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }
}
