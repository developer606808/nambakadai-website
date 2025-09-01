"use client"

import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Camera, Store, Loader2 } from "lucide-react"

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

interface UserStore {
  id: number
  name: string
  publicKey: string
}

interface ProfileSidebarProps {
  user: UserProfile
  store: UserStore | null
  uploadingImage: boolean
  onProfilePictureUpload: (event: React.ChangeEvent<HTMLInputElement>) => void
  fileInputRef: React.RefObject<HTMLInputElement | null>
}

export function ProfileSidebar({
  user,
  store,
  uploadingImage,
  onProfilePictureUpload,
  fileInputRef,
}: ProfileSidebarProps) {
  return (
    <div className="w-full md:w-64 shrink-0">
      <div className="bg-white rounded-lg border p-6 text-center">
        <div className="relative w-24 h-24 mx-auto mb-4 group">
          <Image
            src={user.avatar || "/placeholder.svg"}
            alt={user.name}
            fill
            className="rounded-full object-cover"
          />
          <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-40 rounded-full flex items-center justify-center transition-all duration-200 opacity-0 group-hover:opacity-100">
            <label htmlFor="profile-picture" className="cursor-pointer">
              <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center">
                <Camera className="h-4 w-4 text-gray-700" />
              </div>
              <input
                ref={fileInputRef}
                type="file"
                id="profile-picture"
                className="hidden"
                accept="image/*"
                onChange={onProfilePictureUpload}
              />
            </label>
          </div>
          {/* Loading overlay */}
          {uploadingImage && (
            <div className="absolute inset-0 bg-black bg-opacity-50 rounded-full flex items-center justify-center">
              <div className="flex flex-col items-center text-white">
                <Loader2 className="h-6 w-6 animate-spin mb-1" />
                <span className="text-xs">Processing...</span>
              </div>
            </div>
          )}
        </div>
        <h2 className="text-xl font-semibold">{user.name}</h2>
        <p className="text-gray-500 text-sm mt-1">Member since {user.joinDate}</p>
        <p className="text-gray-500 text-sm capitalize">{user.role.toLowerCase()}</p>

        {/* Stats */}
        <div className="mt-6 grid grid-cols-3 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">{user.stats?.productsCount || 0}</div>
            <div className="text-xs text-gray-500">Products</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600">{user.stats?.wishlistCount || 0}</div>
            <div className="text-xs text-gray-500">Saved</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-purple-600">{user.stats?.storesCount || 0}</div>
            <div className="text-xs text-gray-500">Stores</div>
          </div>
        </div>

        {/* Store Link */}
        {store && (
          <div className="mt-6">
            <Link href={`/stores/${store.name.toLowerCase().replace(/\s+/g, '-')}/${store.publicKey}`}>
              <Button variant="outline" className="w-full justify-start">
                <Store className="mr-2 h-4 w-4" />
                View My Store
              </Button>
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}