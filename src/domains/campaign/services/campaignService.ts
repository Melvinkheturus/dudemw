import { Campaign } from '../types'
import { createClient } from '@/lib/supabase/client'

export async function getActiveCampaign(): Promise<Campaign | null> {
  try {
    const supabase = createClient()
    const { data: sections, error } = await supabase
      .from('homepage_sections')
      .select('*')
      .eq('is_active', true)
      .order('position', { ascending: true })

    if (error) {
      console.error('Error fetching homepage sections:', {
        message: error.message,
        details: error.details,
        hint: error.hint,
        code: error.code
      })
      return null
    }

    if (!sections || sections.length === 0) {
      return null
    }

    // Transform homepage_sections to Campaign format
    const campaign: Campaign = {
      id: 'homepage-active',
      name: 'Active Homepage Campaign',
      description: 'Current active homepage layout from admin',
      status: 'active',
      sections: sections.map(section => ({
        id: section.id,
        type: (section.layout as 'hero' | 'product-grid' | 'banner' | 'category-grid' | 'testimonials') || 'banner',
        title: section.title || '',
        subtitle: '', // No subtitle field in database
        enabled: section.is_active || false,
        order: section.position || 0,
        config: {} // No config field in database
      })),
      createdAt: new Date().toISOString().split('T')[0],
      updatedAt: new Date().toISOString().split('T')[0]
    }

    return campaign
  } catch (error) {
    console.error('Error in getActiveCampaign:', error)
    return null
  }
}

export async function getAllCampaigns(): Promise<Campaign[]> {
  try {
    const activeCampaign = await getActiveCampaign()
    return activeCampaign ? [activeCampaign] : []
  } catch (error) {
    console.error('Error in getAllCampaigns:', error)
    return []
  }
}
