import { MetadataRoute } from 'next'

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://dudemenswear.com'

  // Static pages
  const staticPages = [
    '',
    '/about',
    '/contact',
    '/faq',
    '/shipping',
    '/returns',
    '/refund',
    '/terms',
    '/privacy',
    '/size-guide',
    '/stores',
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: 'monthly' as const,
    priority: route === '' ? 1 : 0.8,
  }))

  // TODO: Add dynamic product and collection pages
  // Fetch from custom API and add to sitemap
  // Example:
  // const products = await getProducts()
  // const productPages = products.map(product => ({
  //   url: `${baseUrl}/products/${product.handle}`,
  //   lastModified: product.updated_at,
  //   changeFrequency: 'weekly',
  //   priority: 0.7,
  // }))

  return [...staticPages]
}
