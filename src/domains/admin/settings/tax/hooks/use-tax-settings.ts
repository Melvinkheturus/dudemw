import { useState, useEffect } from "react"
import { createClient } from "@/lib/supabase/client"
import { toast } from "sonner"
import type { TaxSettings, CategoryTaxRule, Category } from "../types"
import { SettingsClientService } from "@/lib/services/settings-client"

export function useTaxSettings() {
  const [isLoading, setIsLoading] = useState(false)
  const [isFetching, setIsFetching] = useState(true)
  const [categories, setCategories] = useState<Category[]>([])
  const [taxSettings, setTaxSettings] = useState<TaxSettings>({
    tax_enabled: true,
    price_includes_tax: true,
    default_gst_rate: 18,
    store_state: "Tamil Nadu",
    gstin: ""
  })
  const [categoryRules, setCategoryRules] = useState<CategoryTaxRule[]>([])

  // Fetch initial data
  useEffect(() => {
    async function fetchData() {
      try {
        const supabase = createClient()

        // Fetch tax settings via API
        const settingsResult = await SettingsClientService.getTaxSettings()

        if (settingsResult.success && settingsResult.data) {
          const s = settingsResult.data
          setTaxSettings({
            id: s.id,
            tax_enabled: s.tax_enabled ?? true,
            price_includes_tax: s.price_includes_tax ?? true,
            default_gst_rate: s.default_gst_rate ?? 18,
            store_state: s.store_state ?? "Tamil Nadu",
            gstin: s.gstin ?? ""
          })
        }

        // Fetch categories
        const { data: cats } = await supabase
          .from('categories')
          .select('id, name')
          .order('name')

        if (cats) {
          setCategories(cats)
        }

        // Fetch category tax rules
        const { data: rules } = await supabase
          .from('category_tax_rules')
          .select(`
            id,
            category_id,
            gst_rate,
            categories(name)
          `)

        if (rules) {
          setCategoryRules(rules.map((r: any) => ({
            id: r.id,
            category_id: r.category_id,
            category_name: r.categories?.name || 'Unknown',
            gst_rate: r.gst_rate
          })))
        }
      } catch (error) {
        console.error('Failed to fetch tax settings:', error)
      } finally {
        setIsFetching(false)
      }
    }

    fetchData()
  }, [])

  const saveTaxSettings = async () => {
    setIsLoading(true)
    try {
      const payload: any = {
        tax_enabled: taxSettings.tax_enabled,
        default_gst_rate: taxSettings.default_gst_rate,
        price_includes_tax: taxSettings.price_includes_tax,
        store_state: taxSettings.store_state,
        gstin: taxSettings.gstin,
      }

      if (taxSettings.id) {
        // Update existing
        const result = await SettingsClientService.updateTaxSettings(taxSettings.id, payload)
        if (!result.success) throw new Error(result.error)
      } else {
        // This case shouldn't happen often as GET usually creates default, 
        // but if ID is missing we can't update via PUT easily without ID.
        // For now, assume ID exists or handle create logic if needed.
        throw new Error('Tax settings ID is missing')
      }

      toast.success('Tax settings saved successfully')
    } catch (error: any) {
      console.error('Failed to save tax settings:', error)
      toast.error(error.message || 'Failed to save tax settings')
    } finally {
      setIsLoading(false)
    }
  }

  return {
    taxSettings,
    setTaxSettings,
    categoryRules,
    setCategoryRules,
    categories,
    isLoading,
    isFetching,
    saveTaxSettings
  }
}