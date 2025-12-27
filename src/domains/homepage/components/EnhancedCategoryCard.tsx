"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import Image from "next/image"
import Link from "next/link"
import { Play, ArrowRight } from "lucide-react"
import { Category } from "@/domains/product/types"

interface EnhancedCategoryCardProps {
  category: Category
  index: number
}

export function EnhancedCategoryCard({ category, index }: EnhancedCategoryCardProps) {
  const [isHovered, setIsHovered] = useState(false)
  const [showVideo, setShowVideo] = useState(false)

  const hasVideo = !!category.homepage_video_url
  const thumbnailUrl = category.homepage_thumbnail_url || category.image_url || '/placeholder-category.jpg'

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      className="group relative overflow-hidden rounded-2xl bg-white shadow-lg hover:shadow-xl transition-all duration-300"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => {
        setIsHovered(false)
        setShowVideo(false)
      }}
    >
      <Link href={`/categories/${category.slug}`}>
        <div className="relative aspect-[4/3] overflow-hidden">
          {/* Thumbnail Image */}
          <Image
            src={thumbnailUrl}
            alt={category.name}
            fill
            className={`object-cover transition-all duration-500 ${showVideo ? 'opacity-0' : 'opacity-100 group-hover:scale-110'
              }`}
          />

          {/* Video (if available) */}
          {hasVideo && showVideo && (
            <video
              src={category.homepage_video_url!}
              autoPlay
              muted
              loop
              className="absolute inset-0 w-full h-full object-cover"
            />
          )}

          {/* Video Play Button */}
          {hasVideo && !showVideo && (
            <button
              onClick={(e) => {
                e.preventDefault()
                setShowVideo(true)
              }}
              className="absolute top-4 right-4 w-10 h-10 bg-black/50 backdrop-blur-sm rounded-full flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300 hover:bg-black/70"
            >
              <Play className="w-4 h-4 ml-0.5" />
            </button>
          )}

          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

          {/* Content */}
          <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
            <h3 className="text-xl font-bold mb-2 group-hover:text-red-400 transition-colors">
              {category.name}
            </h3>
            {category.description && (
              <p className="text-sm text-gray-200 mb-4 line-clamp-2">
                {category.description}
              </p>
            )}

            {/* CTA Button */}
            <div className="flex items-center space-x-2 text-sm font-medium">
              <span className={`transition-all duration-300 ${isHovered ? 'text-red-400' : 'text-white'
                }`}>
                {isHovered ? 'SHOP NOW' : 'EXPLORE'}
              </span>
              <ArrowRight className={`w-4 h-4 transition-all duration-300 ${isHovered ? 'text-red-400 translate-x-1' : 'text-white'
                }`} />
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  )
}