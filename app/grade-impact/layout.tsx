import type React from "react"
import { ProtectedLayout } from "@/components/protected-layout"

export default function GradeImpactLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <ProtectedLayout>{children}</ProtectedLayout>
}
