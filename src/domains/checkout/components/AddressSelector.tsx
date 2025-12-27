'use client'

import { MapPin, X } from 'lucide-react'

interface Address {
  id: string
  name: string
  phone: string
  addressLine1: string
  addressLine2?: string
  city: string
  state: string
  pincode: string
  isDefault?: boolean
}

interface AddressSelectorProps {
  addresses: Address[]
  selectedAddress: Address | null
  onAddressSelect: (address: Address) => void
  onClose: () => void
}

export default function AddressSelector({
  addresses,
  selectedAddress,
  onAddressSelect,
  onClose
}: AddressSelectorProps) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[80vh] overflow-y-auto p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-semibold">Select Delivery Address</h3>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        
        <div className="space-y-3">
          {addresses.map((address) => (
            <div
              key={address.id}
              className={`border rounded-lg p-4 cursor-pointer transition-colors ${
                selectedAddress?.id === address.id 
                  ? 'border-black bg-gray-50' 
                  : 'border-gray-200 hover:border-gray-300'
              }`}
              onClick={() => {
                onAddressSelect(address)
                onClose()
              }}
            >
              <div className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-red-600 mt-1" />
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <h4 className="font-medium">{address.name}</h4>
                    {address.isDefault && (
                      <span className="bg-black text-white px-2 py-1 rounded text-xs">Default</span>
                    )}
                  </div>
                  <p className="text-sm text-gray-600">{address.phone}</p>
                  <p className="text-gray-700 mt-1">
                    {address.addressLine1}
                    {address.addressLine2 && <>, {address.addressLine2}</>}
                  </p>
                  <p className="text-gray-700">
                    {address.city}, {address.state} - {address.pincode}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        <div className="mt-6 pt-4 border-t">
          <button
            onClick={onClose}
            className="w-full border border-gray-300 py-2 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  )
}

export type { Address }
