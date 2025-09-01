"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter, usePathname } from "next/navigation"
import { useSession } from "next-auth/react"
import { AdminSidebar } from "@/components/admin/admin-sidebar"

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
      } else if (isAuthenticated && isAdmin) {
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
  }, [session, status, pathname, router])

  // Show loading state while checking auth
  if (isAuthorized === null) {
    return (
      <div className="flex h-screen items-center justify-center bg-muted/20">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
      </div>
    )
  }

  // If not authorized, only show the children (login page) without sidebar
  const allowedPages = ["/admin/login", "/admin/forgot-password", "/admin/test"]
  if (!isAuthorized && pathname && allowedPages.includes(pathname)) {
    return <div className="h-screen bg-muted/20">{children}</div>
  }

  // If authorized, show the full admin layout with sidebar
  return (
    <div className="flex h-screen bg-muted/20">
      <AdminSidebar />
      <div className="flex-1 overflow-auto">{children}</div>
    </div>
  )
}
