'use client'

import React from 'react'
import Image from "next/image"
import Link from "next/link"
import { Truck, Star, Eye, Share2, QrCode, Package, MapPin, Heart } from "lucide-react"
import { useWishlist } from "@/hooks/useWishlist"
import { useToast } from "@/components/ui/use-toast"

interface RentalCardProps {
  id: number
  slug?: string
  publicKey?: string
  image?: string
  title: string
  price?: number
  unit?: string
  rating?: number
  reviews?: number
  location?: string
  availability?: number
  category?: string
  storeId?: number
  storeSlug?: string
  storePublicKey?: string
  storeName?: string
}

export function RentalCard({
  id,
  slug,
  publicKey,
  image,
  title,
  price,
  unit,
  rating,
  reviews,
  location,
  availability,
  category,
  storeId,
  storeSlug,
  storePublicKey,
  storeName,
}: RentalCardProps) {
  const { toggleWishlist, wishlistStatus } = useWishlist()
  const { toast } = useToast()

  const rentalUrl = slug && publicKey ? `/rentals/${slug}/${publicKey}` : `/rentals/${publicKey || slug || id}`

  // Early return if critical data is missing
  if (!title || !id) {
    return null
  }

  const handleShare = async (e: React.MouseEvent) => {
    e.preventDefault()
    const shareUrl = `${window.location.origin}${rentalUrl}`

    if (navigator.share) {
      try {
        await navigator.share({
          title: title,
          text: `Check out this rental: ${title}`,
          url: shareUrl,
        })
      } catch (error) {
        console.log('Error sharing:', error)
      }
    } else {
      navigator.clipboard.writeText(shareUrl)
      toast({
        title: "Link Copied!",
        description: "Rental link has been copied to clipboard",
      })
    }
  }

  const generateQR = () => {
    const qrUrl = `${window.location.origin}${rentalUrl}`
    toast({
      title: "QR Code",
      description: `QR code for ${qrUrl} would be generated here`,
    })
  }

  return (
    <div className="group bg-white rounded-2xl overflow-hidden border border-gray-200 hover:border-blue-300 hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 h-full flex flex-col relative">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

      {/* Image Section */}
      <div className="relative overflow-hidden">
        <div className="aspect-square relative">
          <Image
            src={image || "/placeholder.svg"}
            alt={title}
            fill
            className="object-cover transition-transform duration-700 group-hover:scale-110"
            loading="lazy"
            placeholder="blur"
            blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAAIAAoDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkqGx0f/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyJckliyjqTzSlT54b6bk+h0R+IRjWjBqO6O2mhP//Z"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
        </div>

        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-2">
          <div className="bg-gradient-to-r from-blue-500 to-cyan-500 text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-lg">
            🚛 Rental
          </div>
          <div className="bg-gradient-to-r from-green-500 to-emerald-500 text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-lg">
            {availability} Available
          </div>
        </div>

        {/* Action Buttons - Top Right */}
        <div className="absolute top-3 right-3 flex gap-2">
          {/* QR Code Button */}
          <button
            onClick={(e) => {
              e.preventDefault()
              generateQR()
            }}
            className="bg-white/90 hover:bg-white p-2.5 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110 group/qr"
          >
            <QrCode className="h-4 w-4 text-gray-600 group-hover/qr:text-blue-600 transition-colors" />
          </button>

          {/* Wishlist Button */}
          <button
            onClick={(e) => {
              e.preventDefault()
              toggleWishlist(id)
            }}
            className="bg-white/90 hover:bg-white p-2.5 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110 group/wish"
          >
            <Heart className={`h-4 w-4 transition-all duration-300 ${
              wishlistStatus[id]
                ? 'text-red-500 fill-red-500 scale-110'
                : 'text-gray-600 group-hover/wish:text-red-500'
            }`} />
          </button>
        </div>

        {/* Share Button - Bottom Right */}
        <button
          onClick={handleShare}
          className="absolute bottom-3 right-3 bg-white/90 hover:bg-white p-2.5 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110 opacity-0 group-hover:opacity-100 transform translate-y-2 group-hover:translate-y-0"
        >
          <Share2 className="h-4 w-4 text-gray-600 hover:text-blue-600 transition-colors" />
        </button>
      </div>

      {/* Content Section */}
      <div className="p-4 flex-1 flex flex-col relative z-10">
        {/* Rental Title - Limited Text */}
        <h3 className="font-bold text-gray-900 mb-2 text-sm sm:text-base line-clamp-2 leading-tight group-hover:text-blue-700 transition-colors">
          {title.length > 50 ? `${title.substring(0, 50)}...` : title}
        </h3>

        {/* Category */}
        <div className="flex items-center gap-2 mb-2">
          <Package className="h-4 w-4 text-blue-600" />
          <span className="text-xs sm:text-sm text-gray-600 font-medium">
            {category ? (category.length > 25 ? `${category.substring(0, 25)}...` : category) : 'General'}
          </span>
        </div>

        {/* Price */}
        <div className="flex items-baseline mb-3">
          <span className="text-lg sm:text-xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
            ${price ? price.toFixed(2) : '0.00'}
          </span>
          <span className="text-xs text-gray-500 ml-1 font-medium">/{unit || 'day'}</span>
        </div>

        {/* Rating */}
        <div className="flex items-center gap-2 mb-3">
          <div className="flex items-center gap-1">
            <Star className="h-4 w-4 text-yellow-400 fill-yellow-400" />
            <span className="text-sm font-semibold text-gray-900">{rating}</span>
          </div>
          <span className="text-xs text-gray-500">({reviews} reviews)</span>
        </div>

        {/* Location */}
        <div className="flex items-center gap-2 mb-4 flex-1">
          <MapPin className="h-4 w-4 text-gray-400 flex-shrink-0" />
          <span className="text-xs sm:text-sm text-gray-600 truncate">
            {location ? (location.length > 35 ? `${location.substring(0, 35)}...` : location) : 'Location not specified'}
          </span>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2 mt-auto">
          <Link href={rentalUrl} className="flex-1">
            <button className="w-full bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white shadow-md hover:shadow-lg transition-all duration-300 text-xs sm:text-sm font-medium py-2 px-3 rounded-lg flex items-center gap-1.5">
              <Eye className="h-3 w-3" />
              <span className="hidden sm:inline">View Details</span>
              <span className="sm:hidden">Details</span>
            </button>
          </Link>
          {storeId && (storeSlug || storePublicKey) && (
            <Link href={`/stores/${storeSlug || storePublicKey || storeId}`} className="flex-1">
              <button className="w-full bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white shadow-md hover:shadow-lg transition-all duration-300 text-xs sm:text-sm font-medium py-2 px-3 rounded-lg flex items-center gap-1.5">
                <Package className="h-3 w-3" />
                <span className="hidden sm:inline">Visit Store</span>
                <span className="sm:hidden">Store</span>
              </button>
            </Link>
          )}
        </div>
      </div>
    </div>
  )
}