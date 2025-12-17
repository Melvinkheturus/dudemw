'use client'

import { useState } from 'react'
import Image from 'next/image'
import { Star, ThumbsUp } from 'lucide-react'
import { motion } from 'framer-motion'

interface Review {
  id: string
  name: string
  rating: number
  date: string
  comment: string
  verified: boolean
  helpful: number
  images?: string[]
}

interface ProductReviewsProps {
  reviews?: Review[]
  rating?: number
  totalReviews?: number
}

export default function ProductReviews({
  reviews: initialReviews = [],
  rating = 4.8,
  totalReviews = 0,
}: ProductReviewsProps) {
  const [reviews] = useState<Review[]>(initialReviews)
  const [showAll, setShowAll] = useState(false)
  
  // Show only first 3 reviews initially
  const displayedReviews = showAll ? reviews : reviews.slice(0, 3)

  // If no reviews, show empty state with form
  if (reviews.length === 0) {
    return (
      <section className="py-16 md:py-24 px-4 md:px-8 bg-white">
        <div className="container mx-auto max-w-7xl">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-heading tracking-wider mb-4">
              CUSTOMER REVIEWS
            </h2>
            <p className="text-gray-600 font-body mb-6">Be the first to review this product!</p>
          </div>

          {/* Write Review Form */}
          <div className="max-w-2xl mx-auto border-2 border-gray-200 rounded-2xl p-6 md:p-8">
            <h3 className="text-2xl md:text-3xl font-heading tracking-wider mb-6">WRITE A REVIEW</h3>
            <form onSubmit={(e) => {
              e.preventDefault()
              const formData = new FormData(e.currentTarget)
              console.log('Review submitted:', Object.fromEntries(formData))
              alert('Thank you for your review! It will be published after verification.')
              e.currentTarget.reset()
            }}>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-body font-medium mb-2">Your Name *</label>
                  <input
                    type="text"
                    name="name"
                    required
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-black focus:outline-none"
                    placeholder="Enter your name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-body font-medium mb-2">Rating *</label>
                  <div className="flex gap-2">
                    {[1, 2, 3, 4, 5].map((rating) => (
                      <label key={rating} className="cursor-pointer">
                        <input type="radio" name="rating" value={rating} required className="sr-only peer" />
                        <Star className="w-8 h-8 text-gray-300 peer-checked:fill-yellow-400 peer-checked:text-yellow-400 hover:text-yellow-400 transition-colors" />
                      </label>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-body font-medium mb-2">Your Review *</label>
                  <textarea
                    name="comment"
                    required
                    rows={4}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-black focus:outline-none resize-none"
                    placeholder="Share your experience with this product..."
                  />
                </div>
                <button
                  type="submit"
                  className="w-full md:w-auto px-8 py-3 bg-black text-white rounded-lg font-heading tracking-wider hover:bg-gray-800 transition-all"
                >
                  SUBMIT REVIEW
                </button>
              </div>
            </form>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section className="py-16 md:py-24 px-4 md:px-8 bg-white">
      <div className="container mx-auto max-w-7xl">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-12 gap-6">
          <div>
            <h2 className="text-4xl md:text-5xl font-heading tracking-wider mb-4">
              CUSTOMER REVIEWS
            </h2>
            <div className="flex items-center gap-3">
              <div className="flex">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className="w-4 h-4 md:w-5 md:h-5 fill-yellow-400 text-yellow-400"
                  />
                ))}
              </div>
              <span className="text-base md:text-lg font-heading">{rating} out of 5</span>
              <span className="text-sm md:text-base text-gray-600 font-body">({totalReviews.toLocaleString('en-IN')} reviews)</span>
            </div>
          </div>
          <button 
            onClick={() => {
              const reviewForm = document.getElementById('write-review-form')
              if (reviewForm) {
                reviewForm.scrollIntoView({ behavior: 'smooth', block: 'center' })
              }
            }}
            className="px-8 py-3 border-2 border-black rounded-lg font-heading tracking-wider hover:bg-black hover:text-white transition-all"
          >
            WRITE A REVIEW
          </button>
        </div>

        <div className="space-y-6">
          {displayedReviews.map((review, index) => (
            <motion.div
              key={review.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="border-2 border-gray-200 rounded-2xl p-6 hover:shadow-lg transition-shadow"
            >
              <div className="flex items-start justify-between mb-4">
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="font-body font-medium text-lg">{review.name}</h3>
                    {review.verified && (
                      <span className="text-[10px] md:text-xs bg-green-100 text-green-700 px-2 py-0.5 md:px-3 md:py-1 rounded-full font-body font-medium">
                        Verified Buyer
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="flex">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`w-4 h-4 ${
                            i < review.rating
                              ? 'fill-yellow-400 text-yellow-400'
                              : 'text-gray-300'
                          }`}
                        />
                      ))}
                    </div>
                    <span className="text-sm text-gray-600 font-body">{review.date}</span>
                  </div>
                </div>
              </div>

              <p className="text-gray-700 font-body mb-4">{review.comment}</p>

              {review.images && review.images.length > 0 && (
                <div className="flex gap-3 mb-4">
                  {review.images.map((img, idx) => (
                    <div
                      key={idx}
                      className="relative w-24 h-24 rounded-lg overflow-hidden"
                    >
                      <Image
                        src={img}
                        fill
                        alt={`Review ${idx + 1}`}
                        className="object-cover"
                      />
                    </div>
                  ))}
                </div>
              )}

              <button className="flex items-center gap-2 text-sm text-gray-600 hover:text-black transition-colors font-body">
                <ThumbsUp className="w-4 h-4" />
                <span>Helpful ({review.helpful})</span>
              </button>
            </motion.div>
          ))}
        </div>

        {/* Load More Button */}
        {reviews.length > 3 && (
          <div className="text-center mt-8">
            <button
              onClick={() => setShowAll(!showAll)}
              className="px-8 py-3 border-2 border-black rounded-lg font-heading tracking-wider hover:bg-black hover:text-white transition-all"
            >
              {showAll ? 'SHOW LESS' : `LOAD MORE REVIEWS (${reviews.length - 3})`}
            </button>
          </div>
        )}

        {/* Write Review Form */}
        <div id="write-review-form" className="mt-12 border-2 border-gray-200 rounded-2xl p-6 md:p-8">
          <h3 className="text-2xl md:text-3xl font-heading tracking-wider mb-6">WRITE A REVIEW</h3>
          <form onSubmit={(e) => {
            e.preventDefault()
            const formData = new FormData(e.currentTarget)
            console.log('Review submitted:', Object.fromEntries(formData))
            alert('Thank you for your review! It will be published after verification.')
            e.currentTarget.reset()
          }}>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-body font-medium mb-2">Your Name *</label>
                <input
                  type="text"
                  name="name"
                  required
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-black focus:outline-none"
                  placeholder="Enter your name"
                />
              </div>
              <div>
                <label className="block text-sm font-body font-medium mb-2">Rating *</label>
                <div className="flex gap-2">
                  {[1, 2, 3, 4, 5].map((rating) => (
                    <label key={rating} className="cursor-pointer">
                      <input type="radio" name="rating" value={rating} required className="sr-only peer" />
                      <Star className="w-8 h-8 text-gray-300 peer-checked:fill-yellow-400 peer-checked:text-yellow-400 hover:text-yellow-400 transition-colors" />
                    </label>
                  ))}
                </div>
              </div>
              <div>
                <label className="block text-sm font-body font-medium mb-2">Your Review *</label>
                <textarea
                  name="comment"
                  required
                  rows={4}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-black focus:outline-none resize-none"
                  placeholder="Share your experience with this product..."
                />
              </div>
              <button
                type="submit"
                className="w-full md:w-auto px-8 py-3 bg-black text-white rounded-lg font-heading tracking-wider hover:bg-gray-800 transition-all"
              >
                SUBMIT REVIEW
              </button>
            </div>
          </form>
        </div>
      </div>
    </section>
  )
}
