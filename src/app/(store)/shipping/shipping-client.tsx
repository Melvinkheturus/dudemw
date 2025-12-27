'use client'

import { motion } from 'framer-motion'
import { Truck, Package, MapPin, Clock } from 'lucide-react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'

export default function ShippingClient({ cmsContent }: { cmsContent?: string }) {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4 max-w-4xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl md:text-5xl font-heading font-bold mb-4">Shipping Policy</h1>
          <p className="text-gray-600 text-lg">Fast, reliable delivery across India</p>
        </motion.div>

        <div className="space-y-6">
          {cmsContent ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-white rounded-xl p-8 shadow-sm border border-gray-200"
            >
              <div className="prose prose-red max-w-none">
                <ReactMarkdown remarkPlugins={[remarkGfm]}>{cmsContent}</ReactMarkdown>
              </div>
            </motion.div>
          ) : (
            <>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="bg-white rounded-xl p-8 shadow-sm border border-gray-200"
              >
                {/* ... existing content ... */}
                <div className="flex items-start gap-4 mb-4">
                  <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Truck className="w-6 h-6 text-red-600" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold mb-2">Shipping Methods</h2>
                    <p className="text-gray-600">We offer multiple shipping options to suit your needs</p>
                  </div>
                </div>
                <div className="space-y-4 text-gray-700">
                  <div className="border-l-4 border-red-600 pl-4">
                    <h3 className="font-bold mb-1">Standard Delivery (5-7 Business Days)</h3>
                    <p>Free shipping on orders above ₹999. ₹99 for orders below ₹999.</p>
                  </div>
                  <div className="border-l-4 border-red-600 pl-4">
                    <h3 className="font-bold mb-1">Express Delivery (2-3 Business Days)</h3>
                    <p>₹199 flat rate. Available in major cities.</p>
                  </div>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="bg-white rounded-xl p-8 shadow-sm border border-gray-200"
              >
                <div className="flex items-start gap-4 mb-4">
                  <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Clock className="w-6 h-6 text-red-600" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold mb-2">Processing Time</h2>
                  </div>
                </div>
                <ul className="space-y-2 text-gray-700">
                  <li>• Orders are processed within 1-2 business days</li>
                  <li>• Orders placed on weekends/holidays are processed the next business day</li>
                  <li>• You'll receive a tracking number once your order ships</li>
                  <li>• Track your order anytime from your account dashboard</li>
                </ul>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="bg-white rounded-xl p-8 shadow-sm border border-gray-200"
              >
                <div className="flex items-start gap-4 mb-4">
                  <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <MapPin className="w-6 h-6 text-red-600" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold mb-2">Delivery Locations</h2>
                  </div>
                </div>
                <p className="text-gray-700 mb-4">
                  We currently ship to all serviceable pin codes across India. Enter your pin code at
                  checkout to check if we deliver to your area.
                </p>
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                  <p className="text-red-800 text-sm">
                    <strong>Note:</strong> Some remote areas may experience longer delivery times.
                    We'll notify you if your location requires additional time.
                  </p>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="bg-white rounded-xl p-8 shadow-sm border border-gray-200"
              >
                <div className="flex items-start gap-4 mb-4">
                  <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Package className="w-6 h-6 text-red-600" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold mb-2">Order Tracking</h2>
                  </div>
                </div>
                <ul className="space-y-2 text-gray-700">
                  <li>• Track your order from your account dashboard</li>
                  <li>• Receive SMS and email updates at every stage</li>
                  <li>• Contact support if you need help with tracking</li>
                  <li>• Delivery partners: Delhivery, Blue Dart, DTDC</li>
                </ul>
              </motion.div>
            </>
          )}

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="bg-gradient-to-r from-red-600 to-red-700 rounded-xl p-8 text-white text-center"
          >
            <h3 className="text-2xl font-bold mb-2">Need Help?</h3>
            <p className="mb-4">Contact our support team for shipping assistance</p>
            <a
              href="/contact"
              className="inline-block bg-white text-red-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
            >
              Contact Support
            </a>
          </motion.div>
        </div>
      </div>
    </div>
  )
}
