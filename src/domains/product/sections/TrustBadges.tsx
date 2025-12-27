'use client'

import { Star, Tag, Shield } from 'lucide-react'

export default function TrustBadges() {
  const badges = [
    {
      icon: <Star className="w-5 h-5" />,
      title: 'Trending Styles',
      subtitle: 'from Top Brands',
      bgColor: 'bg-yellow-400',
    },
    {
      icon: <Tag className="w-5 h-5" />,
      title: 'Best Prices',
      subtitle: 'on Top Products',
      bgColor: 'bg-blue-400',
    },
    {
      icon: <Shield className="w-5 h-5" />,
      title: 'Easy Returns',
      subtitle: 'on every order',
      bgColor: 'bg-yellow-400',
    },
  ]

  return (
    <section className="py-6 md:py-8 bg-gray-50">
      <div className="container mx-auto px-2">
        <div className="bg-white rounded-xl shadow-sm p-4 md:p-6">
          <div className="grid grid-cols-3 gap-3 md:gap-6">
            {badges.map((badge, index) => (
              <div key={index} className="flex flex-col md:flex-row items-center gap-2 md:gap-4">
                <div className={`${badge.bgColor} rounded-full p-2 md:p-4 flex-shrink-0 flex items-center justify-center`}>
                  <div className="w-5 h-5 md:w-8 md:h-8 flex items-center justify-center">{badge.icon}</div>
                </div>
                <div className="text-center md:text-left">
                  <p className="font-bold text-gray-900 !text-[18px] md:!text-[22px] leading-tight uppercase tracking-wide">
                    {badge.title}
                  </p>
                  <p className="!text-[7px] md:!text-[9px] text-gray-600">{badge.subtitle}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
