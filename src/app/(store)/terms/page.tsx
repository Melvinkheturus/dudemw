'use client'

import { motion } from 'framer-motion'

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4 max-w-4xl">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-heading font-bold mb-4">Terms & Conditions</h1>
          <p className="text-gray-600">Last updated: December 2024</p>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="bg-white rounded-xl p-8 md:p-12 shadow-sm border border-gray-200 space-y-8">
          <section>
            <h2 className="text-2xl font-bold mb-4">1. Acceptance of Terms</h2>
            <p className="text-gray-700 leading-relaxed">
              By accessing and using Dude Mens Wear website, you accept and agree to be bound by the terms and provision of this agreement. If you do not agree to these terms, please do not use our services.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">2. Use of Website</h2>
            <p className="text-gray-700 leading-relaxed mb-3">You agree to use our website only for lawful purposes and in a way that does not infringe the rights of others. You must not:</p>
            <ul className="list-disc list-inside space-y-2 text-gray-700">
              <li>Use the website in any way that causes damage to the website</li>
              <li>Use the website in any way that is unlawful or fraudulent</li>
              <li>Attempt to gain unauthorized access to our systems</li>
              <li>Transmit any harmful or malicious code</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">3. Product Information</h2>
            <p className="text-gray-700 leading-relaxed">
              We strive to provide accurate product descriptions and images. However, we do not warrant that product descriptions, colors, or other content are accurate, complete, or error-free. If a product is not as described, your sole remedy is to return it in unused condition.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">4. Pricing and Payment</h2>
            <p className="text-gray-700 leading-relaxed mb-3">
              All prices are in Indian Rupees (INR) and include applicable taxes. We reserve the right to change prices at any time. Payment must be received before order processing begins.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">5. Order Acceptance</h2>
            <p className="text-gray-700 leading-relaxed">
              We reserve the right to refuse or cancel any order for any reason, including product availability, errors in pricing or product information, or suspected fraud.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">6. Intellectual Property</h2>
            <p className="text-gray-700 leading-relaxed">
              All content on this website, including text, graphics, logos, images, and software, is the property of Dude Mens Wear and protected by copyright laws. You may not reproduce, distribute, or create derivative works without our written permission.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">7. Limitation of Liability</h2>
            <p className="text-gray-700 leading-relaxed">
              Dude Mens Wear shall not be liable for any indirect, incidental, special, or consequential damages arising out of or in connection with your use of our website or products.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">8. Governing Law</h2>
            <p className="text-gray-700 leading-relaxed">
              These terms shall be governed by and construed in accordance with the laws of India. Any disputes shall be subject to the exclusive jurisdiction of the courts in Mumbai, Maharashtra.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">9. Changes to Terms</h2>
            <p className="text-gray-700 leading-relaxed">
              We reserve the right to modify these terms at any time. Changes will be effective immediately upon posting to the website. Your continued use of the website constitutes acceptance of the modified terms.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">10. Contact Information</h2>
            <p className="text-gray-700 leading-relaxed">
              If you have any questions about these Terms & Conditions, please contact us at hello@dudemenswear.com
            </p>
          </section>
        </motion.div>
      </div>
    </div>
  )
}
