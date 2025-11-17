import type React from "react"
import type { Metadata } from "next"
import { DM_Sans, Inter } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { AuthProvider } from "@/components/auth-provider"
import { DataProvider } from "@/lib/data-context"
import { SidebarProvider } from "@/lib/sidebar-context"
import { Toaster } from "@/components/ui/sonner"

const dmSans = DM_Sans({ subsets: ["latin"] })
const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "MCM",
  description: "Track your college applications, essays, and academic progress",
    generator: 'v0.app'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={dmSans.className}>
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem={false} disableTransitionOnChange>
          <AuthProvider>
            <SidebarProvider>
              <DataProvider>
                {children}
                <Toaster />
              </DataProvider>
            </SidebarProvider>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
