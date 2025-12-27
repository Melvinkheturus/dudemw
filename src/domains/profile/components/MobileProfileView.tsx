'use client'

import { Package, Heart, MapPin, Settings, ChevronRight, Clock } from 'lucide-react'
import Link from 'next/link'
import { ProfileSection } from '../types'

interface MobileProfileViewProps {
  userName?: string
  onSectionChange: (section: ProfileSection) => void
  onLogout: () => void
}

export default function MobileProfileView({
  userName,
  onSectionChange,
  onLogout,
}: MobileProfileViewProps) {
  const menuItems = [
    { id: 'orders' as ProfileSection, label: 'My Orders', icon: Package },
    { id: 'wishlist' as ProfileSection, label: 'My Wishlist', icon: Heart },
    { id: 'addresses' as ProfileSection, label: 'Saved Addresses', icon: MapPin },
    { id: 'settings' as ProfileSection, label: 'Account Settings', icon: Settings },
  ]

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Header */}
      <div className="bg-white px-6 py-8">
        <h1 className="text-3xl font-bold text-gray-900">Hi, {userName || 'Guest'}</h1>
      </div>

      {/* Menu Items */}
      <div className="px-4 py-4 space-y-3">
        {menuItems.map((item) => {
          const Icon = item.icon
          return (
            <button
              key={item.id}
              onClick={() => onSectionChange(item.id)}
              className="w-full bg-white rounded-2xl p-5 flex items-center justify-between shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center">
                  <Icon className="w-6 h-6 text-gray-700" />
                </div>
                <span className="text-lg font-medium text-gray-900">{item.label}</span>
              </div>
              <ChevronRight className="w-5 h-5 text-gray-400" />
            </button>
          )
        })}
      </div>

      {/* Logout Button */}
      <div className="px-4 mt-6">
        <button
          onClick={onLogout}
          className="w-full bg-red-600 text-white py-4 rounded-2xl font-semibold text-lg hover:bg-red-700 transition-colors shadow-sm"
        >
          Logout
        </button>
      </div>
    </div>
  )
}
