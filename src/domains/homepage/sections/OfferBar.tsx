"use client"

import { useState } from "react"
import { Flame, Zap, Target, Sparkles, Rocket, BadgeCheck } from "lucide-react"

export default function OfferBar() {
  const [isVisible, setIsVisible] = useState(true)

  const offers = [
    { icon: Flame, text: "FREE SHIPPING ON ORDERS ABOVE ₹999" },
    { icon: Zap, text: "FLAT 10% OFF ON FIRST PURCHASE - USE CODE: APIO10" },
    { icon: Target, text: "3 SHIRTS COMBO @ ₹999 - LIMITED STOCK" },
    { icon: Sparkles, text: "MADE IN INDIA FOR THE WORLD" },
    { icon: Rocket, text: "ORDERS SHIP WITHIN 24 HOURS" },
    { icon: BadgeCheck, text: "EASY 7-DAY RETURNS & EXCHANGE" },
  ]

  // Duplicate offers for seamless loop
  const duplicatedOffers = [...offers, ...offers]

  if (!isVisible) return null

  return (
    <>
      <div className="fixed top-0 z-50 w-full overflow-hidden bg-black py-1.5 text-white shadow-md">
        <div className="relative flex items-center">
          {/* Marquee Container */}
          <div className="flex animate-marquee items-center gap-8 whitespace-nowrap">
            {duplicatedOffers.map((offer, idx) => {
              const Icon = offer.icon
              return (
                <span
                  key={idx}
                  className="flex items-center gap-2 font-body text-xs font-medium tracking-wide md:text-sm"
                >
                  <Icon className="h-3 w-3 md:h-4 md:w-4" />
                  {offer.text}
                </span>
              )
            })}
          </div>
        </div>
      </div>

      {/* Spacer to prevent content jump */}
      <div className="h-7" />

      <style jsx>{`
        @keyframes marquee {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-50%);
          }
        }

        .animate-marquee {
          animation: marquee 40s linear infinite;
        }

        .animate-marquee:hover {
          animation-play-state: paused;
        }
      `}</style>
    </>
  )
}
