"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Heart, Package } from "lucide-react"

interface UserProfile {
  id: number
  name: string
  email: string
  phone?: string
  avatar: string | null
  role: string
  isVerified: boolean
  joinDate: string
  stats: {
    productsCount: number
    storesCount: number
    wishlistCount: number
  }
}

interface SavedItemsProps {
  user: UserProfile
}

export function SavedItems({ user }: SavedItemsProps) {
  return (
    <div className="bg-white rounded-lg border p-6">
      <h2 className="text-xl font-semibold mb-4">Saved Items</h2>
      <p className="text-gray-600 mb-6">
        You have {user.stats?.wishlistCount || 0} saved item{(user.stats?.wishlistCount || 0) !== 1 ? 's' : ''}.
      </p>

      {(user.stats?.wishlistCount || 0) === 0 ? (
        <div className="text-center py-8">
          <Heart className="h-16 w-16 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500 mb-4">You don't have any saved items yet.</p>
          <Link href="/products">
            <Button className="bg-green-500 hover:bg-green-600">
              <Package className="mr-2 h-4 w-4" />
              Browse Products
            </Button>
          </Link>
        </div>
      ) : (
        <div className="text-center py-8">
          <Package className="h-16 w-16 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500 mb-4">
            Saved items feature is coming soon! You'll be able to view and manage your wishlist here.
          </p>
          <Link href="/products">
            <Button variant="outline">
              Continue Browsing
            </Button>
          </Link>
        </div>
      )}
    </div>
  )
}