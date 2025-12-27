'use client'

import { User } from 'lucide-react'

interface ProfileHeaderProps {
  userName?: string
  userEmail?: string
}

export default function ProfileHeader({ userName, userEmail }: ProfileHeaderProps) {
  return (
    <div className="bg-gradient-to-r from-red-600 to-red-700 text-white p-6 rounded-lg mb-6">
      <div className="flex items-center gap-4">
        <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center">
          <User className="w-8 h-8" />
        </div>
        <div>
          <h1 className="text-2xl font-bold">Hi {userName || 'Guest'}!</h1>
          {userEmail && <p className="text-gray-300 text-sm">{userEmail}</p>}
        </div>
      </div>
    </div>
  )
}
