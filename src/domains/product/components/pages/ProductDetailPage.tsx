'use client'

import MobileProductView from '../detail/MobileProductView'
import DesktopProductView from '../detail/DesktopProductView'

import { Product } from '@/domains/product'

interface ProductDetailPageProps {
  product: Product
}

export default function ProductDetailPage({ product }: ProductDetailPageProps) {
  return (
    <>
      <MobileProductView product={product} />
      <DesktopProductView product={product} />
    </>
  )
}
