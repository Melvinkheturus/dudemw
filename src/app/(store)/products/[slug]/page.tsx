import { notFound } from 'next/navigation'
import { Product } from '@/domains/product/types'
import { ProductService } from '@/lib/services/products'
import { generateProductSchema, generateBreadcrumbSchema } from '@/lib/utils/seo'
import { ProductDetailPage } from '@/domains/product'

export default async function ProductPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params

  // Fetch product using ProductService
  const productResult = await ProductService.getProduct(slug, true)

  // Handle product not found
  if (!productResult.success || !productResult.data) {
    notFound()
  }

  const product = productResult.data

  // Get related products from same category using ProductService
  const categoryId = product.product_categories?.[0]?.categories?.id
  let relatedProducts: any[] = []
  
  if (categoryId) {
    const relatedResult = await ProductService.getProducts({
      categoryId,
      status: 'active',
      limit: 9
    })
    
    if (relatedResult.success) {
      // Filter out current product and limit to 8
      relatedProducts = (relatedResult.data || [])
        .filter((p: any) => p.id !== product.id)
        .slice(0, 8)
    }
  }

  // Generate structured data for SEO
  const productSchema = generateProductSchema({
    id: product.id,
    title: product.title,
    description: product.description || '',
    price: product.price,
    images: product.images || [],
    slug: product.slug,
  })

  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: 'Home', url: '/' },
    { name: 'Products', url: '/products' },
    { name: product.title, url: `/products/${product.slug}` },
  ])

  return (
    <>
      {/* Structured Data for SEO */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(productSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />

      <ProductDetailPage product={product as Product} />
    </>
  )
}

// Generate metadata for SEO
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const { data: product } = await supabase
    .from('products')
    .select('*')
    .eq('slug', slug)
    .single()

  if (!product) {
    return {
      title: 'Product Not Found',
    }
  }

  const description = product.description || `Shop ${product.title} at Dude Menswear. Premium quality menswear with fast delivery.`

  return {
    title: `${product.title} - ₹${product.price.toLocaleString()}`,
    description,
    keywords: [product.title, 'menswear', 'fashion', 'streetwear', 'clothing'],
    openGraph: {
      type: 'website',
      title: product.title,
      description,
      images: [
        {
          url: product.images?.[0] || '',
          width: 1080,
          height: 1350,
          alt: product.title,
        },
      ],
      siteName: 'Dude Menswear',
    },
    twitter: {
      card: 'summary_large_image',
      title: product.title,
      description,
      images: [product.images?.[0] || ''],
    },
    alternates: {
      canonical: `/products/${product.slug}`,
    },
  }
}