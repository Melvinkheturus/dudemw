'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/domains/auth/context'
import ProfileHeader from './ProfileHeader'
import ProfileSidebar from './ProfileSidebar'
import GuestWelcome from './GuestWelcome'
import MobileProfileView from './MobileProfileView'
import MobileGuestView from './MobileGuestView'
import DesktopGuestView from './DesktopGuestView'
import OrdersSection from '../sections/OrdersSection'
import WishlistSection from '../sections/WishlistSection'
import AddressesSection from '../sections/AddressesSection'
import SettingsSection from '../sections/SettingsSection'
import TrackOrderSection from '../sections/TrackOrderSection'
import { type ProfileSection } from '@/domains/profile/types'

export default function ProfilePage() {
  const { user, logout, isLoading } = useAuth()
  const [activeSection, setActiveSection] = useState<ProfileSection>('track-order')

  // Update active section when user loads
  useEffect(() => {
    // Allow both guests and logged-in users to access track-order section
    // No automatic switching needed
  }, [user, isLoading, activeSection])

  const renderSection = () => {
    if (!user && activeSection !== 'track-order') {
      return <GuestWelcome />
    }

    switch (activeSection) {
      case 'orders':
        return <OrdersSection />
      case 'wishlist':
        return <WishlistSection />
      case 'addresses':
        return <AddressesSection />
      case 'settings':
        return <SettingsSection />
      case 'track-order':
        return <TrackOrderSection />
      default:
        return <OrdersSection />
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading...</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <>
      {/* Guest View */}
      {!user ? (
        <>
          {/* Mobile Guest View */}
          <div className="lg:hidden">
            <MobileGuestView />
          </div>

          {/* Desktop Guest View */}
          <div className="hidden lg:block">
            <DesktopGuestView />
          </div>
        </>
      ) : (
        <>
          {/* Mobile View - Logged In */}
          <div className="lg:hidden">
            <MobileProfileView
              userName={user.name || user.email}
              onSectionChange={setActiveSection}
              onLogout={logout}
            />
          </div>

          {/* Desktop View - Logged In */}
          <div className="hidden lg:block min-h-screen bg-gray-50 py-8">
            <div className="container mx-auto px-4 max-w-7xl">
              <div className="grid lg:grid-cols-[300px_1fr] gap-6">
                {/* Sidebar - Desktop */}
                <div className="hidden lg:block">
                  <ProfileSidebar
                    activeSection={activeSection}
                    onSectionChange={setActiveSection}
                    onLogout={logout}
                    userName={user.name || user.email}
                    userEmail={user.email}
                  />
                </div>

                {/* Main Content */}
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
                  {renderSection()}
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </>
  )
}
