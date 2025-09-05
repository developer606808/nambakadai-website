"use client"

import { usePathname } from "next/navigation"
import Link from "next/link"
import { ChevronRight, Home } from "lucide-react"

export default function Breadcrumbs() {
  const pathname = usePathname()

  if (!pathname || pathname === "/") return null

  const pathSegments = pathname.split("/").filter((segment) => segment)

  // Create breadcrumb items with proper formatting
  const breadcrumbs = pathSegments.map((segment, index) => {
    const href = `/${pathSegments.slice(0, index + 1).join("/")}`
    const isLast = index === pathSegments.length - 1

    // Format the segment for display (capitalize, replace hyphens with spaces)
    let label = segment.charAt(0).toUpperCase() + segment.slice(1)
    label = label.replace(/-/g, " ")

    // If it's a numeric ID, try to make it more readable
    if (!isNaN(Number(segment))) {
      label = `Item ${segment}`
    }

    return {
      href,
      label,
      isLast,
    }
  })

  return (
    <nav className="flex items-center text-sm text-gray-500 mb-4">
      <Link href="/" className="flex items-center hover:text-gray-900">
        <Home className="h-4 w-4" />
        <span className="sr-only">Home</span>
      </Link>

      {breadcrumbs.map((breadcrumb, index) => (
        <div key={breadcrumb.href} className="flex items-center">
          <ChevronRight className="h-4 w-4 mx-2" />
          {breadcrumb.isLast ? (
            <span className="font-medium text-gray-900">{breadcrumb.label}</span>
          ) : (
            <Link href={breadcrumb.href} className="hover:text-gray-900">
              {breadcrumb.label}
            </Link>
          )}
        </div>
      ))}
    </nav>
  )
}
