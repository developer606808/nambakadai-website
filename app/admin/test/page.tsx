"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"

export default function AdminTestPage() {
  const router = useRouter()

  useEffect(() => {
    // Check if we have admin token
    const token = localStorage.getItem("adminToken")
    if (!token) {
      // Set a mock token for testing
      localStorage.setItem("adminToken", "demo-admin-token")
      // Refresh the page to trigger the auth check
      router.refresh()
    } else {
      router.push("/admin/dashboard")
    }
  }, [router])

  return (
    <div className="flex h-screen items-center justify-center">
      <div className="text-center">
        <h1 className="text-2xl font-bold mb-4">Admin Test Page</h1>
        <p>Setting up admin authentication...</p>
      </div>
    </div>
  )
}