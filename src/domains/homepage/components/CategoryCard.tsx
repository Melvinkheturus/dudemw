"use client"

import Image from "next/image"
import Link from "next/link"
import { useState } from "react"

interface Category {
  id: string
  title: string
  image: string
  href: string
  description: string
}

interface CategoryCardProps {
  category: Category
}

export default function CategoryCard({ category }: CategoryCardProps) {
  const [imageError, setImageError] = useState(false)

  return (
    <Link
      href={category.href}
      className="group relative block overflow-hidden bg-white shadow-card transition-shadow hover:shadow-card-hover"
    >
      {/* Image Container */}
      <div className="relative aspect-[4/5] overflow-hidden bg-gray-100">
        {!imageError ? (
          <Image
            src={category.image}
            alt={category.title}
            fill
            className="object-cover transition-transform duration-700 group-hover:scale-110"
            sizes="(max-width: 768px) 100vw, 33vw"
            onError={() => setImageError(true)}
          />
        ) : (
          <div className="flex h-full items-center justify-center bg-gray-200 text-gray-400">
            No Image
          </div>
        )}
        
        {/* Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
        
        {/* Text Content */}
        <div className="absolute inset-x-0 bottom-0 p-6 text-white">
          <h3 className="font-heading text-3xl tracking-wider md:text-4xl">
            {category.title}
          </h3>
          <p className="mt-2 font-body text-sm text-white/90 md:text-base">
            {category.description}
          </p>
          
          {/* CTA */}
          <div className="mt-4 inline-flex items-center gap-2 border-b-2 border-white pb-1 font-heading text-sm tracking-wider transition-colors group-hover:border-brand-red group-hover:text-brand-red">
            SHOP NOW
            <svg
              className="h-4 w-4 transition-transform group-hover:translate-x-1"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5l7 7-7 7"
              />
            </svg>
          </div>
        </div>
      </div>
    </Link>
  )
}
