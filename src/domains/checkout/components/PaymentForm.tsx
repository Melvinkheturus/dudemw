'use client'

import { TieredShippingInfo } from './ShippingForm'

interface Cart {
  items: Array<{
    id: string
    title: string
    quantity: number
    total: number
    unit_price: number
  }>
  subtotal: number
  total: number
  tax_total: number
}

interface PaymentFormProps {
  cart: Cart
  tieredShipping: TieredShippingInfo | null
  isProcessing: boolean
  hasUserAddress: boolean
  selectedAddress: any
  onSubmit: (e: React.FormEvent) => void
  onBackToReview: () => void
}

export default function PaymentForm({
  cart,
  tieredShipping,
  isProcessing,
  hasUserAddress,
  selectedAddress,
  onSubmit,
  onBackToReview
}: PaymentFormProps) {
  return (
    <form onSubmit={onSubmit} className="space-y-6">
      <h2 className="text-2xl font-bold mb-4">Place Your Order</h2>

      {/* Order Summary Card */}
      <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
        <h3 className="font-semibold mb-4">Final Order Summary</h3>
        <div className="space-y-2">
          <div className="flex justify-between">
            <span>Items ({cart.items.reduce((sum, item) => sum + item.quantity, 0)})</span>
            <span>₹{(cart.subtotal / 100).toFixed(0)}</span>
          </div>
          {tieredShipping && (
            <div className="flex justify-between">
              <span>Shipping ({tieredShipping.option_name})</span>
              <span>₹{(tieredShipping.amount / 100).toFixed(0)}</span>
            </div>
          )}
          <div className="flex justify-between">
            <span>Tax</span>
            <span>₹{(cart.tax_total / 100).toFixed(0)}</span>
          </div>
          <div className="border-t pt-2 mt-2">
            <div className="flex justify-between font-bold text-xl">
              <span>Total</span>
              <span className="text-red-600">₹{((cart.total + (tieredShipping?.amount || 0)) / 100).toFixed(0)}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Payment Method */}
      <div className="bg-green-50 border border-green-200 rounded-lg p-4">
        <h3 className="font-semibold mb-3 text-green-800">Payment Method</h3>
        <div className="flex items-center gap-3 p-3 bg-white border border-green-200 rounded-lg">
          <div className="w-4 h-4 bg-green-600 rounded-full flex items-center justify-center">
            <div className="w-2 h-2 bg-white rounded-full"></div>
          </div>
          <div>
            <p className="font-medium text-green-800">Cash on Delivery (COD)</p>
            <p className="text-sm text-green-600">Pay when your order is delivered to your doorstep</p>
          </div>
        </div>
        <div className="mt-3 p-3 bg-blue-50 border border-blue-200 rounded-lg">
          <p className="text-sm text-blue-700">
            <strong>Note:</strong> Online payment options (Razorpay, UPI, Cards) will be available soon. 
            For now, all orders will be processed as Cash on Delivery.
          </p>
        </div>
      </div>

      {/* Terms and Conditions */}
      <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
        <label className="flex items-start gap-3">
          <input 
            type="checkbox" 
            required 
            className="mt-1"
          />
          <span className="text-sm text-gray-700">
            I agree to the <a href="/terms" className="text-blue-600 hover:underline">Terms & Conditions</a> and 
            <a href="/privacy" className="text-blue-600 hover:underline ml-1">Privacy Policy</a>
          </span>
        </label>
      </div>

      <div className="flex gap-4">
        <button
          type="button"
          onClick={onBackToReview}
          className="flex-1 border border-black py-3 rounded-lg font-semibold hover:bg-gray-100"
        >
          Back to Review
        </button>
        <button
          type="submit"
          disabled={isProcessing || (hasUserAddress && Boolean(!selectedAddress))}
          className="flex-1 bg-red-600 text-white py-3 rounded-lg font-semibold hover:bg-red-700 disabled:bg-gray-400 text-lg"
        >
          {isProcessing ? 'Processing Order...' : 'Place Order (COD)'}
        </button>
      </div>
    </form>
  )
}
