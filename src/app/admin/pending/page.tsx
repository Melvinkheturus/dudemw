'use client'

import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Shield, Clock, AlertCircle, LogOut } from 'lucide-react'
import { useState } from 'react'

export default function AdminPendingPage() {
  const router = useRouter()
  const supabase = createClient()
  const [isLoggingOut, setIsLoggingOut] = useState(false)

  const handleLogout = async () => {
    setIsLoggingOut(true)
    try {
      await supabase.auth.signOut()
      router.push('/admin/login')
      router.refresh()
    } catch (error) {
      console.error('Logout error:', error)
      setIsLoggingOut(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Header Badge */}
        <div className="flex justify-center mb-6">
          <div className="bg-yellow-600 text-white px-4 py-2 rounded-full flex items-center gap-2">
            <Shield className="w-5 h-5" />
            <span className="font-semibold">Admin Portal</span>
          </div>
        </div>

        {/* Pending Card */}
        <div className="bg-white rounded-2xl shadow-2xl p-8">
          {/* Icon */}
          <div className="w-20 h-20 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <Clock className="w-12 h-12 text-yellow-600" />
          </div>

          {/* Header */}
          <div className="text-center mb-6">
            <h1 className="text-3xl font-bold text-gray-900 mb-3">
              Access Pending
            </h1>
            <p className="text-gray-600 text-lg">
              Your admin account is awaiting approval
            </p>
          </div>

          {/* Info Box */}
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
            <div className="flex gap-3">
              <AlertCircle className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
              <div className="text-sm text-yellow-900">
                <p className="font-medium mb-2">What happens next?</p>
                <ul className="list-disc list-inside space-y-1 text-yellow-800">
                  <li>A super admin will review your account</li>
                  <li>You'll receive an email when approved</li>
                  <li>You can then login to access the admin panel</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Status Message */}
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 mb-6">
            <p className="text-sm text-gray-700 text-center">
              Please contact your super admin if you need immediate access or have questions about your account status.
            </p>
          </div>

          {/* Logout Button */}
          <button
            onClick={handleLogout}
            disabled={isLoggingOut}
            className="w-full bg-gray-900 text-white py-3 rounded-lg font-semibold hover:bg-gray-800 transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            data-testid="logout-button"
          >
            <LogOut className="w-5 h-5" />
            {isLoggingOut ? 'Logging out...' : 'Logout'}
          </button>
        </div>

        {/* Warning */}
        <div className="mt-6 bg-gray-800/50 border border-gray-700 rounded-lg p-4">
          <p className="text-xs text-gray-300 text-center">
            🔒 Do not share your login credentials. Your account activity is monitored for security purposes.
          </p>
        </div>
      </div>
    </div>
  )
}
