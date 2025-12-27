'use client'

import { useEffect, useState } from 'react'
import { SectionRenderer } from '@/domains/campaign'
import { getActiveCampaign } from '@/domains/campaign/services/campaignService'
import type { Campaign } from '@/domains/campaign'

export default function DataDrivenHomepage() {
  const [campaign, setCampaign] = useState<Campaign | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function loadCampaign() {
      try {
        setIsLoading(true)
        const activeCampaign = await getActiveCampaign()
        setCampaign(activeCampaign)
      } catch (err) {
        setError('Failed to load homepage content')
        console.error('Error loading campaign:', err)
      } finally {
        setIsLoading(false)
      }
    }

    loadCampaign()
  }, [])

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black mx-auto mb-4"></div>
          <p className="text-gray-600">Loading homepage...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">{error}</p>
          <button 
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800"
          >
            Retry
          </button>
        </div>
      </div>
    )
  }

  if (!campaign) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">No Active Campaign</h1>
          <p className="text-gray-600">Please contact admin to set up homepage content.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="homepage-campaign" data-campaign-id={campaign.id}>
      <SectionRenderer sections={campaign.sections} />
    </div>
  )
}
