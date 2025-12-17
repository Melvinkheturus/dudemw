'use client'

import { ProfileSection } from '../types'
import { Package, Heart, MapPin, Settings, LogOut, Search, User } from 'lucide-react'

interface ProfileSidebarProps {
  activeSection: ProfileSection
  onSectionChange: (section: ProfileSection) => void
  onLogout: () => void
  isGuest?: boolean
  userName?: string
  userEmail?: string
}

export default function ProfileSidebar({
  activeSection,
  onSectionChange,
  onLogout,
  isGuest = false,
  userName,
  userEmail
}: ProfileSidebarProps) {
  const menuItems = isGuest
    ? [
        { id: 'track-order' as ProfileSection, label: 'Track Order', icon: Search }
      ]
    : [
        { id: 'orders' as ProfileSection, label: 'My Orders', icon: Package },
        { id: 'track-order' as ProfileSection, label: 'Track Order', icon: Search },
        { id: 'wishlist' as ProfileSection, label: 'My Wishlist', icon: Heart },
        { id: 'addresses' as ProfileSection, label: 'Saved Addresses', icon: MapPin },
        { id: 'settings' as ProfileSection, label: 'Account Settings', icon: Settings }
      ]

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
      {/* User Profile Header */}
      {!isGuest && (
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center">
              <User className="w-6 h-6 text-gray-600" />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-gray-900 truncate">
                Hi {userName || 'User'}!
              </h3>
              {userEmail && (
                <p className="text-sm text-gray-500 truncate">{userEmail}</p>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Navigation Menu */}
      <nav className="p-2">
        {menuItems.map((item) => {
          const Icon = item.icon
          const isActive = activeSection === item.id
          
          return (
            <button
              key={item.id}
              onClick={() => onSectionChange(item.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-all ${
                isActive
                  ? 'bg-pink-50 text-pink-600'
                  : 'hover:bg-gray-50 text-gray-700'
              }`}
            >
              <Icon className="w-5 h-5" />
              <span className="font-medium">{item.label}</span>
            </button>
          )
        })}
      </nav>
      
      {/* Logout Button */}
      {!isGuest && (
        <div className="p-2 border-t border-gray-200">
          <button
            onClick={onLogout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left text-red-600 hover:bg-red-50 transition-all"
          >
            <LogOut className="w-5 h-5" />
            <span className="font-medium">Logout</span>
          </button>
        </div>
      )}
    </div>
  )
}
