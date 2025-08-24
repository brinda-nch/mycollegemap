"use client"

import { Button } from "@/components/ui/button"
import { PanelLeftOpen, PanelLeftClose, Menu } from "lucide-react"
import { useSidebar } from "@/lib/sidebar-context"

export function SidebarToggle() {
  const { isSidebarVisible, toggleSidebar } = useSidebar()

  return (
    <Button
      variant="outline"
      size="icon"
      onClick={toggleSidebar}
      className={`fixed z-50 ${isSidebarVisible ? 'top-4 right-4' : 'top-4 left-4'}`}
    >
      {isSidebarVisible ? (
        <PanelLeftClose className="h-4 w-4" />
      ) : (
        <Menu className="h-4 w-4" />
      )}
    </Button>
  )
}
