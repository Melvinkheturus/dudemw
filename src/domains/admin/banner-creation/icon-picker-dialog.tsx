"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { 
  Search,
  Truck,
  DollarSign,
  Zap,
  Target,
  Flame,
  Sparkles,
  PartyPopper,
  Trophy,
  Star,
  Package,
  Gem,
  Rocket,
  Gift,
  Percent,
  Bell,
  Rainbow,
  Heart,
  Calendar,
  Tag,
  CreditCard,
  ShoppingBag,
  Clock,
  Shield,
  Award,
  Megaphone,
  TrendingUp,
  Smile
} from "lucide-react"

interface IconPickerDialogProps {
  selectedIcon?: string
  onIconSelect: (icon: string) => void
  children: React.ReactNode
}

const AVAILABLE_ICONS = [
  { icon: "", label: "None", component: null },
  { icon: "truck", label: "Shipping", component: Truck },
  { icon: "dollar-sign", label: "Discount", component: DollarSign },
  { icon: "zap", label: "Fast", component: Zap },
  { icon: "target", label: "Target", component: Target },
  { icon: "flame", label: "Hot Deal", component: Flame },
  { icon: "sparkles", label: "New", component: Sparkles },
  { icon: "party-popper", label: "Sale", component: PartyPopper },
  { icon: "trophy", label: "Premium", component: Trophy },
  { icon: "star", label: "Featured", component: Star },
  { icon: "package", label: "Product", component: Package },
  { icon: "gem", label: "Luxury", component: Gem },
  { icon: "rocket", label: "Launch", component: Rocket },
  { icon: "gift", label: "Gift", component: Gift },
  { icon: "percent", label: "Percentage", component: Percent },
  { icon: "bell", label: "Alert", component: Bell },
  { icon: "rainbow", label: "Colorful", component: Rainbow },
  { icon: "heart", label: "Special", component: Heart },
  { icon: "calendar", label: "Event", component: Calendar },
  { icon: "tag", label: "Tag", component: Tag },
  { icon: "credit-card", label: "Payment", component: CreditCard },
  { icon: "shopping-bag", label: "Shopping", component: ShoppingBag },
  { icon: "clock", label: "Limited Time", component: Clock },
  { icon: "shield", label: "Guarantee", component: Shield },
  { icon: "award", label: "Award", component: Award },
  { icon: "megaphone", label: "Announcement", component: Megaphone },
  { icon: "trending-up", label: "Trending", component: TrendingUp }
]

export function IconPickerDialog({ selectedIcon, onIconSelect, children }: IconPickerDialogProps) {
  const [open, setOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")

  const handleIconSelect = (icon: string) => {
    onIconSelect(icon)
    setOpen(false)
  }

  const filteredIcons = AVAILABLE_ICONS.filter(iconOption =>
    iconOption.label.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const getSelectedIconComponent = () => {
    const selectedIconData = AVAILABLE_ICONS.find(icon => icon.icon === selectedIcon)
    return selectedIconData?.component
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="sm:max-w-lg max-h-[80vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <Sparkles className="w-5 h-5 text-red-600" />
            <span>Choose an Icon</span>
          </DialogTitle>
          <DialogDescription>
            Select an icon to display with your marquee message
          </DialogDescription>
        </DialogHeader>
        
        {/* Search Input */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <Input
            placeholder="Search icons..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>

        {/* Icons Grid */}
        <div className="flex-1 overflow-y-auto">
          <div className="grid grid-cols-6 gap-3 py-4">
            {filteredIcons.map((iconOption) => {
              const IconComponent = iconOption.component
              return (
                <button
                  key={iconOption.icon}
                  type="button"
                  onClick={() => handleIconSelect(iconOption.icon)}
                  className={`p-3 rounded-lg border-2 transition-all hover:scale-110 group ${
                    selectedIcon === iconOption.icon
                      ? "border-red-500 bg-red-500 text-white"
                      : "border-gray-200 hover:border-red-300 bg-white hover:bg-red-50"
                  }`}
                  title={iconOption.label}
                >
                  {IconComponent ? (
                    <IconComponent className={`w-5 h-5 mx-auto ${
                      selectedIcon === iconOption.icon 
                        ? "text-white" 
                        : "text-gray-600 group-hover:text-red-600"
                    }`} />
                  ) : (
                    <span className="text-xs text-gray-400">None</span>
                  )}
                </button>
              )
            })}
          </div>
          
          {filteredIcons.length === 0 && (
            <div className="text-center py-8">
              <Search className="w-8 h-8 text-gray-300 mx-auto mb-2" />
              <p className="text-sm text-gray-500">No icons found matching "{searchQuery}"</p>
            </div>
          )}
        </div>

        {/* Selected Icon Preview */}
        {selectedIcon && (
          <div className="border-t pt-4">
            <div className="flex items-center justify-between p-3 bg-red-50 rounded-lg border border-red-200">
              <span className="text-sm font-medium text-red-800">Selected Icon:</span>
              <div className="flex items-center space-x-2">
                {(() => {
                  const SelectedIconComponent = getSelectedIconComponent()
                  return SelectedIconComponent ? (
                    <SelectedIconComponent className="w-4 h-4 text-red-600" />
                  ) : (
                    <span className="text-xs text-gray-400">None</span>
                  )
                })()}
                <span className="text-sm text-red-700">
                  {AVAILABLE_ICONS.find(icon => icon.icon === selectedIcon)?.label || "None"}
                </span>
              </div>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}