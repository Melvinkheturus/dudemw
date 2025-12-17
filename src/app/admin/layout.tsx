"use client"

import { useState, useEffect } from "react"
import { useRouter, usePathname } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { Sidebar } from "@/components/common/sidebar"
import { Header } from "@/components/common/header"
import { Sheet, SheetContent } from "@/components/ui/sheet"

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const router = useRouter()
  const pathname = usePathname()
  const supabase = createClient()
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [isCheckingAuth, setIsCheckingAuth] = useState(true)

  // Client-side auth verification (backup to middleware)
  useEffect(() => {
    const checkAuth = async () => {
      const publicRoutes = ['/admin/login', '/admin/setup', '/admin/recover', '/admin/pending', '/admin/logout']
      const isPublicRoute = publicRoutes.some(route => pathname.startsWith(route))
      
      if (isPublicRoute) {
        setIsCheckingAuth(false)
        return
      }

      const { data: { user } } = await supabase.auth.getUser()
      
      if (!user) {
        router.push('/admin/login')
        return
      }

      setIsCheckingAuth(false)
    }

    checkAuth()
  }, [pathname, router, supabase])

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Desktop Sidebar */}
      <div className="hidden lg:block">
        <Sidebar collapsed={sidebarCollapsed} />
      </div>

      {/* Mobile Sidebar Sheet */}
      <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
        <SheetContent side="left" className="p-0 w-64 bg-gray-50">
          <Sidebar collapsed={false} />
        </SheetContent>
      </Sheet>

      <div className="flex-1 flex flex-col overflow-hidden p-2 lg:p-4 gap-2 lg:gap-4">
        <div className="bg-white rounded-lg lg:rounded-xl shadow-sm border border-gray-200/60">
          <Header 
            sidebarCollapsed={sidebarCollapsed} 
            onToggleSidebar={() => setSidebarCollapsed(!sidebarCollapsed)}
            mobileMenuOpen={mobileMenuOpen}
            onToggleMobileMenu={() => setMobileMenuOpen(!mobileMenuOpen)}
          />
        </div>
        <main className="flex-1 overflow-y-auto overflow-x-hidden bg-white rounded-lg lg:rounded-xl shadow-sm border border-gray-200/60">
          <div className="p-4 lg:p-8 w-full max-w-full">
            <div className="max-w-7xl mx-auto w-full min-w-0">
              {children}
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}
