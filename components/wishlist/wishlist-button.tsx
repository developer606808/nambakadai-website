"use client"

import { useState, useEffect } from "react"
import { Heart } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/components/auth/auth-context"
import { useToast } from "@/hooks/use-toast"

interface WishlistButtonProps {
  productId: string
  productName: string
  variant?: "icon" | "default"
  size?: "sm" | "md" | "lg"
}

export default function WishlistButton({
  productId,
  productName,
  variant = "default",
  size = "md",
}: WishlistButtonProps) {
  const [isInWishlist, setIsInWishlist] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const { isAuthenticated, user } = useAuth()
  const { toast } = useToast()

  // Check if product is in wishlist on mount
  useEffect(() => {
    if (isAuthenticated) {
      // In a real app, this would be an API call to check wishlist status
      const wishlist = JSON.parse(localStorage.getItem("wishlist") || "[]")
      setIsInWishlist(wishlist.some((item: any) => item.id === productId))
    }
  }, [productId, isAuthenticated])

  const toggleWishlist = async () => {
    if (!isAuthenticated) {
      toast({
        title: "Authentication required",
        description: "Please log in to save items to your wishlist",
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)

    try {
      // In a real app, this would be an API call to add/remove from wishlist
      // Mock implementation using localStorage
      const wishlist = JSON.parse(localStorage.getItem("wishlist") || "[]")

      if (isInWishlist) {
        // Remove from wishlist
        const updatedWishlist = wishlist.filter((item: any) => item.id !== productId)
        localStorage.setItem("wishlist", JSON.stringify(updatedWishlist))
        setIsInWishlist(false)
        toast({
          title: "Removed from wishlist",
          description: `${productName} has been removed from your wishlist`,
        })
      } else {
        // Add to wishlist
        const newItem = {
          id: productId,
          name: productName,
          addedAt: new Date().toISOString(),
        }
        const updatedWishlist = [...wishlist, newItem]
        localStorage.setItem("wishlist", JSON.stringify(updatedWishlist))
        setIsInWishlist(true)
        toast({
          title: "Added to wishlist",
          description: `${productName} has been added to your wishlist`,
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update wishlist. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  if (variant === "icon") {
    const sizeClasses = {
      sm: "h-8 w-8",
      md: "h-10 w-10",
      lg: "h-12 w-12",
    }

    return (
      <Button
        variant="outline"
        size="icon"
        className={`${sizeClasses[size]} rounded-full ${isInWishlist ? "bg-red-50 text-red-500 border-red-200" : ""}`}
        onClick={toggleWishlist}
        disabled={isLoading}
        aria-label={isInWishlist ? "Remove from wishlist" : "Add to wishlist"}
      >
        <Heart className={`h-5 w-5 ${isInWishlist ? "fill-red-500" : ""}`} />
      </Button>
    )
  }

  return (
    <Button
      variant="outline"
      className={`flex items-center ${isInWishlist ? "bg-red-50 text-red-500 border-red-200" : ""}`}
      onClick={toggleWishlist}
      disabled={isLoading}
    >
      <Heart className={`h-4 w-4 mr-2 ${isInWishlist ? "fill-red-500" : ""}`} />
      {isInWishlist ? "Saved" : "Save to Wishlist"}
    </Button>
  )
}
