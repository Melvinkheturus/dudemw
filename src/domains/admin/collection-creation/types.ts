export interface Product {
  id: string
  title: string
  handle?: string | null
  price?: number | null
  product_images?: Array<{
    id: string
    image_url: string
    alt_text?: string | null
    is_primary: boolean | null
    sort_order?: number | null
  }>
  product_variants?: Array<{
    id: string
    name: string | null
    sku: string
    price: number
    discount_price?: number | null
    stock: number
    active: boolean | null
  }>
}

export interface SelectedProductWithVariant {
  product: Product
  selectedVariantId: string // Which variant/SKU to display as main
}

export interface CollectionFormData {
  title: string
  description: string
  is_active: boolean
  selectedProducts: Map<string, SelectedProductWithVariant>
}
