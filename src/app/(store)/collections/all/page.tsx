import { redirect } from 'next/navigation'

// Redirect /collections/all to /products
export default function AllCollectionPage() {
  redirect('/products')
}
