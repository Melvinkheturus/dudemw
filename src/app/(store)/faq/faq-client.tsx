'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronDown, Search } from 'lucide-react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'

export default function FAQClient({ cmsContent }: { cmsContent?: string }) {
  const [searchQuery, setSearchQuery] = useState('')
  const [openIndex, setOpenIndex] = useState<number | null>(0)

  const faqs = [
    {
      category: 'Orders & Shipping',
      questions: [
        {
          q: 'How long does shipping take?',
          a: 'Standard delivery takes 5-7 business days, while express delivery takes 2-3 business days. Orders are processed within 1-2 business days.'
        },
        {
          q: 'Do you offer free shipping?',
          a: 'Yes! We offer free standard shipping on all orders above ₹999. Orders below ₹999 have a shipping charge of ₹99.'
        },
        {
          q: 'Can I track my order?',
          a: 'Absolutely! Once your order ships, you\'ll receive a tracking number via email and SMS. You can also track your order from your account dashboard.'
        },
        {
          q: 'Can I change my delivery address?',
          a: 'You can change your delivery address before the order is shipped. Contact our support team immediately if you need to make changes.'
        }
      ]
    },
    {
      category: 'Returns & Refunds',
      questions: [
        {
          q: 'What is your return policy?',
          a: 'We offer easy returns within 7 days of delivery. Products must be unused, unwashed, and in original packaging with tags attached.'
        },
        {
          q: 'How do I initiate a return?',
          a: 'Log in to your account, go to "My Orders", select the order, and click "Return/Exchange". Our courier partner will pick up the product from your address.'
        },
        {
          q: 'When will I receive my refund?',
          a: 'Refunds are processed within 5-7 business days after we receive and verify the returned product. The amount will be credited to your original payment method.'
        },
        {
          q: 'Can I exchange a product?',
          a: 'Yes! We offer free exchanges for size or color changes, subject to availability. Select "Exchange" when initiating your return.'
        }
      ]
    },
    {
      category: 'Products & Sizing',
      questions: [
        {
          q: 'How do I find my size?',
          a: 'Check our detailed size guide available on each product page. We provide measurements for chest, length, shoulder, and waist to help you find the perfect fit.'
        },
        {
          q: 'Are your products true to size?',
          a: 'Yes, our products follow standard Indian sizing. However, some oversized styles are designed to fit larger. Check the product description for fit details.'
        },
        {
          q: 'What materials are your products made from?',
          a: 'We use premium quality fabrics including 100% cotton, cotton blends, and performance materials. Each product page lists the specific fabric composition.'
        },
        {
          q: 'How do I care for my products?',
          a: 'Care instructions are provided on the product tag. Generally, we recommend machine wash cold, tumble dry low, and avoid bleach for best results.'
        }
      ]
    },
    {
      category: 'Payment & Security',
      questions: [
        {
          q: 'What payment methods do you accept?',
          a: 'We accept all major credit/debit cards, UPI, net banking, and popular wallets through our secure payment gateway powered by Razorpay.'
        },
        {
          q: 'Is my payment information secure?',
          a: 'Yes! All transactions are encrypted using SSL technology. We never store your complete card details on our servers.'
        },
        {
          q: 'Do you offer Cash on Delivery?',
          a: 'Yes, COD is available for orders up to ₹5,000. A small COD fee may apply.'
        },
        {
          q: 'Can I use multiple payment methods?',
          a: 'Currently, we support one payment method per order. However, you can use discount codes along with any payment method.'
        }
      ]
    },
    {
      category: 'Account & Support',
      questions: [
        {
          q: 'Do I need an account to place an order?',
          a: 'No, you can checkout as a guest. However, creating an account helps you track orders, save addresses, and enjoy faster checkout.'
        },
        {
          q: 'How do I reset my password?',
          a: 'Click on "Forgot Password" on the login page. Enter your email, and we\'ll send you a link to reset your password.'
        },
        {
          q: 'How can I contact customer support?',
          a: 'You can reach us via email at hello@dudemenswear.com, call us at +91 98765 43210, or use the contact form on our website.'
        },
        {
          q: 'What are your customer support hours?',
          a: 'Our support team is available Monday to Saturday, 10 AM to 7 PM IST. We respond to emails within 24 hours.'
        }
      ]
    }
  ]

  const filteredFaqs = faqs.map(category => ({
    ...category,
    questions: category.questions.filter(
      faq =>
        faq.q.toLowerCase().includes(searchQuery.toLowerCase()) ||
        faq.a.toLowerCase().includes(searchQuery.toLowerCase())
    )
  })).filter(category => category.questions.length > 0)

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4 max-w-4xl">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-heading font-bold mb-4">Frequently Asked Questions</h1>
          <p className="text-gray-600 text-lg mb-8">Find answers to common questions</p>

          {/* Search */}
          <div className="max-w-2xl mx-auto relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search for answers..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-4 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-600"
            />
          </div>

          {cmsContent && (
            <div className="mt-8 text-left max-w-4xl mx-auto bg-white rounded-xl p-6 shadow-sm border border-gray-200">
              <div className="prose prose-red max-w-none">
                <ReactMarkdown remarkPlugins={[remarkGfm]}>{cmsContent}</ReactMarkdown>
              </div>
            </div>
          )}
        </motion.div>

        <div className="space-y-8">
          {filteredFaqs.map((category, categoryIndex) => (
            <motion.div
              key={category.category}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: categoryIndex * 0.1 }}
            >
              <h2 className="text-2xl font-bold mb-4 text-gray-900">{category.category}</h2>
              <div className="space-y-3">
                {category.questions.map((faq, index) => {
                  const globalIndex = categoryIndex * 100 + index
                  const isOpen = openIndex === globalIndex

                  return (
                    <div key={index} className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                      <button
                        onClick={() => setOpenIndex(isOpen ? null : globalIndex)}
                        className="w-full px-6 py-4 text-left flex items-center justify-between hover:bg-gray-50 transition-colors"
                      >
                        <span className="font-semibold text-gray-900 pr-4">{faq.q}</span>
                        <ChevronDown
                          className={`w-5 h-5 text-gray-500 flex-shrink-0 transition-transform ${isOpen ? 'transform rotate-180' : ''
                            }`}
                        />
                      </button>
                      <AnimatePresence>
                        {isOpen && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.2 }}
                          >
                            <div className="px-6 pb-4 text-gray-700 leading-relaxed border-t border-gray-100 pt-4">
                              {faq.a}
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  )
                })}
              </div>
            </motion.div>
          ))}
        </div>

        {filteredFaqs.length === 0 && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-12">
            <p className="text-gray-600 text-lg">No results found for "{searchQuery}"</p>
            <p className="text-gray-500 mt-2">Try different keywords or browse all categories</p>
          </motion.div>
        )}

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }} className="mt-12 bg-gradient-to-r from-red-600 to-red-700 rounded-xl p-8 text-white text-center">
          <h3 className="text-2xl font-bold mb-2">Still Have Questions?</h3>
          <p className="mb-4">Our support team is here to help</p>
          <a href="/contact" className="inline-block bg-white text-red-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors">
            Contact Support
          </a>
        </motion.div>
      </div>
    </div>
  )
}
