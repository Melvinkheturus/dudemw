'use client'

import { useState } from 'react'
import { User, UserPlus } from 'lucide-react'

interface CheckoutToggleProps {
  onModeChange: (mode: 'guest' | 'login') => void
}

export default function CheckoutToggle({ onModeChange }: CheckoutToggleProps) {
  const [mode, setMode] = useState<'guest' | 'login'>('guest')

  const handleModeChange = (newMode: 'guest' | 'login') => {
    setMode(newMode)
    onModeChange(newMode)
  }

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-6 mb-6">
      <h2 className="text-xl font-bold mb-4">How would you like to checkout?</h2>
      
      <div className="grid md:grid-cols-2 gap-4">
        <button
          onClick={() => handleModeChange('guest')}
          className={`p-6 border-2 rounded-lg text-left transition-all ${
            mode === 'guest'
              ? 'border-black bg-gray-50'
              : 'border-gray-200 hover:border-gray-300'
          }`}
        >
          <div className="flex items-center gap-3 mb-3">
            <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
              mode === 'guest' ? 'bg-black text-white' : 'bg-gray-100 text-gray-600'
            }`}>
              <UserPlus className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-semibold text-lg">Guest Checkout</h3>
              <p className="text-sm text-gray-600">Quick & Easy</p>
            </div>
          </div>
          <p className="text-sm text-gray-600">
            No account needed. Just enter your details and complete the order.
          </p>
        </button>

        <button
          onClick={() => handleModeChange('login')}
          className={`p-6 border-2 rounded-lg text-left transition-all ${
            mode === 'login'
              ? 'border-black bg-gray-50'
              : 'border-gray-200 hover:border-gray-300'
          }`}
        >
          <div className="flex items-center gap-3 mb-3">
            <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
              mode === 'login' ? 'bg-black text-white' : 'bg-gray-100 text-gray-600'
            }`}>
              <User className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-semibold text-lg">Login / Sign Up</h3>
              <p className="text-sm text-gray-600">Recommended</p>
            </div>
          </div>
          <p className="text-sm text-gray-600">
            Save addresses, track orders, and get faster checkout next time.
          </p>
        </button>
      </div>
    </div>
  )
}
