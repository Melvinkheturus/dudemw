'use client'

import { MapPin, Edit } from 'lucide-react'
import { TieredShippingInfo } from './ShippingForm'
import { Address } from './AddressSelector'

interface AddressDisplayProps {
  hasUserAddress: boolean
  selectedAddress: Address | null
  tieredShipping: TieredShippingInfo | null
  onChangeAddress: () => void
}

export default function AddressDisplay({
  hasUserAddress,
  selectedAddress,
  tieredShipping,
  onChangeAddress
}: AddressDisplayProps) {
  if (!hasUserAddress || !selectedAddress) return null

  return (
    <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold text-blue-900">Delivery Address</h3>
        <div className="flex gap-2">
          <button
            onClick={onChangeAddress}
            className="text-sm text-blue-600 hover:text-blue-700 font-medium flex items-center gap-1"
          >
            <Edit className="w-3 h-3" />
            Change
          </button>
        </div>
      </div>
      
      <div className="bg-white rounded-lg p-4 border">
        <div className="flex items-start gap-3">
          <MapPin className="w-5 h-5 text-blue-600 mt-1" />
          <div className="flex-1">
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
      </div>


    </div>
  )
}
