'use client'

import { motion } from 'framer-motion'
import { RotateCcw, CheckCircle, XCircle, AlertCircle } from 'lucide-react'

export default function ReturnsPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4 max-w-4xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl md:text-5xl font-heading font-bold mb-4">Returns & Exchange</h1>
          <p className="text-gray-600 text-lg">Easy returns within 7 days of delivery</p>
        </motion.div>

        <div className="space-y-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white rounded-xl p-8 shadow-sm border border-gray-200"
          >
            <div className="flex items-start gap-4 mb-4">
              <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <RotateCcw className="w-6 h-6 text-red-600" />
              </div>
              <div>
                <h2 className="text-2xl font-bold mb-2">Return Policy</h2>
                <p className="text-gray-600">We want you to be completely satisfied with your purchase</p>
              </div>
            </div>
            <div className="space-y-3 text-gray-700">
              <p>
                You can return or exchange any product within <strong>7 days of delivery</strong> if 
                you're not completely satisfied. We offer hassle-free returns with free pickup.
              </p>
              <p>
                To be eligible for a return, your item must be unused, unwashed, and in the same 
                condition that you received it. It must also be in the original packaging with all tags attached.
              </p>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white rounded-xl p-8 shadow-sm border border-gray-200"
          >
            <div className="flex items-start gap-4 mb-4">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <CheckCircle className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <h2 className="text-2xl font-bold mb-2">Eligible for Return</h2>
              </div>
            </div>
            <ul className="space-y-2 text-gray-700">
              <li>✓ Product is unused and unwashed</li>
              <li>✓ Original tags and packaging intact</li>
              <li>✓ Returned within 7 days of delivery</li>
              <li>✓ No signs of wear or damage</li>
              <li>✓ Invoice included with the return</li>
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
                <XCircle className="w-6 h-6 text-red-600" />
              </div>
              <div>
                <h2 className="text-2xl font-bold mb-2">Not Eligible for Return</h2>
              </div>
            </div>
            <ul className="space-y-2 text-gray-700">
              <li>✗ Products marked as "Final Sale"</li>
              <li>✗ Innerwear and socks (hygiene reasons)</li>
              <li>✗ Products with missing tags or packaging</li>
              <li>✗ Washed, worn, or damaged items</li>
              <li>✗ Returns requested after 7 days</li>
            </ul>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-white rounded-xl p-8 shadow-sm border border-gray-200"
          >
            <div className="flex items-start gap-4 mb-4">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <AlertCircle className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <h2 className="text-2xl font-bold mb-2">How to Return</h2>
              </div>
            </div>
            <ol className="space-y-3 text-gray-700">
              <li className="flex gap-3">
                <span className="font-bold text-red-600 flex-shrink-0">1.</span>
                <span>Log in to your account and go to "My Orders"</span>
              </li>
              <li className="flex gap-3">
                <span className="font-bold text-red-600 flex-shrink-0">2.</span>
                <span>Select the order and click "Return/Exchange"</span>
              </li>
              <li className="flex gap-3">
                <span className="font-bold text-red-600 flex-shrink-0">3.</span>
                <span>Choose the reason for return and submit</span>
              </li>
              <li className="flex gap-3">
                <span className="font-bold text-red-600 flex-shrink-0">4.</span>
                <span>Our courier partner will pick up the product from your address</span>
              </li>
              <li className="flex gap-3">
                <span className="font-bold text-red-600 flex-shrink-0">5.</span>
                <span>Refund will be processed within 5-7 business days after quality check</span>
              </li>
            </ol>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="bg-white rounded-xl p-8 shadow-sm border border-gray-200"
          >
            <h2 className="text-2xl font-bold mb-4">Exchange Policy</h2>
            <p className="text-gray-700 mb-4">
              Want a different size or color? We offer free exchanges! Simply select "Exchange" 
              when initiating your return, and we'll send you the replacement item once we receive 
              the original product.
            </p>
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <p className="text-blue-800 text-sm">
                <strong>Note:</strong> Exchanges are subject to product availability. If the 
                requested item is out of stock, we'll process a refund instead.
              </p>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="bg-gradient-to-r from-red-600 to-red-700 rounded-xl p-8 text-white text-center"
          >
            <h3 className="text-2xl font-bold mb-2">Questions About Returns?</h3>
            <p className="mb-4">Our customer support team is here to help</p>
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
