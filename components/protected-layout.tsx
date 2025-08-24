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
        <main className="pt-16">
          <div className="container mx-auto px-6 py-8 max-w-6xl">
            {children}
          </div>
        </main>
      </div>
    </ProtectedRoute>
  )
}
