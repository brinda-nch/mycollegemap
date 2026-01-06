"use client"

import { useState } from "react"
import { useSession, signOut } from "next-auth/react"
import { usePathname } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Home,
  GraduationCap,
  BookOpen,
  Trophy,
  FileText,
  Target,
  Settings,
  LogOut,
  Menu,
  X,
  User,
  ChevronLeft,
  ChevronRight,
  ClipboardList,
  School,
} from "lucide-react"
import { PngLogo } from "./png-logo"
import { useSidebar } from "@/lib/sidebar-context"

const navigation = [
  { name: "Dashboard", href: "/dashboard", icon: Home },
  { name: "Academics", href: "/gpa", icon: GraduationCap },
  { name: "Extra Curriculars", href: "/extracurriculars", icon: Trophy },
  { name: "Application Tracking", href: "/application-tracking", icon: ClipboardList },
  { name: "College List", href: "/college-list", icon: School },
  { name: "Essays", href: "/essays", icon: FileText },
  { name: "My Profile", href: "/profile", icon: User },
]

export function TopNavbar() {
  const { data: session } = useSession()
  const pathname = usePathname()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const { isSidebarCollapsed, toggleSidebarCollapse } = useSidebar()

  const handleSignOut = () => {
    signOut({ callbackUrl: "/" })
  }

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
  }

  return (
    <>
      {/* Sidebar */}
      <div className={`fixed left-0 top-0 h-full bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-700 z-50 hidden lg:flex flex-col shadow-xl transition-all duration-300 ${isSidebarCollapsed ? 'w-20' : 'w-64'}`}>
        {/* Logo */}
        <div className="p-4 lg:p-6 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
          {!isSidebarCollapsed && (
            <Link href="/dashboard" className="flex items-center">
              <PngLogo size="lg" />
              <span className="ml-2 lg:ml-3 text-lg lg:text-xl font-bold" style={{ color: '#364652' }}>mycollegemap</span>
            </Link>
          )}
          {isSidebarCollapsed && (
            <Link href="/dashboard" className="mx-auto">
              <PngLogo size="md" />
            </Link>
          )}
        </div>

        {/* Toggle Button */}
        <div className="px-4 py-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={toggleSidebarCollapse}
            className="w-full flex items-center justify-center hover:bg-gray-100 rounded-lg"
          >
            {isSidebarCollapsed ? <ChevronRight className="h-5 w-5" /> : <ChevronLeft className="h-5 w-5" />}
          </Button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
          {navigation.map((item) => {
            const isActive = pathname === item.href
            return (
              <Link
                key={item.name}
                href={item.href}
                className={`flex items-center ${isSidebarCollapsed ? 'justify-center px-2' : 'px-4'} py-3 text-base font-medium rounded-xl transition-all ${
                  isActive
                    ? "text-white shadow-lg"
                    : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
                }`}
                style={{ 
                  backgroundColor: isActive ? '#f89880' : undefined,
                }}
                title={isSidebarCollapsed ? item.name : undefined}
              >
                <item.icon className={`h-5 w-5 ${!isSidebarCollapsed ? 'mr-3' : ''}`} />
                {!isSidebarCollapsed && item.name}
              </Link>
            )
          })}
        </nav>

        {/* User Section */}
        <div className="p-4 border-t border-gray-200 dark:border-gray-700">
          {session?.user && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className={`w-full ${isSidebarCollapsed ? 'justify-center px-2' : 'justify-start'} p-2 hover:bg-gray-100`}>
                  <Avatar className={`h-8 w-8 ${!isSidebarCollapsed ? 'mr-3' : ''}`}>
                    <AvatarImage src={session.user.image || ""} alt={session.user.name || ""} />
                    <AvatarFallback>
                      {session.user.name ? getInitials(session.user.name) : <User className="h-4 w-4" />}
                    </AvatarFallback>
                  </Avatar>
                  {!isSidebarCollapsed && (
                    <div className="flex-1 text-left">
                      <p className="text-sm font-medium">{session.user.name}</p>
                      <p className="text-xs text-muted-foreground">{session.user.email}</p>
                    </div>
                  )}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end" forceMount>
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">{session.user.name}</p>
                    <p className="text-xs leading-none text-muted-foreground">{session.user.email}</p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link href="/dashboard" className="cursor-pointer">
                    <Settings className="mr-2 h-4 w-4" />
                    <span>Settings</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleSignOut} className="cursor-pointer">
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Log out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>
      </div>

      {/* Mobile Top Bar */}
      <div className="lg:hidden fixed top-0 left-0 right-0 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 z-50 shadow-sm">
        <div className="flex justify-between items-center px-3 sm:px-4 py-3">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="p-2 hover:bg-gray-100"
          >
            {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>

          <Link href="/dashboard" className="flex items-center">
            <PngLogo size="sm" />
            <span className="ml-2 text-base sm:text-lg font-bold" style={{ color: '#364652' }}>mycollegemap</span>
          </Link>

          {session?.user && (
            <Avatar className="h-8 w-8">
              <AvatarImage src={session.user.image || ""} alt={session.user.name || ""} />
              <AvatarFallback>
                {session.user.name ? getInitials(session.user.name) : <User className="h-4 w-4" />}
              </AvatarFallback>
            </Avatar>
          )}
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 max-h-[calc(100vh-64px)] overflow-y-auto">
            <div className="px-2 pt-2 pb-3 space-y-1">
              {navigation.map((item) => {
                const isActive = pathname === item.href
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={`flex items-center px-3 sm:px-4 py-3 text-sm sm:text-base font-medium rounded-xl transition-colors ${
                      isActive
                        ? "text-white"
                        : "hover:bg-gray-100 dark:hover:bg-gray-800"
                    }`}
                    style={{ 
                      backgroundColor: isActive ? '#f89880' : undefined,
                      color: isActive ? 'white' : '#364652' 
                    }}
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <item.icon className="mr-2 sm:mr-3 h-5 w-5 flex-shrink-0" />
                    <span className="truncate">{item.name}</span>
                  </Link>
                )
              })}
              
              {/* User Profile in Mobile Menu */}
              {session?.user && (
                <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700 px-3 sm:px-4">
                  <div className="flex items-center gap-3 mb-3">
                    <Avatar className="h-10 w-10">
                      <AvatarImage src={session.user.image || ""} alt={session.user.name || ""} />
                      <AvatarFallback>
                        {session.user.name ? getInitials(session.user.name) : <User className="h-4 w-4" />}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">{session.user.name}</p>
                      <p className="text-xs text-muted-foreground truncate">{session.user.email}</p>
                    </div>
                  </div>
                  <Button
                    variant="outline"
                    onClick={handleSignOut}
                    className="w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50"
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    Log out
                  </Button>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </>
  )
}
