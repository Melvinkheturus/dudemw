"use client"

import { useState } from "react"

export default function PincodeChecker() {
  const [pincode, setPincode] = useState("")
  const [isChecking, setIsChecking] = useState(false)
  const [result, setResult] = useState<{
    available: boolean
    deliveryDays?: number
    message: string
  } | null>(null)

  const handleCheck = async () => {
    if (pincode.length !== 6) {
      setResult({ available: false, message: "Please enter valid 6-digit pincode" })
      return
    }

    setIsChecking(true)
    
    try {
      // TODO: Integrate with actual pincode API (Shiprocket/Delhivery)
      // For now, show that pincode checking needs to be configured
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      setResult({
        available: false,
        message: "Pincode verification service not configured. Please contact support."
      })
    } catch (error) {
      setResult({
        available: false,
        message: "Unable to check pincode. Please try again later."
      })
    } finally {
      setIsChecking(false)
    }
  }

  return (
    <div className="rounded border border-gray-300 p-4">
      <h3 className="mb-3 font-heading text-lg tracking-wider text-black">
        CHECK DELIVERY
      </h3>
      
      <div className="flex gap-2">
        <input
          type="text"
          placeholder="Enter Pincode"
          value={pincode}
          onChange={(e) => {
            const value = e.target.value.replace(/\D/g, "").slice(0, 6)
            setPincode(value)
            setResult(null)
          }}
          className="flex-1 border border-gray-300 px-3 py-2 font-body text-sm focus:border-brand-red focus:outline-none"
        />
        <button
          onClick={handleCheck}
          disabled={isChecking || pincode.length !== 6}
          className="bg-black px-4 py-2 font-heading text-sm tracking-wider text-white transition-colors hover:bg-brand-red disabled:opacity-50"
        >
          {isChecking ? "..." : "CHECK"}
        </button>
      </div>

      {result && (
        <div
          className={`mt-3 text-sm font-body ${
            result.available ? "text-green-600" : "text-red-600"
          }`}
        >
          {result.available && "✓ "}{result.message}
        </div>
      )}
    </div>
  )
}
