"use client"

import Link from "next/link"
import Image from "next/image"
import { useEffect, useState } from "react"
import { Category } from "@/domains/product"
import { createClient } from '@/lib/supabase/client'

export default function CategoryLite() {
  const [categories, setCategories] = useState<Category[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    async function fetchCategories() {
      try {
        const supabase = createClient()
        const { data } = await supabase
          .from('categories')
          .select('*')
          .order('name')
        setCategories(data || [])
      } catch (error) {
        console.error('Failed to fetch categories:', error)
      } finally {
        setIsLoading(false)
      }
    }
    fetchCategories()
  }, [])

  if (isLoading) {
    return (
      <section className="border-b border-gray-200 bg-white py-8">
        <div className="container mx-auto px-4 text-center text-gray-400">
          Loading categories...
        </div>
      </section>
    )
  }

  if (categories.length === 0) {
    return null
  }
  return (
    <section className="border-b border-gray-200 bg-white py-8">
      <div className="container mx-auto">
        {/* Mobile: Horizontal Scroll */}
        <div className="flex gap-6 overflow-x-auto px-4 pb-2 scrollbar-hide md:hidden">
          {categories.map((category) => {
            const categoryImage = category.image || '/images/placeholder-category.jpg'
            const categoryHref = `/collections/${category.slug}`

            return (
              <Link
                key={category.id}
                href={categoryHref}
                className="group flex-shrink-0 text-center"
              >
                <div className="relative h-20 w-20 overflow-hidden rounded-2xl bg-gray-100 transition-all group-hover:shadow-lg">
                  <Image
                    src={categoryImage}
                    alt={category.name}
                    fill
                    className="object-cover transition-transform group-hover:scale-105"
                    sizes="80px"
                  />
                </div>
                <p className="mt-3 w-20 truncate font-body text-sm font-medium transition-colors group-hover:text-red-600">
                  {category.name}
                </p>
              </Link>
            )
          })}
        </div>

        {/* Desktop: Grid */}
        <div className="hidden grid-cols-6 gap-6 px-4 md:grid">
          {categories.map((category) => {
            const categoryImage = category.image || '/images/placeholder-category.jpg'
            const categoryHref = `/collections/${category.slug}`

            return (
              <Link
                key={category.id}
                href={categoryHref}
                className="group text-center"
              >
                <div className="relative mx-auto h-24 w-24 overflow-hidden rounded-2xl bg-gray-100 transition-all group-hover:shadow-lg">
                  <Image
                    src={categoryImage}
                    alt={category.name}
                    fill
                    className="object-cover transition-transform group-hover:scale-105"
                    sizes="96px"
                  />
                </div>
                <p className="mt-3 font-body text-sm font-medium transition-colors group-hover:text-red-600">
                  {category.name}
                </p>
              </Link>
            )
          })}
        </div>
      </div>
    </section>
  )
}
