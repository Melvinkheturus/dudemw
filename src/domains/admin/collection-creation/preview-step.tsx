"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Eye, Package, FileText, ToggleLeft, ToggleRight } from 'lucide-react'
import type { CollectionFormData } from './types'

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

      {/* Products Preview - Store UI Style */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Package className="h-5 w-5" />
            Products in Collection ({selectedProductsArray.length})
          </CardTitle>
          <CardDescription>
            Preview of how products will appear on your store
          </CardDescription>
        </CardHeader>
        <CardContent>
          {selectedProductsArray.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {selectedProductsArray.map((selectedProductWithVariant) => {
                const { product, selectedVariantId } = selectedProductWithVariant
                const primaryImage = product.product_images?.find(img => img.is_primary)
                const selectedVariant = product.product_variants?.find(v => v.id === selectedVariantId)
                const displayPrice = selectedVariant ? (selectedVariant.discount_price || selectedVariant.price) : product.price
                const hasDiscount = selectedVariant?.discount_price && selectedVariant.discount_price < selectedVariant.price
                
                return (
                  <div
                    key={product.id}
                    className="group relative bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg transition-all duration-300"
                  >
                    {/* Product Image */}
                    <div className="relative aspect-square bg-gray-100 overflow-hidden">
                      {primaryImage ? (
                        <img
                          src={primaryImage.image_url}
                          alt={primaryImage.alt_text || product.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <Package className="h-12 w-12 text-gray-300" />
                        </div>
                      )}
                      
                      {/* NEW Badge */}
                      <div className="absolute top-2 left-2">
                        <span className="bg-black text-white text-xs font-bold px-2 py-1 rounded">
                          NEW
                        </span>
                      </div>
                      
                      {/* Wishlist Icon */}
                      <button className="absolute top-2 right-2 w-8 h-8 bg-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-md">
                        <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                        </svg>
                      </button>
                    </div>
                    
                    {/* Product Info */}
                    <div className="p-3 space-y-2">
                      {/* Product Title */}
                      <h3 className="text-sm font-medium text-gray-900 line-clamp-2 min-h-[40px]">
                        {product.title}
                      </h3>
                      
                      {/* Selected SKU Badge */}
                      {selectedVariant && (
                        <div className="flex items-center gap-1">
                          <span className="text-xs font-mono bg-gray-100 text-gray-600 px-1.5 py-0.5 rounded">
                            {selectedVariant.sku}
                          </span>
                          {selectedVariant.name && selectedVariant.name !== 'Default' && (
                            <span className="text-xs text-gray-500">
                              • {selectedVariant.name}
                            </span>
                          )}
                        </div>
                      )}
                      
                      {/* Rating Stars */}
                      <div className="flex items-center gap-1">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <svg
                            key={star}
                            className="w-3 h-3 text-yellow-400 fill-current"
                            viewBox="0 0 20 20"
                          >
                            <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
                          </svg>
                        ))}
                        <span className="text-xs text-gray-500 ml-1">(4.5)</span>
                      </div>
                      
                      {/* Price */}
                      <div className="flex items-center gap-2">
                        {hasDiscount && selectedVariant ? (
                          <>
                            <span className="text-base font-bold text-gray-900">
                              ₹{selectedVariant.discount_price?.toFixed(2)}
                            </span>
                            <span className="text-sm text-gray-400 line-through">
                              ₹{selectedVariant.price.toFixed(2)}
                            </span>
                          </>
                        ) : displayPrice ? (
                          <span className="text-base font-bold text-gray-900">
                            ₹{displayPrice.toFixed(2)}
                          </span>
                        ) : null}
                      </div>
                      
                      {/* Add to Cart Button */}
                      <button className="w-full bg-black text-white text-sm font-medium py-2 rounded hover:bg-gray-800 transition-colors opacity-0 group-hover:opacity-100">
                        Add to Cart
                      </button>
                    </div>
                  </div>
                )
              })}
            </div>
          ) : (
            <div className="text-center py-12 text-gray-500">
              <Package className="h-12 w-12 mx-auto mb-3 text-gray-400" />
              <p className="text-sm font-medium">No products selected</p>
              <p className="text-xs text-gray-400 mt-1">Add products to see the preview</p>
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