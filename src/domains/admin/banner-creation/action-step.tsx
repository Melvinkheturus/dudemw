"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { ExternalLink, Package, Layers, Tag, FolderTree, AlertCircle } from "lucide-react"
import { useState, useEffect } from "react"
import { createClient } from "@/lib/supabase/client"

type ActionType = "collection" | "category" | "product" | "external"

interface Category {
  id: string
  name: string
  slug: string
}

interface ActionStepProps {
  actionType?: ActionType
  actionTarget: string
  actionName?: string
  category?: string
  placement?: string
  onActionTypeChange: (type: ActionType) => void
  onActionTargetChange: (target: string) => void
  onActionNameChange?: (name: string) => void
  onCategoryChange?: (category: string) => void
}

const actionOptions = [
  { id: "collection" as ActionType, title: "Link to Collection", icon: Layers },
  { id: "category" as ActionType, title: "Link to Category", icon: Tag },
  { id: "product" as ActionType, title: "Link to Product", icon: Package },
  { id: "external" as ActionType, title: "External URL", icon: ExternalLink }
]

export function ActionStep({ actionType, actionTarget, actionName, category, placement, onActionTypeChange, onActionTargetChange, onActionNameChange, onCategoryChange }: ActionStepProps) {
  const isCategoryBanner = placement === "category-banner"
  const [categories, setCategories] = useState<Category[]>([])
  const [isLoadingCategories, setIsLoadingCategories] = useState(false)

  // Fetch categories from database
  useEffect(() => {
    const fetchCategories = async () => {
      setIsLoadingCategories(true)
      try {
        const supabase = createClient()
        const { data, error } = await supabase
          .from('categories')
          .select('id, name, slug')
          .order('name')
        
        if (error) {
          console.error('Error fetching categories:', error)
        } else {
          setCategories(data || [])
        }
      } catch (error) {
        console.error('Error fetching categories:', error)
      } finally {
        setIsLoadingCategories(false)
      }
    }

    fetchCategories()
  }, [])
  
  return (
    <div className="space-y-6">
      <Card className="border-0 shadow-sm bg-gradient-to-b from-white to-red-50 border-red-100/50 hover:shadow-md transition-all duration-200">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2 text-xl font-bold text-gray-900">
            {isCategoryBanner ? <FolderTree className="h-5 w-5" /> : <ExternalLink className="h-5 w-5" />}
            <span>Where does the banner go?</span>
          </CardTitle>
          <CardDescription className="text-gray-600">
            {isCategoryBanner ? "Select which category page this banner will appear on" : "Define what happens when users click the banner"}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Category Selection for Category Banners */}
          {isCategoryBanner ? (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="category">Category *</Label>
                <Select value={category} onValueChange={onCategoryChange} disabled={isLoadingCategories}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder={isLoadingCategories ? "Loading categories..." : "Select a category"} />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.length > 0 ? (
                      categories.map((cat) => (
                        <SelectItem key={cat.id} value={cat.slug}>
                          {cat.name}
                        </SelectItem>
                      ))
                    ) : (
                      <SelectItem value="loading" disabled>
                        {isLoadingCategories ? "Loading..." : "No categories found"}
                      </SelectItem>
                    )}
                  </SelectContent>
                </Select>
                <p className="text-xs text-gray-500">
                  The banner will appear at the top of the selected category page
                </p>
              </div>

              {/* Warning about existing banners */}
              <div className="flex items-start space-x-3 p-4 bg-amber-50 border border-amber-200 rounded-lg">
                <AlertCircle className="h-5 w-5 text-amber-600 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-amber-800">
                    Important Note
                  </p>
                  <p className="text-xs text-amber-700 mt-1">
                    Only one active banner per category is allowed. If there's already an active banner for this category, it will be replaced when you publish this one.
                  </p>
                </div>
              </div>

              {/* Preview of where banner will appear */}

            </div>
          ) : (
            /* Action Selection for Carousel Banners */
            <>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 w-full">
                {actionOptions.map((option) => {
                  const Icon = option.icon
                  return (
                    <div
                      key={option.id}
                      className={`p-4 rounded-xl border-2 cursor-pointer transition-all duration-200 ${
                        actionType === option.id
                          ? "border-red-500 bg-red-50"
                          : "border-gray-200 hover:border-gray-300"
                      }`}
                      onClick={() => {
                        onActionTypeChange(option.id)
                        onActionTargetChange("")
                      }}
                    >
                      <div className="text-center">
                        <div className={`inline-flex p-3 rounded-lg mb-3 ${
                          actionType === option.id
                            ? "bg-red-100"
                            : "bg-gray-100"
                        }`}>
                          <Icon className={`h-6 w-6 ${
                            actionType === option.id
                              ? "text-red-600"
                              : "text-gray-600"
                          }`} />
                        </div>
                        <h3 className="font-medium text-gray-900 text-sm">{option.title}</h3>
                      </div>
                    </div>
                  )
                })}
              </div>

              {actionType && (
                <div className="space-y-4 p-4 bg-gray-50 rounded-lg">
                  {actionType === "collection" && (
                    <div className="space-y-2">
                      <Label htmlFor="collectionTarget">Select Collection *</Label>
                      <Select value={actionTarget} onValueChange={(value) => {
                        onActionTargetChange(value)
                        if (onActionNameChange) {
                          const names: Record<string, string> = {
                            "winter-collection": "Winter Collection",
                            "new-arrivals": "New Arrivals",
                            "best-sellers": "Best Sellers",
                            "holiday-collection": "Holiday Collection"
                          }
                          onActionNameChange(names[value] || value)
                        }
                      }}>
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
                    </div>
                  )}

                  {actionType === "category" && (
                    <div className="space-y-2">
                      <Label htmlFor="categoryTarget">Select Category *</Label>
                      <Select value={actionTarget} onValueChange={(value) => {
                        onActionTargetChange(value)
                        if (onActionNameChange) {
                          const selectedCategory = categories.find(cat => cat.slug === value)
                          onActionNameChange(selectedCategory?.name || value)
                        }
                      }} disabled={isLoadingCategories}>
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder={isLoadingCategories ? "Loading categories..." : "Choose a category"} />
                        </SelectTrigger>
                        <SelectContent>
                          {categories.length > 0 ? (
                            categories.map((cat) => (
                              <SelectItem key={cat.id} value={cat.slug}>
                                {cat.name}
                              </SelectItem>
                            ))
                          ) : (
                            <SelectItem value="loading" disabled>
                              {isLoadingCategories ? "Loading..." : "No categories found"}
                            </SelectItem>
                          )}
                        </SelectContent>
                      </Select>
                    </div>
                  )}

                  {actionType === "product" && (
                    <>
                      <div className="space-y-2">
                        <Label htmlFor="productTarget">Product ID *</Label>
                        <Input
                          id="productTarget"
                          placeholder="Enter product ID..."
                          value={actionTarget}
                          onChange={(e) => onActionTargetChange(e.target.value)}
                          className="w-full"
                        />
                        <p className="text-xs text-gray-500">
                          Enter the product ID
                        </p>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="productName">Product Name *</Label>
                        <Input
                          id="productName"
                          placeholder="Enter product name for display"
                          value={actionName || ""}
                          onChange={(e) => onActionNameChange?.(e.target.value)}
                          className="w-full"
                        />
                      </div>
                    </>
                  )}

                  {actionType === "external" && (
                    <>
                      <div className="space-y-2">
                        <Label htmlFor="urlTarget">External URL *</Label>
                        <Input
                          id="urlTarget"
                          placeholder="https://example.com"
                          value={actionTarget}
                          onChange={(e) => onActionTargetChange(e.target.value)}
                          className="w-full"
                        />
                        <p className="text-xs text-gray-500">
                          Enter the full URL including https://
                        </p>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="linkName">Link Name *</Label>
                        <Input
                          id="linkName"
                          placeholder="e.g., Learn More"
                          value={actionName || ""}
                          onChange={(e) => onActionNameChange?.(e.target.value)}
                          className="w-full"
                        />
                      </div>
                    </>
                  )}
                </div>
              )}
            </>
          )}
        </CardContent>
      </Card>
    </div>
  )
}