"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { Plus, X } from "lucide-react"

interface ProductFormData {
  name: string
  subtitle: string
  description: string
  highlights: string[]
  status: "draft" | "active" | "archived"
}

interface GeneralTabProps {
  formData: ProductFormData
  onFormDataChange: (updates: Partial<ProductFormData>) => void
}

export function GeneralTab({ formData, onFormDataChange }: GeneralTabProps) {
  const addHighlight = () => {
    onFormDataChange({
      highlights: [...formData.highlights, ""]
    })
  }

  const updateHighlight = (index: number, value: string) => {
    const newHighlights = [...formData.highlights]
    newHighlights[index] = value
    onFormDataChange({ highlights: newHighlights })
  }

  const removeHighlight = (index: number) => {
    onFormDataChange({
      highlights: formData.highlights.filter((_, i) => i !== index)
    })
  }

  return (
    <div className="space-y-6">
      {/* Product Identity */}
      <Card className="border-0 shadow-sm bg-gradient-to-b from-white to-red-50 dark:from-gray-900 dark:to-red-950/20 border-red-100/50 dark:border-red-900/20 hover:shadow-md transition-all duration-200">
        <CardHeader>
          <CardTitle className="text-xl font-bold text-gray-900 dark:text-white">Product Identity</CardTitle>
          <CardDescription className="text-gray-600 dark:text-gray-400">
            Define what the product is and how it's described
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Product Name *</Label>
            <Input
              id="name"
              placeholder="e.g., Oversized Cotton Hoodie"
              value={formData.name}
              onChange={(e) => onFormDataChange({ name: e.target.value })}
              className="w-full"
            />
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Used everywhere - keep it clear and descriptive
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="subtitle">Product Subtitle</Label>
            <Input
              id="subtitle"
              placeholder="e.g., Winter essential, relaxed fit"
              value={formData.subtitle}
              onChange={(e) => onFormDataChange({ subtitle: e.target.value })}
              className="w-full"
            />
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Short tagline used in cards and banners
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description *</Label>
            <Textarea
              id="description"
              placeholder="Describe your product - fit, fabric, wash care, return notes..."
              value={formData.description}
              onChange={(e) => onFormDataChange({ description: e.target.value })}
              rows={6}
              className="w-full"
            />
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Rich text editor will be added here for bold, lists, paragraphs
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Product Highlights */}
      <Card className="border-0 shadow-sm bg-gradient-to-b from-white to-red-50 dark:from-gray-900 dark:to-red-950/20 border-red-100/50 dark:border-red-900/20 hover:shadow-md transition-all duration-200">
        <CardHeader>
          <CardTitle className="text-xl font-bold text-gray-900 dark:text-white">Product Highlights</CardTitle>
          <CardDescription className="text-gray-600 dark:text-gray-400">
            Key features for PDP highlights, SEO snippets, and mobile UX
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-3">
            {formData.highlights.map((highlight, index) => (
              <div key={index} className="flex items-center space-x-2">
                <Input
                  placeholder="e.g., 100% Cotton, Pre-shrunk, Made in India"
                  value={highlight}
                  onChange={(e) => updateHighlight(index, e.target.value)}
                  className="flex-1"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={() => removeHighlight(index)}
                  className="text-red-600 hover:text-red-700 hover:bg-red-50"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ))}
            <Button
              type="button"
              variant="outline"
              onClick={addHighlight}
              className="w-full"
            >
              <Plus className="mr-2 h-4 w-4" />
              Add Highlight
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Product Status */}
      <Card className="border-0 shadow-sm bg-gradient-to-b from-white to-red-50 dark:from-gray-900 dark:to-red-950/20 border-red-100/50 dark:border-red-900/20 hover:shadow-md transition-all duration-200">
        <CardHeader>
          <CardTitle className="text-xl font-bold text-gray-900 dark:text-white">Product Status</CardTitle>
          <CardDescription className="text-gray-600 dark:text-gray-400">
            Control product visibility and availability
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="status">Status</Label>
            <Select value={formData.status} onValueChange={(value: "draft" | "active" | "archived") => onFormDataChange({ status: value })}>
              <SelectTrigger className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="draft">Draft</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="archived">Archived</SelectItem>
              </SelectContent>
            </Select>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Default is Draft - publish when ready
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
