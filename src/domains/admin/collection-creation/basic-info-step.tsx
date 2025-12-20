"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Badge } from "@/components/ui/badge"

interface Product {
  id: string
  title: string
  handle: string
  price?: number
  product_images?: Array<{
    id: string
    image_url: string
    alt_text?: string
    is_primary: boolean
  }>
}

interface CollectionFormData {
  title: string
  slug: string
  description: string
  is_active: boolean
  selectedProducts: Map<string, Product>
}

interface BasicInfoStepProps {
  formData: CollectionFormData
  onTitleChange: (title: string) => void
  onFormDataChange: (updates: Partial<CollectionFormData>) => void
}

export function BasicInfoStep({ formData, onTitleChange, onFormDataChange }: BasicInfoStepProps) {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            Collection Details
          </CardTitle>
          <CardDescription>
            Set up the basic information for your collection
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Title */}
          <div className="space-y-2">
            <Label htmlFor="title">
              Collection Title <span className="text-red-500">*</span>
            </Label>
            <Input
              id="title"
              placeholder="e.g., Summer Collection, Best Sellers, New Arrivals"
              value={formData.title}
              onChange={(e) => onTitleChange(e.target.value)}
              className="text-base"
            />
            <p className="text-xs text-gray-500">
              This will be displayed as the collection name on your store
            </p>
          </div>

          {/* Auto-generated Slug */}
          <div className="space-y-2">
            <Label htmlFor="slug">Collection URL Slug</Label>
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-500">/collections/</span>
              <Badge variant="secondary" className="font-mono text-xs">
                {formData.slug || 'auto-generated'}
              </Badge>
            </div>
            <p className="text-xs text-gray-500">
              Automatically generated from the title. Used in the collection URL.
            </p>
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="description">
              Description <span className="text-red-500">*</span>
            </Label>
            <Textarea
              id="description"
              placeholder="Describe this collection for your customers..."
              value={formData.description}
              onChange={(e) => onFormDataChange({ description: e.target.value })}
              rows={4}
              className="text-base resize-none"
            />
            <p className="text-xs text-gray-500">
              This description will be shown on the collection page and homepage
            </p>
          </div>

          {/* Active Status */}
          <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
            <div className="space-y-0.5">
              <Label htmlFor="is_active" className="text-base font-medium">
                Active Status
              </Label>
              <p className="text-sm text-gray-500">
                Make this collection visible on your store when published
              </p>
            </div>
            <Switch
              id="is_active"
              checked={formData.is_active}
              onCheckedChange={(checked) => onFormDataChange({ is_active: checked })}
            />
          </div>
        </CardContent>
      </Card>

      {/* Help Card */}
      <Card className="border-blue-200 bg-blue-50/50">
        <CardContent className="pt-6">
          <div className="flex items-start gap-3">
            <div className="w-5 h-5 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0 mt-0.5">
              <span className="text-blue-600 text-xs font-bold">i</span>
            </div>
            <div className="space-y-1">
              <p className="text-sm font-medium text-blue-900">
                Collection Tips
              </p>
              <ul className="text-sm text-blue-800 space-y-1">
                <li>• Use descriptive titles that help customers understand the collection</li>
                <li>• Write engaging descriptions that highlight what makes this collection special</li>
                <li>• You can always edit these details later from the collections page</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}