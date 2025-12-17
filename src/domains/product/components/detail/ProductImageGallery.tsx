'use client'

import { useState } from 'react'
import Image from 'next/image'
import { motion } from 'framer-motion'

interface ProductImageGalleryProps {
  images: string[]
  mainImage: string
  title: string
  className?: string
}

export default function ProductImageGallery({ 
  images, 
  mainImage, 
  title,
  className = '' 
}: ProductImageGalleryProps) {
  const [selectedImage, setSelectedImage] = useState(0)

  return (
    <div className={className}>
      <div className="relative aspect-[3/4] overflow-hidden rounded-2xl shadow-lg">
        <Image
          src={images[selectedImage] || mainImage || '/images/placeholder-product.jpg'}
          fill
          alt={title}
          className="object-cover"
          priority
        />
        
        {/* Thumbnail Images - Bottom Overlay */}
        <div className="absolute bottom-4 left-4 right-4">
          <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
            {images.slice(0, 4).map((img, idx) => (
              <button
                key={idx}
                onClick={() => setSelectedImage(idx)}
                className={`relative flex-shrink-0 w-12 h-12 rounded-lg overflow-hidden border-2 transition-all ${
                  selectedImage === idx
                    ? 'border-white scale-105'
                    : 'border-white/40'
                }`}
              >
                <Image
                  src={img}
                  fill
                  alt={`View ${idx + 1}`}
                  className="object-cover"
                />
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
