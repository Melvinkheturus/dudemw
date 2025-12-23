'use client'

import { useState } from 'react'
import { Package } from 'lucide-react'
import { Order, OrderItem } from '../types'
import Image from 'next/image'

type OrderTab = 'active' | 'completed' | 'cancelled'

export default function OrdersSection() {
  const [activeTab, setActiveTab] = useState<OrderTab>('active')
  const [orders] = useState<Order[]>([
    {
      id: '1',
      orderNumber: 'DMW-2024-001',
      date: '2024-07-26',
      status: 'shipped',
      total_amount: 2499,
      items: [
        {
          id: '1',
          name: 'Casual Red Shirt, Denim Jeans',
          image: '/products/shirt.jpg',
          size: 'L',
          quantity: 2,
          price: 2499
        }
      ]
    },
    {
      id: '2',
      orderNumber: 'DMW-2024-002',
      date: '2024-07-24',
      status: 'processing',
      total_amount: 1899,
      items: [
        {
          id: '2',
          name: 'Basic White Tee, Black Trousers',
          image: '/products/tshirt.jpg',
          size: 'M',
          quantity: 2,
          price: 1899
        }
      ]
    }
  ])

  const getStatusColor = (status?: Order['status']) => {
    const colors = {
      processing: 'text-blue-600',
      shipped: 'text-green-600',
      delivered: 'text-green-600',
      cancelled: 'text-red-600'
    }
    return status ? colors[status] : 'text-gray-600'
  }

  const getStatusText = (status?: Order['status']) => {
    const texts = {
      processing: 'Processing',
      shipped: 'Shipped',
      delivered: 'Delivered',
      cancelled: 'Cancelled'
    }
    return status ? texts[status] : 'Unknown'
  }

  const filterOrders = () => {
    switch (activeTab) {
      case 'active':
        return orders.filter(o => o.status === 'processing' || o.status === 'shipped')
      case 'completed':
        return orders.filter(o => o.status === 'delivered')
      case 'cancelled':
        return orders.filter(o => o.status === 'cancelled')
      default:
        return orders
    }
  }

  const filteredOrders = filterOrders()

  return (
    <div>
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">My Orders</h1>
        <p className="text-gray-600">
          Check the status of recent orders, manage returns, and discover similar products.
        </p>
      </div>

      {/* Tabs */}
      <div className="flex gap-6 border-b border-gray-200 mb-6">
        <button
          onClick={() => setActiveTab('active')}
          className={`pb-3 px-1 font-medium transition-colors relative ${activeTab === 'active'
            ? 'text-red-600'
            : 'text-gray-600 hover:text-gray-900'
            }`}
        >
          Active
          {activeTab === 'active' && (
            <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-red-600" />
          )}
        </button>
        <button
          onClick={() => setActiveTab('completed')}
          className={`pb-3 px-1 font-medium transition-colors relative ${activeTab === 'completed'
            ? 'text-red-600'
            : 'text-gray-600 hover:text-gray-900'
            }`}
        >
          Completed
          {activeTab === 'completed' && (
            <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-red-600" />
          )}
        </button>
        <button
          onClick={() => setActiveTab('cancelled')}
          className={`pb-3 px-1 font-medium transition-colors relative ${activeTab === 'cancelled'
            ? 'text-red-600'
            : 'text-gray-600 hover:text-gray-900'
            }`}
        >
          Cancelled
          {activeTab === 'cancelled' && (
            <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-red-600" />
          )}
        </button>
      </div>

      {/* Orders List */}
      {filteredOrders.length === 0 ? (
        <div className="text-center py-16">
          <Package className="w-16 h-16 mx-auto mb-4 text-gray-300" />
          <h3 className="text-xl font-semibold mb-2 text-gray-900">No Orders Found</h3>
          <p className="text-gray-600 mb-6">
            {activeTab === 'active' && "You don't have any active orders"}
            {activeTab === 'completed' && "You don't have any completed orders"}
            {activeTab === 'cancelled' && "You don't have any cancelled orders"}
          </p>
          <a
            href="/products"
            className="inline-block bg-black text-white px-6 py-3 rounded-lg hover:bg-gray-800 transition-colors"
          >
            Start Shopping
          </a>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredOrders.map((order) => (
            <div
              key={order.id}
              className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow"
            >
              {/* Order Header */}
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="font-semibold text-lg text-gray-900">
                    Order #{order.orderNumber}
                  </h3>
                  <p className="text-sm text-gray-500">
                    Order placed on {new Date(order.date || order.created_at || new Date()).toLocaleDateString('en-US', {
                      month: 'long',
                      day: 'numeric',
                      year: 'numeric'
                    })}
                  </p>
                </div>
                <span className={`font-semibold ${getStatusColor(order.status)}`}>
                  Status: {getStatusText(order.status)}
                </span>
              </div>

              {/* Order Items */}
              <div className="bg-gray-50 rounded-lg p-4 mb-4">
                {order.items.map((item) => (
                  <div key={item.id} className="flex gap-4">
                    <div className="w-24 h-24 bg-white rounded-lg flex items-center justify-center overflow-hidden">
                      <Package className="w-12 h-12 text-gray-300" />
                    </div>
                    <div className="flex-1">
                      <p className="text-gray-600 text-sm mb-1">Contains: {item.name}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3">
                <button className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium">
                  Track Order
                </button>
                <button className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium">
                  View Details
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
