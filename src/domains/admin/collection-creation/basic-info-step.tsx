"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"

import type { CollectionFormData } from './types'

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
    </div>
  )
}