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
    <div className="w-full lg:w-80 xl:w-96 shrink-0">
      <div className="bg-white rounded-xl border border-gray-200 p-6 text-center shadow-sm hover:shadow-md transition-all duration-300">
        <div className="relative w-28 h-28 sm:w-32 sm:h-32 mx-auto mb-6 group">
          <Image
            src={user.avatar || "/placeholder.svg"}
            alt={user.name}
            fill
            className="rounded-full object-cover ring-4 ring-gray-100 transition-all duration-300 group-hover:ring-green-200"
          />
          <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 rounded-full flex items-center justify-center transition-all duration-300 opacity-0 group-hover:opacity-100">
            <label htmlFor="profile-picture" className="cursor-pointer">
              <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-lg hover:scale-110 transition-transform duration-200">
                <Camera className="h-5 w-5 text-gray-700" />
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
            <div className="absolute inset-0 bg-black bg-opacity-60 rounded-full flex items-center justify-center backdrop-blur-sm">
              <div className="flex flex-col items-center text-white">
                <Loader2 className="h-8 w-8 animate-spin mb-2" />
                <span className="text-sm font-medium">Processing...</span>
              </div>
            </div>
          )}
        </div>

        <div className="space-y-2">
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900">{user.name}</h2>
          <div className="flex items-center justify-center space-x-2">
            <p className="text-gray-500 text-sm">Member since {user.joinDate}</p>
            {user.isVerified && (
              <div className="w-2 h-2 bg-green-500 rounded-full" title="Verified"></div>
            )}
          </div>
          <div className="inline-flex items-center px-3 py-1 rounded-full bg-gray-100 text-gray-700 text-sm font-medium capitalize">
            {user.role.toLowerCase()}
          </div>
        </div>

        {/* Stats */}
        <div className="mt-8 grid grid-cols-3 gap-4">
          <div className="text-center p-3 rounded-lg bg-gradient-to-br from-green-50 to-green-100 hover:from-green-100 hover:to-green-200 transition-all duration-300 group cursor-pointer">
            <div className="text-2xl sm:text-3xl font-bold text-green-600 group-hover:scale-110 transition-transform duration-200">
              {user.stats?.productsCount || 0}
            </div>
            <div className="text-xs text-gray-600 font-medium mt-1">Products</div>
          </div>
          <div className="text-center p-3 rounded-lg bg-gradient-to-br from-blue-50 to-blue-100 hover:from-blue-100 hover:to-blue-200 transition-all duration-300 group cursor-pointer">
            <div className="text-2xl sm:text-3xl font-bold text-blue-600 group-hover:scale-110 transition-transform duration-200">
              {user.stats?.wishlistCount || 0}
            </div>
            <div className="text-xs text-gray-600 font-medium mt-1">Saved</div>
          </div>
          <div className="text-center p-3 rounded-lg bg-gradient-to-br from-purple-50 to-purple-100 hover:from-purple-100 hover:to-purple-200 transition-all duration-300 group cursor-pointer">
            <div className="text-2xl sm:text-3xl font-bold text-purple-600 group-hover:scale-110 transition-transform duration-200">
              {user.stats?.storesCount || 0}
            </div>
            <div className="text-xs text-gray-600 font-medium mt-1">Stores</div>
          </div>
        </div>

        {/* Store Link */}
        {store && (
          <div className="mt-8">
            <Link href={`/stores/${store.name.toLowerCase().replace(/\s+/g, '-')}/${store.publicKey}`}>
              <Button
                variant="outline"
                className="w-full justify-center h-12 bg-gradient-to-r from-green-50 to-blue-50 hover:from-green-100 hover:to-blue-100 border-green-200 hover:border-green-300 transition-all duration-300 hover:shadow-md"
              >
                <Store className="mr-2 h-5 w-5" />
                <span className="font-medium">View My Store</span>
              </Button>
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}