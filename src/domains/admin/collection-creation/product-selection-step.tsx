"use client"

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Loader2, X, Package, Plus, ShoppingBag } from 'lucide-react'
import { ProductService } from '@/lib/services/products'
import { toast } from 'sonner'

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
  product_variants?: Array<{
    id: string
    name: string
    sku: string
    price: number
    discount_price?: number
    stock: number
    active: boolean
  }>
}

interface ProductVariant {
  id: string
  name: string
  sku: string
  price: number
  discount_price?: number
  stock: number
  active: boolean
  product: Product
}

interface ProductSelectionStepProps {
  selectedProducts: Map<string, Product>
  onProductsChange: (products: Map<string, Product>) => void
}

export function ProductSelectionStep({ selectedProducts, onProductsChange }: ProductSelectionStepProps) {
  const [loading, setLoading] = useState(false)
  const [allProducts, setAllProducts] = useState<Product[]>([])
  const [availableVariants, setAvailableVariants] = useState<ProductVariant[]>([])
  const [selectedVariantId, setSelectedVariantId] = useState<string>("")

  // Load all products when component mounts
  useEffect(() => {
    loadAllProducts()
  }, [])

  // Update available variants when products change
  useEffect(() => {
    const variants: ProductVariant[] = []
    allProducts.forEach(product => {
      if (product.product_variants) {
        product.product_variants.forEach(variant => {
          // Only include active variants that are not already selected
          if (variant.active && !selectedProducts.has(product.id)) {
            variants.push({
              ...variant,
              product: product
            })
          }
        })
      }
    })
    
    // Sort by SKU for better organization
    variants.sort((a, b) => a.sku.localeCompare(b.sku))
    setAvailableVariants(variants)
  }, [allProducts, selectedProducts])

  const loadAllProducts = async () => {
    try {
      setLoading(true)
      const result = await ProductService.getProducts({
        limit: 1000, // Get all products
        sortBy: 'title',
        sortOrder: 'asc'
      })
      
      if (result.success) {
        setAllProducts(result.data || [])
      } else {
        toast.error('Failed to load products')
      }
    } catch (error) {
      console.error('Error loading products:', error)
      toast.error('Failed to load products')
    } finally {
      setLoading(false)
    }
  }

  const addProductByVariant = (variantId: string) => {
    const variant = availableVariants.find(v => v.id === variantId)
    if (!variant) return

    const product = variant.product
    const newSelected = new Map(selectedProducts)
    newSelected.set(product.id, product)
    onProductsChange(newSelected)
    
    // Clear selection
    setSelectedVariantId("")
  }

  const removeSelectedProduct = (productId: string) => {
    const newSelected = new Map(selectedProducts)
    newSelected.delete(productId)
    onProductsChange(newSelected)
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ShoppingBag className="h-5 w-5" />
            Select Products
          </CardTitle>
          <CardDescription>
            Choose which products to include in this collection
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Selected Products Count */}
          {selectedProducts.size > 0 && (
            <div className="flex items-center gap-2 p-4 bg-green-50 border border-green-200 rounded-lg">
              <Package className="h-5 w-5 text-green-600" />
              <span className="text-sm font-medium text-green-900">
                {selectedProducts.size} product{selectedProducts.size !== 1 ? 's' : ''} selected
              </span>
            </div>
          )}

          {/* Product Selection Dropdown */}
          <div className="space-y-2">
            <Label>Add Products by SKU</Label>
            <div className="flex gap-2">
              <div className="flex-1">
                <Select 
                  value={selectedVariantId} 
                  onValueChange={setSelectedVariantId}
                  disabled={loading}
                >
                  <SelectTrigger className="w-full h-12 bg-white border-gray-200 hover:border-gray-300 focus:border-red-500 focus:ring-2 focus:ring-red-100 transition-all duration-200">
                    <SelectValue placeholder={
                      loading 
                        ? "Loading products..." 
                        : availableVariants.length === 0 
                          ? "No products available" 
                          : "Select a product by SKU..."
                    } />
                  </SelectTrigger>
                  <SelectContent className="max-h-80 w-full min-w-[400px]">
                    {loading ? (
                      <div className="flex items-center justify-center py-8">
                        <Loader2 className="h-5 w-5 animate-spin text-gray-400" />
                        <span className="ml-2 text-sm text-gray-500">Loading products...</span>
                      </div>
                    ) : availableVariants.length === 0 ? (
                      <div className="text-center py-8 text-gray-500">
                        <Package className="h-8 w-8 mx-auto mb-2 text-gray-400" />
                        <p className="text-sm">No available products</p>
                      </div>
                    ) : (
                      availableVariants.map(variant => {
                        const primaryImage = variant.product.product_images?.find(img => img.is_primary)
                        const displayPrice = variant.discount_price || variant.price
                        
                        return (
                          <SelectItem 
                            key={variant.id} 
                            value={variant.id}
                            className="cursor-pointer hover:bg-gray-50 focus:bg-gray-50 p-3 border-b border-gray-100 last:border-b-0"
                          >
                            <div className="flex items-center gap-3 w-full">
                              {primaryImage && (
                                <div className="flex-shrink-0">
                                  <img
                                    src={primaryImage.image_url}
                                    alt={primaryImage.alt_text || variant.product.title}
                                    className="w-10 h-10 object-cover rounded-lg border border-gray-200"
                                  />
                                </div>
                              )}
                              
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2 mb-1">
                                  <Badge variant="outline" className="text-xs font-mono bg-gray-50 text-gray-700 border-gray-300">
                                    {variant.sku}
                                  </Badge>
                                  <span className="text-sm font-semibold text-gray-900 truncate">
                                    {variant.product.title}
                                  </span>
                                </div>
                                <div className="flex items-center gap-3 text-xs text-gray-500">
                                  <span className="font-medium">
                                    {variant.name}
                                  </span>
                                  <span className="text-green-600 font-semibold">
                                    ₹{displayPrice.toFixed(2)}
                                  </span>
                                  <span className="text-gray-400">
                                    Stock: {variant.stock}
                                  </span>
                                </div>
                              </div>
                            </div>
                          </SelectItem>
                        )
                      })
                    )}
                  </SelectContent>
                </Select>
              </div>
              
              <Button
                onClick={() => selectedVariantId && addProductByVariant(selectedVariantId)}
                disabled={!selectedVariantId || loading}
                className="bg-red-600 hover:bg-red-700 text-white h-12 px-6 font-medium shadow-sm hover:shadow-md transition-all duration-200"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add
              </Button>
            </div>
            <p className="text-xs text-gray-500">
              Select a product variant by its SKU and click Add to include it in this collection.
            </p>
          </div>

          {/* Selected Products Display */}
          {selectedProducts.size > 0 ? (
            <div className="space-y-3">
              <Label>Selected Products ({selectedProducts.size})</Label>
              <div className="grid gap-3 max-h-96 overflow-y-auto border border-gray-200 rounded-lg p-4">
                {Array.from(selectedProducts.values()).map(product => {
                  const primaryImage = product.product_images?.find(img => img.is_primary)
                  
                  return (
                    <div
                      key={product.id}
                      className="flex items-center gap-3 p-3 bg-white border border-gray-200 rounded-lg hover:shadow-sm transition-shadow"
                    >
                      {primaryImage && (
                        <img
                          src={primaryImage.image_url}
                          alt={primaryImage.alt_text || product.title}
                          className="w-12 h-12 object-cover rounded border border-gray-200 flex-shrink-0"
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
                          <p className="text-sm font-medium text-green-600">
                            ₹{product.price.toFixed(2)}
                          </p>
                        )}
                      </div>
                      
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeSelectedProduct(product.id)}
                        className="text-red-600 hover:text-red-700 hover:bg-red-50"
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  )
                })}
              </div>
            </div>
          ) : (
            <div className="text-center py-12 border-2 border-dashed border-gray-300 rounded-lg">
              <Package className="h-12 w-12 mx-auto text-gray-400 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No products selected</h3>
              <p className="text-gray-600 mb-4">Use the dropdown above to browse and add products by SKU</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Help Card */}
      <Card className="border-blue-200 bg-blue-50/50">
        <CardContent className="pt-6">
          <div className="flex items-start gap-3">
            <div className="w-5 h-5 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0 mt-0.5">
              <span className="text-blue-600 text-xs font-bold">i</span>
            </div>
            <div className="space-y-1">
              <p className="text-sm font-medium text-blue-900">
                Product Selection Tips
              </p>
              <ul className="text-sm text-blue-800 space-y-1">
                <li>• Browse all available products by their SKU in the dropdown</li>
                <li>• Each option shows SKU, product name, variant, price, and stock</li>
                <li>• Only active product variants with stock are shown</li>
                <li>• Select products that fit well together thematically</li>
                <li>• Collections work best with 3-20 products for optimal display</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}