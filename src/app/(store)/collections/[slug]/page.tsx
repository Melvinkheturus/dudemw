import { notFound } from 'next/navigation'
import { generateBreadcrumbSchema } from '@/lib/utils/seo'
import { CollectionService } from '@/lib/services/collections'
import { ProductsPage } from '@/domains/product'

export default async function CollectionPage({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>
  searchParams: Promise<{ q?: string; page?: string; sort?: string }>
}) {
  const { slug } = await params
  const resolvedSearchParams = await searchParams
  
  // Fetch collection from database using CollectionService
  const collectionResult = await CollectionService.getCollection(slug, true)
  
  if (!collectionResult.success || !collectionResult.data) {
    notFound()
  }

  const collection = collectionResult.data

  // Generate structured data for SEO
  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: 'Home', url: '/' },
    { name: 'Collections', url: '/collections' },
    { name: collection.title, url: `/collections/${slug}` },
  ])

  return (
    <>
      {/* Structured Data for SEO */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      
      {/* Use ProductsPage with collection filter */}
      <ProductsPage 
        searchParams={{
          ...resolvedSearchParams,
          collection: collection.id,
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
  const collectionResult = await CollectionService.getCollection(slug, true)

  if (!collectionResult.success || !collectionResult.data) {
    return {
      title: 'Collection Not Found',
    }
  }

  const collection = collectionResult.data

  return {
    title: `${collection.title} - Dude Menswear`,
    description: collection.description || `Shop ${collection.title} collection at Dude Menswear`,
    keywords: ['menswear', 'fashion', 'collection', collection.title.toLowerCase(), 'clothing'],
    openGraph: {
      type: 'website',
      title: collection.title,
      description: collection.description || `Shop ${collection.title} collection`,
      siteName: 'Dude Menswear',
    },
    twitter: {
      card: 'summary_large_image',
      title: collection.title,
      description: collection.description || `Shop ${collection.title} collection`,
    },
    alternates: {
      canonical: `/collections/${slug}`,
    },
  }
}

// Generate static params for collections from database
export async function generateStaticParams() {
  const collectionsResult = await CollectionService.getCollections(true)
  
  if (!collectionsResult.success || !collectionsResult.data) {
    return []
  }

  return collectionsResult.data.map((collection: any) => ({
    slug: collection.slug,
  }))
}