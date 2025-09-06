"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter, usePathname } from "next/navigation"
import { useSession } from "next-auth/react"
import { AdminSidebar } from "@/components/admin/admin-sidebar"
import { AdminProvider } from "@/components/admin/admin-provider"

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const router = useRouter()
  const pathname = usePathname()
  const { data: session, status } = useSession()
  const [isAuthorized, setIsAuthorized] = useState<boolean | null>(null)

  useEffect(() => {
    // Check if user is authenticated and has admin role
    const checkAdminAuth = () => {
      const isLoading = status === "loading"
      const isAuthenticated = !!session?.user
      const isAdmin = session?.user?.role === "ADMIN"


      if (isLoading) {
        setIsAuthorized(null) // Still loading
        return
      }

      if (isAuthenticated && isAdmin) {
        setIsAuthorized(true) // Authorized admin
      } else {
        setIsAuthorized(false) // Not authorized

        // If not authorized and not on allowed pages, redirect to login
        const allowedPages = ["/admin/login", "/admin/forgot-password", "/admin/test"]
        if (pathname && !allowedPages.includes(pathname)) {
          router.push("/admin/login")
        }
      }
    }

    checkAdminAuth()
  }, [session, status, pathname, router, isAuthorized])

  // Show loading state while checking auth
  if (isAuthorized === null) {
    return (
      <div className="flex h-screen items-center justify-center bg-muted/20">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
      </div>
    )
  }

  // Determine what to render based on authorization and current page
  const allowedPages = ["/admin/login", "/admin/forgot-password", "/admin/test"]
  const isAllowedPage = pathname && allowedPages.includes(pathname)

  // If loading, show loading state
  if (isAuthorized === null) {
    return (
      <div className="min-h-screen bg-muted/20 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    )
  }

  // If not authorized
  if (!isAuthorized) {
    // If on allowed page (like login), show children without sidebar
    if (isAllowedPage) {
      return (
        <div className="min-h-screen bg-muted/20">
          {children}
        </div>
      )
    } else {
      // If not on allowed page, redirect to login
      return (
        <div className="min-h-screen bg-muted/20 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Redirecting to login...</p>
          </div>
        </div>
      )
    }
  }

  // If authorized, show full admin layout
  return (
    <AdminProvider>
      <div className="flex h-screen bg-muted/20">
        <AdminSidebar />
        <div className="flex-1 overflow-auto">
          <main className="p-6">
            {children}
          </main>
        </div>
      </div>
    </AdminProvider>
  )
}
