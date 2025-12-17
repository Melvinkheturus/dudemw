import { notFound } from 'next/navigation'
import { generateBreadcrumbSchema } from '@/lib/utils/seo'
import { ProductsPage } from '@/domains/product'

// Define available collections
const COLLECTIONS = {
  'new-arrivals': {
    title: 'New Arrivals',
    description: 'Discover the latest trends in menswear',
  },
  'best-sellers': {
    title: 'Best Sellers',
    description: 'Our most popular items',
  },
  'trending': {
    title: 'Trending Now',
    description: 'What\'s hot right now',
  },
  'sale': {
    title: 'Sale',
    description: 'Great deals on premium menswear',
  },
  'winter-collection': {
    title: 'Winter Collection',
    description: 'Stay warm and stylish',
  },
  'summer-collection': {
    title: 'Summer Collection',
    description: 'Cool and comfortable styles',
  },
}

export default async function CollectionPage({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>
  searchParams: Promise<{ q?: string; page?: string; sort?: string }>
}) {
  const { slug } = await params
  const resolvedSearchParams = await searchParams
  
  // Check if collection exists
  const collection = COLLECTIONS[slug as keyof typeof COLLECTIONS]
  
  if (!collection) {
    notFound()
  }

  // Generate structured data for SEO
  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: 'Home', url: '/' },
    { name: 'Products', url: '/products' },
    { name: collection.title, url: `/collections/${slug}` },
  ])

  return (
    <>
      {/* Structured Data for SEO */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      
      {/* Use ProductsPage with collection filter - no separate page needed */}
      <ProductsPage 
        searchParams={{
          ...resolvedSearchParams,
          collection: slug,
        }}
      />
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
  const collection = COLLECTIONS[slug as keyof typeof COLLECTIONS]

  if (!collection) {
    return {
      title: 'Collection Not Found',
    }
  }

  return {
    title: `${collection.title} - Dude Menswear`,
    description: collection.description,
    keywords: ['menswear', 'fashion', 'collection', collection.title.toLowerCase(), 'clothing'],
    openGraph: {
      type: 'website',
      title: collection.title,
      description: collection.description,
      siteName: 'Dude Menswear',
    },
    twitter: {
      card: 'summary_large_image',
      title: collection.title,
      description: collection.description,
    },
    alternates: {
      canonical: `/collections/${slug}`,
    },
  }
}

// Generate static params for known collections
export async function generateStaticParams() {
  return Object.keys(COLLECTIONS).map((slug) => ({
    slug,
  }))
}