"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Save, Upload, Image, AlertTriangle } from "lucide-react"
import Link from "next/link"
import { useParams } from "next/navigation"

// Types (same as create page)
type BannerPlacement = "homepage-carousel" | "product-listing-carousel" | "category-banner"
type ActionType = "collection" | "category" | "product" | "external"

interface BannerFormData {
  id: number
  placement: BannerPlacement
  internalTitle: string
  bannerImage?: File
  ctaText?: string
  position?: number
  category?: string
  actionType: ActionType
  actionTarget: string
  isActive: boolean
  startDate?: string
  endDate?: string
}

// Mock data for editing
const mockBanner: BannerFormData = {
  id: 1,
  placement: "homepage-carousel",
  internalTitle: "Winter Sale – Main Banner",
  ctaText: "Shop Winter Sale",
  position: 1,
  actionType: "collection",
  actionTarget: "winter-collection",
  isActive: true,
  startDate: "2024-12-01",
  endDate: "2024-12-31"
}

export default function EditBannerPage() {
  const params = useParams()
  const bannerId = params.id as string
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState<BannerFormData | null>(null)
  const [hasChanges, setHasChanges] = useState(false)

  useEffect(() => {
    // TODO: Fetch banner data by ID
    setFormData(mockBanner)
  }, [bannerId])

  const updateFormData = (updates: Partial<BannerFormData>) => {
    if (!formData) return
    setFormData(prev => ({ ...prev!, ...updates }))
    setHasChanges(true)
  }

  const handleSubmit = async (isDraft = false) => {
    if (!formData) return
    
    setIsLoading(true)
    
    // TODO: Implement banner update
    console.log("Updating banner:", { ...formData, isDraft })
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000))
    setIsLoading(false)
    setHasChanges(false)
  }

  const getPlacementLabel = (placement: BannerPlacement): string => {
    switch (placement) {
      case "homepage-carousel": return "Homepage Carousel"
      case "product-listing-carousel": return "Product Listing Carousel"
      case "category-banner": return "Category Banner"
    }
  }

  if (!formData) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-600 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Loading banner...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="w-full max-w-full overflow-x-hidden">
      <div className="space-y-6 lg:space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-center space-x-4 min-w-0">
            <Button variant="outline" size="icon" asChild className="flex-shrink-0">
              <Link href="/admin/banners">
                <ArrowLeft className="h-4 w-4" />
              </Link>
            </Button>
            <div className="min-w-0">
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-gray-900 dark:text-white truncate">
                Edit Banner
              </h1>
              <p className="text-sm sm:text-base lg:text-lg text-gray-600 dark:text-gray-400 mt-1 sm:mt-2 truncate">
                {formData.internalTitle}
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-3 flex-shrink-0">
            <Button variant="outline" asChild>
              <Link href="/admin/banners">Cancel</Link>
            </Button>
            <Button 
              variant="outline"
              onClick={() => handleSubmit(true)}
              disabled={isLoading || !hasChanges}
            >
              Save as Draft
            </Button>
            <Button 
              className="bg-red-600 hover:bg-red-700 text-white shadow-lg shadow-red-600/25"
              onClick={() => handleSubmit(false)}
              disabled={isLoading || !hasChanges}
            >
              <Save className="mr-2 h-4 w-4" />
              {isLoading ? "Saving..." : "Save Changes"}
            </Button>
          </div>
        </div>

        {/* Changes Warning */}
        {hasChanges && (
          <Card className="border-orange-200 bg-orange-50 dark:border-orange-800 dark:bg-orange-950/20">
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <AlertTriangle className="h-5 w-5 text-orange-600 dark:text-orange-400" />
                <p className="text-sm text-orange-800 dark:text-orange-200">
                  You have unsaved changes. Don't forget to save your work.
                </p>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Placement Info (Read-only) */}
        <Card className="border-0 shadow-sm bg-gradient-to-b from-white to-red-50 dark:from-gray-900 dark:to-red-950/20 border-red-100/50 dark:border-red-900/20 hover:shadow-md transition-all duration-200">
          <CardHeader>
            <CardTitle className="text-xl font-bold text-gray-900 dark:text-white">Placement</CardTitle>
            <CardDescription className="text-gray-600 dark:text-gray-400">
              Banner placement cannot be changed after creation
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium text-gray-900 dark:text-white">{getPlacementLabel(formData.placement)}</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                    {formData.placement === "homepage-carousel" && "Large rotating banners on homepage"}
                    {formData.placement === "product-listing-carousel" && "Carousel above/between product grids"}
                    {formData.placement === "category-banner" && "Single banner per category"}
                  </p>
                </div>
                <Badge variant="secondary">Locked</Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Content Section */}
        <Card className="border-0 shadow-sm bg-gradient-to-b from-white to-red-50 dark:from-gray-900 dark:to-red-950/20 border-red-100/50 dark:border-red-900/20 hover:shadow-md transition-all duration-200">
          <CardHeader>
            <CardTitle className="text-xl font-bold text-gray-900 dark:text-white">Banner Content</CardTitle>
            <CardDescription className="text-gray-600 dark:text-gray-400">
              Update banner details and image
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="internalTitle">Internal Title *</Label>
              <Input
                id="internalTitle"
                placeholder="e.g., Winter Sale – Main Banner"
                value={formData.internalTitle}
                onChange={(e) => updateFormData({ internalTitle: e.target.value })}
                className="w-full"
              />
            </div>

            <div className="space-y-2">
              <Label>Banner Image</Label>
              <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-8 text-center">
                <div className="w-full h-24 bg-gray-200 dark:bg-gray-700 rounded-lg flex items-center justify-center mb-4">
                  <div className="text-center">
                    <Image className="mx-auto h-8 w-8 text-gray-400 mb-2" />
                    <p className="text-sm text-gray-500 dark:text-gray-400">Current Banner</p>
                  </div>
                </div>
                <Button variant="outline" onClick={() => document.getElementById('banner-upload')?.click()}>
                  <Upload className="mr-2 h-4 w-4" />
                  Replace Image
                </Button>
                <input
                  id="banner-upload"
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => {
                    const file = e.target.files?.[0]
                    if (file) updateFormData({ bannerImage: file })
                  }}
                />
                <p className="text-xs text-gray-400 mt-2">PNG, JPG up to 10MB</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Placement-Specific Fields */}
        {(formData.placement === "homepage-carousel" || formData.placement === "product-listing-carousel") && (
          <Card className="border-0 shadow-sm bg-gradient-to-b from-white to-red-50 dark:from-gray-900 dark:to-red-950/20 border-red-100/50 dark:border-red-900/20 hover:shadow-md transition-all duration-200">
            <CardHeader>
              <CardTitle className="text-xl font-bold text-gray-900 dark:text-white">Carousel Settings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-1 md:grid-cols-2 w-full">
                <div className="space-y-2 min-w-0">
                  <Label htmlFor="ctaText">CTA Text (Optional)</Label>
                  <Input
                    id="ctaText"
                    placeholder="e.g., Shop Winter Sale"
                    value={formData.ctaText || ""}
                    onChange={(e) => updateFormData({ ctaText: e.target.value })}
                    className="w-full"
                  />
                </div>
                <div className="space-y-2 min-w-0">
                  <Label htmlFor="position">Position in Carousel</Label>
                  <Select value={formData.position?.toString()} onValueChange={(value) => updateFormData({ position: parseInt(value) })}>
                    <SelectTrigger className="w-full">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1">1 (First)</SelectItem>
                      <SelectItem value="2">2</SelectItem>
                      <SelectItem value="3">3</SelectItem>
                      <SelectItem value="4">4</SelectItem>
                      <SelectItem value="5">5</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {formData.placement === "category-banner" && (
          <Card className="border-0 shadow-sm bg-gradient-to-b from-white to-red-50 dark:from-gray-900 dark:to-red-950/20 border-red-100/50 dark:border-red-900/20 hover:shadow-md transition-all duration-200">
            <CardHeader>
              <CardTitle className="text-xl font-bold text-gray-900 dark:text-white">Category Settings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="category">Category *</Label>
                <Select value={formData.category} onValueChange={(value) => updateFormData({ category: value })}>
                  <SelectTrigger className="w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Shirts">Shirts</SelectItem>
                    <SelectItem value="Hoodies">Hoodies</SelectItem>
                    <SelectItem value="Pants">Pants</SelectItem>
                    <SelectItem value="Jackets">Jackets</SelectItem>
                    <SelectItem value="Accessories">Accessories</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Action Target */}
        <Card className="border-0 shadow-sm bg-gradient-to-b from-white to-red-50 dark:from-gray-900 dark:to-red-950/20 border-red-100/50 dark:border-red-900/20 hover:shadow-md transition-all duration-200">
          <CardHeader>
            <CardTitle className="text-xl font-bold text-gray-900 dark:text-white">Action Target</CardTitle>
            <CardDescription className="text-gray-600 dark:text-gray-400">
              Where the banner links to when clicked
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="actionType">Action Type</Label>
              <Select value={formData.actionType} onValueChange={(value: ActionType) => updateFormData({ actionType: value, actionTarget: "" })}>
                <SelectTrigger className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="collection">Link to Collection</SelectItem>
                  <SelectItem value="category">Link to Category</SelectItem>
                  <SelectItem value="product">Link to Product</SelectItem>
                  <SelectItem value="external">External URL</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="actionTarget">Target *</Label>
              {formData.actionType === "collection" && (
                <Select value={formData.actionTarget} onValueChange={(value) => updateFormData({ actionTarget: value })}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Choose a collection" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="winter-collection">Winter Collection</SelectItem>
                    <SelectItem value="new-arrivals">New Arrivals</SelectItem>
                    <SelectItem value="best-sellers">Best Sellers</SelectItem>
                    <SelectItem value="holiday-collection">Holiday Collection</SelectItem>
                  </SelectContent>
                </Select>
              )}

              {formData.actionType === "category" && (
                <Select value={formData.actionTarget} onValueChange={(value) => updateFormData({ actionTarget: value })}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Choose a category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="shirts">Shirts</SelectItem>
                    <SelectItem value="hoodies">Hoodies</SelectItem>
                    <SelectItem value="pants">Pants</SelectItem>
                    <SelectItem value="jackets">Jackets</SelectItem>
                    <SelectItem value="accessories">Accessories</SelectItem>
                  </SelectContent>
                </Select>
              )}

              {formData.actionType === "product" && (
                <Input
                  placeholder="Type to search products..."
                  value={formData.actionTarget}
                  onChange={(e) => updateFormData({ actionTarget: e.target.value })}
                  className="w-full"
                />
              )}

              {formData.actionType === "external" && (
                <Input
                  placeholder="https://example.com"
                  value={formData.actionTarget}
                  onChange={(e) => updateFormData({ actionTarget: e.target.value })}
                  className="w-full"
                />
              )}
            </div>
          </CardContent>
        </Card>

        {/* Schedule & Status */}
        <Card className="border-0 shadow-sm bg-gradient-to-b from-white to-red-50 dark:from-gray-900 dark:to-red-950/20 border-red-100/50 dark:border-red-900/20 hover:shadow-md transition-all duration-200">
          <CardHeader>
            <CardTitle className="text-xl font-bold text-gray-900 dark:text-white">Schedule & Status</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center justify-between p-4 rounded-xl bg-white/60 dark:bg-gray-800/60 border border-gray-200/50 dark:border-gray-700/50">
              <div className="space-y-0.5">
                <Label className="text-base font-semibold text-gray-900 dark:text-white">Active Banner</Label>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Enable this banner to make it visible to customers
                </p>
              </div>
              <Switch 
                checked={formData.isActive}
                onCheckedChange={(checked) => updateFormData({ isActive: checked })}
              />
            </div>

            <div className="grid gap-4 sm:grid-cols-1 md:grid-cols-2 w-full">
              <div className="space-y-2 min-w-0">
                <Label htmlFor="startDate">Start Date (Optional)</Label>
                <Input
                  id="startDate"
                  type="date"
                  value={formData.startDate || ""}
                  onChange={(e) => updateFormData({ startDate: e.target.value })}
                  className="w-full"
                />
              </div>
              <div className="space-y-2 min-w-0">
                <Label htmlFor="endDate">End Date (Optional)</Label>
                <Input
                  id="endDate"
                  type="date"
                  value={formData.endDate || ""}
                  onChange={(e) => updateFormData({ endDate: e.target.value })}
                  className="w-full"
                />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}