"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { CheckCircle, AlertCircle, Image as ImageIcon, Video, ExternalLink } from "lucide-react"
import Image from "next/image"

interface BannerOption {
  id: string
  internal_title: string
  image_url: string
  placement: string
  status: string
}

interface CategoryFormData {
  name: string
  slug: string
  description: string
  homepage_thumbnail_url: string
  homepage_video_url: string
  plp_square_thumbnail_url: string
  banner_source: 'none' | 'existing' | 'create'
  selected_banner_id: string
  meta_title: string
  meta_description: string
  status: 'active' | 'inactive'
  display_order: number
}

interface PreviewStepProps {
  formData: CategoryFormData
  availableBanners: BannerOption[]
}

export function PreviewStep({ formData, availableBanners }: PreviewStepProps) {
  const selectedBanner = availableBanners.find(b => b.id === formData.selected_banner_id)
  
  const validationItems = [
    {
      label: "Category name",
      value: formData.name,
      valid: !!formData.name.trim(),
      required: true
    },
    {
      label: "Description",
      value: formData.description,
      valid: !!formData.description.trim(),
      required: true
    },
    {
      label: "Homepage thumbnail",
      value: formData.homepage_thumbnail_url ? "Uploaded" : "Not uploaded",
      valid: !!formData.homepage_thumbnail_url,
      required: true
    },
    {
      label: "PLP square thumbnail",
      value: formData.plp_square_thumbnail_url ? "Uploaded" : "Not uploaded",
      valid: !!formData.plp_square_thumbnail_url,
      required: true
    },
    {
      label: "Homepage video",
      value: formData.homepage_video_url ? "Uploaded" : "Not uploaded",
      valid: true, // Optional
      required: false
    },
    {
      label: "Banner configuration",
      value: formData.banner_source === 'none' ? "No banner" : 
             formData.banner_source === 'existing' && selectedBanner ? selectedBanner.internal_title :
             formData.banner_source === 'create' ? "Create new banner" : "Not configured",
      valid: formData.banner_source === 'none' || 
             (formData.banner_source === 'existing' && !!selectedBanner) ||
             formData.banner_source === 'create',
      required: false
    }
  ]

  const allRequiredValid = validationItems.filter(item => item.required).every(item => item.valid)

  return (
    <div className="space-y-6">
      {/* Validation Summary */}
      <Card className="border-0 shadow-sm bg-gradient-to-br from-white to-gray-50/50">
        <CardHeader className="pb-4">
          <div className="flex items-center space-x-2">
            {allRequiredValid ? (
              <CheckCircle className="h-5 w-5 text-green-600" />
            ) : (
              <AlertCircle className="h-5 w-5 text-amber-600" />
            )}
            <CardTitle className="text-xl font-semibold text-gray-900">
              {allRequiredValid ? "Ready to Create" : "Review Required Fields"}
            </CardTitle>
          </div>
          <p className="text-sm text-gray-600">
            {allRequiredValid 
              ? "All required information has been provided. Review the details below."
              : "Please complete the required fields before creating the category."
            }
          </p>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {validationItems.map((item, index) => (
              <div key={index} className="flex items-center space-x-3 p-3 rounded-lg bg-gray-50/50">
                {item.valid ? (
                  <CheckCircle className="h-4 w-4 text-green-600 flex-shrink-0" />
                ) : (
                  <AlertCircle className="h-4 w-4 text-amber-600 flex-shrink-0" />
                )}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center space-x-2">
                    <span className="text-sm font-medium text-gray-700">{item.label}</span>
                    {item.required && (
                      <Badge variant="secondary" className="text-xs">Required</Badge>
                    )}
                  </div>
                  <p className="text-xs text-gray-500 truncate">{item.value}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Category Preview */}
      <Card className="border-0 shadow-sm bg-gradient-to-br from-white to-gray-50/50">
        <CardHeader className="pb-4">
          <CardTitle className="text-xl font-semibold text-gray-900">Category Preview</CardTitle>
          <p className="text-sm text-gray-600">How your category will appear to customers</p>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Basic Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-3">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">{formData.name || "Category Name"}</h3>
                <p className="text-sm text-gray-500">/{formData.slug || "category-slug"}</p>
              </div>
              <p className="text-sm text-gray-700">{formData.description || "Category description will appear here..."}</p>
              <div className="flex items-center space-x-4">
                <Badge variant={formData.status === 'active' ? 'default' : 'secondary'}>
                  {formData.status}
                </Badge>
                <span className="text-xs text-gray-500">Order: {formData.display_order}</span>
              </div>
            </div>
            
            {/* Media Preview */}
            <div className="space-y-4">
              {formData.homepage_thumbnail_url && (
                <div>
                  <h4 className="text-sm font-medium text-gray-700 mb-2">Homepage Thumbnail</h4>
                  <Image
                    src={formData.homepage_thumbnail_url}
                    alt="Homepage thumbnail"
                    width={200}
                    height={120}
                    className="rounded-lg object-cover border"
                  />
                </div>
              )}
              
              {formData.plp_square_thumbnail_url && (
                <div>
                  <h4 className="text-sm font-medium text-gray-700 mb-2">PLP Square Thumbnail</h4>
                  <Image
                    src={formData.plp_square_thumbnail_url}
                    alt="PLP square thumbnail"
                    width={120}
                    height={120}
                    className="rounded-lg object-cover border"
                  />
                </div>
              )}
            </div>
          </div>

          {/* Banner Preview */}
          {formData.banner_source !== 'none' && (
            <div className="border-t pt-6">
              <h4 className="text-sm font-medium text-gray-700 mb-3">Banner Configuration</h4>
              {formData.banner_source === 'existing' && selectedBanner ? (
                <div className="flex items-start space-x-3 p-3 border border-gray-200 rounded-lg bg-gray-50/50">
                  <Image
                    src={selectedBanner.image_url}
                    alt={selectedBanner.internal_title}
                    width={80}
                    height={50}
                    className="rounded object-cover flex-shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <h5 className="text-sm font-medium text-gray-900">{selectedBanner.internal_title}</h5>
                    <p className="text-xs text-gray-500">Existing banner • {selectedBanner.status}</p>
                  </div>
                </div>
              ) : formData.banner_source === 'create' ? (
                <div className="flex items-center space-x-3 p-3 border border-green-200 rounded-lg bg-green-50/50">
                  <ExternalLink className="h-8 w-8 text-green-600 flex-shrink-0" />
                  <div>
                    <h5 className="text-sm font-medium text-gray-900">New banner will be created</h5>
                    <p className="text-xs text-gray-500">Banner creation wizard will open after category is saved</p>
                  </div>
                </div>
              ) : null}
            </div>
          )}

          {/* SEO Preview */}
          {(formData.meta_title || formData.meta_description) && (
            <div className="border-t pt-6">
              <h4 className="text-sm font-medium text-gray-700 mb-3">SEO Settings</h4>
              <div className="space-y-2">
                {formData.meta_title && (
                  <div>
                    <span className="text-xs text-gray-500">Meta Title:</span>
                    <p className="text-sm text-gray-900">{formData.meta_title}</p>
                  </div>
                )}
                {formData.meta_description && (
                  <div>
                    <span className="text-xs text-gray-500">Meta Description:</span>
                    <p className="text-sm text-gray-700">{formData.meta_description}</p>
                  </div>
                )}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}