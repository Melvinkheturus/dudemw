'use client'

import { ProductCard } from '@/domains/product'

interface RelatedProductsProps {
  products?: any[]
}

export default function RelatedProducts({ products = [] }: RelatedProductsProps) {
  // If no products provided, show empty state
  if (products.length === 0) {
    return null
  }

  return (
    <section className="py-16 md:py-24 bg-white">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl md:text-4xl font-heading tracking-wider mb-8 text-center">
          YOU MAY ALSO LIKE
        </h2>

        <div className="grid grid-cols-2 gap-4 md:grid-cols-4 md:gap-6">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </section>
  )
}
