"use client"

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'

export default function AdminPage() {
  const router = useRouter()
  const { data: session, status } = useSession()

  useEffect(() => {
    if (status === 'loading') return // Still loading

    if (!session?.user) {
      // Not authenticated, redirect to login
      router.push('/admin/login')
      return
    }

    if (session.user.role !== 'ADMIN') {
      // Not an admin, redirect to login
      router.push('/admin/login')
      return
    }

    // User is authenticated and is admin, redirect to dashboard
    router.push('/admin/dashboard')
  }, [session, status, router])

  // Show loading while checking authentication
  return (
    <div className="flex h-screen items-center justify-center bg-muted/20">
      <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
    </div>
  )
}