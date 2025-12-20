"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Eye, Package, Globe, Hash, FileText, ToggleLeft, ToggleRight } from 'lucide-react'

interface Product {
  id: string
  title: string
  handle: string
  price?: number
  product_images?: Array<{
    id: string
    image_url: string
    alt_text?: string
    is_primary: boolean
  }>
}

interface CollectionFormData {
  title: string
  slug: string
  description: string
  is_active: boolean
  selectedProducts: Map<string, Product>
}

interface PreviewStepProps {
  formData: CollectionFormData
}

export function PreviewStep({ formData }: PreviewStepProps) {
  const selectedProductsArray = Array.from(formData.selectedProducts.values())

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Eye className="h-5 w-5" />
            Collection Preview
          </CardTitle>
          <CardDescription>
            Review your collection details before creating
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Collection Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <FileText className="h-5 w-5 text-gray-400 mt-0.5" />
                <div className="space-y-1">
                  <p className="text-sm font-medium text-gray-600">Collection Title</p>
                  <p className="text-base font-semibold text-gray-900">{formData.title}</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Hash className="h-5 w-5 text-gray-400 mt-0.5" />
                <div className="space-y-1">
                  <p className="text-sm font-medium text-gray-600">URL Slug</p>
                  <Badge variant="secondary" className="font-mono text-xs">
                    /collections/{formData.slug}
                  </Badge>
                </div>
              </div>

              <div className="flex items-start gap-3">
                {formData.is_active ? (
                  <ToggleRight className="h-5 w-5 text-green-500 mt-0.5" />
                ) : (
                  <ToggleLeft className="h-5 w-5 text-gray-400 mt-0.5" />
                )}
                <div className="space-y-1">
                  <p className="text-sm font-medium text-gray-600">Status</p>
                  <Badge variant={formData.is_active ? "default" : "secondary"}>
                    {formData.is_active ? "Active" : "Inactive"}
                  </Badge>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <Package className="h-5 w-5 text-gray-400 mt-0.5" />
                <div className="space-y-1">
                  <p className="text-sm font-medium text-gray-600">Products Selected</p>
                  <p className="text-base font-semibold text-gray-900">
                    {formData.selectedProducts.size} product{formData.selectedProducts.size !== 1 ? 's' : ''}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Globe className="h-5 w-5 text-gray-400 mt-0.5" />
                <div className="space-y-1">
                  <p className="text-sm font-medium text-gray-600">Collection Type</p>
                  <Badge variant="outline">Manual Collection</Badge>
                </div>
              </div>
            </div>
          </div>

          {/* Description */}
          <div className="space-y-2">
            <p className="text-sm font-medium text-gray-600">Description</p>
            <div className="p-4 bg-gray-50 rounded-lg border">
              <p className="text-sm text-gray-900 whitespace-pre-wrap">{formData.description}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Products Preview */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Package className="h-5 w-5" />
            Products in Collection ({selectedProductsArray.length})
          </CardTitle>
          <CardDescription>
            Products that will be included in this collection
          </CardDescription>
        </CardHeader>
        <CardContent>
          {selectedProductsArray.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 max-h-96 overflow-y-auto">
              {selectedProductsArray.map((product, index) => {
                const primaryImage = product.product_images?.find(img => img.is_primary)
                
                return (
                  <div
                    key={product.id}
                    className="flex items-center gap-3 p-3 bg-white border border-gray-200 rounded-lg hover:shadow-sm transition-shadow"
                  >
                    <div className="flex items-center justify-center w-6 h-6 bg-gray-100 rounded-full text-xs font-medium text-gray-600 flex-shrink-0">
                      {index + 1}
                    </div>
                    
                    {primaryImage && (
                      <img
                        src={primaryImage.image_url}
                        alt={primaryImage.alt_text || product.title}
                        className="w-10 h-10 object-cover rounded border border-gray-200 flex-shrink-0"
                      />
                    )}
                    
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">
                        {product.title}
                      </p>
                      <p className="text-xs text-gray-500 truncate">
                        {product.handle}
                      </p>
                      {product.price && (
                        <p className="text-xs font-medium text-green-600">
                          ₹{product.price.toFixed(2)}
                        </p>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              <Package className="h-8 w-8 mx-auto mb-2 text-gray-400" />
              <p className="text-sm">No products selected</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Summary Card */}
      <Card className="border-green-200 bg-green-50/50">
        <CardContent className="pt-6">
          <div className="flex items-start gap-3">
            <div className="w-5 h-5 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0 mt-0.5">
              <span className="text-green-600 text-xs font-bold">✓</span>
            </div>
            <div className="space-y-2">
              <p className="text-sm font-medium text-green-900">
                Ready to Create Collection
              </p>
              <p className="text-sm text-green-800">
                Your collection "{formData.title}" with {formData.selectedProducts.size} products is ready to be created. 
                {formData.is_active 
                  ? " It will be immediately visible on your store." 
                  : " It will be saved as inactive and can be activated later."
                }
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}