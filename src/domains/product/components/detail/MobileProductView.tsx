'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import { Heart, ChevronLeft, Upload } from 'lucide-react'
import { motion } from 'framer-motion'
import ProductOptions from './ProductOptions'
import AddToCartButton from './AddToCartButton'
import FloatingBottomBar from './FloatingBottomBar'

import { Product } from '@/domains/product'

interface MobileProductViewProps {
  product: Product
}

// Helper function to convert string colors to ProductColor objects
const getColorHex = (colorName: string): string => {
  const colorMap: { [key: string]: string } = {
    'White': '#FFFFFF',
    'Black': '#000000',
    'Gray': '#808080',
    'Grey': '#808080',
    'Navy': '#000080',
    'Blue': '#0000FF',
    'Light Blue': '#ADD8E6',
    'Red': '#FF0000',
    'Maroon': '#800000',
    'Green': '#008000',
    'Pink': '#FFC0CB',
    'Khaki': '#F0E68C',
    'Brown': '#A52A2A',
    'Olive': '#808000',
    'Charcoal': '#36454F'
  }
  return colorMap[colorName] || '#000000'
}

const convertToProductColors = (colors: string[], productImages: string[]) => {
  return colors.map(color => ({
    name: color,
    hex: getColorHex(color),
    image: productImages[0] // Use first product image as fallback
  }))
}

export default function MobileProductView({ product }: MobileProductViewProps) {
  const productColors = convertToProductColors(product.colors || [], product.images || [])
  const [selectedColor, setSelectedColor] = useState(productColors[0] || { name: 'Black', hex: '#000000', image: (product.images && product.images[0]) || '' })
  const [selectedSize, setSelectedSize] = useState('')
  const [selectedImage, setSelectedImage] = useState(0)
  const [isWishlisted, setIsWishlisted] = useState(false)
  const [showFloatingBar, setShowFloatingBar] = useState(false)
  const [currentImage, setCurrentImage] = useState((product.images && product.images[0]) || '')

  useEffect(() => {
    // Show floating bar when size is selected
    setShowFloatingBar(!!selectedSize)
  }, [selectedSize])

  // Update main image when color changes
  useEffect(() => {
    setCurrentImage((product.images && product.images[selectedImage]) || '')
  }, [selectedColor, selectedImage, product.images])

  const handleColorSelect = (color: { name: string; hex: string; image: string }) => {
    setSelectedColor(color)
  }

  const handleBuyNow = () => {
    // Add your buy now logic here
    // TODO: Implement buy now functionality
  }

  // Get variant ID based on selected options
  const getVariantId = () => {
    // TODO: Implement variant selection logic based on size/color
    return undefined
  }

  return (
    <div className="lg:hidden bg-white min-h-screen pb-24">
      {/* Image Card Only */}
      <motion.div 
        className="px-4 pt-6"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      >
        <div className="relative aspect-[3/4] overflow-hidden rounded-2xl shadow-lg">
          <Image
            src={currentImage || '/images/placeholder-product.jpg'}
            fill
            alt={product.title}
            className="object-cover"
            priority
          />
          
          {/* Back and Like Icons - Overlaid on Image */}
          <div className="absolute top-4 left-0 right-0 z-20 flex items-center justify-between px-4">
            <button 
              onClick={() => window.history.back()}
              className="w-10 h-10 bg-white/90 backdrop-blur-md rounded-full flex items-center justify-center hover:bg-white transition-all shadow-md"
            >
              <ChevronLeft className="w-6 h-6 text-gray-900" />
            </button>
            <button
              onClick={() => setIsWishlisted(!isWishlisted)}
              className={`w-10 h-10 backdrop-blur-md rounded-full flex items-center justify-center transition-all shadow-md ${
                isWishlisted 
                  ? 'bg-red-600 hover:bg-red-700' 
                  : 'bg-white/90 hover:bg-white'
              }`}
            >
              <Heart
                className={`w-5 h-5 ${
                  isWishlisted ? 'fill-white text-white' : 'text-gray-900'
                }`}
              />
            </button>
          </div>

          {/* Thumbnail Images - Bottom Overlay */}
          <div className="absolute bottom-4 left-4 right-4">
            <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
              {(product.images || []).slice(0, 4).map((img, idx) => (
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
      </motion.div>

      {/* Title and Description - Outside Card */}
      <motion.div 
        className="px-4 pt-4"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
      >
        <h1 className="text-2xl font-heading font-bold text-gray-900 mb-2">
          {product.title}
        </h1>
        {product.description && (
          <p className="text-sm text-gray-600 leading-relaxed mb-4">
            {product.description}
          </p>
        )}
      </motion.div>

      {/* Product Details - Cardless */}
      <motion.div 
        className="px-4"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
      >
        {/* Price */}
        <p className="text-3xl font-bold text-gray-900 mb-6">
          ₹{product.price.toLocaleString('en-IN')}
        </p>

        <ProductOptions
          sizes={product.sizes || []}
          colors={productColors}
          rating={4.5}
          reviews={128}
          selectedSize={selectedSize}
          selectedColor={selectedColor}
          onSizeSelect={setSelectedSize}
          onColorSelect={handleColorSelect}
          variant="mobile"
        />

        {/* Add to Cart and Share Buttons */}
        <div className="flex gap-3 mb-4">
          <AddToCartButton 
            productId={product.id}
            productTitle={product.title}
            productPrice={product.price}
            productImage={(product.images && product.images[0]) || ''}
            selectedSize={selectedSize}
            selectedColor={selectedColor}
            variant="mobile"
            className="flex-1"
            variantId={getVariantId()}
          />
          <button
            onClick={() => {
              if (navigator.share) {
                navigator.share({
                  title: product.title,
                  text: `Check out ${product.title}`,
                  url: window.location.href,
                })
              } else {
                navigator.clipboard.writeText(window.location.href)
                alert('Link copied to clipboard!')
              }
            }}
            className="w-14 h-14 bg-gray-100 hover:bg-gray-200 rounded-lg flex items-center justify-center transition-all"
            title="Share"
          >
            <Upload className="w-5 h-5 text-gray-700" />
          </button>
        </div>
      </motion.div>

      {/* Floating Bottom Bar */}
      <FloatingBottomBar
        isVisible={showFloatingBar}
        selectedColor={selectedColor}
        price={product.price}
        onBuyNow={handleBuyNow}
        isMobile={true}
      />
    </div>
  )
}
