'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Ruler, User, TrendingUp } from 'lucide-react'

export default function SizeGuidePage() {
  const [activeCategory, setActiveCategory] = useState<'tshirts' | 'pants' | 'shirts'>('tshirts')

  const sizeData = {
    tshirts: [
      { size: 'S', chest: '36-38', length: '27', shoulder: '16' },
      { size: 'M', chest: '38-40', length: '28', shoulder: '17' },
      { size: 'L', chest: '40-42', length: '29', shoulder: '18' },
      { size: 'XL', chest: '42-44', length: '30', shoulder: '19' },
      { size: 'XXL', chest: '44-46', length: '31', shoulder: '20' },
    ],
    pants: [
      { size: '28', waist: '28', hip: '36', length: '39' },
      { size: '30', waist: '30', hip: '38', length: '40' },
      { size: '32', waist: '32', hip: '40', length: '41' },
      { size: '34', waist: '34', hip: '42', length: '42' },
      { size: '36', waist: '36', hip: '44', length: '43' },
    ],
    shirts: [
      { size: 'S', chest: '38-40', length: '28', shoulder: '17', sleeve: '24' },
      { size: 'M', chest: '40-42', length: '29', shoulder: '18', sleeve: '25' },
      { size: 'L', chest: '42-44', length: '30', shoulder: '19', sleeve: '26' },
      { size: 'XL', chest: '44-46', length: '31', shoulder: '20', sleeve: '27' },
      { size: 'XXL', chest: '46-48', length: '32', shoulder: '21', sleeve: '28' },
    ]
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4 max-w-6xl">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl md:text-5xl font-heading font-bold mb-4">Size Guide</h1>
          <p className="text-gray-600 text-lg">Find your perfect fit with our detailed size charts</p>
        </motion.div>

        {/* Category Tabs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="flex justify-center gap-4 mb-8"
        >
          <button
            onClick={() => setActiveCategory('tshirts')}
            className={`px-6 py-3 rounded-lg font-semibold transition-all ${
              activeCategory === 'tshirts'
                ? 'bg-red-600 text-white shadow-lg'
                : 'bg-white text-gray-700 hover:bg-gray-100'
            }`}
          >
            T-Shirts
          </button>
          <button
            onClick={() => setActiveCategory('pants')}
            className={`px-6 py-3 rounded-lg font-semibold transition-all ${
              activeCategory === 'pants'
                ? 'bg-red-600 text-white shadow-lg'
                : 'bg-white text-gray-700 hover:bg-gray-100'
            }`}
          >
            Pants
          </button>
          <button
            onClick={() => setActiveCategory('shirts')}
            className={`px-6 py-3 rounded-lg font-semibold transition-all ${
              activeCategory === 'shirts'
                ? 'bg-red-600 text-white shadow-lg'
                : 'bg-white text-gray-700 hover:bg-gray-100'
            }`}
          >
            Shirts
          </button>
        </motion.div>

        {/* Size Chart */}
        <motion.div
          key={activeCategory}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden mb-8"
        >
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-4 text-left font-bold text-gray-900">Size</th>
                  {activeCategory === 'tshirts' && (
                    <>
                      <th className="px-6 py-4 text-left font-bold text-gray-900">Chest (inches)</th>
                      <th className="px-6 py-4 text-left font-bold text-gray-900">Length (inches)</th>
                      <th className="px-6 py-4 text-left font-bold text-gray-900">Shoulder (inches)</th>
                    </>
                  )}
                  {activeCategory === 'pants' && (
                    <>
                      <th className="px-6 py-4 text-left font-bold text-gray-900">Waist (inches)</th>
                      <th className="px-6 py-4 text-left font-bold text-gray-900">Hip (inches)</th>
                      <th className="px-6 py-4 text-left font-bold text-gray-900">Length (inches)</th>
                    </>
                  )}
                  {activeCategory === 'shirts' && (
                    <>
                      <th className="px-6 py-4 text-left font-bold text-gray-900">Chest (inches)</th>
                      <th className="px-6 py-4 text-left font-bold text-gray-900">Length (inches)</th>
                      <th className="px-6 py-4 text-left font-bold text-gray-900">Shoulder (inches)</th>
                      <th className="px-6 py-4 text-left font-bold text-gray-900">Sleeve (inches)</th>
                    </>
                  )}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {sizeData[activeCategory].map((row, index) => (
                  <motion.tr
                    key={row.size}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="hover:bg-gray-50"
                  >
                    <td className="px-6 py-4 font-bold text-red-600">{row.size}</td>
                    {Object.entries(row).slice(1).map(([key, value]) => (
                      <td key={key} className="px-6 py-4 text-gray-700">{value}</td>
                    ))}
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>

        {/* How to Measure */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white rounded-xl p-6 shadow-sm border border-gray-200"
          >
            <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center mb-4">
              <Ruler className="w-6 h-6 text-red-600" />
            </div>
            <h3 className="font-bold text-lg mb-2">Chest Measurement</h3>
            <p className="text-gray-600 text-sm">
              Measure around the fullest part of your chest, keeping the tape horizontal.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white rounded-xl p-6 shadow-sm border border-gray-200"
          >
            <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center mb-4">
              <User className="w-6 h-6 text-red-600" />
            </div>
            <h3 className="font-bold text-lg mb-2">Waist Measurement</h3>
            <p className="text-gray-600 text-sm">
              Measure around your natural waistline, keeping the tape comfortably loose.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-white rounded-xl p-6 shadow-sm border border-gray-200"
          >
            <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center mb-4">
              <TrendingUp className="w-6 h-6 text-red-600" />
            </div>
            <h3 className="font-bold text-lg mb-2">Length Measurement</h3>
            <p className="text-gray-600 text-sm">
              Measure from the highest point of the shoulder to the desired length.
            </p>
          </motion.div>
        </div>

        {/* Tips */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-red-50 border border-red-200 rounded-xl p-6"
        >
          <h3 className="font-bold text-lg mb-3 text-red-900">Sizing Tips</h3>
          <ul className="space-y-2 text-red-800">
            <li>• All measurements are in inches</li>
            <li>• For best results, measure over light clothing</li>
            <li>• If you're between sizes, we recommend sizing up for a relaxed fit</li>
            <li>• Our oversized collection is designed to fit 1-2 sizes larger</li>
            <li>• Still unsure? Contact our support team for personalized assistance</li>
          </ul>
        </motion.div>
      </div>
    </div>
  )
}
