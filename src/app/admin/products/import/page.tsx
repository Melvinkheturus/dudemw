'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { ProductService } from '@/lib/services/products'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { toast } from 'sonner'
import { ArrowLeft, Upload, Download, Loader2, CheckCircle, XCircle } from 'lucide-react'
import Link from 'next/link'

export default function ProductImportPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [file, setFile] = useState<File | null>(null)
  const [results, setResults] = useState<any>(null)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0]
    if (selectedFile && selectedFile.type === 'text/csv') {
      setFile(selectedFile)
      setResults(null)
    } else {
      toast.error('Please select a valid CSV file')
    }
  }

  const parseCSV = (text: string) => {
    const lines = text.split('\n')
    const headers = lines[0].split(',').map(h => h.trim())
    const products = []

    for (let i = 1; i < lines.length; i++) {
      if (!lines[i].trim()) continue

      const values = lines[i].split(',').map(v => v.trim())
      const product: any = {}

      headers.forEach((header, index) => {
        product[header] = values[index]
      })

      if (product.title && product.slug && product.sku) {
        products.push({
          title: product.title || product.Title,
          slug: product.slug || product.Slug,
          description: product.description || product.Description,
          price: parseFloat(product.price || product.Price) || 0,
          compare_price: parseFloat(product.compare_price || product['Compare Price']) || undefined,
          sku: product.sku || product.SKU,
          stock: parseInt(product.stock || product.Stock) || 0,
          category: product.category || product.Category,
          status: product.status || product.Status || 'active'
        })
      }
    }

    return products
  }

  const handleImport = async () => {
    if (!file) {
      toast.error('Please select a file')
      return
    }

    setLoading(true)

    try {
      const text = await file.text()
      const products = parseCSV(text)

      if (products.length === 0) {
        toast.error('No valid products found in CSV')
        setLoading(false)
        return
      }

      const result = await ProductService.bulkImport(products)

      if (result.success && result.data) {
        setResults(result.data)
        toast.success(`Import completed: ${result.data.success} successful, ${result.data.failed} failed`)
      } else {
        toast.error(result.error || 'Import failed')
      }
    } catch (error) {
      console.error('Error importing products:', error)
      toast.error('Failed to import products')
    } finally {
      setLoading(false)
    }
  }

  const downloadTemplate = () => {
    const template = `title,slug,description,price,compare_price,sku,stock,category,status
Example T-Shirt,example-t-shirt,A comfortable cotton t-shirt,999,1499,SKU-001,100,t-shirts,active
Example Hoodie,example-hoodie,Warm and cozy hoodie,1999,2499,SKU-002,50,hoodies,active`

    const blob = new Blob([template], { type: 'text/csv' })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'product-import-template.csv'
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    window.URL.revokeObjectURL(url)
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center space-x-4">
        <Link href="/admin/products">
          <Button variant="outline" size="icon">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <div>
          <h1 className="text-4xl font-bold tracking-tight text-gray-900">Import Products</h1>
          <p className="text-lg text-gray-600 mt-2">Bulk import products from CSV file</p>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Import Card */}
        <Card>
          <CardHeader>
            <CardTitle>Upload CSV File</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                <Upload className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                <label htmlFor="csv-upload" className="cursor-pointer">
                  <span className="text-red-600 hover:text-red-700 font-medium">
                    Choose a CSV file
                  </span>
                  <input
                    id="csv-upload"
                    type="file"
                    accept=".csv"
                    className="hidden"
                    onChange={handleFileChange}
                    disabled={loading}
                  />
                </label>
                {file && (
                  <p className="mt-2 text-sm text-gray-600">{file.name}</p>
                )}
              </div>
            </div>

            <Button
              onClick={handleImport}
              disabled={!file || loading}
              className="w-full bg-red-600 hover:bg-red-700"
            >
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {loading ? 'Importing...' : 'Import Products'}
            </Button>
          </CardContent>
        </Card>

        {/* Template Card */}
        <Card>
          <CardHeader>
            <CardTitle>CSV Template</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <p className="text-sm text-gray-600 mb-4">
                Download the CSV template to see the required format for importing products.
              </p>
              
              <div className="bg-gray-50 rounded-lg p-4 mb-4">
                <h4 className="font-semibold text-sm text-gray-900 mb-2">Required Columns:</h4>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• <strong>title</strong> - Product name</li>
                  <li>• <strong>slug</strong> - URL-friendly identifier</li>
                  <li>• <strong>price</strong> - Product price</li>
                  <li>• <strong>sku</strong> - Stock keeping unit</li>
                  <li>• <strong>stock</strong> - Available quantity</li>
                </ul>

                <h4 className="font-semibold text-sm text-gray-900 mb-2 mt-4">Optional Columns:</h4>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• <strong>description</strong> - Product description</li>
                  <li>• <strong>compare_price</strong> - Original price</li>
                  <li>• <strong>category</strong> - Category slug</li>
                  <li>• <strong>status</strong> - active/draft</li>
                </ul>
              </div>

              <Button
                onClick={downloadTemplate}
                variant="outline"
                className="w-full"
              >
                <Download className="mr-2 h-4 w-4" />
                Download Template
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Results */}
      {results && (
        <Card>
          <CardHeader>
            <CardTitle>Import Results</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center space-x-3 p-4 bg-green-50 rounded-lg">
                  <CheckCircle className="h-8 w-8 text-green-600" />
                  <div>
                    <p className="text-2xl font-bold text-green-900">{results.success}</p>
                    <p className="text-sm text-green-700">Successful</p>
                  </div>
                </div>

                <div className="flex items-center space-x-3 p-4 bg-red-50 rounded-lg">
                  <XCircle className="h-8 w-8 text-red-600" />
                  <div>
                    <p className="text-2xl font-bold text-red-900">{results.failed}</p>
                    <p className="text-sm text-red-700">Failed</p>
                  </div>
                </div>
              </div>

              {results.errors && results.errors.length > 0 && (
                <div>
                  <h4 className="font-semibold text-sm text-gray-900 mb-2">Errors:</h4>
                  <div className="bg-red-50 rounded-lg p-4 max-h-60 overflow-y-auto">
                    <ul className="text-sm text-red-700 space-y-1">
                      {results.errors.map((error: string, index: number) => (
                        <li key={index}>• {error}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              )}

              <Link href="/admin/products">
                <Button className="w-full bg-red-600 hover:bg-red-700">
                  View Products
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
