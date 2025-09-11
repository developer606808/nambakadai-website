'use client'

import React, { useState } from 'react'
import Image from "next/image"
import Link from "next/link"
import { Heart, QrCode, Share2, MapPin, Store as StoreIcon, Eye, ShoppingCart, X } from "lucide-react"
import { useWishlist } from "@/hooks/useWishlist"
import { useToast } from "@/components/ui/use-toast"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"

interface ProductCardProps {
  id: number
  title: string
  slug?: string
  publicKey?: string
  images?: string[]
  price: number
  unit?: {
    symbol: string
  }
  location: string
  store?: {
    id: number
    name: string
    slug?: string
    publicKey?: string
  }
  isFeatured?: boolean
}

export function ProductCard({
  id,
  title,
  slug,
  publicKey,
  images,
  price,
  unit,
  location,
  store,
  isFeatured,
}: ProductCardProps) {
  const { toggleWishlist, wishlistStatus } = useWishlist()
  const { toast } = useToast()
  const [qrCodeUrl, setQrCodeUrl] = useState<string>('')
  const [isQrDialogOpen, setIsQrDialogOpen] = useState(false)

  console.log('slug',slug,'publicKey',publicKey)

  const productUrl = `/products/${slug}/${publicKey}`
  const storeUrl = `/stores/${store?.slug}/${store?.publicKey}`

  // Early return if critical data is missing
  if (!title || !id) {
    return null
  }

  const handleShare = async (e: React.MouseEvent) => {
    e.preventDefault()
    const shareUrl = `${window.location.origin}${productUrl}`

    if (navigator.share) {
      try {
        await navigator.share({
          title: title,
          text: `Check out this product: ${title}`,
          url: shareUrl,
        })
      } catch (error) {
        console.log('Error sharing:', error)
      }
    } else {
      navigator.clipboard.writeText(shareUrl)
      toast({
        title: "Link Copied!",
        description: "Product link has been copied to clipboard",
      })
    }
  }

  const generateQR = async () => {
    try {
      const QRCode = (await import('qrcode')).default
      const qrUrl = `${window.location.origin}${productUrl}`
      const qrCodeDataUrl = await QRCode.toDataURL(qrUrl, {
        width: 256,
        margin: 2,
        color: {
          dark: '#000000',
          light: '#FFFFFF'
        }
      })
      setQrCodeUrl(qrCodeDataUrl)
      setIsQrDialogOpen(true)
    } catch (error) {
      console.error('Error generating QR code:', error)
      toast({
        title: "Error",
        description: "Failed to generate QR code",
        variant: "destructive"
      })
    }
  }

  return (
    <div className="group bg-white rounded-2xl overflow-hidden border border-gray-200 hover:border-green-300 hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 h-full flex flex-col relative">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-gradient-to-br from-green-50/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

      {/* Image Section */}
      <div className="relative overflow-hidden">
        <div className="aspect-square relative">
          <Image
            src={images && images.length > 0 ? images[0] : "/placeholder.svg"}
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
        {isFeatured && (
          <div className="absolute top-3 left-3 bg-gradient-to-r from-amber-400 to-orange-500 text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-lg animate-pulse">
            ⭐ Featured
          </div>
        )}

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
        {/* Product Title - Limited Text */}
        <h3 className="font-bold text-gray-900 mb-2 text-sm sm:text-base line-clamp-2 leading-tight group-hover:text-green-700 transition-colors">
          {title.length > 50 ? `${title.substring(0, 50)}...` : title}
        </h3>

        {/* Price */}
        <div className="flex items-baseline mb-3">
          <span className="text-lg sm:text-xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
            ₹{typeof price === 'number' ? price.toFixed(2) : '0.00'}
          </span>
          <span className="text-xs text-gray-500 ml-1 font-medium">/{unit?.symbol || 'unit'}</span>
        </div>

        {/* Store Information */}
        <div className="mb-4 flex-1">
          <div className="flex items-start gap-2 mb-2">
            <StoreIcon className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
            <div className="min-w-0 flex-1">
              <Link
                href={storeUrl}
                className="text-xs sm:text-sm text-gray-600 hover:text-green-600 transition-colors font-medium truncate block"
              >
                {store?.name ? (store.name.length > 25 ? `${store.name.substring(0, 25)}...` : store.name) : 'Unknown Store'}
              </Link>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <MapPin className="h-3 w-3 text-gray-400 flex-shrink-0" />
            <span className="text-xs text-gray-500 truncate">
              {location.length > 30 ? `${location.substring(0, 30)}...` : location}
            </span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2 mt-auto">
          <Link
            href={productUrl}
            className="flex-1"
          >
            <button className="w-full border border-gray-300 hover:border-green-400 hover:bg-green-50 text-gray-700 hover:text-green-700 transition-all duration-300 text-xs sm:text-sm font-medium py-2 px-3 rounded-lg flex items-center gap-1.5">
              <Eye className="h-3 w-3" />
              <span className="hidden sm:inline">Details</span>
              <span className="sm:hidden">View</span>
            </button>
          </Link>

          <Link
            href={storeUrl}
            className="flex-1"
          >
            <button className="w-full bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white shadow-md hover:shadow-lg transition-all duration-300 text-xs sm:text-sm font-medium py-2 px-3 rounded-lg flex items-center gap-1.5">
              <StoreIcon className="h-3 w-3" />
              <span className="hidden sm:inline">Store</span>
              <span className="sm:hidden">Shop</span>
            </button>
          </Link>
        </div>
      </div>

      {/* QR Code Dialog */}
      <Dialog open={isQrDialogOpen} onOpenChange={setIsQrDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <QrCode className="h-5 w-5" />
              Product QR Code
            </DialogTitle>
          </DialogHeader>
          <div className="flex flex-col items-center space-y-4">
            {qrCodeUrl && (
              <div className="p-4 bg-white rounded-lg border-2 border-gray-200">
                <Image
                  src={qrCodeUrl}
                  alt="Product QR Code"
                  width={200}
                  height={200}
                  className="rounded"
                />
              </div>
            )}
            <div className="text-center space-y-2">
              <p className="text-sm text-gray-600">
                Scan this QR code to view the product details
              </p>
              <p className="text-xs text-gray-500 font-mono bg-gray-100 p-2 rounded">
                {`${window.location.origin}${productUrl}`}
              </p>
            </div>
            <div className="flex gap-2 w-full">
              <button
                onClick={() => {
                  navigator.clipboard.writeText(`${window.location.origin}${productUrl}`)
                  toast({
                    title: "Link Copied!",
                    description: "Product link has been copied to clipboard",
                  })
                }}
                className="flex-1 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
              >
                Copy Link
              </button>
              <button
                onClick={() => setIsQrDialogOpen(false)}
                className="flex-1 bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}