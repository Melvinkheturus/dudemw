"use client"

import Link from "next/link"
import Image from "next/image"
import { MapPin, Mail, Phone } from "lucide-react"
import { useEffect, useState } from "react"
import { Category } from "@/domains/product"
import { createClient } from '@/lib/supabase/client'

export default function Footer() {
  const [categories, setCategories] = useState<Category[]>([])

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const supabase = createClient()
        const { data } = await supabase
          .from('categories')
          .select('*')
          .order('name')
        setCategories((data || []).slice(0, 5)) // Limit to 5 categories for footer
      } catch (error) {
        console.error('Failed to fetch categories:', error)
        setCategories([])
      }
    }
    
    fetchCategories()
  }, [])
  return (
    <footer className="hidden border-t-2 border-black bg-white lg:block">
      <div className="mx-auto max-w-[1600px] px-6 py-12">
        {/* Main Footer Content */}
        <div className="mb-8 grid grid-cols-4 gap-12">
          {/* Store Location & Contact */}
          <div>
            <h4 className="mb-4 font-heading text-lg tracking-wider">
              VISIT US
            </h4>
            <div className="space-y-3 font-body text-sm">
              <div className="flex items-start gap-2">
                <MapPin className="h-5 w-5 flex-shrink-0 text-black" />
                <div>
                  <p className="font-medium text-black">Store Location</p>
                  <p className="text-gray-700">
                    123 Fashion Street<br />
                    Mumbai, Maharashtra<br />
                    India - 400001
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="h-5 w-5 flex-shrink-0 text-black" />
                <a href="mailto:hello@dudemenswear.com" className="text-gray-700 hover:text-red-600">
                  hello@dudemenswear.com
                </a>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="h-5 w-5 flex-shrink-0 text-black" />
                <a href="tel:+919876543210" className="text-gray-700 hover:text-red-600">
                  +91 98765 43210
                </a>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="mb-4 font-heading text-lg tracking-wider">
              TAKE ME TO...
            </h4>
            <ul className="space-y-2 font-body text-sm">
              <li>
                <Link href="/collections/all" className="hover:text-red-600">
                  Shop All
                </Link>
              </li>
              {categories.map((category) => (
                <li key={category.id}>
                  <Link href={`/collections/${category.slug}`} className="hover:text-red-600">
                    {category.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Customer Care */}
          <div>
            <h4 className="mb-4 font-heading text-lg tracking-wider">
              MAY I HELP YOU?
            </h4>
            <ul className="space-y-2 font-body text-sm">
              <li>
                <Link href="/profile?section=track-order" className="hover:text-red-600">
                  Track Order
                </Link>
              </li>
              <li>
                <Link href="/returns" className="hover:text-red-600">
                  Returns
                </Link>
              </li>
              <li>
                <Link href="/faq" className="hover:text-red-600">
                  FAQ
                </Link>
              </li>
              <li>
                <Link href="/shipping" className="hover:text-red-600">
                  Shipping Policy
                </Link>
              </li>
              <li>
                <Link href="/refund" className="hover:text-red-600">
                  Refund Policy
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-red-600">
                  Contact Us
                </Link>
              </li>
            </ul>
          </div>

          {/* Dude World */}
          <div>
            <h4 className="mb-4 font-heading text-lg tracking-wider">
              DUDE WORLD
            </h4>
            <ul className="space-y-2 font-body text-sm">
              <li>
                <Link href="/about" className="hover:text-red-600">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/size-guide" className="hover:text-red-600">
                  Size Guide
                </Link>
              </li>
              <li>
                <Link href="/stores" className="hover:text-red-600">
                  Store Locator
                </Link>
              </li>
              <li>
                <a
                  href="https://instagram.com/dudemenswear"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-red-600"
                >
                  Instagram
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t-2 border-gray-200 pt-6">
          {/* Logo Center */}
          <div className="mb-4 flex justify-center">
            <Image
              src="/logo/typography-logo.png"
              alt="Dude Mens Wear"
              width={240}
              height={72}
              className="h-auto w-60"
            />
          </div>
          
          {/* Copyright and Payment */}
          <div className="flex items-center justify-between">
            <p className="flex items-center gap-1 font-body text-sm text-gray-600">
              © 2025 Dude Mens Wear. All rights reserved. | Crafted by{" "}
              <a
                href="https://mergex.in"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 font-medium text-red-600 transition-colors hover:text-red-700"
              >
                Mergex <span className="text-base">⚡</span>
              </a>
            </p>
            <div className="flex items-center gap-4">
              <span className="font-body text-xs text-gray-500">We Accept:</span>
              <div className="flex gap-2">
                <div className="rounded border border-gray-300 px-3 py-1 font-body text-xs font-medium">
                  Razorpay
                </div>
                <div className="rounded border border-gray-300 px-3 py-1 font-body text-xs font-medium">
                  UPI
                </div>
                <div className="rounded border border-gray-300 px-3 py-1 font-body text-xs font-medium">
                  Cards
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
