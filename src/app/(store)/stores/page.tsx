import { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { MapPin, Phone, Clock, Mail, Navigation } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'

export const metadata: Metadata = {
  title: 'Store Locator | Dude Mens Wear',
  description: 'Find Dude Mens Wear stores near you. Visit our flagship store in Mumbai for the latest men\'s fashion.',
}

// Store data - can be replaced with database data later
const stores = [
  {
    id: 1,
    name: 'Dude Mens Wear - Flagship Store',
    address: '123 Fashion Street, Colaba',
    city: 'Mumbai',
    state: 'Maharashtra',
    pincode: '400001',
    phone: '+91 98765 43210',
    email: 'mumbai@dudemw.com',
    hours: {
      weekdays: '10:00 AM - 9:00 PM',
      saturday: '10:00 AM - 10:00 PM',
      sunday: '11:00 AM - 8:00 PM',
    },
    mapUrl: 'https://maps.google.com/?q=18.9220,72.8347',
    isOpen: true,
  },
]

export default function StoresPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-gray-900 via-gray-800 to-black py-16 lg:py-24">
        <div className="absolute inset-0 bg-[url('/images/pattern.png')] opacity-5" />
        <div className="relative mx-auto max-w-7xl px-4 text-center">
          <h1 className="font-heading text-4xl font-bold tracking-tight text-white lg:text-5xl">
            FIND YOUR STORE
          </h1>
          <p className="mx-auto mt-4 max-w-2xl font-body text-lg text-gray-300">
            Visit us in person for the complete Dude experience. Try on our latest collections and get personalized styling advice.
          </p>
        </div>
      </section>

      {/* Stores List */}
      <section className="mx-auto max-w-7xl px-4 py-12 lg:py-16">
        <div className="grid gap-8 lg:grid-cols-2">
          {stores.map((store) => (
            <Card key={store.id} className="overflow-hidden border-2 border-gray-200 transition-shadow hover:shadow-lg">
              <CardContent className="p-0">
                <div className="flex flex-col lg:flex-row">
                  {/* Store Image/Map Placeholder */}
                  <div className="relative h-48 w-full bg-gradient-to-br from-red-50 to-gray-100 lg:h-auto lg:w-1/3">
                    <div className="flex h-full items-center justify-center">
                      <div className="text-center">
                        <MapPin className="mx-auto h-12 w-12 text-red-600" />
                        <p className="mt-2 font-heading text-sm font-bold text-gray-700">
                          {store.city}
                        </p>
                      </div>
                    </div>
                    {store.isOpen && (
                      <div className="absolute left-4 top-4">
                        <span className="inline-flex items-center gap-1 rounded-full bg-green-100 px-3 py-1 text-xs font-semibold text-green-700">
                          <span className="h-2 w-2 animate-pulse rounded-full bg-green-500" />
                          Open Now
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Store Info */}
                  <div className="flex-1 p-6">
                    <h2 className="font-heading text-xl font-bold text-gray-900">
                      {store.name}
                    </h2>
                    
                    <div className="mt-4 space-y-3">
                      {/* Address */}
                      <div className="flex items-start gap-3">
                        <MapPin className="mt-0.5 h-5 w-5 flex-shrink-0 text-gray-400" />
                        <div className="font-body text-sm text-gray-600">
                          <p>{store.address}</p>
                          <p>{store.city}, {store.state} - {store.pincode}</p>
                        </div>
                      </div>

                      {/* Phone */}
                      <div className="flex items-center gap-3">
                        <Phone className="h-5 w-5 flex-shrink-0 text-gray-400" />
                        <a 
                          href={`tel:${store.phone}`} 
                          className="font-body text-sm text-gray-600 hover:text-red-600"
                        >
                          {store.phone}
                        </a>
                      </div>

                      {/* Email */}
                      <div className="flex items-center gap-3">
                        <Mail className="h-5 w-5 flex-shrink-0 text-gray-400" />
                        <a 
                          href={`mailto:${store.email}`} 
                          className="font-body text-sm text-gray-600 hover:text-red-600"
                        >
                          {store.email}
                        </a>
                      </div>

                      {/* Hours */}
                      <div className="flex items-start gap-3">
                        <Clock className="mt-0.5 h-5 w-5 flex-shrink-0 text-gray-400" />
                        <div className="font-body text-sm text-gray-600">
                          <p><span className="font-medium">Mon - Fri:</span> {store.hours.weekdays}</p>
                          <p><span className="font-medium">Saturday:</span> {store.hours.saturday}</p>
                          <p><span className="font-medium">Sunday:</span> {store.hours.sunday}</p>
                        </div>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="mt-6 flex flex-wrap gap-3">
                      <Button asChild className="bg-red-600 hover:bg-red-700">
                        <a 
                          href={store.mapUrl} 
                          target="_blank" 
                          rel="noopener noreferrer"
                        >
                          <Navigation className="mr-2 h-4 w-4" />
                          Get Directions
                        </a>
                      </Button>
                      <Button variant="outline" asChild>
                        <a href={`tel:${store.phone}`}>
                          <Phone className="mr-2 h-4 w-4" />
                          Call Store
                        </a>
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Coming Soon Section */}
        <div className="mt-16 rounded-2xl border-2 border-dashed border-gray-300 bg-gray-50 p-8 text-center lg:p-12">
          <div className="mx-auto max-w-md">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-red-100">
              <MapPin className="h-8 w-8 text-red-600" />
            </div>
            <h3 className="font-heading text-xl font-bold text-gray-900">
              More Stores Coming Soon
            </h3>
            <p className="mt-2 font-body text-gray-600">
              We're expanding! New stores will be opening in Bangalore, Delhi, and Chennai soon. Stay tuned!
            </p>
            <Button variant="outline" className="mt-6" asChild>
              <Link href="/contact">
                Get Notified
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Contact CTA */}
      <section className="border-t-2 border-gray-200 bg-gray-50 py-12">
        <div className="mx-auto max-w-7xl px-4 text-center">
          <h2 className="font-heading text-2xl font-bold text-gray-900">
            Can't Visit? Shop Online!
          </h2>
          <p className="mt-2 font-body text-gray-600">
            Browse our complete collection online with free shipping on orders over ₹999.
          </p>
          <div className="mt-6 flex justify-center gap-4">
            <Button asChild className="bg-black hover:bg-gray-800">
              <Link href="/products">
                Shop Now
              </Link>
            </Button>
            <Button variant="outline" asChild>
              <Link href="/contact">
                Contact Us
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  )
}
