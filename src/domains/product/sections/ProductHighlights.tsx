'use client'

import { motion } from 'framer-motion'
import { Zap, Droplet, Wind, Shield } from 'lucide-react'

interface Highlight {
  icon: React.ReactNode
  text: string
}

export default function ProductHighlights() {
  const highlights: Highlight[] = [
    { icon: <Zap className="w-5 h-5" />, text: '180 GSM Premium Cotton' },
    { icon: <Droplet className="w-5 h-5" />, text: 'Bio-washed' },
    { icon: <Wind className="w-5 h-5" />, text: 'Breathable Fabric' },
    { icon: <Shield className="w-5 h-5" />, text: 'Anti-shrink' },
  ]

  return (
    <section className="pt-0 pb-8 md:py-12 px-4 md:px-8 bg-gradient-to-b from-white to-gray-50">
      <div className="container mx-auto max-w-7xl">
        <h2 className="text-2xl md:text-3xl font-heading tracking-wider mb-6 md:mb-8 text-center">
          PRODUCT HIGHLIGHTS
        </h2>
        <div className="flex justify-center gap-2 md:gap-3 flex-wrap">
          {highlights.map((highlight, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="flex items-center gap-2 md:gap-3 bg-white px-3 py-2 md:px-6 md:py-4 rounded-full border-2 border-gray-200 whitespace-nowrap shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="text-red-600">
                <div className="w-4 h-4 md:w-5 md:h-5">{highlight.icon}</div>
              </div>
              <span className="font-body font-medium text-xs md:text-base">{highlight.text}</span>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
