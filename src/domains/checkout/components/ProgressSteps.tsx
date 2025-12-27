'use client'

interface ProgressStepsProps {
  currentStep: 'shipping' | 'review' | 'payment'
  hasUserAddress: boolean
}

export default function ProgressSteps({ currentStep, hasUserAddress }: ProgressStepsProps) {
  return (
    <div className="mb-8 flex items-center justify-between">
      {!hasUserAddress && (
        <div className={`flex-1 text-center ${currentStep === 'shipping' ? 'font-bold' : 'text-gray-400'}`}>
          1. Shipping Details
        </div>
      )}
      <div className={`flex-1 text-center ${currentStep === 'review' ? 'font-bold' : 'text-gray-400'}`}>
        {hasUserAddress ? '1. Review Order' : '2. Review Order'}
      </div>
      <div className={`flex-1 text-center ${currentStep === 'payment' ? 'font-bold' : 'text-gray-400'}`}>
        {hasUserAddress ? '2. Place Order' : '3. Place Order'}
      </div>
    </div>
  )
}
