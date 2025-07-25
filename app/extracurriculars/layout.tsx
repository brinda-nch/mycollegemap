import type React from "react"
import { ProtectedLayout } from "@/components/protected-layout"
import { Sidebar } from "@/components/sidebar"

export default function ExtracurricularsLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <ProtectedLayout>
      <div className="flex h-screen bg-gray-100">
        <Sidebar />
        <main className="flex-1 overflow-y-auto p-6">{children}</main>
      </div>
    </ProtectedLayout>
  )
}
