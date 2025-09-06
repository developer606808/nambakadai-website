"use client"

import React, { createContext, useContext, useState, useCallback } from 'react'
import { useRouter } from 'next/navigation'

interface AdminContextType {
  isLoading: boolean
  setIsLoading: (loading: boolean) => void
  refreshData: () => void
  navigateAfterAction: (path: string, delay?: number) => void
}

const AdminContext = createContext<AdminContextType | undefined>(undefined)

export function AdminProvider({ children }: { children: React.ReactNode }) {
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const refreshData = useCallback(() => {
    // Force a refresh of the current page data
    router.refresh()
  }, [router])

  const navigateAfterAction = useCallback((path: string, delay = 1000) => {
    // Navigate after a delay to allow for UI feedback
    setTimeout(() => {
      router.push(path)
      router.refresh()
    }, delay)
  }, [router])

  const value: AdminContextType = {
    isLoading,
    setIsLoading,
    refreshData,
    navigateAfterAction,
  }

  return (
    <AdminContext.Provider value={value}>
      {children}
    </AdminContext.Provider>
  )
}

export function useAdmin() {
  const context = useContext(AdminContext)
  if (context === undefined) {
    throw new Error('useAdmin must be used within an AdminProvider')
  }
  return context
}
