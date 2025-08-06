"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter, usePathname } from "next/navigation"
import { AdminSidebar } from "@/components/admin/admin-sidebar"

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const router = useRouter()
  const pathname = usePathname()
  const [isLoggedIn, setIsLoggedIn] = useState<boolean | null>(null)

  useEffect(() => {
    // Check if admin is logged in
    // This is a mock implementation - replace with your actual auth check
    const checkAdminAuth = () => {
      const adminToken = localStorage.getItem("adminToken")
      setIsLoggedIn(!!adminToken)

      // If not logged in and not already on login page, redirect to login
      if (!adminToken && pathname !== "/admin/login" && pathname !== "/admin/forgot-password") {
        router.push("/admin/login")
      }
    }

    checkAdminAuth()
  }, [pathname, router])

  // Show loading state while checking auth
  if (isLoggedIn === null) {
    return (
      <div className="flex h-screen items-center justify-center bg-muted/20">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
      </div>
    )
  }

  // If not logged in, only show the children (login page) without sidebar
  if (!isLoggedIn && (pathname === "/admin/login" || pathname === "/admin/forgot-password")) {
    return <div className="h-screen bg-muted/20">{children}</div>
  }

  // If logged in, show the full admin layout with sidebar
  return (
    <div className="flex h-screen bg-muted/20">
      <AdminSidebar />
      <div className="flex-1 overflow-auto">{children}</div>
    </div>
  )
}
