"use client"

import { Shirt, Truck, RotateCcw, BadgeCheck } from "lucide-react"

const features = [
  {
    icon: Shirt,
    title: "PREMIUM COTTON",
    description: "100% breathable fabric"
  },
  {
    icon: Truck,
    title: "FAST SHIPPING",
    description: "2-4 days delivery"
  },
  {
    icon: RotateCcw,
    title: "EASY RETURNS",
    description: "7-day hassle-free"
  },
  {
    icon: BadgeCheck,
    title: "10K+ HAPPY DUDES",
    description: "Trusted by thousands"
  }
]

export default function WhyDudeSection() {
  return (
    <section className="bg-white py-16 md:py-24">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="mb-12 text-center">
          <h2 className="font-heading text-4xl tracking-wider text-black md:text-5xl">
            WHY <span className="text-brand-red">DUDE</span>?
          </h2>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-2 gap-8 md:grid-cols-4 md:gap-12">
          {features.map((feature, idx) => {
            const Icon = feature.icon
            return (
              <div key={idx} className="text-center">
                <div className="mb-3 flex justify-center">
                  <Icon className="h-10 w-10 text-black md:h-12 md:w-12" strokeWidth={1.5} />
                </div>
                <h3 className="mb-1.5 font-heading text-base tracking-wider text-black md:text-lg">
                  {feature.title}
                </h3>
                <p className="font-body text-xs text-gray-800 md:text-sm">
                  {feature.description}
                </p>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
