'use client'

import { MapPin, Edit } from 'lucide-react'
import { TieredShippingInfo, ShippingFormData } from './ShippingForm'
import { Address } from './AddressSelector'

interface Cart {
  items: Array<{
    id: string
    title: string
    quantity: number
    total: number
    unit_price: number
    thumbnail?: string
  }>
  subtotal: number
  total: number
  tax_total: number
}

interface OrderReviewProps {
  cart: Cart
  hasUserAddress: boolean
  selectedAddress: Address | null
  formData: ShippingFormData
  tieredShipping: TieredShippingInfo | null
  onEditShipping: () => void
  onChangeAddress: () => void
  onProceedToPayment: () => void
}

export default function OrderReview({
  cart,
  hasUserAddress,
  selectedAddress,
  formData,
  tieredShipping,
  onEditShipping,
  onChangeAddress,
  onProceedToPayment
}: OrderReviewProps) {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold mb-4">Review Your Order</h2>

      {/* Order Items */}
      <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
        <h3 className="font-semibold mb-4">Order Items</h3>
        <div className="space-y-3">
          {cart.items.map((item) => (
            <div key={item.id} className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                {item.thumbnail && (
                  <img 
                    src={item.thumbnail} 
                    alt={item.title}
                    className="w-12 h-12 object-cover rounded"
                  />
                )}
                <div>
                  <h4 className="font-medium">{item.title}</h4>
                  <p className="text-sm text-gray-600">Qty: {item.quantity}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="font-semibold">₹{(item.total / 100).toFixed(0)}</p>
                <p className="text-sm text-gray-600">₹{(item.unit_price / 100).toFixed(0)} each</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Shipping Address */}
      <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold">Shipping Address</h3>
          {!hasUserAddress && (
            <button
              onClick={onEditShipping}
              className="text-sm text-blue-600 hover:text-blue-700 font-medium flex items-center gap-1"
            >
              <Edit className="w-3 h-3" />
              Edit
            </button>
          )}
          {hasUserAddress && (
            <button
              onClick={onChangeAddress}
              className="text-sm text-blue-600 hover:text-blue-700 font-medium flex items-center gap-1"
            >
              <Edit className="w-3 h-3" />
              Change
            </button>
          )}
        </div>
        
        {hasUserAddress && selectedAddress ? (
          <div className="flex items-start gap-3">
            <MapPin className="w-5 h-5 text-blue-600 mt-1" />
            <div>
              <h4 className="font-medium">{selectedAddress.name}</h4>
              <p className="text-sm text-gray-600">{selectedAddress.phone}</p>
              <p className="text-gray-700 mt-1">
                {selectedAddress.addressLine1}
                {selectedAddress.addressLine2 && <>, {selectedAddress.addressLine2}</>}
              </p>
              <p className="text-gray-700">
                {selectedAddress.city}, {selectedAddress.state} - {selectedAddress.pincode}
              </p>
            </div>
          </div>
        ) : (
          <div className="flex items-start gap-3">
            <MapPin className="w-5 h-5 text-blue-600 mt-1" />
            <div>
              <h4 className="font-medium">{formData.first_name} {formData.last_name}</h4>
              <p className="text-sm text-gray-600">{formData.phone}</p>
              <p className="text-gray-700 mt-1">
                {formData.address_1}
                {formData.address_2 && <>, {formData.address_2}</>}
              </p>
              <p className="text-gray-700">
                {formData.city}, {formData.province} - {formData.postal_code}
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Shipping Method */}
      {tieredShipping && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-6">
          <h3 className="font-semibold mb-4 text-green-900">📦 Delivery Details</h3>
          <div className="bg-white rounded-lg p-4 border border-green-300">
            <div className="flex items-center justify-between mb-3">
              <div>
                <div className="font-medium text-green-800">{tieredShipping.option_name}</div>
                <div className="text-sm text-green-700">{tieredShipping.description}</div>
                <div className="text-xs text-green-600 mt-1">
                  {tieredShipping.is_tamil_nadu ? '📍 Tamil Nadu' : '📍 Pan India'} • {tieredShipping.total_quantity} item(s)
                </div>
              </div>
              <div className="text-xl font-bold text-green-800">
                ₹{(tieredShipping.amount / 100).toFixed(0)}
              </div>
            </div>
            
            <div className="flex items-center gap-2 text-sm text-green-700 bg-green-100 rounded px-3 py-2">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>Expected delivery by <strong>{tieredShipping.estimated_delivery}</strong></span>
            </div>
          </div>
        </div>
      )}

      {/* Order Summary */}
      <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
        <h3 className="font-semibold mb-4">Order Summary</h3>
        <div className="space-y-2">
          <div className="flex justify-between">
            <span>Subtotal</span>
            <span>₹{(cart.subtotal / 100).toFixed(0)}</span>
          </div>
          {tieredShipping && (
            <div className="flex justify-between">
              <span>Shipping</span>
              <span>₹{(tieredShipping.amount / 100).toFixed(0)}</span>
            </div>
          )}
          <div className="flex justify-between">
            <span>Tax</span>
            <span>₹{(cart.tax_total / 100).toFixed(0)}</span>
          </div>
          <div className="border-t pt-2 mt-2">
            <div className="flex justify-between font-bold text-lg">
              <span>Total</span>
              <span>₹{((cart.total + (tieredShipping?.amount || 0)) / 100).toFixed(0)}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="flex gap-4">
        {!hasUserAddress && (
          <button
            type="button"
            onClick={onEditShipping}
            className="flex-1 border border-black py-3 rounded-lg font-semibold hover:bg-gray-100"
          >
            Back to Shipping
          </button>
        )}
        <button
          type="button"
          onClick={onProceedToPayment}
          className="flex-1 bg-black text-white py-3 rounded-lg font-semibold hover:bg-gray-800"
        >
          Proceed to Payment
        </button>
      </div>
    </div>
  )
}
