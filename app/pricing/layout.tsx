import type React from "react"

// Pricing page should be accessible to everyone (logged in and logged out)
// So we don't wrap it in ProtectedLayout
export default function PricingLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}



