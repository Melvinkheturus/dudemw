'use client'

import { useState } from 'react'
import { Search, Package, CheckCircle } from 'lucide-react'
import { supabase } from '@/lib/supabase/client'

export default function TrackOrderSection() {
  const [orderNumber, setOrderNumber] = useState('')
  const [email, setEmail] = useState('')
  const [tracking, setTracking] = useState<any>(null)

  const handleTrack = async (e: React.FormEvent) => {
    e.preventDefault()
    
    try {
      // Fetch order from Supabase
      const { data: orderData, error } = await supabase
        .from('orders')
        .select('*')
        .eq('id', orderNumber.trim())
        .eq('email', email.trim())
        .single()

      if (error || !orderData) {
        setTracking({
          orderNumber: orderNumber,
          status: 'not_found',
          timeline: [
            { status: 'Order not found', date: 'Please check your order number and email', completed: false }
          ]
        })
        return
      }

      // Generate timeline based on order status
      const generateTimeline = (status: string, createdAt: string) => {
        const orderDate = new Date(createdAt).toLocaleDateString()
        const timeline = [
          { status: 'Order Placed', date: orderDate, completed: true }
        ]

        if (['processing', 'shipped', 'delivered'].includes(status)) {
          timeline.push({ status: 'Processing', date: orderDate, completed: true })
        }

        if (['shipped', 'delivered'].includes(status)) {
          timeline.push({ status: 'Shipped', date: orderDate, completed: true })
        }

        if (status === 'delivered') {
          timeline.push({ status: 'Delivered', date: orderDate, completed: true })
        } else if (status === 'shipped') {
          timeline.push({ status: 'Out for Delivery', date: 'Expected soon', completed: false })
          timeline.push({ status: 'Delivered', date: 'Expected', completed: false })
        } else {
          timeline.push({ status: 'Processing', date: 'In progress', completed: false })
          timeline.push({ status: 'Shipped', date: 'Pending', completed: false })
          timeline.push({ status: 'Delivered', date: 'Pending', completed: false })
        }

        return timeline
      }

      setTracking({
        orderNumber: orderData.id,
        status: orderData.order_status || 'pending',
        timeline: generateTimeline(orderData.order_status || 'pending', orderData.created_at || new Date().toISOString())
      })
    } catch (error) {
      console.error('Error tracking order:', error)
      setTracking({
        orderNumber: orderNumber,
        status: 'error',
        timeline: [
          { status: 'Error', date: 'Unable to track order. Please try again later.', completed: false }
        ]
      })
    }
  }

  return (
    <div className="max-w-4xl mx-auto">
      {/* Track Orders Section with Background Image */}
      <div className="relative bg-white rounded-xl shadow-sm border border-gray-200 mb-6 overflow-hidden min-h-[400px]">
        {/* Background Image */}
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: "url('/illustration/track_order.png')"
          }}
        />
        
        {/* Overlay Content */}
        <div className="relative z-10 p-8 h-full flex items-center">
          <div className="w-full max-w-md">
            <h2 className="text-2xl font-bold text-black mb-6">
              Track Your Order
            </h2>
            
            <form onSubmit={handleTrack} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-black mb-2">
                  Order Number
                </label>
                <input
                  type="text"
                  value={orderNumber}
                  onChange={(e) => setOrderNumber(e.target.value)}
                  placeholder="e.g., DM2024001"
                  className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-600 text-gray-900 placeholder-gray-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-black mb-2">
                  Email Address
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your@email.com"
                  className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-600 text-gray-900 placeholder-gray-500"
                  required
                />
              </div>

              <button
                type="submit"
                className="w-full bg-black text-white py-3 rounded-lg font-semibold hover:bg-gray-800 transition-colors flex items-center justify-center gap-2 mt-4"
              >
                <Search className="w-5 h-5" />
                Track Order
              </button>
            </form>
          </div>
        </div>
      </div>

      {tracking && (
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <div className="flex items-center justify-between mb-6 pb-4 border-b border-gray-200">
            <div>
              <h3 className="font-semibold text-lg">Order #{tracking.orderNumber}</h3>
              <p className="text-sm text-gray-600">Currently: {tracking.status}</p>
            </div>
            <Package className="w-8 h-8 text-red-600" />
          </div>

          <div className="space-y-6">
            {tracking.timeline.map((item: any, index: number) => (
              <div key={index} className="flex gap-4">
                <div className="flex flex-col items-center">
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center ${
                      item.completed
                        ? 'bg-green-100 text-green-600'
                        : 'bg-gray-100 text-gray-400'
                    }`}
                  >
                    {item.completed ? (
                      <CheckCircle className="w-5 h-5" />
                    ) : (
                      <div className="w-3 h-3 rounded-full bg-gray-300"></div>
                    )}
                  </div>
                  {index < tracking.timeline.length - 1 && (
                    <div
                      className={`w-0.5 h-12 ${
                        item.completed ? 'bg-green-300' : 'bg-gray-200'
                      }`}
                    ></div>
                  )}
                </div>
                <div className="flex-1 pb-4">
                  <h4
                    className={`font-medium ${
                      item.completed ? 'text-black' : 'text-gray-400'
                    }`}
                  >
                    {item.status}
                  </h4>
                  <p className="text-sm text-gray-600">{item.date}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
