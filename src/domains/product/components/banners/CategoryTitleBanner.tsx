"use client"

import { useEffect, useState } from "react"
import { Category } from "@/domains/product"
import { createClient } from '@/lib/supabase/client'

interface CategoryTitleBannerProps {
  handle?: string
}

export default function CategoryTitleBanner({ handle }: CategoryTitleBannerProps) {
  const [category, setCategory] = useState<Category | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchCategory() {
      if (!handle) {
        setLoading(false)
        return
      }
      try {
        const supabase = createClient()
        const { data } = await supabase
          .from('categories')
          .select('*')
          .eq('slug', handle)
          .single()
        setCategory(data || null)
      } catch (error) {
        console.error('Failed to fetch category:', error)
      } finally {
        setLoading(false)
      }
    }
    fetchCategory()
  }, [handle])

  if (loading) {
    return (
      <section className="w-full bg-white px-4 pt-2 pb-4 md:px-8 md:pt-3 md:pb-6">
        <div className="relative mx-auto max-w-[1600px] overflow-hidden rounded-none shadow-2xl md:rounded-3xl">
          <div className="relative h-[400px] md:h-[500px] bg-gray-200 flex items-center justify-center">
            <div className="text-gray-400">Loading...</div>
          </div>
        </div>
      </section>
    )
  }

  if (!category) {
    return null
  }

  const title = category.name.toUpperCase()
  const bannerImage = category.image || '/images/placeholder-banner.jpg'
  const description = category.description || 'Elevate Your Everyday Style'

  return (
    <section className="w-full bg-white px-4 pt-2 pb-4 md:px-8 md:pt-3 md:pb-6">
      {/* Card Container - Rounded with Shadow */}
      <div className="relative mx-auto max-w-[1600px] overflow-hidden rounded-none shadow-2xl md:rounded-3xl">
        <div className="relative h-[400px] md:h-[500px]">
          {/* Background Image */}
          <div
            className="absolute inset-0 bg-cover bg-center bg-no-repeat"
            style={{ backgroundImage: `url(${bannerImage})` }}
          >
            {/* Dark overlay for better text visibility */}
            <div className="absolute inset-0 bg-black/40" />
          </div>

          {/* Content - Centered at Bottom */}
          <div className="absolute inset-x-0 bottom-0 pb-12 md:pb-16">
            <div className="container mx-auto px-4 text-center">
              {/* Category Title - Big, Bold, Prominent White */}
              <h1
                className="font-heading font-extrabold tracking-wider mb-4"
                style={{
                  fontSize: 'clamp(4rem, 12vw, 10rem)',
                  color: '#FFFFFF',
                  textShadow: '0 10px 40px rgba(0, 0, 0, 0.8), 0 4px 8px rgba(0, 0, 0, 0.6)',
                  lineHeight: '1'
                }}
              >
                {title}
              </h1>

              {/* Subtitle - White */}
              <p
                className="font-body"
                style={{
                  fontSize: 'clamp(1.125rem, 2.5vw, 2rem)',
                  color: '#FFFFFF',
                  textShadow: '0 4px 12px rgba(0, 0, 0, 0.5)'
                }}
              >
                {description}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
