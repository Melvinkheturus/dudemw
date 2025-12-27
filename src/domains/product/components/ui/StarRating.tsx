import React from 'react'

interface StarRatingProps {
    rating: number // 0-5, supports decimals (e.g., 4.3)
    reviewCount?: number // Optional review count to display
    size?: 'sm' | 'md' | 'lg'
    showCount?: boolean // Show "(24)" next to stars
    className?: string
}

export default function StarRating({
    rating,
    reviewCount,
    size = 'sm',
    showCount = true,
    className = '',
}: StarRatingProps) {
    // Don't render anything if rating is 0 or null
    if (!rating || rating === 0) {
        return null
    }

    // Clamp rating between 0 and 5
    const clampedRating = Math.max(0, Math.min(5, rating))

    // Size configurations
    const sizeClasses = {
        sm: 'h-3 w-3',
        md: 'h-4 w-4',
        lg: 'h-5 w-5',
    }

    const textSizeClasses = {
        sm: 'text-xs',
        md: 'text-sm',
        lg: 'text-base',
    }

    const starSize = sizeClasses[size]
    const textSize = textSizeClasses[size]

    // Generate 5 stars with appropriate fill
    const stars = Array.from({ length: 5 }, (_, index) => {
        const starNumber = index + 1
        const fillPercentage = Math.max(0, Math.min(100, (clampedRating - index) * 100))

        return (
            <div key={index} className="relative inline-block">
                {/* Background star (empty) */}
                <svg
                    className={`${starSize} text-gray-300`}
                    viewBox="0 0 20 20"
                    fill="currentColor"
                    aria-hidden="true"
                >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>

                {/* Foreground star (filled) */}
                {fillPercentage > 0 && (
                    <div
                        className="absolute inset-0 overflow-hidden"
                        style={{ width: `${fillPercentage}%` }}
                    >
                        <svg
                            className={`${starSize} text-yellow-400`}
                            viewBox="0 0 20 20"
                            fill="currentColor"
                            aria-hidden="true"
                        >
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                    </div>
                )}
            </div>
        )
    })

    return (
        <div className={`flex items-center gap-1 ${className}`} aria-label={`Rated ${clampedRating} out of 5 stars`}>
            <div className="flex items-center gap-0.5">
                {stars}
            </div>
            {showCount && reviewCount !== undefined && reviewCount > 0 && (
                <span className={`ml-0.5 ${textSize} text-gray-500`}>
                    ({reviewCount})
                </span>
            )}
        </div>
    )
}
