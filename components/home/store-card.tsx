'use client'

import React from 'react'
import Image from "next/image"
import Link from "next/link"
import { Store as StoreIcon, Star, Eye, Share2, QrCode } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"

interface StoreCardProps {
  id: string | number
  slug?: string
  publicKey?: string
  image?: string
  name: string
  category?: string
  rating?: number
  reviews?: number
}

export function StoreCard({
  id,
  slug,
  publicKey,
  image,
  name,
  category,
  rating,
  reviews,
}: StoreCardProps) {
  const { toast } = useToast()

  const storeUrl = `/stores/${slug || id}/${publicKey || id}`

  // Early return if critical data is missing
  if (!name || !id) {
    return null
  }

  const handleShare = async (e: React.MouseEvent) => {
    e.preventDefault()
    const shareUrl = `${window.location.origin}${storeUrl}`

    if (navigator.share) {
      try {
        await navigator.share({
          title: name,
          text: `Check out this store: ${name}`,
          url: shareUrl,
        })
      } catch (error) {
        console.log('Error sharing:', error)
      }
    } else {
      navigator.clipboard.writeText(shareUrl)
      toast({
        title: "Link Copied!",
        description: "Store link has been copied to clipboard",
      })
    }
  }

  const generateQR = () => {
    const qrUrl = `${window.location.origin}${storeUrl}`
    toast({
      title: "QR Code",
      description: "QR code functionality would be implemented here",
    })
  }

  return (
    <div className="group bg-white rounded-2xl overflow-hidden border border-gray-200 hover:border-green-300 hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 h-full flex flex-col relative">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-gradient-to-br from-green-50/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

      {/* Image Section */}
      <div className="relative overflow-hidden">
        <div className="aspect-square relative">
          <Image
            src={image || "/placeholder.svg"}
            alt={name}
            fill
            className="object-cover transition-transform duration-700 group-hover:scale-110"
            loading="lazy"
            placeholder="blur"
            blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAAIAAoDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkqGx0f/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyJckliyjqTzSlT54b6bk+h0R+IRjWjBqO6O2mhP//Z"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
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
            <QrCode className="h-4 w-4 text-gray-600 group-hover/qr:text-green-600 transition-colors" />
          </button>
        </div>

        {/* Share Button - Bottom Right */}
        <button
          onClick={handleShare}
          className="absolute bottom-3 right-3 bg-white/90 hover:bg-white p-2.5 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110 opacity-0 group-hover:opacity-100 transform translate-y-2 group-hover:translate-y-0"
        >
          <Share2 className="h-4 w-4 text-gray-600 hover:text-green-600 transition-colors" />
        </button>
      </div>

      {/* Content Section */}
      <div className="p-4 flex-1 flex flex-col relative z-10">
        {/* Store Name - Limited Text */}
        <h3 className="font-bold text-gray-900 mb-2 text-sm sm:text-base line-clamp-2 leading-tight group-hover:text-green-700 transition-colors">
          {name.length > 40 ? `${name.substring(0, 40)}...` : name}
        </h3>

        {/* Category */}
        <div className="flex items-center gap-2 mb-3">
          <StoreIcon className="h-4 w-4 text-green-600" />
          <span className="text-xs sm:text-sm text-gray-600 font-medium">
            {category ? (category.length > 30 ? `${category.substring(0, 30)}...` : category) : 'General'}
          </span>
        </div>

        {/* Rating */}
        <div className="flex items-center gap-2 mb-4">
          <div className="flex items-center gap-1">
            <Star className="h-4 w-4 text-yellow-400 fill-yellow-400" />
            <span className="text-sm font-semibold text-gray-900">{rating}</span>
          </div>
          <span className="text-xs text-gray-500">({reviews} reviews)</span>
        </div>

        {/* Action Button */}
        <div className="mt-auto">
          <Link href={storeUrl} className="block">
            <button className="w-full bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white shadow-md hover:shadow-lg transition-all duration-300 text-xs sm:text-sm font-medium py-2.5 px-4 rounded-lg flex items-center gap-1.5">
              <Eye className="h-3 w-3" />
              <span>Visit Store</span>
            </button>
          </Link>
        </div>
      </div>
    </div>
  )
}