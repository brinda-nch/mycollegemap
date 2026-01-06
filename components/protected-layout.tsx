"use client"

import type React from "react"

import { ProtectedRoute } from "./protected-route"
import { TopNavbar } from "./top-navbar"
import { useSidebar } from "@/lib/sidebar-context"

interface ProtectedLayoutProps {
  children: React.ReactNode
}

export function ProtectedLayout({ children }: ProtectedLayoutProps) {
  const { isSidebarCollapsed } = useSidebar()
  
  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-100 dark:bg-gray-900">
        <TopNavbar />
        <main className={`pt-0 transition-all duration-300 ${isSidebarCollapsed ? 'lg:ml-20' : 'lg:ml-64'}`}>
          <div className="pt-16 lg:pt-0">
            {children}
          </div>
        </main>
      </div>
    </ProtectedRoute>
  )
}
