import { notFound } from 'next/navigation'
import { generateBreadcrumbSchema } from '@/lib/utils/seo'
import { ProductsPage } from '@/domains/product'

// Define available categories
const CATEGORIES = {
  'shirts': {
    title: 'Shirts',
    description: 'Premium shirts for every occasion',
    keywords: ['shirts', 'formal shirts', 'casual shirts', 'dress shirts'],
  },
  'pants': {
    title: 'Pants',
    description: 'Comfortable and stylish pants',
    keywords: ['pants', 'trousers', 'chinos', 'formal pants'],
  },
  'hoodies': {
    title: 'Hoodies',
    description: 'Cozy hoodies and sweatshirts',
    keywords: ['hoodies', 'sweatshirts', 'casual wear', 'streetwear'],
  },
  'jeans': {
    title: 'Jeans',
    description: 'Premium denim for modern men',
    keywords: ['jeans', 'denim', 'casual pants', 'streetwear'],
  },
  't-shirts': {
    title: 'T-Shirts',
    description: 'Comfortable and stylish t-shirts',
    keywords: ['t-shirts', 'tees', 'casual wear', 'cotton shirts'],
  },
  'jackets': {
    title: 'Jackets',
    description: 'Stylish jackets and outerwear',
    keywords: ['jackets', 'outerwear', 'blazers', 'coats'],
  },
  'shorts': {
    title: 'Shorts',
    description: 'Comfortable shorts for casual wear',
    keywords: ['shorts', 'casual wear', 'summer wear', 'bermuda'],
  },
  'accessories': {
    title: 'Accessories',
    description: 'Complete your look with our accessories',
    keywords: ['accessories', 'belts', 'wallets', 'bags', 'caps'],
  },
}

export default async function CategoryPage({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>
  searchParams: Promise<{ q?: string; page?: string; sort?: string }>
}) {
  const { slug } = await params
  const resolvedSearchParams = await searchParams

  // Check if category exists
  const category = CATEGORIES[slug as keyof typeof CATEGORIES]

  if (!category) {
    notFound()
  }

  // Generate structured data for SEO
  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: 'Home', url: '/' },
    { name: 'Products', url: '/products' },
    { name: category.title, url: `/categories/${slug}` },
  ])

  return (
    <>
      {/* Structured Data for SEO */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />

      {/* Use ProductsPage with category filter - no separate page needed */}
      <ProductsPage
        searchParams={{
          ...resolvedSearchParams,
          category: slug,
        }}
        category={slug}
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
  const category = CATEGORIES[slug as keyof typeof CATEGORIES]

  if (!category) {
    return {
      title: 'Category Not Found',
    }
  }

  return {
    title: `${category.title} - Dude Menswear`,
    description: category.description,
    keywords: ['menswear', 'fashion', ...category.keywords, 'clothing', 'men'],
    openGraph: {
      type: 'website',
      title: `${category.title} - Dude Menswear`,
      description: category.description,
      siteName: 'Dude Menswear',
    },
    twitter: {
      card: 'summary_large_image',
      title: `${category.title} - Dude Menswear`,
      description: category.description,
    },
    alternates: {
      canonical: `/categories/${slug}`,
    },
  }
}

// Generate static params for known categories
export async function generateStaticParams() {
  return Object.keys(CATEGORIES).map((slug) => ({
    slug,
  }))
}