import { ProtectedLayout } from "@/components/protected-layout"

export default function CollegeListLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <ProtectedLayout>{children}</ProtectedLayout>
}

