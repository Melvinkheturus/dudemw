"use client"

import DesktopNavbar from "./desktop/Navbar"
import MobileNavbar from "./mobile/MobileNavbar"
import BottomNavbar from "./mobile/BottomNavbar"
import OfferBar from "@/domains/homepage/sections/OfferBar"

export default function Navbar() {
  return (
    <>
      {/* Offer Bar - Above everything */}
      <OfferBar />

      {/* Desktop Navbar - Hidden on mobile */}
      <div className="hidden lg:block">
        <DesktopNavbar />
      </div>

      {/* Mobile Top Navbar - Hidden on desktop */}
      <div className="block lg:hidden">
        <MobileNavbar />
      </div>

      {/* Mobile Bottom Navbar - Hidden on desktop */}
      <BottomNavbar />
    </>
  )
}
