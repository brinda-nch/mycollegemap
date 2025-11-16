"use client"

import type React from "react"

import { ProtectedRoute } from "./protected-route"
import { TopNavbar } from "./top-navbar"

interface ProtectedLayoutProps {
  children: React.ReactNode
}

export function ProtectedLayout({ children }: ProtectedLayoutProps) {
  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-100 dark:bg-gray-900">
        <TopNavbar />
        <main className="pt-0 md:pt-0">
          <div className="md:p-0 pt-16 md:pt-0">
            {children}
          </div>
        </main>
      </div>
    </ProtectedRoute>
  )
}
