'use client'

import { useState } from 'react'
import { Package, Search, Truck } from 'lucide-react'
import { supabase } from '@/lib/supabase/client'

export default function TrackOrderPage() {
  const [orderId, setOrderId] = useState('')
  const [order, setOrder] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!orderId.trim()) return

    setLoading(true)
    setError('')
    
    try {
      // Fetch order from Supabase
      const { data: orderData, error: orderError } = await supabase
        .from('orders')
        .select(`
          *,
          order_items (
            *,
            product_variants (
              *,
              products (
                name,
                product_images (
                  image_url
                )
              )
            )
          ),
          addresses (*)
        `)
        .eq('id', orderId.trim())
        .single()

      if (orderError || !orderData) {
        setError('Order not found. Please check your order ID.')
        setOrder(null)
        return
      }

      // Transform data to match expected format
      const shippingAddress = orderData.addresses;
      const transformedOrder = {
        id: orderData.id,
        display_id: orderData.id,
        status: orderData.order_status || 'pending',
        created_at: orderData.created_at,
        items: orderData.order_items?.map((item: any) => ({
          id: item.id,
          title: item.product_variants?.products?.name || 'Product',
          quantity: item.quantity,
          unit_price: item.unit_price * 100, // Convert to paise for display
          thumbnail: item.product_variants?.products?.product_images?.[0]?.image_url || '/images/placeholder.jpg'
        })) || [],
        total: orderData.total_amount * 100, // Convert to paise for display
        shipping_address: shippingAddress ? {
          first_name: shippingAddress.name?.split(' ')[0] || '',
          last_name: shippingAddress.name?.split(' ').slice(1).join(' ') || '',
          address_1: shippingAddress.address_line1,
          city: shippingAddress.city,
          province: shippingAddress.state,
          postal_code: shippingAddress.pincode
        } : null
      }
      
      setOrder(transformedOrder)
    } catch (err: any) {
      console.error('Error tracking order:', err)
      setError('An error occurred while tracking your order. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-8">
          <Package className="w-16 h-16 mx-auto mb-4 text-gray-400" />
          <h1 className="text-3xl font-bold mb-2">Track Your Order</h1>
          <p className="text-gray-600">
            Enter your order ID to track your package
          </p>
        </div>

        <form onSubmit={handleSearch} className="mb-8">
          <div className="flex gap-4">
            <input
              type="text"
              value={orderId}
              onChange={(e) => setOrderId(e.target.value)}
              placeholder="Enter order ID (e.g., ORDER-123456)"
              className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
            />
            <button
              type="submit"
              disabled={loading || !orderId.trim()}
              className="px-6 py-3 bg-black text-white rounded-lg font-semibold hover:bg-gray-800 disabled:bg-gray-400 flex items-center gap-2"
            >
              <Search className="w-5 h-5" />
              {loading ? 'Searching...' : 'Track'}
            </button>
          </div>
        </form>

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <p className="text-red-800">{error}</p>
          </div>
        )}

        {order && (
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <div className="flex items-center gap-3 mb-6">
              <Truck className="w-6 h-6 text-green-600" />
              <div>
                <h2 className="text-xl font-bold">Order #{order.display_id}</h2>
                <p className="text-green-600 font-medium">Status: {order.status}</p>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <h3 className="font-semibold mb-2">Items</h3>
                {order.items.map((item: any) => (
                  <div key={item.id} className="flex justify-between">
                    <span>{item.title} x {item.quantity}</span>
                    <span>₹{(item.unit_price / 100).toFixed(0)}</span>
                  </div>
                ))}
              </div>

              <div className="border-t pt-4">
                <div className="flex justify-between font-bold">
                  <span>Total</span>
                  <span>₹{(order.total / 100).toFixed(0)}</span>
                </div>
              </div>

              {order.shipping_address && (
                <div className="border-t pt-4">
                  <h3 className="font-semibold mb-2">Shipping Address</h3>
                  <p className="text-gray-600">
                    {order.shipping_address.first_name} {order.shipping_address.last_name}<br />
                    {order.shipping_address.address_1}<br />
                    {order.shipping_address.city}, {order.shipping_address.province} {order.shipping_address.postal_code}
                  </p>
                </div>
              )}
            </div>
          </div>
        )}

        <div className="text-center mt-8">
          <p className="text-gray-600 text-sm">
            Enter your order ID to track your package status and delivery information.
          </p>
        </div>
      </div>
    </div>
  )
}
