"use client"

import React, { createContext, useContext, useState } from 'react'

interface SidebarContextType {
  isSidebarVisible: boolean
  toggleSidebar: () => void
  hideSidebar: () => void
  showSidebar: () => void
}

const SidebarContext = createContext<SidebarContextType | undefined>(undefined)

export function SidebarProvider({ children }: { children: React.ReactNode }) {
  const [isSidebarVisible, setIsSidebarVisible] = useState(true)

  const toggleSidebar = () => {
    setIsSidebarVisible(!isSidebarVisible)
  }

  const hideSidebar = () => {
    setIsSidebarVisible(false)
  }

  const showSidebar = () => {
    setIsSidebarVisible(true)
  }

  const value: SidebarContextType = {
    isSidebarVisible,
    toggleSidebar,
    hideSidebar,
    showSidebar,
  }

  return (
    <SidebarContext.Provider value={value}>
      {children}
    </SidebarContext.Provider>
  )
}

export function useSidebar() {
  const context = useContext(SidebarContext)
  if (context === undefined) {
    throw new Error('useSidebar must be used within a SidebarProvider')
  }
  return context
}
