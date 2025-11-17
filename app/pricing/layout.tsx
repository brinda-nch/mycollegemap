"use client"

import type React from "react"
import { useSession } from "next-auth/react"
import { TopNavbar } from "@/components/top-navbar"
import { TrialBanner } from "@/components/trial-banner"
import { useSidebar } from "@/lib/sidebar-context"

// Pricing page should be accessible to everyone (logged in and logged out)
// But logged-in users should see the sidebar
export default function PricingLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { data: session } = useSession()
  const { isSidebarCollapsed } = useSidebar()

  // If user is logged in, show sidebar layout
  if (session?.user?.id) {
    return (
      <div className="min-h-screen bg-gray-100 dark:bg-gray-900">
        <TopNavbar />
        <TrialBanner userId={session.user.id} />
        <main className={`pt-0 md:pt-0 transition-all duration-300 ${isSidebarCollapsed ? 'md:ml-20' : 'md:ml-64'}`}>
          <div className="md:p-0 pt-16 md:pt-0">
            {children}
          </div>
        </main>
      </div>
    )
  }

  // For non-logged-in users, just show children (marketing page has its own nav)
  return <>{children}</>
}



