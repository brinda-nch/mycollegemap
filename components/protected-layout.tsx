"use client"

import type React from "react"

import { ProtectedRoute } from "./protected-route"
import { TopNavbar } from "./top-navbar"
import { TrialBanner } from "./trial-banner"
import { TrialEnforcer } from "./trial-enforcer"
import { useSidebar } from "@/lib/sidebar-context"
import { useSession } from "next-auth/react"

interface ProtectedLayoutProps {
  children: React.ReactNode
}

export function ProtectedLayout({ children }: ProtectedLayoutProps) {
  const { isSidebarCollapsed } = useSidebar()
  const { data: session } = useSession()
  
  return (
    <ProtectedRoute>
      {session?.user?.id ? (
        <TrialEnforcer userId={session.user.id}>
          <div className="min-h-screen bg-gray-100 dark:bg-gray-900">
            <TopNavbar />
            <TrialBanner userId={session.user.id} />
            <main className={`pt-0 md:pt-0 transition-all duration-300 ${isSidebarCollapsed ? 'md:ml-20' : 'md:ml-64'}`}>
              <div className="md:p-0 pt-16 md:pt-0">
                {children}
              </div>
            </main>
          </div>
        </TrialEnforcer>
      ) : (
        <div className="min-h-screen bg-gray-100 dark:bg-gray-900">
          <TopNavbar />
          <main className={`pt-0 md:pt-0 transition-all duration-300 ${isSidebarCollapsed ? 'md:ml-20' : 'md:ml-64'}`}>
            <div className="md:p-0 pt-16 md:pt-0">
              {children}
            </div>
          </main>
        </div>
      )}
    </ProtectedRoute>
  )
}
